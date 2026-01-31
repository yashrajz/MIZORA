import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { User } from '@/lib/models';
import { sendWelcomeEmail } from '@/lib/email';
import { ApiResponse } from '@/types';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const token = searchParams.get('token');

        console.log('Verification attempt with token:', token);

        if (!token) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'Verification token is required' },
                { status: 400 }
            );
        }

        await dbConnect();

        // First, find user by token only to debug
        const userByToken = await User.findOne({ emailVerificationToken: token });
        console.log('User found by token:', userByToken ? userByToken.email : 'none');
        if (userByToken && userByToken.emailVerificationExpires) {
            console.log('Token expires:', userByToken.emailVerificationExpires);
            console.log('Current time:', new Date());
            console.log('Is expired:', userByToken.emailVerificationExpires < new Date());
        }

        // Find user with this verification token
        const user = await User.findOne({
            emailVerificationToken: token,
            emailVerificationExpires: { $gt: new Date() },
        });

        console.log('User found with valid token:', user ? user.email : 'none');

        if (!user) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'Invalid or expired verification token' },
                { status: 400 }
            );
        }

        // Check if already verified
        if (user.isEmailVerified) {
            return NextResponse.json<ApiResponse>(
                { success: true, message: 'Email already verified' },
                { status: 200 }
            );
        }

        // Mark email as verified
        user.isEmailVerified = true;
        user.emailVerificationToken = undefined;
        user.emailVerificationExpires = undefined;
        await user.save();

        // Send welcome email
        await sendWelcomeEmail(user.email, user.fullName);

        return NextResponse.json<ApiResponse>(
            { success: true, message: 'Email verified successfully! Welcome to MIZORA.' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Verify email error:', error);
        return NextResponse.json<ApiResponse>(
            { success: false, error: 'Failed to verify email' },
            { status: 500 }
        );
    }
}

// POST - Resend verification email
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email } = body;

        if (!email) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'Email is required' },
                { status: 400 }
            );
        }

        await dbConnect();

        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            // Don't reveal if user exists
            return NextResponse.json<ApiResponse>(
                { success: true, message: 'If an account exists, a verification email has been sent.' },
                { status: 200 }
            );
        }

        if (user.isEmailVerified) {
            return NextResponse.json<ApiResponse>(
                { success: true, message: 'Email is already verified' },
                { status: 200 }
            );
        }

        // Generate new token
        const { generateVerificationToken, sendVerificationEmail } = await import('@/lib/email');
        const verificationToken = generateVerificationToken();
        const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

        user.emailVerificationToken = verificationToken;
        user.emailVerificationExpires = verificationExpires;
        await user.save();

        // Send verification email
        await sendVerificationEmail(user.email, user.fullName, verificationToken);

        return NextResponse.json<ApiResponse>(
            { success: true, message: 'Verification email sent! Please check your inbox.' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Resend verification error:', error);
        return NextResponse.json<ApiResponse>(
            { success: false, error: 'Failed to send verification email' },
            { status: 500 }
        );
    }
}
