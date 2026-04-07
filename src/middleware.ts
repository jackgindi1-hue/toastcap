import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// CRM domain - this is the bulletproof backup that should be hidden from public
const CRM_DOMAINS = [
  'toastcap-crm.netlify.app',
];

// Allowed paths on the CRM domain
const ALLOWED_CRM_PATHS = [
  '/crm',           // Admin dashboard
  '/api/',          // All API routes (webhooks, tracking, drip, etc.)
  '/_next/',        // Next.js assets
  '/favicon.ico',   // Favicon
  '/toast-capital-logo.png', // Logo for emails (CDN)
];

// Pages on public domain (toastcap.com) that REQUIRE a token
// These pages should show 404 if no token is present
// Basically ALL user-facing pages - maximum stealth mode
const TOKEN_REQUIRED_PAGES = [
  '/',              // Homepage - requires token
  '/quote',         // Quote page - requires token
  '/upload',        // Upload page - requires token
  '/dlvc',          // DLVC page - requires token
  '/privacy',       // Privacy page - requires token
  '/terms',         // Terms page - requires token
];

// Pages on public domain that are ALWAYS allowed (no token required)
const ALWAYS_ALLOWED_PATHS = [
  '/api/',          // API routes
  '/_next/',        // Next.js assets
  '/favicon.ico',   // Favicon
  '/toast-capital-logo.png', // Logo
  '/toast-icon.png', // Icon
  // NOTE: /privacy and /terms now require tokens too - maximum stealth
];

// Generic 404 page - no branding, no Toast Capital anything
const GENERIC_404 = `<!DOCTYPE html>
<html>
<head><title>404</title></head>
<body style="margin:0;padding:0;background:#f5f5f5;display:flex;align-items:center;justify-content:center;height:100vh;font-family:system-ui,sans-serif;">
<div style="text-align:center;color:#999;">
<h1 style="font-size:72px;margin:0;font-weight:200;">404</h1>
<p style="margin:10px 0 0;font-size:14px;">Page not found</p>
</div>
</body>
</html>`;

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  const pathname = request.nextUrl.pathname;
  const token = request.nextUrl.searchParams.get('token');

  // Check if this is the CRM domain
  const isCrmDomain = CRM_DOMAINS.some(domain => hostname.includes(domain.split(':')[0]));

  // ============================================
  // CRM DOMAIN LOGIC (toastcap-crm.netlify.app)
  // ============================================
  if (isCrmDomain) {
    // On CRM domain - check if path is allowed
    const isAllowedPath = ALLOWED_CRM_PATHS.some(path => pathname.startsWith(path));

    if (isAllowedPath) {
      return NextResponse.next();
    }

    // Block everything else on CRM domain
    return new NextResponse(GENERIC_404, {
      status: 404,
      headers: { 'Content-Type': 'text/html' },
    });
  }

  // ============================================
  // PUBLIC DOMAIN LOGIC (toastcap.com)
  // ============================================

  // Always allow certain paths (API, assets, legal pages)
  const isAlwaysAllowed = ALWAYS_ALLOWED_PATHS.some(path => pathname.startsWith(path));
  if (isAlwaysAllowed) {
    return NextResponse.next();
  }

  // Check if this is a page that requires a token
  const requiresToken = TOKEN_REQUIRED_PAGES.some(page => {
    if (page === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(page);
  });

  // If page requires token but no token provided, return 404
  if (requiresToken && !token) {
    return new NextResponse(GENERIC_404, {
      status: 404,
      headers: { 'Content-Type': 'text/html' },
    });
  }

  // For localhost development, be more lenient
  if (hostname.includes('localhost')) {
    return NextResponse.next();
  }

  // Token is present, let the page handle validation
  return NextResponse.next();
}

// Configure which paths the middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - Static files (images, fonts, etc.)
     */
    '/((?!_next/static|_next/image|.*\\.(?:ico|png|jpg|jpeg|gif|svg|webp|avif|woff|woff2|ttf|eot)).*)',
  ],
};
