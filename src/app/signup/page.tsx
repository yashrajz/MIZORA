'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import styles from './signup.module.css';

export default function SignUpPage() {
    const router = useRouter();
    const { signUp, isLoading, error } = useAuth();
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [localError, setLocalError] = useState('');
    const [showVerificationMessage, setShowVerificationMessage] = useState(false);
    const [registeredEmail, setRegisteredEmail] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLocalError('');

        if (!fullName || !email || !password || !confirmPassword) {
            setLocalError('Please fill in all fields');
            return;
        }

        // Validate name (2-50 chars, letters and spaces only)
        const trimmedName = fullName.trim();
        if (trimmedName.length < 2 || trimmedName.length > 50) {
            setLocalError('Name must be between 2 and 50 characters');
            return;
        }

        if (!/^[a-zA-Z\s]+$/.test(trimmedName)) {
            setLocalError('Name can only contain letters and spaces');
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
            setLocalError('Please enter a valid email address');
            return;
        }

        if (password !== confirmPassword) {
            setLocalError('Passwords do not match');
            return;
        }

        if (password.length < 8) {
            setLocalError('Password must be at least 8 characters');
            return;
        }

        // Check password strength
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
            setLocalError('Password must contain uppercase, lowercase, and number');
            return;
        }

        const success = await signUp(email.trim().toLowerCase(), password, trimmedName);
        if (success) {
            // Show verification message instead of redirecting
            setRegisteredEmail(email.trim().toLowerCase());
            setShowVerificationMessage(true);
        }
    };

    return (
        <main className={styles.main}>
            <div className={styles.container}>
                <div className={styles.formCard}>
                    {showVerificationMessage ? (
                        <>
                            <div className={styles.header}>
                                <h1 className={styles.title}>Check Your Email</h1>
                                <p className={styles.subtitle}>We've sent a verification link to {registeredEmail}</p>
                            </div>
                            <div style={{ padding: '2rem', textAlign: 'center' }}>
                                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✉️</div>
                                <p style={{ marginBottom: '1rem', color: '#6b7280' }}>
                                    Please click the verification link in your email to activate your account.
                                </p>
                                <p style={{ marginBottom: '2rem', color: '#6b7280', fontSize: '0.875rem' }}>
                                    Can't find it? Check your spam folder.
                                </p>
                                <Link href="/signin" className={styles.submitButton} style={{ textDecoration: 'none', display: 'inline-block' }}>
                                    Go to Sign In
                                </Link>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className={styles.header}>
                                <h1 className={styles.title}>Create Account</h1>
                                <p className={styles.subtitle}>Join MIZORA for a premium matcha experience</p>
                            </div>

                    <form onSubmit={handleSubmit} className={styles.form}>
                        {(error || localError) && (
                            <div className={styles.error}>
                                {error || localError}
                            </div>
                        )}

                        <div className={styles.inputGroup}>
                            <label htmlFor="fullName" className={styles.label}>
                                Full Name
                            </label>
                            <input
                                type="text"
                                id="fullName"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className={styles.input}
                                placeholder="Your Name"
                                disabled={isLoading}
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label htmlFor="email" className={styles.label}>
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={styles.input}
                                placeholder="your@email.com"
                                disabled={isLoading}
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label htmlFor="password" className={styles.label}>
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={styles.input}
                                placeholder="Minimum 8 characters"
                                disabled={isLoading}
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label htmlFor="confirmPassword" className={styles.label}>
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className={styles.input}
                                placeholder="••••••••"
                                disabled={isLoading}
                            />
                        </div>

                        <button
                            type="submit"
                            className={styles.submitButton}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Creating Account...' : 'Create Account'}
                        </button>
                    </form>

                    <div className={styles.footer}>
                        <p>
                            Already have an account?{' '}
                            <Link href="/signin" className={styles.link}>
                                Sign in
                            </Link>
                        </p>
                    </div>
                        </>
                    )}
                </div>
            </div>
        </main>
    );
}
