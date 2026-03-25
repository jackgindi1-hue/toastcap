import { NextRequest, NextResponse } from 'next/server';
import { getAllLeads, createLead, findLeadByEmail, findLeadByPhone, updateLead } from '@/lib/leads-db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET /api/leads - Get all leads with optional filters
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const stage = searchParams.get('stage');
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const tag = searchParams.get('tag');

    let leads = await getAllLeads();

    // Apply filters
    if (stage && stage !== 'all') {
      leads = leads.filter(l => l.stage === stage);
    }

    if (status && status !== 'all') {
      leads = leads.filter(l => l.status === status);
    }

    if (tag) {
      leads = leads.filter(l => l.tags.includes(tag as any));
    }

    if (search) {
      const searchLower = search.toLowerCase();
      leads = leads.filter(l =>
        l.firstName.toLowerCase().includes(searchLower) ||
        l.lastName.toLowerCase().includes(searchLower) ||
        l.email.toLowerCase().includes(searchLower) ||
        l.phone.includes(search) ||
        l.businessName.toLowerCase().includes(searchLower)
      );
    }

    return NextResponse.json({ leads, total: leads.length });
  } catch (error: any) {
    console.error('Error fetching leads:', error);
    return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
  }
}

// POST /api/leads - Create or update a lead
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Check if lead already exists by email or phone
    let existingLead = null;

    if (data.email) {
      existingLead = await findLeadByEmail(data.email);
    }

    if (!existingLead && data.phone) {
      existingLead = await findLeadByPhone(data.phone);
    }

    if (existingLead) {
      // Update existing lead with new data
      const updated = await updateLead(existingLead.id, {
        ...data,
        // Update stage if progressing forward
        stage: getHigherStage(existingLead.stage, data.stage),
        // Update timestamps based on stage
        ...(data.stage === 'application' && !existingLead.applicationSubmittedAt
          ? { applicationSubmittedAt: new Date().toISOString() }
          : {}),
        ...(data.stage === 'dlvc' && !existingLead.dlvcSubmittedAt
          ? { dlvcSubmittedAt: new Date().toISOString() }
          : {}),
      });

      return NextResponse.json({ lead: updated, updated: true });
    }

    // Create new lead
    const lead = await createLead(data);
    return NextResponse.json({ lead, created: true });
  } catch (error: any) {
    console.error('Error creating lead:', error);
    return NextResponse.json({ error: 'Failed to create lead' }, { status: 500 });
  }
}

// Helper to determine which stage is higher in the funnel
function getHigherStage(current: string, incoming: string): string {
  const stageOrder = ['quote', 'application', 'dlvc', 'funded'];
  const currentIndex = stageOrder.indexOf(current);
  const incomingIndex = stageOrder.indexOf(incoming);

  return incomingIndex > currentIndex ? incoming : current;
}
