import { NextResponse } from 'next/server';
import { getAllLeads } from '@/lib/leads-db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET /api/debug-leads - Debug endpoint to check lead states
export async function GET() {
  try {
    const allLeads = await getAllLeads();

    // Categorize leads
    const withEmail = allLeads.filter(l => l.email && l.email.trim());
    const withoutEmail = allLeads.filter(l => !l.email || !l.email.trim());
    const inDrip = allLeads.filter(l => l.dripCampaign);
    const notInDrip = allLeads.filter(l => !l.dripCampaign);
    const emailBounced = allLeads.filter(l => l.emailBounced);
    const dripPaused = allLeads.filter(l => l.dripPaused);

    // Leads that could be added to drip (have email, not bounced, not already in drip)
    const eligibleForDrip = allLeads.filter(l =>
      l.email &&
      l.email.trim() &&
      !l.emailBounced &&
      !l.dripCampaign
    );

    // Leads with email but NOT in drip
    const withEmailNotInDrip = allLeads.filter(l =>
      l.email &&
      l.email.trim() &&
      !l.dripCampaign
    );

    // Sample of leads not in drip with email (to see why)
    const sampleNotInDrip = withEmailNotInDrip.slice(0, 10).map(l => ({
      id: l.id,
      businessName: l.businessName,
      email: l.email,
      dripCampaign: l.dripCampaign,
      dripStep: l.dripStep,
      dripPaused: l.dripPaused,
      emailBounced: l.emailBounced,
    }));

    // Sample of leads IN drip
    const sampleInDrip = inDrip.slice(0, 10).map(l => ({
      id: l.id,
      businessName: l.businessName,
      email: l.email,
      dripCampaign: l.dripCampaign,
      dripStep: l.dripStep,
      dripTotalSteps: l.dripTotalSteps,
      nextDripAt: l.nextDripAt,
      dripPaused: l.dripPaused,
    }));

    // Drip status breakdown
    const dripSteps: Record<string, number> = {};
    for (const lead of inDrip) {
      const step = lead.dripStep || 0;
      dripSteps[`step_${step}`] = (dripSteps[`step_${step}`] || 0) + 1;
    }

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      summary: {
        totalLeads: allLeads.length,
        withEmail: withEmail.length,
        withoutEmail: withoutEmail.length,
        inDripCampaign: inDrip.length,
        notInDripCampaign: notInDrip.length,
        emailBounced: emailBounced.length,
        dripPaused: dripPaused.length,
        eligibleForDrip: eligibleForDrip.length,
        withEmailNotInDrip: withEmailNotInDrip.length,
      },
      dripStepsBreakdown: dripSteps,
      samples: {
        leadsNotInDripWithEmail: sampleNotInDrip,
        leadsInDrip: sampleInDrip,
      },
      // Check for issues
      issues: {
        leadsWithoutEmail: withoutEmail.length > 0 ? `${withoutEmail.length} leads have no email` : null,
        leadsWithEmailNotInDrip: withEmailNotInDrip.length > 0 ? `${withEmailNotInDrip.length} leads have email but are not in drip` : null,
      },
    });
  } catch (error: any) {
    console.error('Debug leads error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
