import { NextRequest, NextResponse } from 'next/server';
import { getDocument } from '@/lib/leads-db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET /api/leads/[id]/documents/[docId] - Download a document
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; docId: string }> }
) {
  try {
    const { docId } = await params;

    const doc = await getDocument(docId);

    if (!doc) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    // Return the file with appropriate headers
    const headers = new Headers();
    headers.set('Content-Type', doc.metadata.fileType);
    headers.set('Content-Disposition', `inline; filename="${doc.metadata.fileName}"`);
    headers.set('Content-Length', doc.metadata.fileSize.toString());

    return new NextResponse(doc.file, { headers });
  } catch (error: any) {
    console.error('Error fetching document:', error);
    return NextResponse.json({ error: 'Failed to fetch document' }, { status: 500 });
  }
}
