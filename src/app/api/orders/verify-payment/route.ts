import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import dbConnect from '@/lib/mongodb';
import { Order, CartItem } from '@/lib/models';
import { validateAuth } from '@/lib/auth';
import { ApiResponse } from '@/types';

// POST - Verify payment and update order status (fallback for webhook)
export async function POST(request: NextRequest) {
    try {
        const auth = await validateAuth();
        if (!auth) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { sessionId, orderId } = await request.json();

        if (!sessionId || !orderId) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'Missing session ID or order ID' },
                { status: 400 }
            );
        }

        await dbConnect();

        // Get the order
        const order = await Order.findById(orderId);
        if (!order) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'Order not found' },
                { status: 404 }
            );
        }

        // Make sure this order belongs to the user
        if (order.userId !== auth.userId) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // If already paid, just return success
        if (order.paymentStatus === 'paid') {
            return NextResponse.json<ApiResponse>(
                { 
                    success: true, 
                    data: { 
                        order,
                        alreadyPaid: true 
                    } 
                },
                { status: 200 }
            );
        }

        // Verify the payment with Stripe
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (session.payment_status === 'paid') {
            // Update order status
            order.paymentStatus = 'paid';
            order.status = 'confirmed';
            order.stripePaymentIntentId = session.payment_intent as string;
            await order.save();

            // Clear user's cart
            await CartItem.deleteMany({ userId: auth.userId });

            return NextResponse.json<ApiResponse>(
                { 
                    success: true, 
                    data: { 
                        order,
                        paymentVerified: true 
                    } 
                },
                { status: 200 }
            );
        } else {
            return NextResponse.json<ApiResponse>(
                { 
                    success: false, 
                    error: 'Payment not completed',
                    data: { paymentStatus: session.payment_status }
                },
                { status: 400 }
            );
        }
    } catch (error) {
        console.error('Verify payment error:', error);
        return NextResponse.json<ApiResponse>(
            { success: false, error: 'Failed to verify payment' },
            { status: 500 }
        );
    }
}
