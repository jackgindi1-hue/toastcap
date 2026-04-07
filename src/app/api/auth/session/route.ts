import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getSession();

    return NextResponse.json({
      authenticated: session.authenticated,
      username: session.username || null,
    });
  } catch (error: any) {
    console.error('[Auth] Session check error:', error);
    return NextResponse.json({
      authenticated: false,
      username: null,
    });
  }
}
