import { NextRequest, NextResponse } from 'next/server';
import { getDocument } from '@/lib/leads-db';
import { requireAuth } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET /api/leads/[id]/documents/[docId] - Download a document (PROTECTED)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; docId: string }> }
) {
  // Require authentication
  const authError = await requireAuth(request);
  if (authError) return authError;

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

// DELETE /api/leads/[id]/documents/[docId] - Delete document (PROTECTED)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; docId: string }> }
) {
  // Require authentication
  const authError = await requireAuth(request);
  if (authError) return authError;

  // You would implement the actual delete logic here, for example:
  // const { docId } = await params;
  // const deleted = await deleteDocument(docId);
  // if (!deleted) {
  //   return NextResponse.json({ error: 'Document not found or could not be deleted' }, { status: 404 });
  // }
  // return NextResponse.json({ success: true });

  return NextResponse.json({ error: 'Not implemented' }, { status: 501 });
}
