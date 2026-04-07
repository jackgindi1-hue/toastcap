import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Server-side Supabase client with service role key (full access)
// Returns a dummy client during build if env vars are not set
let _supabase: SupabaseClient | null = null;

export const supabase = (() => {
  if (_supabase) return _supabase;

  if (!supabaseUrl || !supabaseServiceKey) {
    // Return a mock client during build time
    console.warn('⚠️ Supabase env vars not set - using mock client');
    return {
      from: () => ({
        select: () => ({ data: [], error: null, single: () => ({ data: null, error: null }) }),
        insert: () => ({ data: null, error: null, select: () => ({ single: () => ({ data: null, error: null }) }) }),
        update: () => ({ data: null, error: null, eq: () => ({ select: () => ({ single: () => ({ data: null, error: null }) }) }) }),
        delete: () => ({ data: null, error: null, eq: () => ({ data: null, error: null }) }),
        eq: () => ({ data: [], error: null, single: () => ({ data: null, error: null }) }),
        order: () => ({ data: [], error: null }),
        limit: () => ({ data: [], error: null }),
      }),
      storage: {
        from: () => ({
          upload: async () => ({ data: null, error: null }),
          getPublicUrl: () => ({ data: { publicUrl: '' } }),
        }),
      },
    } as unknown as SupabaseClient;
  }

  _supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return _supabase;
})();

// Types for the leads table
export interface LeadRow {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  phone_verified: boolean;
  business_name: string;
  business_type: string | null;
  monthly_revenue: string | null;
  funding_amount: string | null;
  num_locations: string | null;
  stage: string;
  status: string;
  tags: string[];
  created_at: string;
  updated_at: string;
  quote_submitted_at: string | null;
  application_submitted_at: string | null;
  dlvc_submitted_at: string | null;
  documents: Record<string, boolean> | null;
  documents_complete: boolean;
  ready_for_review: boolean;
  drip_campaign: string | null;
  drip_step: number | null;
  drip_total_steps: number | null;
  next_drip_at: string | null;
  drip_paused: boolean;
  drip_completed_at: string | null;
  email_bounced: boolean;
  last_drip_sent_at: string | null;
  jotform_submission_id: string | null;
}

// SQL to create the leads table
export const CREATE_LEADS_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS leads (
  id TEXT PRIMARY KEY,
  first_name TEXT NOT NULL DEFAULT '',
  last_name TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  phone TEXT NOT NULL DEFAULT '',
  phone_verified BOOLEAN DEFAULT FALSE,
  business_name TEXT NOT NULL DEFAULT '',
  business_type TEXT,
  monthly_revenue TEXT,
  funding_amount TEXT,
  num_locations TEXT,
  stage TEXT NOT NULL DEFAULT 'quote',
  status TEXT NOT NULL DEFAULT 'new',
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  quote_submitted_at TIMESTAMPTZ,
  application_submitted_at TIMESTAMPTZ,
  dlvc_submitted_at TIMESTAMPTZ,
  documents JSONB,
  documents_complete BOOLEAN DEFAULT FALSE,
  ready_for_review BOOLEAN DEFAULT FALSE,
  drip_campaign TEXT,
  drip_step INTEGER,
  drip_total_steps INTEGER,
  next_drip_at TIMESTAMPTZ,
  drip_paused BOOLEAN DEFAULT FALSE,
  drip_completed_at TIMESTAMPTZ,
  email_bounced BOOLEAN DEFAULT FALSE,
  last_drip_sent_at TIMESTAMPTZ,
  jotform_submission_id TEXT
);

CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_phone ON leads(phone);
CREATE INDEX IF NOT EXISTS idx_leads_stage ON leads(stage);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
`;
