import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import dbConnect from '@/lib/mongodb';
import { CartItem, Product, Order } from '@/lib/models';
import { validateAuth } from '@/lib/auth';
import { ApiResponse } from '@/types';
import { products as staticProducts } from '@/data/products';
import mongoose from 'mongoose';

// Helper to check if a string is a valid MongoDB ObjectId
function isValidObjectId(id: string): boolean {
    return mongoose.Types.ObjectId.isValid(id) && (new mongoose.Types.ObjectId(id)).toString() === id;
}

// Size pricing multipliers
const SIZE_MULTIPLIERS: Record<string, number> = {
    '30g': 1,
    '100g': 2.5,
    '200g': 4.5,
    '250g': 5.5,
    '500g': 8.5,
    'N/A': 1,
    'Kit Box': 1,
};

// Helper to calculate actual price based on size
function calculateItemPrice(basePrice: number, baseWeight: string, selectedSize?: string): number {
    if (!selectedSize || selectedSize === baseWeight) {
        return basePrice;
    }
    
    const baseSizeMultiplier = SIZE_MULTIPLIERS[baseWeight] || 1;
    const selectedSizeMultiplier = SIZE_MULTIPLIERS[selectedSize] || 1;
    
    return (basePrice / baseSizeMultiplier) * selectedSizeMultiplier;
}

// Helper to convert country name to ISO code
function getCountryCode(country: string): string {
    const countryMap: Record<string, string> = {
        'united states': 'US',
        'usa': 'US',
        'us': 'US',
        'canada': 'CA',
        'ca': 'CA',
        'united kingdom': 'GB',
        'uk': 'GB',
        'gb': 'GB',
        'australia': 'AU',
        'au': 'AU',
        'germany': 'DE',
        'de': 'DE',
        'france': 'FR',
        'fr': 'FR',
        'japan': 'JP',
        'jp': 'JP',
        'india': 'IN',
        'in': 'IN',
        'china': 'CN',
        'cn': 'CN',
        'brazil': 'BR',
        'br': 'BR',
        'mexico': 'MX',
        'mx': 'MX',
        'spain': 'ES',
        'es': 'ES',
        'italy': 'IT',
        'it': 'IT',
        'netherlands': 'NL',
        'nl': 'NL',
        'singapore': 'SG',
        'sg': 'SG',
    };
    
    const normalized = country.toLowerCase().trim();
    return countryMap[normalized] || country.toUpperCase().slice(0, 2);
}

export async function POST(request: NextRequest) {
    try {
        const auth = await validateAuth();
        if (!auth) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'Please sign in to checkout' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { shippingAddress } = body;

        if (!shippingAddress || typeof shippingAddress !== 'object') {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'Shipping address is required' },
                { status: 400 }
            );
        }

        // Validate and sanitize shipping address fields
        const requiredFields = ['fullName', 'address', 'city', 'state', 'postalCode', 'country'];
        for (const field of requiredFields) {
            if (!shippingAddress[field] || typeof shippingAddress[field] !== 'string' || !shippingAddress[field].trim()) {
                return NextResponse.json<ApiResponse>(
                    { success: false, error: `${field} is required` },
                    { status: 400 }
                );
            }
        }

        // Sanitize address fields (limit length and trim)
        const sanitizedAddress = {
            fullName: shippingAddress.fullName.trim().slice(0, 100),
            address: shippingAddress.address.trim().slice(0, 200),
            city: shippingAddress.city.trim().slice(0, 100),
            state: shippingAddress.state.trim().slice(0, 100),
            postalCode: shippingAddress.postalCode.trim().slice(0, 20),
            country: shippingAddress.country.trim().slice(0, 100),
            phone: shippingAddress.phone ? shippingAddress.phone.trim().slice(0, 30) : '',
        };

        // Validate postal code format
        if (!/^[A-Za-z0-9\s-]{3,20}$/.test(sanitizedAddress.postalCode)) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'Invalid postal code format' },
                { status: 400 }
            );
        }

        await dbConnect();

        // Get cart items
        const cartItems = await CartItem.find({ userId: auth.userId }).lean();

        if (cartItems.length === 0) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'Cart is empty' },
                { status: 400 }
            );
        }

        // Populate product details and create line items
        const lineItems: {
            price_data: {
                currency: string;
                product_data: {
                    name: string;
                    description?: string;
                    images?: string[];
                };
                unit_amount: number;
            };
            quantity: number;
        }[] = [];

        const orderItems: {
            productId: string;
            name: string;
            price: number;
            quantity: number;
            image: string;
        }[] = [];

        let subtotal = 0;

        for (const item of cartItems) {
            // Try to find product in MongoDB first (only if valid ObjectId)
            let dbProduct = null;
            if (isValidObjectId(item.productId)) {
                try {
                    dbProduct = await Product.findById(item.productId).lean();
                } catch (e) {
                    // Invalid ObjectId, fall through to static products
                }
            }

            // Fallback to static products
            const staticProduct = staticProducts.find(p => p.id === item.productId);
            const product = dbProduct || staticProduct;

            if (!product) continue;

            const basePrice = product.price;
            const actualPrice = calculateItemPrice(basePrice, product.weight, item.selectedSize);
            const name = product.name + (item.selectedSize ? ` (${item.selectedSize})` : '');
            const image = product.images[0] || '';
            const description = (product as any).subtitle || (product as any).description || '';

            subtotal += actualPrice * item.quantity;

            // Stripe line item
            lineItems.push({
                price_data: {
                    currency: 'inr',
                    product_data: {
                        name,
                        description: description.substring(0, 500),
                        images: image ? [`${process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_SITE_URL}${image}`] : [],
                    },
                    unit_amount: Math.round(actualPrice * 100), // Stripe uses paise (100 paise = 1 INR)
                },
                quantity: item.quantity,
            });

            // Order item for database
            orderItems.push({
                productId: item.productId,
                name,
                price: actualPrice,
                quantity: item.quantity,
                image,
            });
        }

        // Calculate shipping cost (handled via Stripe shipping_options)
        // Free shipping for orders ₹499+, otherwise ₹50
        const shippingCost = subtotal >= 499 ? 0 : 50;
        const total = subtotal + shippingCost;

        // Create order in database (pending payment)
        const order = await Order.create({
            userId: auth.userId,
            items: orderItems,
            total,
            shippingAddress,
            status: 'pending',
            paymentMethod: 'card',
            paymentStatus: 'pending',
        });

        // Create Stripe checkout session
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            line_items: lineItems,
            success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}&order_id=${order._id}`,
            cancel_url: `${baseUrl}/checkout/cancel?order_id=${order._id}`,
            customer_email: auth.email,
            metadata: {
                orderId: order._id.toString(),
                userId: auth.userId,
            },
            // Pre-fill billing details from the shipping address
            billing_address_collection: 'auto',
            // Pass shipping details to Stripe
            shipping_options: [
                {
                    shipping_rate_data: {
                        type: 'fixed_amount',
                        fixed_amount: {
                            amount: shippingCost * 100,
                            currency: 'inr',
                        },
                        display_name: shippingCost === 0 ? 'Free Shipping' : 'Standard Shipping',
                        delivery_estimate: {
                            minimum: {
                                unit: 'business_day',
                                value: 3,
                            },
                            maximum: {
                                unit: 'business_day',
                                value: 7,
                            },
                        },
                    },
                },
            ],
            // Pre-fill customer shipping details
            customer_creation: 'always',
            phone_number_collection: {
                enabled: true,
            },
            // Pass the shipping address as pre-filled details
            payment_intent_data: {
                shipping: {
                    name: shippingAddress.fullName,
                    phone: shippingAddress.phone || '',
                    address: {
                        line1: shippingAddress.address,
                        city: shippingAddress.city,
                        state: shippingAddress.state,
                        postal_code: shippingAddress.postalCode,
                        country: getCountryCode(shippingAddress.country),
                    },
                },
            },
        });

        // Update order with Stripe session ID
        order.stripeSessionId = session.id;
        await order.save();

        return NextResponse.json<ApiResponse>(
            {
                success: true,
                data: {
                    sessionId: session.id,
                    sessionUrl: session.url,
                    orderId: order._id,
                },
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Stripe checkout error:', error);
        return NextResponse.json<ApiResponse>(
            { success: false, error: 'Failed to create checkout session' },
            { status: 500 }
        );
    }
}
