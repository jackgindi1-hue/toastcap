import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabase } from '@/lib/supabase';

// Verify admin authentication
async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('admin_session');
  return !!sessionCookie?.value;
}

// POST - Create the required tables (one-time setup)
export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized - login to /crm first' }, { status: 401 });
  }

  const results: { table: string; status: string; error?: string }[] = [];

  // Create tokens table
  try {
    const { error: tokensError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS tokens (
          id TEXT PRIMARY KEY,
          token TEXT UNIQUE NOT NULL,
          lead_id TEXT NOT NULL,
          clicks_used INTEGER DEFAULT 0,
          max_clicks INTEGER DEFAULT 3,
          status TEXT DEFAULT 'active',
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
        CREATE INDEX IF NOT EXISTS idx_tokens_token ON tokens(token);
        CREATE INDEX IF NOT EXISTS idx_tokens_lead_id ON tokens(lead_id);
      `
    });

    if (tokensError) {
      // Try direct insert approach if RPC doesn't exist
      // First check if table exists
      const { error: checkError } = await supabase.from('tokens').select('id').limit(1);

      if (checkError && checkError.code === '42P01') {
        // Table doesn't exist - we can't create it without exec_sql
        results.push({
          table: 'tokens',
          status: 'error',
          error: 'Table does not exist. Please run SQL manually in Supabase dashboard.'
        });
      } else if (!checkError) {
        results.push({ table: 'tokens', status: 'exists' });
      } else {
        results.push({ table: 'tokens', status: 'error', error: checkError.message });
      }
    } else {
      results.push({ table: 'tokens', status: 'created' });
    }
  } catch (e: any) {
    results.push({ table: 'tokens', status: 'error', error: e.message });
  }

  // Create settings table
  try {
    const { error: settingsError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS settings (
          id TEXT PRIMARY KEY DEFAULT 'global',
          active_send_from_domain TEXT DEFAULT 'toastcap.com',
          send_from_domains TEXT[] DEFAULT ARRAY['toastcap.com'],
          active_landing_domain TEXT DEFAULT 'toastcap.com',
          landing_domains TEXT[] DEFAULT ARRAY['toastcap.com'],
          tracking_domain TEXT DEFAULT 'toastcap-crm.netlify.app',
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
        INSERT INTO settings (id) VALUES ('global') ON CONFLICT (id) DO NOTHING;
      `
    });

    if (settingsError) {
      // Try to check if table exists
      const { error: checkError } = await supabase.from('settings').select('id').limit(1);

      if (checkError && checkError.code === '42P01') {
        results.push({
          table: 'settings',
          status: 'error',
          error: 'Table does not exist. Please run SQL manually in Supabase dashboard.'
        });
      } else if (!checkError) {
        results.push({ table: 'settings', status: 'exists' });
      } else {
        results.push({ table: 'settings', status: 'error', error: checkError.message });
      }
    } else {
      results.push({ table: 'settings', status: 'created' });
    }
  } catch (e: any) {
    results.push({ table: 'settings', status: 'error', error: e.message });
  }

  const allSuccess = results.every(r => r.status === 'created' || r.status === 'exists');

  return NextResponse.json({
    success: allSuccess,
    results,
    message: allSuccess
      ? 'All tables ready!'
      : 'Some tables need manual setup. Copy the SQL from the error messages and run in Supabase dashboard.',
    sql: `
-- Run this SQL in Supabase Dashboard → SQL Editor:

-- TOKENS TABLE
CREATE TABLE IF NOT EXISTS tokens (
  id TEXT PRIMARY KEY,
  token TEXT UNIQUE NOT NULL,
  lead_id TEXT NOT NULL,
  clicks_used INTEGER DEFAULT 0,
  max_clicks INTEGER DEFAULT 3,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_tokens_token ON tokens(token);
CREATE INDEX IF NOT EXISTS idx_tokens_lead_id ON tokens(lead_id);

-- SETTINGS TABLE
CREATE TABLE IF NOT EXISTS settings (
  id TEXT PRIMARY KEY DEFAULT 'global',
  active_send_from_domain TEXT DEFAULT 'toastcap.com',
  send_from_domains TEXT[] DEFAULT ARRAY['toastcap.com'],
  active_landing_domain TEXT DEFAULT 'toastcap.com',
  landing_domains TEXT[] DEFAULT ARRAY['toastcap.com'],
  tracking_domain TEXT DEFAULT 'toastcap-crm.netlify.app',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
INSERT INTO settings (id) VALUES ('global') ON CONFLICT (id) DO NOTHING;
    `
  });
}

// GET - Check table status
export async function GET() {
  const results: { table: string; exists: boolean }[] = [];

  // Check tokens table
  const { error: tokensError } = await supabase.from('tokens').select('id').limit(1);
  results.push({ table: 'tokens', exists: !tokensError || tokensError.code !== '42P01' });

  // Check settings table
  const { error: settingsError } = await supabase.from('settings').select('id').limit(1);
  results.push({ table: 'settings', exists: !settingsError || settingsError.code !== '42P01' });

  return NextResponse.json({
    ready: results.every(r => r.exists),
    tables: results
  });
}
