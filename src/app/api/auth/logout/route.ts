import { NextResponse } from 'next/server';
import { destroySession } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    await destroySession();

    return NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error: any) {
    console.error('[Auth] Logout error:', error);
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    );
  }
}
