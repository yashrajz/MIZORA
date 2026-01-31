import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { ApiResponse, IUserPublic } from '@/types';

export async function GET() {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'Not authenticated' },
                { status: 401 }
            );
        }

        return NextResponse.json<ApiResponse<IUserPublic>>(
            { success: true, data: user },
            { status: 200 }
        );
    } catch (error) {
        console.error('Get user error:', error);
        return NextResponse.json<ApiResponse>(
            { success: false, error: 'Failed to get user information' },
            { status: 500 }
        );
    }
}
