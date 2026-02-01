import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { User } from '@/lib/models';
import { hashPassword, generateToken, setAuthCookie } from '@/lib/auth';
import { generateVerificationToken, sendVerificationEmail } from '@/lib/email';
import { ApiResponse, AuthResponse, SignUpRequest } from '@/types';

export async function POST(request: NextRequest) {
    try {
        const body: SignUpRequest = await request.json();
        const { email, password, fullName } = body;

        // Validation
        if (!email || !password || !fullName) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'Email, password, and full name are required' },
                { status: 400 }
            );
        }

        // Sanitize and validate inputs
        const sanitizedEmail = email.trim().toLowerCase();
        const sanitizedName = fullName.trim();

        if (sanitizedName.length < 2 || sanitizedName.length > 50) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'Name must be between 2 and 50 characters' },
                { status: 400 }
            );
        }

        if (!/^[a-zA-Z\s]+$/.test(sanitizedName)) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'Name can only contain letters and spaces' },
                { status: 400 }
            );
        }

        if (password.length < 8 || password.length > 128) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'Password must be between 8 and 128 characters' },
                { status: 400 }
            );
        }

        // Check password strength
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'Password must contain uppercase, lowercase, and number' },
                { status: 400 }
            );
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(sanitizedEmail) || sanitizedEmail.length > 255) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'Please enter a valid email address' },
                { status: 400 }
            );
        }

        await dbConnect();

        // Check if user already exists
        const existingUser = await User.findOne({ email: sanitizedEmail });
        if (existingUser) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'An account with this email already exists' },
                { status: 409 }
            );
        }

        // Generate verification token
        const verificationToken = generateVerificationToken();
        const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        console.log('Generated verification token:', verificationToken);
        console.log('Token expires:', verificationExpires);

        // Hash password and create user
        const passwordHash = await hashPassword(password);
        const user = await User.create({
            email: sanitizedEmail,
            passwordHash,
            fullName: sanitizedName,
            isEmailVerified: false,
            emailVerificationToken: verificationToken,
            emailVerificationExpires: verificationExpires,
        });

        console.log('User created with token:', user.emailVerificationToken);

        // Send verification email
        const emailResult = await sendVerificationEmail(
            user.email,
            user.fullName,
            verificationToken
        );

        console.log('Email send result:', emailResult);

        if (!emailResult.success) {
            console.error('Failed to send verification email:', emailResult.error);
        }

        // DO NOT log in user automatically - they must verify email first
        // Return success without setting auth cookie

        return NextResponse.json<ApiResponse>(
            { 
                success: true, 
                message: 'Account created! Please check your email to verify your account.',
                data: {
                    email: user.email,
                    requiresVerification: true
                }
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Signup error:', error);
        return NextResponse.json<ApiResponse>(
            { success: false, error: 'Failed to create account. Please try again.' },
            { status: 500 }
        );
    }
}
