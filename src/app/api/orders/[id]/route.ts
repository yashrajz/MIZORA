import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Order } from '@/lib/models';
import { validateAuth } from '@/lib/auth';
import { ApiResponse, OrderStatus } from '@/types';

// GET - Get single order by ID
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const auth = await validateAuth();
        if (!auth) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'Please sign in to view order' },
                { status: 401 }
            );
        }

        const { id } = await params;

        await dbConnect();

        const order = await Order.findOne({
            _id: id,
            userId: auth.userId,
        }).lean();

        if (!order) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'Order not found' },
                { status: 404 }
            );
        }

        return NextResponse.json<ApiResponse>(
            { success: true, data: { ...order, _id: order._id.toString() } },
            { status: 200 }
        );
    } catch (error) {
        console.error('Get order error:', error);
        return NextResponse.json<ApiResponse>(
            { success: false, error: 'Failed to get order' },
            { status: 500 }
        );
    }
}

// PATCH - Update order status (for admin or cancel by user)
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const auth = await validateAuth();
        if (!auth) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'Please sign in to update order' },
                { status: 401 }
            );
        }

        const { id } = await params;
        const body = await request.json();
        const { status } = body as { status: OrderStatus };

        // Users can only cancel their own orders
        const allowedUserStatuses: OrderStatus[] = ['cancelled'];
        if (!allowedUserStatuses.includes(status)) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'You can only cancel orders' },
                { status: 403 }
            );
        }

        await dbConnect();

        const order = await Order.findOne({
            _id: id,
            userId: auth.userId,
        });

        if (!order) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'Order not found' },
                { status: 404 }
            );
        }

        // Can only cancel pending or confirmed orders
        if (!['pending', 'confirmed'].includes(order.status)) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'This order cannot be cancelled' },
                { status: 400 }
            );
        }

        order.status = status;
        await order.save();

        const orderData = order.toObject();
        return NextResponse.json<ApiResponse>(
            {
                success: true,
                data: { ...orderData, _id: orderData._id.toString() },
                message: 'Order cancelled successfully',
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Update order error:', error);
        return NextResponse.json<ApiResponse>(
            { success: false, error: 'Failed to update order' },
            { status: 500 }
        );
    }
}
