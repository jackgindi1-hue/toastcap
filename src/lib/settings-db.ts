import { supabase } from './supabase';

export interface Settings {
  id: string;
  // Email settings
  activeSendFromDomain: string;
  sendFromDomains: string[];
  // Landing page settings
  activeLandingDomain: string;
  landingDomains: string[];
  // Tracking domain (CRM domain - bulletproof)
  trackingDomain: string;
  updatedAt: string;
}

// SQL to create the settings table (run in Supabase dashboard)
export const CREATE_SETTINGS_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS settings (
  id TEXT PRIMARY KEY DEFAULT 'global',
  active_send_from_domain TEXT DEFAULT 'toastcap.com',
  send_from_domains TEXT[] DEFAULT ARRAY['toastcap.com'],
  active_landing_domain TEXT DEFAULT 'toastcap.com',
  landing_domains TEXT[] DEFAULT ARRAY['toastcap.com'],
  tracking_domain TEXT DEFAULT 'toastcap-crm.netlify.app',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Insert default settings row
INSERT INTO settings (id) VALUES ('global') ON CONFLICT (id) DO NOTHING;
`;

// Get current settings (always returns settings, creates default if not exists)
export async function getSettings(): Promise<Settings> {
  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .eq('id', 'global')
    .single();

  if (error || !data) {
    // Return default settings if not found
    return {
      id: 'global',
      activeSendFromDomain: 'toastcap.com',
      sendFromDomains: ['toastcap.com'],
      activeLandingDomain: 'toastcap.com',
      landingDomains: ['toastcap.com'],
      trackingDomain: 'toastcap-crm.netlify.app',
      updatedAt: new Date().toISOString(),
    };
  }

  return rowToSettings(data);
}

// Update active send-from domain
export async function setActiveSendFromDomain(domain: string): Promise<Settings | null> {
  const settings = await getSettings();

  // Verify domain is in the list
  if (!settings.sendFromDomains.includes(domain)) {
    console.error('Domain not in send_from_domains list:', domain);
    return null;
  }

  const { data, error } = await supabase
    .from('settings')
    .update({
      active_send_from_domain: domain,
      updated_at: new Date().toISOString(),
    })
    .eq('id', 'global')
    .select()
    .single();

  if (error) {
    console.error('Error updating send-from domain:', error);
    return null;
  }

  return rowToSettings(data);
}

// Update active landing page domain
export async function setActiveLandingDomain(domain: string): Promise<Settings | null> {
  const settings = await getSettings();

  // Verify domain is in the list
  if (!settings.landingDomains.includes(domain)) {
    console.error('Domain not in landing_domains list:', domain);
    return null;
  }

  const { data, error } = await supabase
    .from('settings')
    .update({
      active_landing_domain: domain,
      updated_at: new Date().toISOString(),
    })
    .eq('id', 'global')
    .select()
    .single();

  if (error) {
    console.error('Error updating landing domain:', error);
    return null;
  }

  return rowToSettings(data);
}

// Add a new send-from domain to the list
export async function addSendFromDomain(domain: string): Promise<Settings | null> {
  const settings = await getSettings();

  if (settings.sendFromDomains.includes(domain)) {
    return settings; // Already exists
  }

  const newDomains = [...settings.sendFromDomains, domain];

  const { data, error } = await supabase
    .from('settings')
    .update({
      send_from_domains: newDomains,
      updated_at: new Date().toISOString(),
    })
    .eq('id', 'global')
    .select()
    .single();

  if (error) {
    console.error('Error adding send-from domain:', error);
    return null;
  }

  return rowToSettings(data);
}

// Remove a send-from domain from the list
export async function removeSendFromDomain(domain: string): Promise<Settings | null> {
  const settings = await getSettings();

  // Can't remove the active domain
  if (settings.activeSendFromDomain === domain) {
    console.error('Cannot remove active send-from domain');
    return null;
  }

  // Can't remove if only one domain
  if (settings.sendFromDomains.length <= 1) {
    console.error('Cannot remove last send-from domain');
    return null;
  }

  const newDomains = settings.sendFromDomains.filter(d => d !== domain);

  const { data, error } = await supabase
    .from('settings')
    .update({
      send_from_domains: newDomains,
      updated_at: new Date().toISOString(),
    })
    .eq('id', 'global')
    .select()
    .single();

  if (error) {
    console.error('Error removing send-from domain:', error);
    return null;
  }

  return rowToSettings(data);
}

// Add a new landing domain to the list
export async function addLandingDomain(domain: string): Promise<Settings | null> {
  const settings = await getSettings();

  if (settings.landingDomains.includes(domain)) {
    return settings; // Already exists
  }

  const newDomains = [...settings.landingDomains, domain];

  const { data, error } = await supabase
    .from('settings')
    .update({
      landing_domains: newDomains,
      updated_at: new Date().toISOString(),
    })
    .eq('id', 'global')
    .select()
    .single();

  if (error) {
    console.error('Error adding landing domain:', error);
    return null;
  }

  return rowToSettings(data);
}

// Remove a landing domain from the list
export async function removeLandingDomain(domain: string): Promise<Settings | null> {
  const settings = await getSettings();

  // Can't remove the active domain
  if (settings.activeLandingDomain === domain) {
    console.error('Cannot remove active landing domain');
    return null;
  }

  // Can't remove if only one domain
  if (settings.landingDomains.length <= 1) {
    console.error('Cannot remove last landing domain');
    return null;
  }

  const newDomains = settings.landingDomains.filter(d => d !== domain);

  const { data, error } = await supabase
    .from('settings')
    .update({
      landing_domains: newDomains,
      updated_at: new Date().toISOString(),
    })
    .eq('id', 'global')
    .select()
    .single();

  if (error) {
    console.error('Error removing landing domain:', error);
    return null;
  }

  return rowToSettings(data);
}

// Get the full "from" email address
export async function getSendFromEmail(): Promise<string> {
  const settings = await getSettings();
  return `support@${settings.activeSendFromDomain}`;
}

// Get the full "from" with name for email sending
export async function getEmailFrom(): Promise<string> {
  const settings = await getSettings();
  return `Toast Capital Support <support@${settings.activeSendFromDomain}>`;
}

// Get landing page URL with token
export async function getLandingPageUrl(path: string, token?: string): Promise<string> {
  const settings = await getSettings();
  const baseUrl = `https://${settings.activeLandingDomain}${path}`;
  if (token) {
    return `${baseUrl}?token=${token}`;
  }
  return baseUrl;
}

// Get tracking URL for opens/clicks
export async function getTrackingUrl(type: 'open' | 'click', params: Record<string, string>): Promise<string> {
  const settings = await getSettings();
  const queryString = new URLSearchParams(params).toString();
  return `https://${settings.trackingDomain}/api/track/${type}?${queryString}`;
}

// Convert database row to Settings object
function rowToSettings(row: any): Settings {
  return {
    id: row.id,
    activeSendFromDomain: row.active_send_from_domain || 'toastcap.com',
    sendFromDomains: row.send_from_domains || ['toastcap.com'],
    activeLandingDomain: row.active_landing_domain || 'toastcap.com',
    landingDomains: row.landing_domains || ['toastcap.com'],
    trackingDomain: row.tracking_domain || 'toastcap-crm.netlify.app',
    updatedAt: row.updated_at,
  };
}
