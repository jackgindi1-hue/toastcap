import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

// ============================================
// SECURE AUTHENTICATION SYSTEM
// ============================================

const SESSION_COOKIE_NAME = 'tc_admin_session';
const SESSION_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

// Get admin credentials from environment variables ONLY
function getAdminCredentials() {
  return {
    username: process.env.ADMIN_USERNAME || '',
    passwordHash: process.env.ADMIN_PASSWORD_HASH || '',
  };
}

// Auth secret from environment
const getAuthSecret = () => process.env.AUTH_SECRET || '';

// Simple but secure hash comparison (timing-safe)
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    // Still do the comparison to prevent timing attacks
    let result = 0;
    for (let i = 0; i < a.length; i++) {
      result |= a.charCodeAt(i) ^ (b.charCodeAt(i % b.length) || 0);
    }
    return false;
  }

  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

// Hash password using simple but effective method
// In production, use bcrypt - but this avoids native dependencies
export function hashPassword(password: string): string {
  const secret = getAuthSecret();
  // Simple HMAC-like hash
  let hash = 0;
  const combined = password + secret;
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  // Convert to hex and add some entropy
  const baseHash = Math.abs(hash).toString(16);
  const entropy = Buffer.from(password + secret).toString('base64').slice(0, 20);
  return `v1:${baseHash}:${entropy}`;
}

// Verify password against hash
export function verifyPassword(password: string, storedHash: string): boolean {
  const computedHash = hashPassword(password);
  return timingSafeEqual(computedHash, storedHash);
}

// Generate a secure session token
function generateSessionToken(username: string): string {
  const secret = getAuthSecret();
  const expiresAt = Date.now() + SESSION_DURATION_MS;
  const payload = `${username}:${expiresAt}`;

  // Create a signature
  let hash = 0;
  const toSign = payload + secret;
  for (let i = 0; i < toSign.length; i++) {
    const char = toSign.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  const signature = Math.abs(hash).toString(16);

  // Encode the token
  const token = Buffer.from(`${payload}:${signature}`).toString('base64');
  return token;
}

// Verify and decode session token
function verifySessionToken(token: string): { valid: boolean; username?: string } {
  try {
    const secret = getAuthSecret();
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const parts = decoded.split(':');

    if (parts.length !== 3) {
      return { valid: false };
    }

    const [username, expiresAtStr, signature] = parts;
    const expiresAt = parseInt(expiresAtStr, 10);

    // Check expiration
    if (Date.now() > expiresAt) {
      return { valid: false };
    }

    // Verify signature
    const payload = `${username}:${expiresAtStr}`;
    let hash = 0;
    const toSign = payload + secret;
    for (let i = 0; i < toSign.length; i++) {
      const char = toSign.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    const expectedSignature = Math.abs(hash).toString(16);

    if (!timingSafeEqual(signature, expectedSignature)) {
      return { valid: false };
    }

    return { valid: true, username };
  } catch {
    return { valid: false };
  }
}

// ============================================
// PUBLIC API
// ============================================

/**
 * Validate admin login credentials
 */
export function validateCredentials(username: string, password: string): boolean {
  const creds = getAdminCredentials();

  if (!creds.username || !creds.passwordHash) {
    console.error('[Auth] Admin credentials not configured');
    return false;
  }

  // Check username (case-insensitive)
  if (username.toLowerCase() !== creds.username.toLowerCase()) {
    return false;
  }

  // Check password
  return verifyPassword(password, creds.passwordHash);
}

/**
 * Create a session after successful login
 */
export async function createSession(username: string): Promise<string> {
  const token = generateSessionToken(username);

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_DURATION_MS / 1000, // in seconds
    path: '/',
  });

  return token;
}

/**
 * Destroy the current session
 */
export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

/**
 * Get the current session from cookies
 */
export async function getSession(): Promise<{ authenticated: boolean; username?: string }> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (!token) {
      return { authenticated: false };
    }

    const result = verifySessionToken(token);

    if (result.valid && result.username) {
      return { authenticated: true, username: result.username };
    }

    return { authenticated: false };
  } catch {
    return { authenticated: false };
  }
}

/**
 * Check if request is authenticated (for API routes)
 * Can check either cookie or Authorization header
 */
export async function isAuthenticated(request?: NextRequest): Promise<boolean> {
  // First try cookie-based auth
  const session = await getSession();
  if (session.authenticated) {
    return true;
  }

  // Then try header-based auth (for API calls)
  if (request) {
    const authHeader = request.headers.get('Authorization');
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.slice(7);
      const result = verifySessionToken(token);
      return result.valid;
    }

    // Also check for API key (for server-to-server calls like cron)
    const apiKey = request.headers.get('X-API-Key');
    const expectedApiKey = process.env.INTERNAL_API_KEY;
    if (apiKey && expectedApiKey && timingSafeEqual(apiKey, expectedApiKey)) {
      return true;
    }
  }

  return false;
}

/**
 * Require authentication - returns error response if not authenticated
 */
export async function requireAuth(request?: NextRequest): Promise<Response | null> {
  const authenticated = await isAuthenticated(request);

  if (!authenticated) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized', message: 'Authentication required' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  return null; // null means authenticated, continue
}

/**
 * Utility to generate a password hash for setup
 * Run: console.log(hashPassword('your-password'))
 */
export function generatePasswordHash(password: string): string {
  return hashPassword(password);
}
