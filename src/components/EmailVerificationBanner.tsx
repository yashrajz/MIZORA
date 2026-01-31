'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import styles from './EmailVerificationBanner.module.css';

export default function EmailVerificationBanner() {
    const { user, resendVerificationEmail } = useAuth();
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);
    const [dismissed, setDismissed] = useState(false);

    const showBanner = user && !user.isEmailVerified && !dismissed;

    // Add padding to body when banner is shown
    useEffect(() => {
        if (showBanner) {
            document.body.style.paddingTop = '52px';
        } else {
            document.body.style.paddingTop = '0';
        }
        return () => {
            document.body.style.paddingTop = '0';
        };
    }, [showBanner]);

    // Don't show if no user, already verified, or dismissed
    if (!showBanner) {
        return null;
    }

    const handleResend = async () => {
        setSending(true);
        const success = await resendVerificationEmail();
        setSending(false);
        if (success) {
            setSent(true);
            setTimeout(() => setSent(false), 5000);
        }
    };

    return (
        <div className={styles.banner}>
            <div className={styles.content}>
                <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <p className={styles.message}>
                    Please verify your email address. Check your inbox for a verification link.
                </p>
            </div>
            <div className={styles.actions}>
                {sent ? (
                    <span className={styles.sentMessage}>Email sent!</span>
                ) : (
                    <button 
                        onClick={handleResend} 
                        className={styles.resendButton}
                        disabled={sending}
                    >
                        {sending ? 'Sending...' : 'Resend Email'}
                    </button>
                )}
                <button 
                    onClick={() => setDismissed(true)}
                    className={styles.dismissButton}
                    aria-label="Dismiss"
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
