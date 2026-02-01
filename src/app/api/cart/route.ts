import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/mongodb';
import { CartItem, Product } from '@/lib/models';
import { validateAuth } from '@/lib/auth';
import { ApiResponse, AddToCartRequest, UpdateCartRequest, ICartItemPopulated } from '@/types';
import { products as staticProducts } from '@/data/products';

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

// GET - Get user's cart items
export async function GET() {
    try {
        const auth = await validateAuth();
        if (!auth) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'Please sign in to view your cart' },
                { status: 401 }
            );
        }

        await dbConnect();

        const cartItems = await CartItem.find({ userId: auth.userId }).lean();

        // Populate product details from static data (or DB if products are in MongoDB)
        const populatedItems = await Promise.all(
            cartItems.map(async (item) => {
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

                return {
                    _id: item._id.toString(),
                    productId: item.productId,
                    quantity: item.quantity,
                    selectedSize: item.selectedSize,
                    createdAt: item.createdAt,
                    updatedAt: item.updatedAt,
                    product: product ? {
                        _id: dbProduct ? dbProduct._id.toString() : staticProduct?.id,
                        name: product.name,
                        slug: product.slug,
                        price: product.price,
                        weight: product.weight,
                        images: product.images,
                        stock: dbProduct?.stock || 100,
                    } : null,
                };
            })
        );

        // Filter out items with missing products
        const validItems = populatedItems.filter(item => item.product !== null);

        // Calculate totals with correct pricing based on selected size
        const subtotal = validItems.reduce((sum, item) => {
            const actualPrice = calculateItemPrice(
                item.product?.price || 0,
                item.product?.weight || '30g',
                item.selectedSize
            );
            return sum + actualPrice * item.quantity;
        }, 0);
        const itemCount = validItems.reduce((sum, item) => sum + item.quantity, 0);

        return NextResponse.json<ApiResponse>(
            {
                success: true,
                data: {
                    items: validItems,
                    subtotal,
                    itemCount,
                },
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Get cart error:', error);
        return NextResponse.json<ApiResponse>(
            { success: false, error: 'Failed to get cart' },
            { status: 500 }
        );
    }
}

// POST - Add item to cart
export async function POST(request: NextRequest) {
    try {
        const auth = await validateAuth();
        if (!auth) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'Please sign in to add items to cart' },
                { status: 401 }
            );
        }

        const body: AddToCartRequest = await request.json();
        const { productId, quantity = 1, selectedSize } = body;

        if (!productId || typeof productId !== 'string') {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'Product ID is required' },
                { status: 400 }
            );
        }

        // Sanitize productId (prevent injection)
        const sanitizedProductId = productId.trim().slice(0, 100);

        if (quantity < 1 || quantity > 99) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'Quantity must be between 1 and 99' },
                { status: 400 }
            );
        }

        // Verify product exists (in MongoDB or static data)
        await dbConnect();
        
        // Try MongoDB only if it's a valid ObjectId
        let dbProduct = null;
        if (isValidObjectId(sanitizedProductId)) {
            try {
                dbProduct = await Product.findById(sanitizedProductId).lean();
            } catch (e) {
                // Invalid ObjectId, fall through to static products
            }
        }
        
        const staticProduct = staticProducts.find(p => p.id === sanitizedProductId);
        const product = dbProduct || staticProduct;

        if (!product) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'Product not found' },
                { status: 404 }
            );
        }

        // Check if item already in cart with same size
        const existingItem = await CartItem.findOne({
            userId: auth.userId,
            productId: sanitizedProductId,
            selectedSize: selectedSize || undefined,
        });

        if (existingItem) {
            // Update quantity with limit check
            const newQuantity = existingItem.quantity + quantity;
            if (newQuantity > 99) {
                return NextResponse.json<ApiResponse>(
                    { success: false, error: 'Maximum quantity is 99' },
                    { status: 400 }
                );
            }
            existingItem.quantity = newQuantity;
            await existingItem.save();

            return NextResponse.json<ApiResponse>(
                {
                    success: true,
                    data: existingItem,
                    message: 'Cart updated',
                },
                { status: 200 }
            );
        }

        // Create new cart item
        const cartItem = await CartItem.create({
            userId: auth.userId,
            productId: sanitizedProductId,
            quantity,
            selectedSize: selectedSize || undefined,
        });

        return NextResponse.json<ApiResponse>(
            {
                success: true,
                data: cartItem,
                message: 'Added to cart',
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Add to cart error:', error);
        return NextResponse.json<ApiResponse>(
            { success: false, error: 'Failed to add item to cart' },
            { status: 500 }
        );
    }
}

// PUT - Update cart item quantity
export async function PUT(request: NextRequest) {
    try {
        const auth = await validateAuth();
        if (!auth) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'Please sign in to update cart' },
                { status: 401 }
            );
        }

        const body: UpdateCartRequest = await request.json();
        const { productId, quantity } = body;

        if (!productId || typeof productId !== 'string') {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'Product ID is required' },
                { status: 400 }
            );
        }

        const sanitizedProductId = productId.trim().slice(0, 100);

        if (typeof quantity !== 'number' || quantity < 0 || quantity > 99) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'Invalid quantity' },
                { status: 400 }
            );
        }

        await dbConnect();

        if (quantity <= 0) {
            // Remove item if quantity is 0 or negative
            await CartItem.deleteOne({ userId: auth.userId, productId: sanitizedProductId });
            return NextResponse.json<ApiResponse>(
                { success: true, message: 'Item removed from cart' },
                { status: 200 }
            );
        }

        const cartItem = await CartItem.findOneAndUpdate(
            { userId: auth.userId, productId: sanitizedProductId },
            { quantity },
            { new: true }
        );

        if (!cartItem) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'Item not found in cart' },
                { status: 404 }
            );
        }

        return NextResponse.json<ApiResponse>(
            { success: true, data: cartItem, message: 'Cart updated' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Update cart error:', error);
        return NextResponse.json<ApiResponse>(
            { success: false, error: 'Failed to update cart' },
            { status: 500 }
        );
    }
}

// DELETE - Remove item from cart or clear cart
export async function DELETE(request: NextRequest) {
    try {
        const auth = await validateAuth();
        if (!auth) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'Please sign in to modify cart' },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const productId = searchParams.get('productId');
        const clearAll = searchParams.get('clearAll') === 'true';

        await dbConnect();

        if (clearAll) {
            // Clear entire cart
            await CartItem.deleteMany({ userId: auth.userId });
            return NextResponse.json<ApiResponse>(
                { success: true, message: 'Cart cleared' },
                { status: 200 }
            );
        }

        if (!productId) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'Product ID is required' },
                { status: 400 }
            );
        }

        const sanitizedProductId = productId.trim().slice(0, 100);

        const result = await CartItem.deleteOne({ userId: auth.userId, productId: sanitizedProductId });

        if (result.deletedCount === 0) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'Item not found in cart' },
                { status: 404 }
            );
        }

        return NextResponse.json<ApiResponse>(
            { success: true, message: 'Item removed from cart' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Delete cart item error:', error);
        return NextResponse.json<ApiResponse>(
            { success: false, error: 'Failed to remove item from cart' },
            { status: 500 }
        );
    }
}
