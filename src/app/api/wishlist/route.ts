import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/mongodb';
import { WishlistItem, Product } from '@/lib/models';
import { validateAuth } from '@/lib/auth';
import { ApiResponse } from '@/types';
import { products as staticProducts } from '@/data/products';

// Helper to check if a string is a valid MongoDB ObjectId
function isValidObjectId(id: string): boolean {
    return mongoose.Types.ObjectId.isValid(id) && (new mongoose.Types.ObjectId(id)).toString() === id;
}

// GET - Get user's wishlist items
export async function GET() {
    try {
        const auth = await validateAuth();
        if (!auth) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'Please sign in to view your wishlist' },
                { status: 401 }
            );
        }

        await dbConnect();

        const wishlistItems = await WishlistItem.find({ userId: auth.userId }).lean();

        // Populate product details from static data (or DB if products are in MongoDB)
        const populatedItems = await Promise.all(
            wishlistItems.map(async (item) => {
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
                    createdAt: item.createdAt,
                    product: product ? {
                        _id: dbProduct ? dbProduct._id.toString() : staticProduct?.id,
                        name: product.name,
                        slug: product.slug,
                        price: product.price,
                        images: product.images,
                        grade: (product as any).grade || 'Premium',
                        subtitle: (product as any).subtitle || '',
                    } : null,
                };
            })
        );

        // Filter out items with missing products
        const validItems = populatedItems.filter(item => item.product !== null);

        return NextResponse.json<ApiResponse>(
            {
                success: true,
                data: {
                    items: validItems,
                    itemCount: validItems.length,
                },
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Get wishlist error:', error);
        return NextResponse.json<ApiResponse>(
            { success: false, error: 'Failed to get wishlist' },
            { status: 500 }
        );
    }
}

// POST - Add item to wishlist
export async function POST(request: NextRequest) {
    try {
        const auth = await validateAuth();
        if (!auth) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'Please sign in to add items to wishlist' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { productId } = body;

        if (!productId) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'Product ID is required' },
                { status: 400 }
            );
        }

        // Verify product exists (in MongoDB or static data)
        await dbConnect();
        
        // Try MongoDB only if it's a valid ObjectId
        let dbProduct = null;
        if (isValidObjectId(productId)) {
            try {
                dbProduct = await Product.findById(productId).lean();
            } catch (e) {
                // Invalid ObjectId, fall through to static products
            }
        }
        
        const staticProduct = staticProducts.find(p => p.id === productId);
        const product = dbProduct || staticProduct;

        if (!product) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'Product not found' },
                { status: 404 }
            );
        }

        // Check if item already in wishlist
        const existingItem = await WishlistItem.findOne({
            userId: auth.userId,
            productId,
        });

        if (existingItem) {
            return NextResponse.json<ApiResponse>(
                {
                    success: true,
                    data: existingItem,
                    message: 'Item already in wishlist',
                },
                { status: 200 }
            );
        }

        // Create new wishlist item
        const wishlistItem = await WishlistItem.create({
            userId: auth.userId,
            productId,
        });

        return NextResponse.json<ApiResponse>(
            {
                success: true,
                data: wishlistItem,
                message: 'Added to wishlist',
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Add to wishlist error:', error);
        return NextResponse.json<ApiResponse>(
            { success: false, error: 'Failed to add to wishlist' },
            { status: 500 }
        );
    }
}

// DELETE - Remove item from wishlist
export async function DELETE(request: NextRequest) {
    try {
        const auth = await validateAuth();
        if (!auth) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'Please sign in to manage your wishlist' },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const productId = searchParams.get('productId');

        if (!productId) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'Product ID is required' },
                { status: 400 }
            );
        }

        await dbConnect();

        const result = await WishlistItem.findOneAndDelete({
            userId: auth.userId,
            productId,
        });

        if (!result) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'Item not found in wishlist' },
                { status: 404 }
            );
        }

        return NextResponse.json<ApiResponse>(
            {
                success: true,
                message: 'Removed from wishlist',
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Remove from wishlist error:', error);
        return NextResponse.json<ApiResponse>(
            { success: false, error: 'Failed to remove from wishlist' },
            { status: 500 }
        );
    }
}
