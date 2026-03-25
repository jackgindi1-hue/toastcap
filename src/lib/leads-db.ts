import { supabase } from './supabase';
import { DRIP_TOTAL_STEPS } from './email-templates';

// Re-export DRIP_TOTAL_STEPS for backward compatibility
export { DRIP_TOTAL_STEPS };

// Types
export type LeadStage = 'quote' | 'application' | 'dlvc' | 'funded';
export type LeadStatus = 'new' | 'contacted' | 'in_review' | 'approved' | 'funded' | 'lost';
export type LeadTag = 'hot' | 'follow_up' | 'waiting_docs' | 'problem' | 'vip';
export type MessageType = 'sms' | 'email';
export type MessageStatus = 'pending' | 'sent' | 'delivered' | 'opened' | 'clicked' | 'failed';
export type DocType = 'bank_statement_1' | 'bank_statement_2' | 'bank_statement_3' | 'drivers_license' | 'void_check' | 'other';

export interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  phoneVerified?: boolean;
  businessName: string;
  businessType?: string;
  monthlyRevenue?: string;
  fundingAmount?: string;
  numLocations?: string;
  stage: LeadStage;
  status: LeadStatus;
  tags: LeadTag[];
  createdAt: string;
  updatedAt: string;
  quoteSubmittedAt?: string;
  applicationSubmittedAt?: string;
  dlvcSubmittedAt?: string;
  documents?: {
    bankStatement1?: boolean;
    bankStatement2?: boolean;
    bankStatement3?: boolean;
    driversLicense?: boolean;
    voidCheck?: boolean;
  };
  documentsComplete?: boolean;
  readyForReview?: boolean;
  dripCampaign?: 'cold_outreach' | null;
  dripStep?: number;
  dripTotalSteps?: number;
  nextDripAt?: string;
  dripPaused?: boolean;
  dripCompletedAt?: string;
  emailBounced?: boolean;
  lastDripSentAt?: string;
  jotformSubmissionId?: string;
}

export interface LeadDocument {
  id: string;
  leadId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  docType: DocType;
  uploadedAt: string;
}

export interface LeadMessage {
  id: string;
  leadId: string;
  type: MessageType;
  subject?: string;
  content: string;
  status: MessageStatus;
  sentAt: string;
  deliveredAt?: string;
  openedAt?: string;
  clickedAt?: string;
  resendEmailId?: string;
  twilioSid?: string;
}

export interface LeadNote {
  id: string;
  leadId: string;
  content: string;
  createdAt: string;
}

// Generate unique IDs
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

// Convert database row to Lead object
function rowToLead(row: any): Lead {
  return {
    id: row.id,
    firstName: row.first_name || '',
    lastName: row.last_name || '',
    email: row.email || '',
    phone: row.phone || '',
    phoneVerified: row.phone_verified || false,
    businessName: row.business_name || '',
    businessType: row.business_type || undefined,
    monthlyRevenue: row.monthly_revenue || undefined,
    fundingAmount: row.funding_amount || undefined,
    numLocations: row.num_locations || undefined,
    stage: row.stage || 'quote',
    status: row.status || 'new',
    tags: row.tags || [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    quoteSubmittedAt: row.quote_submitted_at || undefined,
    applicationSubmittedAt: row.application_submitted_at || undefined,
    dlvcSubmittedAt: row.dlvc_submitted_at || undefined,
    documents: row.documents || undefined,
    documentsComplete: row.documents_complete || false,
    readyForReview: row.ready_for_review || false,
    dripCampaign: row.drip_campaign || undefined,
    dripStep: row.drip_step || undefined,
    dripTotalSteps: row.drip_total_steps || undefined,
    nextDripAt: row.next_drip_at || undefined,
    dripPaused: row.drip_paused || false,
    dripCompletedAt: row.drip_completed_at || undefined,
    emailBounced: row.email_bounced || false,
    lastDripSentAt: row.last_drip_sent_at || undefined,
    jotformSubmissionId: row.jotform_submission_id || undefined,
  };
}

// Convert Lead object to database row
function leadToRow(lead: Partial<Lead>) {
  const row: any = {};

  if (lead.id !== undefined) row.id = lead.id;
  if (lead.firstName !== undefined) row.first_name = lead.firstName;
  if (lead.lastName !== undefined) row.last_name = lead.lastName;
  if (lead.email !== undefined) row.email = lead.email;
  if (lead.phone !== undefined) row.phone = lead.phone;
  if (lead.phoneVerified !== undefined) row.phone_verified = lead.phoneVerified;
  if (lead.businessName !== undefined) row.business_name = lead.businessName;
  if (lead.businessType !== undefined) row.business_type = lead.businessType;
  if (lead.monthlyRevenue !== undefined) row.monthly_revenue = lead.monthlyRevenue;
  if (lead.fundingAmount !== undefined) row.funding_amount = lead.fundingAmount;
  if (lead.numLocations !== undefined) row.num_locations = lead.numLocations;
  if (lead.stage !== undefined) row.stage = lead.stage;
  if (lead.status !== undefined) row.status = lead.status;
  if (lead.tags !== undefined) row.tags = lead.tags;
  if (lead.createdAt !== undefined) row.created_at = lead.createdAt;
  if (lead.updatedAt !== undefined) row.updated_at = lead.updatedAt;
  if (lead.quoteSubmittedAt !== undefined) row.quote_submitted_at = lead.quoteSubmittedAt;
  if (lead.applicationSubmittedAt !== undefined) row.application_submitted_at = lead.applicationSubmittedAt;
  if (lead.dlvcSubmittedAt !== undefined) row.dlvc_submitted_at = lead.dlvcSubmittedAt;
  if (lead.documents !== undefined) row.documents = lead.documents;
  if (lead.documentsComplete !== undefined) row.documents_complete = lead.documentsComplete;
  if (lead.readyForReview !== undefined) row.ready_for_review = lead.readyForReview;
  if (lead.dripCampaign !== undefined) row.drip_campaign = lead.dripCampaign;
  if (lead.dripStep !== undefined) row.drip_step = lead.dripStep;
  if (lead.dripTotalSteps !== undefined) row.drip_total_steps = lead.dripTotalSteps;
  if (lead.nextDripAt !== undefined) row.next_drip_at = lead.nextDripAt;
  if (lead.dripPaused !== undefined) row.drip_paused = lead.dripPaused;
  if (lead.dripCompletedAt !== undefined) row.drip_completed_at = lead.dripCompletedAt;
  if (lead.emailBounced !== undefined) row.email_bounced = lead.emailBounced;
  if (lead.lastDripSentAt !== undefined) row.last_drip_sent_at = lead.lastDripSentAt;
  if (lead.jotformSubmissionId !== undefined) row.jotform_submission_id = lead.jotformSubmissionId;

  return row;
}

// ============================================
// LEADS CRUD
// ============================================

export async function createLead(data: Partial<Lead>): Promise<Lead> {
  const now = new Date().toISOString();

  const lead: Lead = {
    id: generateId(),
    firstName: data.firstName || '',
    lastName: data.lastName || '',
    email: data.email || '',
    phone: data.phone || '',
    businessName: data.businessName || '',
    businessType: data.businessType,
    monthlyRevenue: data.monthlyRevenue,
    fundingAmount: data.fundingAmount,
    numLocations: data.numLocations,
    stage: data.stage || 'quote',
    status: data.status || 'new',
    tags: data.tags || [],
    createdAt: now,
    updatedAt: now,
    quoteSubmittedAt: data.stage === 'quote' ? now : data.quoteSubmittedAt,
    applicationSubmittedAt: data.applicationSubmittedAt,
    dlvcSubmittedAt: data.dlvcSubmittedAt,
  };

  const { error } = await supabase
    .from('leads')
    .insert(leadToRow(lead));

  if (error) {
    console.error('Error creating lead:', error);
    throw new Error(error.message);
  }

  return lead;
}

// BULK CREATE - This is the key function for fast imports!
export async function createLeadsBulk(leadsData: Partial<Lead>[]): Promise<{ created: number; errors: string[] }> {
  const now = new Date().toISOString();
  const errors: string[] = [];

  const rows = leadsData.map((data, index) => {
    try {
      const lead: Lead = {
        id: generateId(),
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        email: data.email || '',
        phone: data.phone || '',
        businessName: data.businessName || '',
        businessType: data.businessType,
        monthlyRevenue: data.monthlyRevenue,
        fundingAmount: data.fundingAmount,
        numLocations: data.numLocations,
        stage: data.stage || 'quote',
        status: data.status || 'new',
        tags: data.tags || [],
        createdAt: now,
        updatedAt: now,
        quoteSubmittedAt: data.stage === 'quote' ? now : data.quoteSubmittedAt,
        applicationSubmittedAt: data.applicationSubmittedAt,
        dlvcSubmittedAt: data.dlvcSubmittedAt,
      };
      return leadToRow(lead);
    } catch (err: any) {
      errors.push(`Row ${index + 1}: ${err.message}`);
      return null;
    }
  }).filter(Boolean);

  if (rows.length === 0) {
    return { created: 0, errors };
  }

  // Batch insert in chunks of 500 to avoid Supabase limits
  const BATCH_SIZE = 500;
  let created = 0;

  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE);
    const { error } = await supabase
      .from('leads')
      .insert(batch);

    if (error) {
      console.error(`Bulk insert error (batch ${i / BATCH_SIZE + 1}):`, error);
      errors.push(`Batch ${i / BATCH_SIZE + 1} failed: ${error.message}`);
    } else {
      created += batch.length;
    }

    console.log(`📥 Imported batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(rows.length / BATCH_SIZE)}: ${batch.length} leads`);
  }

  return { created, errors };
}

export async function getLead(id: string): Promise<Lead | null> {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    return null;
  }

  return rowToLead(data);
}

export async function updateLead(id: string, data: Partial<Lead>): Promise<Lead | null> {
  const updateData = leadToRow({
    ...data,
    updatedAt: new Date().toISOString(),
  });

  const { data: updated, error } = await supabase
    .from('leads')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error || !updated) {
    console.error('Error updating lead:', error);
    return null;
  }

  return rowToLead(updated);
}

export async function deleteLead(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('leads')
    .delete()
    .eq('id', id);

  return !error;
}

export async function deleteAllLeads(): Promise<number> {
  // First count how many we're deleting
  const { count } = await supabase
    .from('leads')
    .select('*', { count: 'exact', head: true });

  const { error } = await supabase
    .from('leads')
    .delete()
    .neq('id', ''); // Delete all rows

  if (error) {
    console.error('Error deleting all leads:', error);
    throw new Error(error.message);
  }

  return count || 0;
}

export async function getAllLeads(): Promise<Lead[]> {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching leads:', error);
    return [];
  }

  return (data || []).map(rowToLead);
}

export async function findLeadByEmail(email: string): Promise<Lead | null> {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .ilike('email', email)
    .limit(1)
    .single();

  if (error || !data) {
    return null;
  }

  return rowToLead(data);
}

export async function findLeadByPhone(phone: string): Promise<Lead | null> {
  const cleanPhone = phone.replace(/\D/g, '');

  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .limit(100); // Get some leads and filter

  if (error || !data) {
    return null;
  }

  // Find matching phone (after cleaning)
  const match = data.find(row => row.phone?.replace(/\D/g, '') === cleanPhone);
  return match ? rowToLead(match) : null;
}

// ============================================
// DOCUMENT TRACKING
// ============================================

export type DocumentField = 'bankStatement1' | 'bankStatement2' | 'bankStatement3' | 'driversLicense' | 'voidCheck';

export async function updateLeadDocumentStatus(
  leadId: string,
  docField: DocumentField,
  hasDoc: boolean
): Promise<Lead | null> {
  const lead = await getLead(leadId);
  if (!lead) return null;

  const documents = lead.documents || {
    bankStatement1: false,
    bankStatement2: false,
    bankStatement3: false,
    driversLicense: false,
    voidCheck: false,
  };

  documents[docField] = hasDoc;

  const documentsComplete =
    documents.bankStatement1 &&
    documents.bankStatement2 &&
    documents.bankStatement3 &&
    documents.driversLicense &&
    documents.voidCheck;

  const readyForReview = documentsComplete && lead.stage === 'dlvc';

  return updateLead(leadId, {
    documents,
    documentsComplete,
    readyForReview,
  });
}

export async function getLeadsReadyForReview(): Promise<Lead[]> {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .eq('ready_for_review', true)
    .order('created_at', { ascending: false });

  if (error) return [];
  return (data || []).map(rowToLead);
}

export async function getLeadsWithIncompleteDocuments(): Promise<Lead[]> {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .eq('stage', 'dlvc')
    .eq('documents_complete', false)
    .order('created_at', { ascending: false });

  if (error) return [];
  return (data || []).map(rowToLead);
}

export async function getDocumentCompletionStats(): Promise<{
  total: number;
  complete: number;
  incomplete: number;
  readyForReview: number;
  byDocument: {
    bankStatement1: number;
    bankStatement2: number;
    bankStatement3: number;
    driversLicense: number;
    voidCheck: number;
  };
}> {
  const allLeads = await getAllLeads();
  const dlvcLeads = allLeads.filter(l => l.stage === 'dlvc' || l.stage === 'funded');

  const stats = {
    total: dlvcLeads.length,
    complete: 0,
    incomplete: 0,
    readyForReview: 0,
    byDocument: {
      bankStatement1: 0,
      bankStatement2: 0,
      bankStatement3: 0,
      driversLicense: 0,
      voidCheck: 0,
    },
  };

  for (const lead of dlvcLeads) {
    if (lead.documentsComplete) stats.complete++;
    else stats.incomplete++;
    if (lead.readyForReview) stats.readyForReview++;
    if (lead.documents) {
      if (lead.documents.bankStatement1) stats.byDocument.bankStatement1++;
      if (lead.documents.bankStatement2) stats.byDocument.bankStatement2++;
      if (lead.documents.bankStatement3) stats.byDocument.bankStatement3++;
      if (lead.documents.driversLicense) stats.byDocument.driversLicense++;
      if (lead.documents.voidCheck) stats.byDocument.voidCheck++;
    }
  }

  return stats;
}

// ============================================
// DRIP CAMPAIGN MANAGEMENT
// ============================================

export const DRIP_SCHEDULE_DAYS = [0, 1, 2, 5, 6, 7, 13, 14, 15];
export const DRIP_SEND_HOURS = [9, 13, 9, 13, 9, 13, 9, 13, 9];

export function calculateNextDripDate(currentStep: number, lastSentAt: string): string | null {
  if (currentStep >= DRIP_TOTAL_STEPS) return null;

  const nextStep = currentStep + 1;
  const currentDayOffset = DRIP_SCHEDULE_DAYS[currentStep - 1] || 0;
  const nextDayOffset = DRIP_SCHEDULE_DAYS[nextStep - 1];
  const daysUntilNext = nextDayOffset - currentDayOffset;

  const lastSent = new Date(lastSentAt);
  const nextDate = new Date(lastSent);
  nextDate.setDate(nextDate.getDate() + daysUntilNext);

  const sendHour = DRIP_SEND_HOURS[nextStep - 1] || 9;
  nextDate.setHours(sendHour, 0, 0, 0);

  return nextDate.toISOString();
}

export async function startDripCampaign(leadId: string, startAtStep: number = 1): Promise<Lead | null> {
  const lead = await getLead(leadId);
  if (!lead) return null;
  if (lead.emailBounced || !lead.email) return null;

  const validStep = Math.max(1, Math.min(startAtStep, DRIP_TOTAL_STEPS));
  const now = new Date();
  const sendHour = DRIP_SEND_HOURS[validStep - 1] || 9;

  const nextDripDate = new Date(now);
  nextDripDate.setHours(sendHour, 0, 0, 0);
  if (nextDripDate <= now) {
    nextDripDate.setDate(nextDripDate.getDate() + 1);
  }

  return updateLead(leadId, {
    dripCampaign: 'cold_outreach',
    dripStep: validStep - 1,
    dripTotalSteps: DRIP_TOTAL_STEPS,
    nextDripAt: nextDripDate.toISOString(),
    dripPaused: false,
    dripCompletedAt: undefined,
    lastDripSentAt: undefined,
  });
}

// BULK start drip - uses only 2 DB calls instead of 3 per lead
export async function bulkStartDripCampaign(
  leadIds: string[],
  startAtStep: number = 1
): Promise<{
  started: number;
  skipped: number;
  skipReasons: { notFound: number; noEmail: number; emailBounced: number; alreadyInDrip: number };
  skippedDetails: { id: string; business: string; reason: string }[];
  startedIds: string[];
}> {
  const validStep = Math.max(1, Math.min(startAtStep, DRIP_TOTAL_STEPS));
  const now = new Date();
  const sendHour = DRIP_SEND_HOURS[validStep - 1] || 9;

  const nextDripDate = new Date(now);
  nextDripDate.setHours(sendHour, 0, 0, 0);
  if (nextDripDate <= now) {
    nextDripDate.setDate(nextDripDate.getDate() + 1);
  }

  // 1. Fetch ALL leads in ONE query
  const { data: rows, error } = await supabase
    .from('leads')
    .select('*')
    .in('id', leadIds);

  if (error) {
    console.error('bulkStartDripCampaign fetch error:', error);
    throw error;
  }

  const leads = (rows || []).map(rowToLead);
  const leadMap = new Map<string, Lead>(leads.map(l => [l.id, l]));

  const skipReasons = { notFound: 0, noEmail: 0, emailBounced: 0, alreadyInDrip: 0 };
  const skippedDetails: { id: string; business: string; reason: string }[] = [];
  const eligibleIds: string[] = [];

  // 2. Filter in memory
  for (const leadId of leadIds) {
    const lead = leadMap.get(leadId);

    if (!lead) {
      skipReasons.notFound++;
      skippedDetails.push({ id: leadId, business: '?', reason: 'Lead not found' });
      continue;
    }

    if (!lead.email || !lead.email.trim()) {
      skipReasons.noEmail++;
      skippedDetails.push({ id: leadId, business: lead.businessName || '?', reason: 'No email' });
      continue;
    }

    if (lead.emailBounced) {
      skipReasons.emailBounced++;
      skippedDetails.push({ id: leadId, business: lead.businessName || '?', reason: 'Email bounced' });
      continue;
    }

    if (lead.dripCampaign) {
      skipReasons.alreadyInDrip++;
      skippedDetails.push({ id: leadId, business: lead.businessName || '?', reason: `Already in drip step ${lead.dripStep || 0}` });
      continue;
    }

    eligibleIds.push(leadId);
  }

  // 3. Bulk update ALL eligible leads in ONE query
  if (eligibleIds.length > 0) {
    const { error: updateError } = await supabase
      .from('leads')
      .update({
        drip_campaign: 'cold_outreach',
        drip_step: validStep - 1,
        drip_total_steps: DRIP_TOTAL_STEPS,
        next_drip_at: nextDripDate.toISOString(),
        drip_paused: false,
        drip_completed_at: null,
        last_drip_sent_at: null,
        updated_at: now.toISOString(),
      })
      .in('id', eligibleIds);

    if (updateError) {
      console.error('bulkStartDripCampaign update error:', updateError);
      throw updateError;
    }
  }

  console.log(`✅ Bulk drip: ${eligibleIds.length} started, ${leadIds.length - eligibleIds.length} skipped`);

  return {
    started: eligibleIds.length,
    skipped: leadIds.length - eligibleIds.length,
    skipReasons,
    skippedDetails: skippedDetails.slice(0, 20),
    startedIds: eligibleIds,
  };
}

export async function pauseDripCampaign(leadId: string): Promise<Lead | null> {
  return updateLead(leadId, { dripPaused: true });
}

export async function resumeDripCampaign(leadId: string): Promise<Lead | null> {
  const lead = await getLead(leadId);
  if (!lead || !lead.dripCampaign) return null;

  const now = new Date();
  let nextDripAt = lead.nextDripAt;

  if (lead.nextDripAt && new Date(lead.nextDripAt) < now) {
    nextDripAt = now.toISOString();
  }

  return updateLead(leadId, { dripPaused: false, nextDripAt });
}

export async function stopDripCampaign(leadId: string): Promise<Lead | null> {
  return updateLead(leadId, {
    dripCampaign: null,
    dripStep: undefined,
    nextDripAt: undefined,
    dripPaused: undefined,
  });
}

export async function advanceDripStep(leadId: string): Promise<Lead | null> {
  const lead = await getLead(leadId);
  if (!lead || !lead.dripCampaign) return null;

  const now = new Date().toISOString();
  const currentStep = (lead.dripStep || 0) + 1;

  if (currentStep >= DRIP_TOTAL_STEPS) {
    return updateLead(leadId, {
      dripStep: DRIP_TOTAL_STEPS,
      dripCampaign: null,
      dripCompletedAt: now,
      nextDripAt: undefined,
      lastDripSentAt: now,
    });
  }

  const nextDripAt = calculateNextDripDate(currentStep, now);

  return updateLead(leadId, {
    dripStep: currentStep,
    nextDripAt: nextDripAt || undefined,
    lastDripSentAt: now,
  });
}

export async function getLeadsDueForDrip(): Promise<Lead[]> {
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .not('drip_campaign', 'is', null)
    .eq('drip_paused', false)
    .eq('email_bounced', false)
    .not('email', 'eq', '')
    .lte('next_drip_at', now);

  if (error) return [];
  return (data || []).map(rowToLead);
}

export async function getLeadsInDripCampaign(): Promise<Lead[]> {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .not('drip_campaign', 'is', null)
    .order('created_at', { ascending: false });

  if (error) return [];
  return (data || []).map(rowToLead);
}

export async function markEmailBounced(leadId: string): Promise<Lead | null> {
  return updateLead(leadId, { emailBounced: true, dripPaused: true });
}

export async function markEmailBouncedByAddress(email: string): Promise<Lead | null> {
  const lead = await findLeadByEmail(email);
  if (!lead) return null;
  return markEmailBounced(lead.id);
}

// ============================================
// DOCUMENTS, MESSAGES, NOTES - Using Netlify Blobs for now
// (These are less frequently accessed, so rate limits aren't an issue)
// ============================================

import { getStore } from '@netlify/blobs';

function getDocsStore() {
  if (process.env.NETLIFY) {
    return getStore('documents');
  }
  const siteID = process.env.NETLIFY_SITE_ID || process.env.SITE_ID || '';
  const token = process.env.NETLIFY_ACCESS_TOKEN || '';
  if (siteID && token) {
    return getStore({ name: 'documents', siteID, token });
  }
  return getStore('documents');
}

function getMessagesStore() {
  if (process.env.NETLIFY) {
    return getStore('messages');
  }
  const siteID = process.env.NETLIFY_SITE_ID || process.env.SITE_ID || '';
  const token = process.env.NETLIFY_ACCESS_TOKEN || '';
  if (siteID && token) {
    return getStore({ name: 'messages', siteID, token });
  }
  return getStore('messages');
}

function getNotesStore() {
  if (process.env.NETLIFY) {
    return getStore('notes');
  }
  const siteID = process.env.NETLIFY_SITE_ID || process.env.SITE_ID || '';
  const token = process.env.NETLIFY_ACCESS_TOKEN || '';
  if (siteID && token) {
    return getStore({ name: 'notes', siteID, token });
  }
  return getStore('notes');
}

export async function saveDocument(
  leadId: string,
  file: Buffer,
  metadata: {
    fileName: string;
    fileType: string;
    fileSize: number;
    docType: DocType;
  }
): Promise<LeadDocument> {
  const store = getDocsStore();
  const now = new Date().toISOString();

  const doc: LeadDocument = {
    id: generateId(),
    leadId,
    fileName: metadata.fileName,
    fileType: metadata.fileType,
    fileSize: metadata.fileSize,
    docType: metadata.docType,
    uploadedAt: now,
  };

  await store.setJSON(`meta_${doc.id}`, doc);
  const uint8Array = new Uint8Array(file);
  await store.set(`file_${doc.id}`, uint8Array.buffer as ArrayBuffer);
  await updateDocumentIndex(leadId, doc.id, 'add');

  return doc;
}

export async function getDocument(id: string): Promise<{ metadata: LeadDocument; file: Buffer } | null> {
  const store = getDocsStore();

  try {
    const metadata = await store.get(`meta_${id}`, { type: 'json' }) as LeadDocument | null;
    if (!metadata) return null;

    const file = await store.get(`file_${id}`, { type: 'arrayBuffer' });
    if (!file) return null;

    return { metadata, file: Buffer.from(file) };
  } catch {
    return null;
  }
}

export async function getLeadDocuments(leadId: string): Promise<LeadDocument[]> {
  const store = getDocsStore();
  const docs: LeadDocument[] = [];

  try {
    const index = await store.get(`index_${leadId}`, { type: 'json' }) as string[] | null;
    if (!index) return [];

    for (const id of index) {
      const metadata = await store.get(`meta_${id}`, { type: 'json' }) as LeadDocument | null;
      if (metadata) docs.push(metadata);
    }

    return docs;
  } catch {
    return [];
  }
}

async function updateDocumentIndex(leadId: string, docId: string, action: 'add' | 'remove'): Promise<void> {
  const store = getDocsStore();
  let index: string[] = [];

  try {
    index = (await store.get(`index_${leadId}`, { type: 'json' }) as string[]) || [];
  } catch {
    index = [];
  }

  if (action === 'add' && !index.includes(docId)) {
    index.push(docId);
  } else if (action === 'remove') {
    index = index.filter(i => i !== docId);
  }

  await store.setJSON(`index_${leadId}`, index);
}

export async function createMessage(data: {
  leadId: string;
  type: MessageType;
  subject?: string;
  content: string;
  resendEmailId?: string;
  twilioSid?: string;
}): Promise<LeadMessage> {
  const store = getMessagesStore();
  const now = new Date().toISOString();

  const message: LeadMessage = {
    id: generateId(),
    leadId: data.leadId,
    type: data.type,
    subject: data.subject,
    content: data.content,
    status: 'sent',
    sentAt: now,
    resendEmailId: data.resendEmailId,
    twilioSid: data.twilioSid,
  };

  await store.setJSON(`msg_${message.id}`, message);
  await updateMessageIndex(data.leadId, message.id, 'add');

  return message;
}

export async function updateMessageStatus(
  id: string,
  status: MessageStatus,
  timestamp?: string
): Promise<LeadMessage | null> {
  const store = getMessagesStore();

  try {
    const message = await store.get(`msg_${id}`, { type: 'json' }) as LeadMessage | null;
    if (!message) return null;

    const updated: LeadMessage = { ...message, status };

    if (status === 'delivered' && timestamp) updated.deliveredAt = timestamp;
    else if (status === 'opened' && timestamp) updated.openedAt = timestamp;
    else if (status === 'clicked' && timestamp) updated.clickedAt = timestamp;

    await store.setJSON(`msg_${id}`, updated);
    return updated;
  } catch {
    return null;
  }
}

export async function getLeadMessages(leadId: string): Promise<LeadMessage[]> {
  const store = getMessagesStore();
  const messages: LeadMessage[] = [];

  try {
    const index = await store.get(`index_${leadId}`, { type: 'json' }) as string[] | null;
    if (!index) return [];

    for (const id of index) {
      const message = await store.get(`msg_${id}`, { type: 'json' }) as LeadMessage | null;
      if (message) messages.push(message);
    }

    messages.sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime());
    return messages;
  } catch {
    return [];
  }
}

async function updateMessageIndex(leadId: string, msgId: string, action: 'add' | 'remove'): Promise<void> {
  const store = getMessagesStore();
  let index: string[] = [];

  try {
    index = (await store.get(`index_${leadId}`, { type: 'json' }) as string[]) || [];
  } catch {
    index = [];
  }

  if (action === 'add' && !index.includes(msgId)) {
    index.push(msgId);
  } else if (action === 'remove') {
    index = index.filter(i => i !== msgId);
  }

  await store.setJSON(`index_${leadId}`, index);
}

export async function createNote(leadId: string, content: string): Promise<LeadNote> {
  const store = getNotesStore();
  const now = new Date().toISOString();

  const note: LeadNote = {
    id: generateId(),
    leadId,
    content,
    createdAt: now,
  };

  await store.setJSON(`note_${note.id}`, note);
  await updateNoteIndex(leadId, note.id, 'add');

  return note;
}

export async function getLeadNotes(leadId: string): Promise<LeadNote[]> {
  const store = getNotesStore();
  const notes: LeadNote[] = [];

  try {
    const index = await store.get(`index_${leadId}`, { type: 'json' }) as string[] | null;
    if (!index) return [];

    for (const id of index) {
      const note = await store.get(`note_${id}`, { type: 'json' }) as LeadNote | null;
      if (note) notes.push(note);
    }

    notes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return notes;
  } catch {
    return [];
  }
}

export async function deleteNote(id: string, leadId: string): Promise<boolean> {
  const store = getNotesStore();

  try {
    await store.delete(`note_${id}`);
    await updateNoteIndex(leadId, id, 'remove');
    return true;
  } catch {
    return false;
  }
}

async function updateNoteIndex(leadId: string, noteId: string, action: 'add' | 'remove'): Promise<void> {
  const store = getNotesStore();
  let index: string[] = [];

  try {
    index = (await store.get(`index_${leadId}`, { type: 'json' }) as string[]) || [];
  } catch {
    index = [];
  }

  if (action === 'add' && !index.includes(noteId)) {
    index.push(noteId);
  } else if (action === 'remove') {
    index = index.filter(i => i !== noteId);
  }

  await store.setJSON(`index_${leadId}`, index);
}
