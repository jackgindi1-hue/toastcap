import { NextRequest, NextResponse } from 'next/server';
import { getLead, getLeadDocuments, getLeadMessages, getLeadNotes } from '@/lib/leads-db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET /api/debug/lead/[id] - Get detailed lead info for debugging
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    console.log(`🔍 DEBUG: Fetching lead ${id}`);

    const lead = await getLead(id);

    if (!lead) {
      return NextResponse.json({
        error: 'Lead not found',
        searchedId: id,
      }, { status: 404 });
    }

    console.log(`🔍 DEBUG: Lead found:`, {
      id: lead.id,
      email: lead.email,
      phone: lead.phone,
      businessName: lead.businessName,
      stage: lead.stage,
      documents: lead.documents,
      documentsComplete: lead.documentsComplete,
    });

    // Fetch related data
    const [documents, messages, notes] = await Promise.all([
      getLeadDocuments(id),
      getLeadMessages(id),
      getLeadNotes(id),
    ]);

    console.log(`🔍 DEBUG: Related data:`, {
      documentsCount: documents.length,
      messagesCount: messages.length,
      notesCount: notes.length,
    });

    return NextResponse.json({
      lead,
      documentFlags: lead.documents || {},
      documentsComplete: lead.documentsComplete || false,
      readyForReview: lead.readyForReview || false,
      actualDocuments: documents,
      actualDocumentsCount: documents.length,
      messages,
      messagesCount: messages.length,
      notes,
      notesCount: notes.length,
      _debug: {
        hasDocumentFlags: !!lead.documents,
        flagsVsActual: {
          flagsSet: Object.values(lead.documents || {}).filter(Boolean).length,
          actualDocs: documents.length,
        },
      },
    });
  } catch (error: any) {
    console.error('🔍 DEBUG ERROR:', error);
    return NextResponse.json({
      error: error.message || 'Failed to fetch lead',
      stack: error.stack,
    }, { status: 500 });
  }
}
