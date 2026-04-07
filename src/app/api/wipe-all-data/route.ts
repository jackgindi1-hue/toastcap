import { NextRequest, NextResponse } from 'next/server';
import { deleteAllLeads } from '@/lib/leads-db';
import { getStore } from '@netlify/blobs';
import { requireAuth } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Helper to get blob stores
function getBlobStore(name: string) {
  if (process.env.NETLIFY) {
    return getStore(name);
  }
  const siteID = process.env.NETLIFY_SITE_ID || process.env.SITE_ID || '';
  const token = process.env.NETLIFY_ACCESS_TOKEN || '';
  if (siteID && token) {
    return getStore({ name, siteID, token });
  }
  return getStore(name);
}

// Wipe all blobs in a store
async function wipeStore(name: string): Promise<{ deleted: number; errors: string[] }> {
  const store = getBlobStore(name);
  let deleted = 0;
  const errors: string[] = [];

  try {
    // List all blobs in the store
    const { blobs } = await store.list();

    console.log(`📦 Store "${name}": Found ${blobs.length} blobs to delete`);

    // Delete each blob
    for (const blob of blobs) {
      try {
        await store.delete(blob.key);
        deleted++;
      } catch (err: any) {
        errors.push(`${name}/${blob.key}: ${err.message}`);
      }
    }
  } catch (err: any) {
    errors.push(`${name}: Failed to list blobs - ${err.message}`);
  }

  return { deleted, errors };
}

// DELETE /api/wipe-all-data - Wipe ALL data from ALL stores (PROTECTED)
export async function DELETE(request: NextRequest) {
  // Require authentication
  const authError = await requireAuth(request);
  if (authError) return authError;

  try {
    // Require confirmation header
    const confirmHeader = request.headers.get('x-confirm-wipe');
    if (confirmHeader !== 'WIPE_ALL_DATA_CONFIRMED') {
      return NextResponse.json(
        { error: 'Missing or invalid confirmation header. Set x-confirm-wipe: WIPE_ALL_DATA_CONFIRMED' },
        { status: 400 }
      );
    }

    const results: Record<string, { deleted: number; errors: string[] }> = {};

    console.log('🗑️ WIPE ALL DATA - Starting...');

    // 1. Delete all leads from Supabase
    try {
      const leadsDeleted = await deleteAllLeads();
      results['supabase_leads'] = { deleted: leadsDeleted, errors: [] };
      console.log(`✅ Supabase leads: ${leadsDeleted} deleted`);
    } catch (err: any) {
      results['supabase_leads'] = { deleted: 0, errors: [err.message] };
      console.error('❌ Supabase leads error:', err);
    }

    // 2. Wipe Netlify Blobs stores
    const blobStores = ['messages', 'documents', 'notes', 'analytics'];

    for (const storeName of blobStores) {
      const result = await wipeStore(storeName);
      results[`blobs_${storeName}`] = result;
      console.log(`✅ Blobs "${storeName}": ${result.deleted} deleted, ${result.errors.length} errors`);
    }

    // Calculate totals
    const totalDeleted = Object.values(results).reduce((sum, r) => sum + r.deleted, 0);
    const totalErrors = Object.values(results).reduce((sum, r) => sum + r.errors.length, 0);

    console.log(`🗑️ WIPE ALL DATA - Complete! ${totalDeleted} items deleted, ${totalErrors} errors`);

    return NextResponse.json({
      success: true,
      message: 'All data wiped successfully',
      summary: {
        totalDeleted,
        totalErrors,
      },
      details: results,
    });
  } catch (error: any) {
    console.error('Wipe all data error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to wipe all data' },
      { status: 500 }
    );
  }
}

// GET /api/wipe-all-data - Get counts of data in each store (PROTECTED)
export async function GET(request: NextRequest) {
  // Require authentication
  const authError = await requireAuth(request);
  if (authError) return authError;

  try {
    const counts: Record<string, number> = {};

    // Count blobs in each store
    const blobStores = ['messages', 'documents', 'notes', 'analytics'];

    for (const storeName of blobStores) {
      try {
        const store = getBlobStore(storeName);
        const { blobs } = await store.list();
        counts[storeName] = blobs.length;
      } catch {
        counts[storeName] = -1; // Error indicator
      }
    }

    return NextResponse.json({
      success: true,
      counts,
      message: 'Use DELETE with header x-confirm-wipe: WIPE_ALL_DATA_CONFIRMED to wipe all data',
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to get counts' },
      { status: 500 }
    );
  }
}
