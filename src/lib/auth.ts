import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { JWTPayload, IUserPublic } from '@/types';
import dbConnect from './mongodb';
import { User } from './models';

const JWT_SECRET = process.env.JWT_SECRET || 'mizora-jwt-secret-key-change-in-production';
const TOKEN_EXPIRY = '7d';
const COOKIE_NAME = 'mizora_auth_token';

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
}

/**
 * Compare password with hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
}

/**
 * Generate JWT token
 */
export function generateToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
}

/**
 * Verify JWT token
 */
export function verifyToken(token: string): JWTPayload | null {
    try {
        return jwt.verify(token, JWT_SECRET) as JWTPayload;
    } catch {
        return null;
    }
}

/**
 * Set auth token cookie
 */
export async function setAuthCookie(token: string): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
    });
}

/**
 * Remove auth token cookie
 */
export async function removeAuthCookie(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete(COOKIE_NAME);
}

/**
 * Get auth token from cookie
 */
export async function getAuthToken(): Promise<string | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME);
    return token?.value || null;
}

/**
 * Get current authenticated user from token
 */
export async function getCurrentUser(): Promise<IUserPublic | null> {
    const token = await getAuthToken();
    if (!token) return null;

    const payload = verifyToken(token);
    if (!payload) return null;

    try {
        await dbConnect();
        const user = await User.findById(payload.userId).lean();
        
        if (!user) return null;

        return {
            _id: user._id.toString(),
            email: user.email,
            fullName: user.fullName,
            avatarUrl: user.avatarUrl,
            isEmailVerified: user.isEmailVerified || false,
            createdAt: user.createdAt,
        };
    } catch {
        return null;
    }
}

/**
 * Validate user ID from token (for API routes)
 */
export async function validateAuth(): Promise<{ userId: string; email: string } | null> {
    const token = await getAuthToken();
    if (!token) return null;

    const payload = verifyToken(token);
    if (!payload) return null;

    return { userId: payload.userId, email: payload.email };
}
