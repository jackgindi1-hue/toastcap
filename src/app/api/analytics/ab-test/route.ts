import { NextRequest, NextResponse } from 'next/server';
import { getABTestMetrics } from '@/lib/analytics-db';
import { requireAuth } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET /api/analytics/ab-test - Get A/B test comparison metrics
export async function GET(request: NextRequest) {
  // Require authentication
  const authError = await requireAuth(request);
  if (authError) return authError;

  try {
    const { templates, summary } = await getABTestMetrics();

    return NextResponse.json({
      success: true,
      summary,
      templates,
      description: 'A/B test comparison: Original style (gray wrapper, centered) vs V2 style (orange banner, website-like)',
    });
  } catch (error: any) {
    console.error('A/B test metrics error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch A/B test metrics' },
      { status: 500 }
    );
  }
}
