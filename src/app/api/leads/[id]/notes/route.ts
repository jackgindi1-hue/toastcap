import { NextRequest, NextResponse } from 'next/server';
import { createNote, getLeadNotes, deleteNote } from '@/lib/leads-db';
import { requireAuth } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET /api/leads/[id]/notes - Get all notes for a lead (PROTECTED)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Require authentication
  const authError = await requireAuth(request);
  if (authError) return authError;

  try {
    const { id } = await params;
    const notes = await getLeadNotes(id);
    return NextResponse.json({ notes });
  } catch (error: any) {
    console.error('Error fetching notes:', error);
    return NextResponse.json({ error: 'Failed to fetch notes' }, { status: 500 });
  }
}

// POST /api/leads/[id]/notes - Create a new note (PROTECTED)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Require authentication
  const authError = await requireAuth(request);
  if (authError) return authError;

  try {
    const { id } = await params;
    const { content } = await request.json();

    if (!content || !content.trim()) {
      return NextResponse.json({ error: 'Note content is required' }, { status: 400 });
    }

    const note = await createNote(id, content.trim());
    return NextResponse.json({ note });
  } catch (error: any) {
    console.error('Error creating note:', error);
    return NextResponse.json({ error: 'Failed to create note' }, { status: 500 });
  }
}

// DELETE /api/leads/[id]/notes - Delete a note
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { noteId } = await request.json();

    const deleted = await deleteNote(noteId, id);

    if (!deleted) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting note:', error);
    return NextResponse.json({ error: 'Failed to delete note' }, { status: 500 });
  }
}
