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

        if (password.length < 8) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'Password must be at least 8 characters' },
                { status: 400 }
            );
        }

        // Email validation
        const emailRegex = /^\S+@\S+\.\S+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'Please enter a valid email address' },
                { status: 400 }
            );
        }

        await dbConnect();

        // Check if user already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
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
            email: email.toLowerCase(),
            passwordHash,
            fullName: fullName.trim(),
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

        // Generate token and set cookie (user can login but with limited access until verified)
        const token = generateToken({
            userId: user._id.toString(),
            email: user.email,
        });
        await setAuthCookie(token);

        const response: AuthResponse = {
            user: {
                _id: user._id.toString(),
                email: user.email,
                fullName: user.fullName,
                avatarUrl: user.avatarUrl,
                isEmailVerified: user.isEmailVerified,
                createdAt: user.createdAt,
            },
        };

        return NextResponse.json<ApiResponse<AuthResponse>>(
            { 
                success: true, 
                data: response, 
                message: 'Account created! Please check your email to verify your account.' 
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
