import { NextRequest, NextResponse } from 'next/server';
import { startDripCampaign, getLead, getAllLeads } from '@/lib/leads-db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60; // 60 seconds for bulk operations

// POST /api/drip/start - Start drip campaign for leads
// Body: { leadIds: string[], startAtStep?: number (1-9) }
export async function POST(request: NextRequest) {
  try {
    const { leadIds, startAtStep } = await request.json();

    if (!leadIds || !Array.isArray(leadIds) || leadIds.length === 0) {
      return NextResponse.json({ error: 'No lead IDs provided' }, { status: 400 });
    }

    // Validate startAtStep if provided
    const validStartStep = startAtStep ? Math.max(1, Math.min(startAtStep, 9)) : 1;

    console.log(`🚀 Starting drip for ${leadIds.length} leads at step ${validStartStep}`);

    let started = 0;
    const skipReasons = {
      notFound: 0,
      noEmail: 0,
      emailBounced: 0,
      alreadyInDrip: 0,
      startFunctionFailed: 0,
    };
    const skippedDetails: { id: string; business: string; reason: string }[] = [];
    const startedIds: string[] = [];

    // Process in batches to avoid timeout
    const BATCH_SIZE = 25;

    for (let i = 0; i < leadIds.length; i += BATCH_SIZE) {
      const batch = leadIds.slice(i, i + BATCH_SIZE);

      // Process each lead and track why it was skipped
      for (const leadId of batch) {
        try {
          // Get the lead first to check why it might be skipped
          const lead = await getLead(leadId);

          if (!lead) {
            skipReasons.notFound++;
            skippedDetails.push({ id: leadId, business: '?', reason: 'Lead not found in database' });
            console.log(`🚀 Skipped ${leadId}: not found`);
            continue;
          }

          if (!lead.email || !lead.email.trim()) {
            skipReasons.noEmail++;
            skippedDetails.push({ id: leadId, business: lead.businessName || '?', reason: 'No email address' });
            console.log(`🚀 Skipped ${leadId}: no email`);
            continue;
          }

          if (lead.emailBounced) {
            skipReasons.emailBounced++;
            skippedDetails.push({ id: leadId, business: lead.businessName || '?', reason: 'Email bounced' });
            console.log(`🚀 Skipped ${leadId}: email bounced`);
            continue;
          }

          if (lead.dripCampaign) {
            skipReasons.alreadyInDrip++;
            skippedDetails.push({ id: leadId, business: lead.businessName || '?', reason: `Already in drip step ${lead.dripStep || 0}/${lead.dripTotalSteps || 9}` });
            console.log(`🚀 Skipped ${leadId}: already in drip`);
            continue;
          }

          // Actually start the drip
          const result = await startDripCampaign(leadId, validStartStep);
          if (result) {
            started++;
            startedIds.push(leadId);
            console.log(`🚀 Started drip for ${leadId}: ${lead.businessName}`);
          } else {
            skipReasons.startFunctionFailed++;
            skippedDetails.push({ id: leadId, business: lead.businessName || '?', reason: 'startDripCampaign returned null' });
            console.log(`🚀 Failed to start drip for ${leadId}: startDripCampaign returned null`);
          }
        } catch (error: any) {
          skipReasons.startFunctionFailed++;
          skippedDetails.push({ id: leadId, business: '?', reason: error.message || 'Unknown error' });
          console.error(`🚀 Error starting drip for ${leadId}:`, error);
        }
      }

      // Log progress
      console.log(`🚀 Drip progress: ${i + batch.length}/${leadIds.length} processed, ${started} started`);

      // Small delay between batches
      if (i + BATCH_SIZE < leadIds.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    const totalSkipped = Object.values(skipReasons).reduce((a, b) => a + b, 0);
    console.log(`🚀 Drip complete: ${started} started, ${totalSkipped} skipped`, skipReasons);

    // VERIFY: Get actual count of leads in drip now
    const allLeads = await getAllLeads();
    const actualInDrip = allLeads.filter(l => l.dripCampaign).length;
    const actualWithEmail = allLeads.filter(l => l.email && l.email.trim()).length;

    console.log(`🚀 Verification: ${actualInDrip} leads now in drip, ${actualWithEmail} have email`);

    return NextResponse.json({
      success: true,
      started,
      skipped: totalSkipped,
      total: leadIds.length,
      startedAtStep: validStartStep,
      // Detailed breakdown
      skipBreakdown: skipReasons,
      // First 20 skip details
      skipDetails: skippedDetails.slice(0, 20),
      // Verification stats
      verification: {
        totalLeadsInDB: allLeads.length,
        totalWithEmail: actualWithEmail,
        totalInDripNow: actualInDrip,
        startedThisRequest: started,
        startedIds: startedIds.slice(0, 10), // First 10 started IDs for verification
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
