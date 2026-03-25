import { NextRequest, NextResponse } from 'next/server';
import { getAllLeads } from '@/lib/leads-db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET /api/debug/search?q=verde - Search leads for debugging
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q')?.toLowerCase() || '';

    if (!query) {
      return NextResponse.json({
        error: 'Missing search query. Use ?q=searchterm',
        example: '/api/debug/search?q=verde',
      }, { status: 400 });
    }

    console.log(`🔍 DEBUG SEARCH: Searching for "${query}"`);

    const allLeads = await getAllLeads();

    console.log(`🔍 DEBUG SEARCH: Total leads: ${allLeads.length}`);

    // Search in email, businessName, firstName, lastName
    const matches = allLeads.filter(lead =>
      lead.email?.toLowerCase().includes(query) ||
      lead.businessName?.toLowerCase().includes(query) ||
      lead.firstName?.toLowerCase().includes(query) ||
      lead.lastName?.toLowerCase().includes(query) ||
      lead.phone?.includes(query)
    );

    console.log(`🔍 DEBUG SEARCH: Found ${matches.length} matches for "${query}"`);

    return NextResponse.json({
      query,
      totalLeads: allLeads.length,
      matchCount: matches.length,
      matches: matches.map(lead => ({
        id: lead.id,
        firstName: lead.firstName,
        lastName: lead.lastName,
        email: lead.email,
        phone: lead.phone,
        businessName: lead.businessName,
        stage: lead.stage,
        status: lead.status,
        documents: lead.documents,
        documentsComplete: lead.documentsComplete,
        createdAt: lead.createdAt,
      })),
    });
  } catch (error: any) {
    console.error('🔍 DEBUG SEARCH ERROR:', error);
    return NextResponse.json({
      error: error.message || 'Search failed',
    }, { status: 500 });
  }
}
