import { NextRequest, NextResponse } from 'next/server';
import { validateCredentials, createSession } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Rate limiting - simple in-memory store (resets on deploy)
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>();
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

function getClientIP(request: NextRequest): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
         request.headers.get('x-real-ip') ||
         'unknown';
}

function isRateLimited(ip: string): boolean {
  const attempts = loginAttempts.get(ip);
  if (!attempts) return false;

  // Reset if lockout period has passed
  if (Date.now() - attempts.lastAttempt > LOCKOUT_DURATION_MS) {
    loginAttempts.delete(ip);
    return false;
  }

  return attempts.count >= MAX_ATTEMPTS;
}

function recordAttempt(ip: string, success: boolean): void {
  if (success) {
    loginAttempts.delete(ip);
    return;
  }

  const attempts = loginAttempts.get(ip) || { count: 0, lastAttempt: 0 };
  attempts.count++;
  attempts.lastAttempt = Date.now();
  loginAttempts.set(ip, attempts);
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIP(request);

    // Check rate limiting
    if (isRateLimited(ip)) {
      console.warn(`[Auth] Rate limited login attempt from ${ip}`);
      return NextResponse.json(
        { error: 'Too many login attempts. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    // Validate credentials (SECURITY: never log credentials or password info)
    const isValid = validateCredentials(username, password);

    if (!isValid) {
      recordAttempt(ip, false);
      console.warn(`[Auth] Failed login attempt for "${username}" from ${ip}`);

      // Generic error message to prevent username enumeration
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Success - create session
    recordAttempt(ip, true);
    const token = await createSession(username);

    console.log(`[Auth] Successful login for "${username}" from ${ip}`);

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      // Include token for clients that need it in headers
      token,
    });

  } catch (error: any) {
    console.error('[Auth] Login error:', error);
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    );
  }
}
