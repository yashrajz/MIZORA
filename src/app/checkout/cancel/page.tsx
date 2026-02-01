'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { XCircle, ArrowLeft, RefreshCcw, Loader2 } from 'lucide-react';
import styles from '../checkout.module.css';

function CancelContent() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('order_id');

    return (
        <main className={styles.main}>
            <div className={styles.container}>
                <div className={styles.cancelState}>
                    <div className={styles.cancelIconWrapper}>
                        <XCircle size={64} className={styles.cancelIcon} />
                    </div>
                    <h1 className={styles.cancelTitle}>Payment Cancelled</h1>
                    <p className={styles.cancelText}>
                        Your payment was cancelled. No charges have been made to your account.
                    </p>
                    
                    {orderId && (
                        <p className={styles.cancelSubtext}>
                            Order #{orderId} has been cancelled and will not be processed.
                        </p>
                    )}

                    <div className={styles.cancelInfo}>
                        <p>Don&apos;t worry! Your cart items are still saved.</p>
                        <p>If you experienced any issues, please try again or contact support.</p>
                    </div>

                    <div className={styles.cancelActions}>
                        <Link href="/checkout" className={styles.retryButton}>
                            <RefreshCcw size={18} />
                            Try Again
                        </Link>
                        <Link href="/cart" className={styles.backToCartButton}>
                            <ArrowLeft size={18} />
                            Back to Cart
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default function CheckoutCancelPage() {
    return (
        <Suspense fallback={
            <main className={styles.main}>
                <div className={styles.container}>
                    <div className={styles.cancelState}>
                        <Loader2 size={48} className={styles.spinnerLarge} />
                        <h1 className={styles.cancelTitle}>Loading...</h1>
                    </div>
                </div>
            </main>
        }>
            <CancelContent />
        </Suspense>
    );
}
