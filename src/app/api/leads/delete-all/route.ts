import { NextRequest, NextResponse } from 'next/server';
import { deleteAllLeads } from '@/lib/leads-db';
import { requireAuth } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// DELETE /api/leads/delete-all - Delete all leads (PROTECTED)
export async function DELETE(request: NextRequest) {
  // Require authentication
  const authError = await requireAuth(request);
  if (authError) return authError;

  try {
    // Require confirmation header
    const confirmHeader = request.headers.get('x-confirm-delete');
    if (confirmHeader !== 'DELETE_ALL_LEADS') {
      return NextResponse.json(
        { error: 'Missing confirmation header' },
        { status: 400 }
      );
    }

    const deleted = await deleteAllLeads();

    console.log(`🗑️ Deleted ${deleted} leads`);

    return NextResponse.json({
      success: true,
      deleted,
    });
  } catch (error: any) {
    console.error('Delete all error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete leads' },
      { status: 500 }
    );
  }
}
