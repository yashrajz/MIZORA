import { NextResponse } from 'next/server';
import { removeAuthCookie } from '@/lib/auth';
import { ApiResponse } from '@/types';

export async function POST() {
    try {
        await removeAuthCookie();

        return NextResponse.json<ApiResponse>(
            { success: true, message: 'Signed out successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Signout error:', error);
        return NextResponse.json<ApiResponse>(
            { success: false, error: 'Failed to sign out' },
            { status: 500 }
        );
    }
}
