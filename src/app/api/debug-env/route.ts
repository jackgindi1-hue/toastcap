import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET /api/debug-env - Check environment variables (remove after debugging)
export async function GET() {
  return NextResponse.json({
    timestamp: new Date().toISOString(),
    env: {
      // Key variable - if set, we're on Netlify and auto-auth should work
      NETLIFY: process.env.NETLIFY ? `set (${process.env.NETLIFY})` : 'NOT SET - auto-auth will NOT work!',
      NETLIFY_SITE_ID: process.env.NETLIFY_SITE_ID ? `set (${process.env.NETLIFY_SITE_ID.length} chars)` : 'NOT SET',
      SITE_ID: process.env.SITE_ID ? `set (${process.env.SITE_ID.length} chars)` : 'NOT SET',
      NETLIFY_ACCESS_TOKEN: process.env.NETLIFY_ACCESS_TOKEN ? `set (${process.env.NETLIFY_ACCESS_TOKEN.length} chars)` : 'NOT SET',
      // Also check common Netlify auto-vars
      DEPLOY_URL: process.env.DEPLOY_URL ? 'set' : 'NOT SET',
      URL: process.env.URL ? 'set' : 'NOT SET',
    },
    recommendation: process.env.NETLIFY
      ? 'Running on Netlify - auto-auth should work'
      : 'NOT on Netlify platform - need manual NETLIFY_SITE_ID and NETLIFY_ACCESS_TOKEN',
  });
}
