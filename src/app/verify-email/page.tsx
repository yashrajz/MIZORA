'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import styles from './verify.module.css';

function VerifyEmailContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { refreshUser } = useAuth();
    const token = searchParams.get('token');
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (!token) {
            setStatus('error');
            setMessage('No verification token provided');
            return;
        }

        const verifyEmail = async () => {
            try {
                const res = await fetch(`/api/auth/verify?token=${token}`);
                const data = await res.json();

                if (data.success) {
                    setStatus('success');
                    setMessage(data.message || 'Email verified successfully!');
                    // Refresh user state to update isEmailVerified and log them in
                    await refreshUser();
                    // Redirect to dashboard after 2 seconds
                    setTimeout(() => {
                        router.push('/dashboard');
                    }, 2000);
                } else {
                    setStatus('error');
                    setMessage(data.error || 'Verification failed');
                }
            } catch (err) {
                setStatus('error');
                setMessage('Failed to connect to server');
            }
        };

        verifyEmail();
    }, [token, refreshUser, router]);

    return (
        <main className={styles.main}>
            <div className={styles.container}>
                <div className={styles.card}>
                    {status === 'loading' && (
                        <>
                            <Loader2 size={64} className={styles.loadingIcon} />
                            <h1 className={styles.title}>Verifying your email...</h1>
                            <p className={styles.text}>Please wait a moment.</p>
                        </>
                    )}

                    {status === 'success' && (
                        <>
                            <CheckCircle size={64} className={styles.successIcon} />
                            <h1 className={styles.title}>Email Verified!</h1>
                            <p className={styles.text}>{message}</p>
                            <p className={styles.redirectText}>Logging you in and redirecting to your dashboard...</p>
                            <Link href="/dashboard" className={styles.primaryButton}>
                                Go to Dashboard
                            </Link>
                        </>
                    )}

                    {status === 'error' && (
                        <>
                            <XCircle size={64} className={styles.errorIcon} />
                            <h1 className={styles.title}>Verification Failed</h1>
                            <p className={styles.text}>{message}</p>
                            <div className={styles.actions}>
                                <Link href="/signin" className={styles.primaryButton}>
                                    Sign In
                                </Link>
                                <Link href="/" className={styles.secondaryButton}>
                                    Go Home
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </main>
    );
}

export default function VerifyEmailPage() {
    return (
        <Suspense fallback={
            <main className={styles.main}>
                <div className={styles.container}>
                    <div className={styles.card}>
                        <Loader2 size={64} className={styles.loadingIcon} />
                        <h1 className={styles.title}>Loading...</h1>
                    </div>
                </div>
            </main>
        }>
            <VerifyEmailContent />
        </Suspense>
    );
}
