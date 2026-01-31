import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { User } from '@/lib/models';
import { verifyPassword, generateToken, setAuthCookie } from '@/lib/auth';
import { ApiResponse, AuthResponse, SignInRequest } from '@/types';

export async function POST(request: NextRequest) {
    try {
        const body: SignInRequest = await request.json();
        const { email, password } = body;

        // Validation
        if (!email || !password) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'Email and password are required' },
                { status: 400 }
            );
        }

        await dbConnect();

        // Find user by email
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'Invalid email or password' },
                { status: 401 }
            );
        }

        // Verify password
        const isValidPassword = await verifyPassword(password, user.passwordHash);
        if (!isValidPassword) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'Invalid email or password' },
                { status: 401 }
            );
        }

        // Generate token and set cookie
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
                isEmailVerified: user.isEmailVerified || false,
                createdAt: user.createdAt,
            },
        };

        return NextResponse.json<ApiResponse<AuthResponse>>(
            { success: true, data: response, message: 'Signed in successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Signin error:', error);
        return NextResponse.json<ApiResponse>(
            { success: false, error: 'Failed to sign in. Please try again.' },
            { status: 500 }
        );
    }
}
