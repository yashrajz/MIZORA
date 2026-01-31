import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Product } from '@/lib/models';
import { ApiResponse, IProduct } from '@/types';
import { products as staticProducts } from '@/data/products';

// GET - Get all products (from MongoDB, with fallback to static)
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const source = searchParams.get('source'); // 'static' to force static data
        const search = searchParams.get('search');
        const grade = searchParams.get('grade');
        const minPrice = searchParams.get('minPrice');
        const maxPrice = searchParams.get('maxPrice');
        const sort = searchParams.get('sort') || 'name';
        const order = searchParams.get('order') || 'asc';

        // If explicitly requesting static data
        if (source === 'static') {
            let products = [...staticProducts];

            // Apply filters
            if (search) {
                const searchLower = search.toLowerCase();
                products = products.filter(
                    p =>
                        p.name.toLowerCase().includes(searchLower) ||
                        p.description.toLowerCase().includes(searchLower)
                );
            }
            if (grade) {
                products = products.filter(p => p.grade.toLowerCase() === grade.toLowerCase());
            }
            if (minPrice) {
                products = products.filter(p => p.price >= parseFloat(minPrice));
            }
            if (maxPrice) {
                products = products.filter(p => p.price <= parseFloat(maxPrice));
            }

            // Sort
            products.sort((a, b) => {
                const aVal = a[sort as keyof typeof a];
                const bVal = b[sort as keyof typeof b];
                if (typeof aVal === 'string' && typeof bVal === 'string') {
                    return order === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
                }
                if (typeof aVal === 'number' && typeof bVal === 'number') {
                    return order === 'asc' ? aVal - bVal : bVal - aVal;
                }
                return 0;
            });

            return NextResponse.json<ApiResponse>(
                { success: true, data: { products, source: 'static' } },
                { status: 200 }
            );
        }

        // Try MongoDB first
        await dbConnect();
        
        // Build query
        const query: Record<string, unknown> = {};
        if (search) {
            query.$text = { $search: search };
        }
        if (grade) {
            query.grade = { $regex: new RegExp(grade, 'i') };
        }
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) (query.price as Record<string, number>).$gte = parseFloat(minPrice);
            if (maxPrice) (query.price as Record<string, number>).$lte = parseFloat(maxPrice);
        }

        // Build sort
        const sortObj: Record<string, 1 | -1> = {};
        sortObj[sort] = order === 'asc' ? 1 : -1;

        let products = await Product.find(query).sort(sortObj).lean();

        // If no products in MongoDB, return static products
        if (products.length === 0) {
            let staticResult = [...staticProducts];

            if (search) {
                const searchLower = search.toLowerCase();
                staticResult = staticResult.filter(
                    p =>
                        p.name.toLowerCase().includes(searchLower) ||
                        p.description.toLowerCase().includes(searchLower)
                );
            }
            if (grade) {
                staticResult = staticResult.filter(p => p.grade.toLowerCase() === grade.toLowerCase());
            }
            if (minPrice) {
                staticResult = staticResult.filter(p => p.price >= parseFloat(minPrice));
            }
            if (maxPrice) {
                staticResult = staticResult.filter(p => p.price <= parseFloat(maxPrice));
            }

            return NextResponse.json<ApiResponse>(
                { success: true, data: { products: staticResult, source: 'static' } },
                { status: 200 }
            );
        }

        return NextResponse.json<ApiResponse>(
            { success: true, data: { products, source: 'mongodb' } },
            { status: 200 }
        );
    } catch (error) {
        console.error('Get products error:', error);
        
        // Fallback to static products on error
        return NextResponse.json<ApiResponse>(
            { success: true, data: { products: staticProducts, source: 'static' } },
            { status: 200 }
        );
    }
}

// POST - Seed products to MongoDB (admin/setup endpoint)
export async function POST(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const action = searchParams.get('action');

        if (action !== 'seed') {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'Invalid action. Use ?action=seed to seed products.' },
                { status: 400 }
            );
        }

        await dbConnect();

        // Check if products already exist
        const existingCount = await Product.countDocuments();
        if (existingCount > 0) {
            return NextResponse.json<ApiResponse>(
                {
                    success: false,
                    error: `Products already exist in database (${existingCount} products). Use DELETE to clear first.`,
                },
                { status: 409 }
            );
        }

        // Transform static products for MongoDB
        const productsToInsert = staticProducts.map(p => ({
            slug: p.slug,
            name: p.name,
            subtitle: p.subtitle,
            price: p.price,
            description: p.description,
            images: p.images,
            grade: p.grade,
            origin: p.origin,
            weight: p.weight,
            bestFor: p.bestFor,
            rating: p.rating,
            reviews: p.reviews,
            features: p.features,
            ingredients: p.ingredients,
            stock: 100, // Default stock
        }));

        const inserted = await Product.insertMany(productsToInsert);

        return NextResponse.json<ApiResponse>(
            {
                success: true,
                message: `Successfully seeded ${inserted.length} products to MongoDB`,
                data: { count: inserted.length },
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Seed products error:', error);
        return NextResponse.json<ApiResponse>(
            { success: false, error: 'Failed to seed products' },
            { status: 500 }
        );
    }
}

// DELETE - Clear all products (admin/setup endpoint)
export async function DELETE() {
    try {
        await dbConnect();

        const result = await Product.deleteMany({});

        return NextResponse.json<ApiResponse>(
            {
                success: true,
                message: `Deleted ${result.deletedCount} products from MongoDB`,
                data: { deletedCount: result.deletedCount },
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Delete products error:', error);
        return NextResponse.json<ApiResponse>(
            { success: false, error: 'Failed to delete products' },
            { status: 500 }
        );
    }
}
