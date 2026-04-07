import { NextRequest, NextResponse } from 'next/server';
import { bulkStartDripCampaign, getAllLeads } from '@/lib/leads-db';
import { requireAuth } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

// POST /api/drip/start - Start drip campaign for leads (PROTECTED)
export async function POST(request: NextRequest) {
  // Require authentication
  const authError = await requireAuth(request);
  if (authError) return authError;

  try {
    const { leadIds, startAtStep, style } = await request.json();

    if (!leadIds || !Array.isArray(leadIds) || leadIds.length === 0) {
      return NextResponse.json({ error: 'No lead IDs provided' }, { status: 400 });
    }

    const validStartStep = startAtStep ? Math.max(1, Math.min(startAtStep, 9)) : 1;
    const validStyle: 'original' | 'v2' = style === 'v2' ? 'v2' : 'original';

    console.log(`🚀 Starting drip for ${leadIds.length} leads at step ${validStartStep} (style: ${validStyle})`);

    // Use bulk function - only 2 DB calls total
    const result = await bulkStartDripCampaign(leadIds, validStartStep, validStyle);

    // Verify
    const allLeads = await getAllLeads();
    const actualInDrip = allLeads.filter(l => l.dripCampaign).length;

    console.log(`🚀 Done: ${result.started} started, ${result.skipped} skipped, ${actualInDrip} total in drip`);

    return NextResponse.json({
      success: true,
      started: result.started,
      skipped: result.skipped,
      total: leadIds.length,
      startedAtStep: validStartStep,
      style: validStyle,
      skipBreakdown: result.skipReasons,
      skipDetails: result.skippedDetails,
      verification: {
        totalLeadsInDB: allLeads.length,
        totalInDripNow: actualInDrip,
        startedThisRequest: result.started,
        startedIds: result.startedIds.slice(0, 10),
      },
    });
  } catch (error: any) {
    console.error('Start drip error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to start drip campaign' },
      { status: 500 }
    );
  }
}
