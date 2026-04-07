import { supabase } from './supabase';

// Token statuses - represents the linear flow
export type TokenStatus = 'active' | 'quote_completed' | 'upload_completed' | 'dlvc_completed' | 'completed';

export interface Token {
  id: string;
  token: string;
  leadId: string;
  clicksUsed: number;
  maxClicks: number;
  status: TokenStatus;
  createdAt: string;
  updatedAt: string;
}

// SQL to create the tokens table (run in Supabase dashboard)
export const CREATE_TOKENS_TABLE_SQL = `
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
CREATE INDEX IF NOT EXISTS idx_tokens_status ON tokens(status);
`;

// Generate a secure random token
function generateTokenString(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 24; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

// Create a new token for a lead
export async function createToken(leadId: string, maxClicks: number = 3): Promise<Token | null> {
  const id = generateId();
  const token = generateTokenString();

  const { data, error } = await supabase
    .from('tokens')
    .insert({
      id,
      token,
      lead_id: leadId,
      clicks_used: 0,
      max_clicks: maxClicks,
      status: 'active',
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating token:', error);
    return null;
  }

  return rowToToken(data);
}

// Get token by token string
export async function getToken(tokenString: string): Promise<Token | null> {
  const { data, error } = await supabase
    .from('tokens')
    .select('*')
    .eq('token', tokenString)
    .single();

  if (error || !data) {
    return null;
  }

  return rowToToken(data);
}

// Get token for a lead
export async function getTokenForLead(leadId: string): Promise<Token | null> {
  const { data, error } = await supabase
    .from('tokens')
    .select('*')
    .eq('lead_id', leadId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error || !data) {
    return null;
  }

  return rowToToken(data);
}

// Get or create token for a lead (AUTO-GENERATE)
// This is the main function to use - it ensures every lead has a token
export async function getOrCreateTokenForLead(leadId: string, maxClicks: number = 3): Promise<Token | null> {
  // First try to get existing active token
  const { data, error } = await supabase
    .from('tokens')
    .select('*')
    .eq('lead_id', leadId)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (!error && data) {
    // Return existing active token
    return rowToToken(data);
  }

  // No active token found, create a new one
  return createToken(leadId, maxClicks);
}

// Generate tokens for multiple leads at once (for bulk imports/drips)
export async function createTokensBulk(leadIds: string[], maxClicks: number = 3): Promise<Map<string, string>> {
  const tokenMap = new Map<string, string>();
  const tokensToInsert: any[] = [];

  for (const leadId of leadIds) {
    const id = generateId();
    const token = generateTokenString();

    tokensToInsert.push({
      id,
      token,
      lead_id: leadId,
      clicks_used: 0,
      max_clicks: maxClicks,
      status: 'active',
    });

    tokenMap.set(leadId, token);
  }

  if (tokensToInsert.length > 0) {
    const { error } = await supabase
      .from('tokens')
      .insert(tokensToInsert);

    if (error) {
      console.error('Error creating bulk tokens:', error);
      // Return empty map on error
      return new Map();
    }
  }

  return tokenMap;
}

// Get tokens for multiple leads (for email sending)
export async function getTokensForLeads(leadIds: string[]): Promise<Map<string, string>> {
  const tokenMap = new Map<string, string>();

  if (leadIds.length === 0) return tokenMap;

  const { data, error } = await supabase
    .from('tokens')
    .select('lead_id, token')
    .in('lead_id', leadIds)
    .eq('status', 'active');

  if (error) {
    console.error('Error fetching tokens for leads:', error);
    return tokenMap;
  }

  for (const row of data || []) {
    tokenMap.set(row.lead_id, row.token);
  }

  // For any leads without tokens, create them
  const leadsWithoutTokens = leadIds.filter(id => !tokenMap.has(id));
  if (leadsWithoutTokens.length > 0) {
    const newTokens = await createTokensBulk(leadsWithoutTokens);
    for (const [leadId, token] of newTokens) {
      tokenMap.set(leadId, token);
    }
  }

  return tokenMap;
}

// Validate and consume a click on the token (for /quote only)
export async function validateAndConsumeClick(tokenString: string): Promise<{ valid: boolean; token?: Token; error?: string }> {
  const token = await getToken(tokenString);

  if (!token) {
    return { valid: false, error: 'Token not found' };
  }

  // Check if token is still active (for /quote)
  if (token.status !== 'active') {
    return { valid: false, error: 'Token already used', token };
  }

  // Check click limit
  if (token.clicksUsed >= token.maxClicks) {
    return { valid: false, error: 'Click limit exceeded', token };
  }

  // Increment click count
  const { data, error } = await supabase
    .from('tokens')
    .update({
      clicks_used: token.clicksUsed + 1,
      updated_at: new Date().toISOString(),
    })
    .eq('id', token.id)
    .select()
    .single();

  if (error) {
    console.error('Error updating token clicks:', error);
    return { valid: false, error: 'Failed to update token' };
  }

  return { valid: true, token: rowToToken(data) };
}

// Validate token for a specific page in the flow
export async function validateTokenForPage(
  tokenString: string,
  page: 'quote' | 'upload' | 'dlvc' | 'thank-you'
): Promise<{ valid: boolean; token?: Token; error?: string }> {
  const token = await getToken(tokenString);

  if (!token) {
    return { valid: false, error: 'Token not found' };
  }

  // Define required status for each page
  const requiredStatus: Record<string, TokenStatus[]> = {
    'quote': ['active'],
    'upload': ['quote_completed'],
    'dlvc': ['upload_completed'],
    'thank-you': ['dlvc_completed', 'completed'],
  };

  const allowedStatuses = requiredStatus[page];

  if (!allowedStatuses.includes(token.status)) {
    return { valid: false, error: `Invalid token status for ${page}`, token };
  }

  // For /quote, also check click limit
  if (page === 'quote' && token.clicksUsed >= token.maxClicks) {
    return { valid: false, error: 'Click limit exceeded', token };
  }

  return { valid: true, token };
}

// Progress token to next status after form submission
export async function progressTokenStatus(
  tokenString: string,
  currentPage: 'quote' | 'upload' | 'dlvc'
): Promise<Token | null> {
  const token = await getToken(tokenString);

  if (!token) {
    return null;
  }

  // Define next status for each page
  const nextStatus: Record<string, TokenStatus> = {
    'quote': 'quote_completed',
    'upload': 'upload_completed',
    'dlvc': 'completed',
  };

  const newStatus = nextStatus[currentPage];

  const { data, error } = await supabase
    .from('tokens')
    .update({
      status: newStatus,
      updated_at: new Date().toISOString(),
    })
    .eq('id', token.id)
    .select()
    .single();

  if (error) {
    console.error('Error progressing token status:', error);
    return null;
  }

  return rowToToken(data);
}

// Convert database row to Token object
function rowToToken(row: any): Token {
  return {
    id: row.id,
    token: row.token,
    leadId: row.lead_id,
    clicksUsed: row.clicks_used || 0,
    maxClicks: row.max_clicks || 3,
    status: row.status || 'active',
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
