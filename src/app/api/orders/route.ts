import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Order, CartItem, Product } from '@/lib/models';
import { validateAuth } from '@/lib/auth';
import { ApiResponse, CreateOrderRequest, IOrder, IOrderItem } from '@/types';
import { products as staticProducts } from '@/data/products';

// GET - Get user's orders
export async function GET(request: NextRequest) {
    try {
        const auth = await validateAuth();
        if (!auth) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'Please sign in to view orders' },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const status = searchParams.get('status');

        await dbConnect();

        // Build query
        const query: { userId: string; status?: string } = { userId: auth.userId };
        if (status) {
            query.status = status;
        }

        // Get orders with pagination
        const skip = (page - 1) * limit;
        const [orders, total] = await Promise.all([
            Order.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Order.countDocuments(query),
        ]);

        return NextResponse.json<ApiResponse>(
            {
                success: true,
                data: {
                    orders,
                    pagination: {
                        page,
                        limit,
                        total,
                        totalPages: Math.ceil(total / limit),
                    },
                },
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Get orders error:', error);
        return NextResponse.json<ApiResponse>(
            { success: false, error: 'Failed to get orders' },
            { status: 500 }
        );
    }
}

// POST - Create order from cart
export async function POST(request: NextRequest) {
    try {
        const auth = await validateAuth();
        if (!auth) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'Please sign in to place an order' },
                { status: 401 }
            );
        }

        const body: CreateOrderRequest = await request.json();
        const { shippingAddress, paymentMethod = 'card' } = body;

        // Validate shipping address
        if (!shippingAddress) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'Shipping address is required' },
                { status: 400 }
            );
        }

        const requiredFields = ['fullName', 'address', 'city', 'state', 'postalCode', 'country'];
        for (const field of requiredFields) {
            if (!shippingAddress[field as keyof typeof shippingAddress]) {
                return NextResponse.json<ApiResponse>(
                    { success: false, error: `${field} is required in shipping address` },
                    { status: 400 }
                );
            }
        }

        await dbConnect();

        // Get cart items
        const cartItems = await CartItem.find({ userId: auth.userId }).lean();

        if (cartItems.length === 0) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'Your cart is empty' },
                { status: 400 }
            );
        }

        // Build order items and calculate total
        const orderItems: IOrderItem[] = [];
        let total = 0;

        for (const cartItem of cartItems) {
            // Find product (MongoDB or static)
            const dbProduct = await Product.findById(cartItem.productId).lean();
            const staticProduct = staticProducts.find(p => p.id === cartItem.productId);
            const product = dbProduct || staticProduct;

            if (!product) {
                return NextResponse.json<ApiResponse>(
                    { success: false, error: `Product not found: ${cartItem.productId}` },
                    { status: 400 }
                );
            }

            const itemTotal = product.price * cartItem.quantity;
            total += itemTotal;

            orderItems.push({
                productId: cartItem.productId,
                name: product.name,
                price: product.price,
                quantity: cartItem.quantity,
                image: product.images[0] || '',
            });
        }

        // Create order
        const order = await Order.create({
            userId: auth.userId,
            items: orderItems,
            total,
            shippingAddress,
            paymentMethod,
            status: 'pending',
            paymentStatus: 'pending',
        });

        // Clear cart after successful order
        await CartItem.deleteMany({ userId: auth.userId });

        const orderData = order.toObject();
        return NextResponse.json<ApiResponse>(
            {
                success: true,
                data: { ...orderData, _id: orderData._id.toString() },
                message: 'Order placed successfully',
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Create order error:', error);
        return NextResponse.json<ApiResponse>(
            { success: false, error: 'Failed to create order' },
            { status: 500 }
        );
    }
}
