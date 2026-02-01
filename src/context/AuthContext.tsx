'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface User {
    _id: string;
    email: string;
    fullName: string;
    avatarUrl?: string;
    isEmailVerified: boolean;
    createdAt: Date;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    error: string | null;
    signIn: (email: string, password: string) => Promise<boolean>;
    signUp: (email: string, password: string, fullName: string) => Promise<boolean>;
    signOut: () => Promise<void>;
    refreshUser: () => Promise<void>;
    resendVerificationEmail: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const refreshUser = useCallback(async () => {
        try {
            setIsLoading(true);
            const res = await fetch('/api/auth/user');
            const data = await res.json();

            if (data.success) {
                setUser(data.data);
            } else {
                setUser(null);
            }
        } catch (err) {
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Check auth on mount
    useEffect(() => {
        refreshUser();
    }, [refreshUser]);

    const signIn = async (email: string, password: string): Promise<boolean> => {
        try {
            setIsLoading(true);
            setError(null);
            const res = await fetch('/api/auth/signin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();

            if (data.success) {
                setUser(data.data.user);
                return true;
            } else {
                setError(data.error || 'Failed to sign in');
                return false;
            }
        } catch (err) {
            setError('Failed to connect to server');
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const signUp = async (email: string, password: string, fullName: string): Promise<boolean> => {
        try {
            setIsLoading(true);
            setError(null);
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, fullName }),
            });
            const data = await res.json();

            if (data.success) {
                // Don't set user - they need to verify email first
                return true;
            } else {
                setError(data.error || 'Failed to create account');
                return false;
            }
        } catch (err) {
            setError('Failed to connect to server');
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const signOut = async (): Promise<void> => {
        try {
            setIsLoading(true);
            await fetch('/api/auth/signout', { method: 'POST' });
            setUser(null);
        } catch (err) {
            console.error('Sign out error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const resendVerificationEmail = async (): Promise<boolean> => {
        if (!user) return false;
        try {
            const res = await fetch('/api/auth/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: user.email }),
            });
            const data = await res.json();
            return data.success;
        } catch {
            return false;
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                error,
                signIn,
                signUp,
                signOut,
                refreshUser,
                resendVerificationEmail,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
