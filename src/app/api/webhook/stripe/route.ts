import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import dbConnect from '@/lib/mongodb';
import { Order, CartItem } from '@/lib/models';
import Stripe from 'stripe';

// Disable body parsing for webhook - use runtime config
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    try {
        const body = await request.text();
        const signature = request.headers.get('stripe-signature');

        if (!signature) {
            return NextResponse.json(
                { error: 'Missing stripe-signature header' },
                { status: 400 }
            );
        }

        let event: Stripe.Event;

        try {
            event = stripe.webhooks.constructEvent(
                body,
                signature,
                process.env.STRIPE_WEBHOOK_SECRET!
            );
        } catch (err) {
            console.error('Webhook signature verification failed:', err);
            return NextResponse.json(
                { error: 'Invalid signature' },
                { status: 400 }
            );
        }

        await dbConnect();

        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object as Stripe.Checkout.Session;
                const orderId = session.metadata?.orderId;

                if (orderId) {
                    // Update order status
                    const order = await Order.findById(orderId);
                    if (order) {
                        order.paymentStatus = 'paid';
                        order.status = 'confirmed';
                        order.stripePaymentIntentId = session.payment_intent as string;
                        await order.save();

                        // Clear user's cart
                        const userId = session.metadata?.userId;
                        if (userId) {
                            await CartItem.deleteMany({ userId });
                        }

                        console.log(`Order ${orderId} payment completed`);
                    }
                }
                break;
            }

            case 'checkout.session.expired': {
                const session = event.data.object as Stripe.Checkout.Session;
                const orderId = session.metadata?.orderId;

                if (orderId) {
                    // Mark order as failed/cancelled
                    await Order.findByIdAndUpdate(orderId, {
                        paymentStatus: 'failed',
                        status: 'cancelled',
                    });
                    console.log(`Order ${orderId} checkout session expired`);
                }
                break;
            }

            case 'payment_intent.payment_failed': {
                const paymentIntent = event.data.object as Stripe.PaymentIntent;
                // Find order by payment intent and mark as failed
                const order = await Order.findOne({
                    stripePaymentIntentId: paymentIntent.id,
                });
                if (order) {
                    order.paymentStatus = 'failed';
                    await order.save();
                    console.log(`Order ${order._id} payment failed`);
                }
                break;
            }

            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        return NextResponse.json({ received: true }, { status: 200 });
    } catch (error) {
        console.error('Webhook error:', error);
        return NextResponse.json(
            { error: 'Webhook handler failed' },
            { status: 500 }
        );
    }
}
