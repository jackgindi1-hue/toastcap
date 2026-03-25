import { NextRequest, NextResponse } from 'next/server';
import {
  pauseDripCampaign,
  resumeDripCampaign,
  stopDripCampaign,
  getLeadsInDripCampaign,
} from '@/lib/leads-db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET /api/drip/manage - Get all leads in drip campaigns
export async function GET() {
  try {
    const leads = await getLeadsInDripCampaign();

    return NextResponse.json({
      success: true,
      leads: leads.map(l => ({
        id: l.id,
        firstName: l.firstName,
        lastName: l.lastName,
        email: l.email,
        businessName: l.businessName,
        dripCampaign: l.dripCampaign,
        dripStep: l.dripStep,
        dripTotalSteps: l.dripTotalSteps,
        nextDripAt: l.nextDripAt,
        dripPaused: l.dripPaused,
        emailBounced: l.emailBounced,
        lastDripSentAt: l.lastDripSentAt,
      })),
      total: leads.length,
    });
  } catch (error: any) {
    console.error('Get drip leads error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to get drip leads' },
      { status: 500 }
    );
  }
}

// POST /api/drip/manage - Pause/Resume/Stop drip for a lead
export async function POST(request: NextRequest) {
  try {
    const { leadId, action } = await request.json();

    if (!leadId) {
      return NextResponse.json({ error: 'Lead ID required' }, { status: 400 });
    }

    if (!['pause', 'resume', 'stop'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action. Use: pause, resume, or stop' }, { status: 400 });
    }

    let result;
    switch (action) {
      case 'pause':
        result = await pauseDripCampaign(leadId);
        break;
      case 'resume':
        result = await resumeDripCampaign(leadId);
        break;
      case 'stop':
        result = await stopDripCampaign(leadId);
        break;
    }

    if (!result) {
      return NextResponse.json({ error: 'Lead not found or no active drip' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      action,
      lead: {
        id: result.id,
        dripCampaign: result.dripCampaign,
        dripStep: result.dripStep,
        dripPaused: result.dripPaused,
        nextDripAt: result.nextDripAt,
      },
    });
  } catch (error: any) {
    console.error('Manage drip error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to manage drip' },
      { status: 500 }
    );
  }
}
