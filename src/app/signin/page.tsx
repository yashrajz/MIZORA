'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import styles from './signin.module.css';

export default function SignInPage() {
    const router = useRouter();
    const { signIn, isLoading, error } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [localError, setLocalError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLocalError('');

        if (!email || !password) {
            setLocalError('Please fill in all fields');
            return;
        }

        const success = await signIn(email, password);
        if (success) {
            router.push('/dashboard');
        }
    };

    return (
        <main className={styles.main}>
            <div className={styles.container}>
                <div className={styles.formCard}>
                    <div className={styles.header}>
                        <h1 className={styles.title}>Welcome Back</h1>
                        <p className={styles.subtitle}>Sign in to your MIZORA account</p>
                    </div>

                    <form onSubmit={handleSubmit} className={styles.form}>
                        {(error || localError) && (
                            <div className={styles.error}>
                                {error || localError}
                            </div>
                        )}

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
                                placeholder="••••••••"
                                disabled={isLoading}
                            />
                        </div>

                        <button
                            type="submit"
                            className={styles.submitButton}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Signing In...' : 'Sign In'}
                        </button>
                    </form>

                    <div className={styles.footer}>
                        <p>
                            Don&apos;t have an account?{' '}
                            <Link href="/signup" className={styles.link}>
                                Create one
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}
