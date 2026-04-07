import { NextRequest, NextResponse } from 'next/server';
import { getLeadDocuments, saveDocument, type DocType } from '@/lib/leads-db';
import { requireAuth } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET /api/leads/[id]/documents - Get all documents for a lead (PROTECTED)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Require authentication
  const authError = await requireAuth(request);
  if (authError) return authError;

  try {
    const { id } = await params;
    const documents = await getLeadDocuments(id);
    return NextResponse.json({ documents });
  } catch (error: any) {
    console.error('Error fetching documents:', error);
    return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 });
  }
}

// POST /api/leads/[id]/documents - Upload a document (PROTECTED)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Require authentication
  const authError = await requireAuth(request);
  if (authError) return authError;

  try {
    const { id } = await params;
    const formData = await request.formData();

    const file = formData.get('file') as File | null;
    const docType = formData.get('docType') as DocType | null;

    if (!file) {
      return NextResponse.json({ error: 'File is required' }, { status: 400 });
    }

    if (!docType) {
      return NextResponse.json({ error: 'Document type is required' }, { status: 400 });
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Save document
    const document = await saveDocument(id, buffer, {
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      docType,
    });

    return NextResponse.json({ document });
  } catch (error: any) {
    console.error('Error uploading document:', error);
    return NextResponse.json({ error: 'Failed to upload document' }, { status: 500 });
  }
}
