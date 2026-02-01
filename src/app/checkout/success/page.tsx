'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Package, ArrowRight, Loader2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import styles from '../checkout.module.css';

function SuccessContent() {
    const searchParams = useSearchParams();
    const { refreshCart } = useCart();
    const [isVerifying, setIsVerifying] = useState(true);
    const [verificationError, setVerificationError] = useState<string | null>(null);
    
    const sessionId = searchParams.get('session_id');
    const orderId = searchParams.get('order_id');

    useEffect(() => {
        const verifyPayment = async () => {
            if (!sessionId || !orderId) {
                setIsVerifying(false);
                return;
            }

            try {
                // Call API to verify payment and update order status
                const res = await fetch('/api/orders/verify-payment', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ sessionId, orderId }),
                });

                const data = await res.json();
                
                if (data.success) {
                    // Payment verified, refresh cart to clear items
                    await refreshCart();
                } else {
                    setVerificationError(data.error || 'Payment verification failed');
                }
            } catch (error) {
                console.error('Payment verification error:', error);
                setVerificationError('Failed to verify payment');
            } finally {
                setIsVerifying(false);
            }
        };

        verifyPayment();
    }, [sessionId, orderId, refreshCart]);

    if (isVerifying) {
        return (
            <main className={styles.main}>
                <div className={styles.container}>
                    <div className={styles.successState}>
                        <Loader2 size={48} className={styles.spinnerLarge} />
                        <h1 className={styles.successTitle}>Confirming your payment...</h1>
                        <p className={styles.successText}>
                            Please wait while we verify your payment.
                        </p>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className={styles.main}>
            <div className={styles.container}>
                <div className={styles.successState}>
                    <div className={styles.successIconWrapper}>
                        <CheckCircle size={64} className={styles.successIcon} />
                    </div>
                    <h1 className={styles.successTitle}>Payment Successful!</h1>
                    <p className={styles.successText}>
                        Thank you for your order. We&apos;ve received your payment and your order is being processed.
                    </p>
                    
                    {orderId && (
                        <div className={styles.orderIdBox}>
                            <Package size={20} />
                            <div>
                                <span className={styles.orderIdLabel}>Order ID</span>
                                <span className={styles.orderId}>{orderId}</span>
                            </div>
                        </div>
                    )}

                    <div className={styles.confirmationDetails}>
                        <p>✓ Confirmation email sent to your inbox</p>
                        <p>✓ Order is being prepared for shipping</p>
                        <p>✓ Track your order in your dashboard</p>
                    </div>

                    <div className={styles.successActions}>
                        <Link href="/orders" className={styles.viewOrdersButton}>
                            <Package size={18} />
                            View My Orders
                        </Link>
                        <Link href="/products" className={styles.continueButton}>
                            Continue Shopping
                            <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default function CheckoutSuccessPage() {
    return (
        <Suspense fallback={
            <main className={styles.main}>
                <div className={styles.container}>
                    <div className={styles.successState}>
                        <Loader2 size={48} className={styles.spinnerLarge} />
                        <h1 className={styles.successTitle}>Loading...</h1>
                    </div>
                </div>
            </main>
        }>
            <SuccessContent />
        </Suspense>
    );
}
