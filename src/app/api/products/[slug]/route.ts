import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Product } from '@/lib/models';
import { ApiResponse } from '@/types';
import { products as staticProducts } from '@/data/products';

// GET - Get single product by slug
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;

        await dbConnect();

        // Try MongoDB first
        const dbProduct = await Product.findOne({ slug }).lean();
        const staticProduct = staticProducts.find(p => p.slug === slug);
        const product = dbProduct || staticProduct;

        if (!product) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'Product not found' },
                { status: 404 }
            );
        }

        // Normalize _id to string
        const productData = dbProduct 
            ? { ...dbProduct, _id: dbProduct._id.toString() }
            : { ...staticProduct!, _id: staticProduct!.id };

        return NextResponse.json<ApiResponse>(
            { success: true, data: productData },
            { status: 200 }
        );
    } catch (error) {
        console.error('Get product error:', error);
        
        // Try static on error
        const { slug } = await params;
        const product = staticProducts.find(p => p.slug === slug);
        
        if (product) {
            return NextResponse.json<ApiResponse>(
                { success: true, data: product },
                { status: 200 }
            );
        }

        return NextResponse.json<ApiResponse>(
            { success: false, error: 'Failed to get product' },
            { status: 500 }
        );
    }
}
