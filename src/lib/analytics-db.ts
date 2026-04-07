import { getStore } from '@netlify/blobs';

// Types for analytics tracking
export interface EmailEvent {
  id: string;
  leadId: string;
  messageId: string;
  templateId?: string;
  templateName?: string;
  subject?: string;
  eventType: 'sent' | 'opened' | 'clicked';
  timestamp: string;
  metadata?: {
    linkUrl?: string;
    userAgent?: string;
    ipAddress?: string;
  };
}

export interface SmsEvent {
  id: string;
  leadId: string;
  messageId: string;
  templateId?: string;
  templateName?: string;
  eventType: 'sent' | 'delivered' | 'failed';
  timestamp: string;
}

export interface TemplateMetrics {
  templateId: string;
  templateName: string;
  type: 'email' | 'sms';
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  openRate: number;
  clickRate: number;
  lastUsed: string;
}

export interface DailyMetrics {
  date: string;
  emailsSent: number;
  emailsOpened: number;
  emailsClicked: number;
  smsSent: number;
  smsDelivered: number;
}

// Generate unique IDs
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

// Get store instance
function getAnalyticsStore() {
  return getStore({
    name: 'analytics',
    siteID: process.env.NETLIFY_SITE_ID || '',
    token: process.env.NETLIFY_ACCESS_TOKEN || '',
  });
}

// ============================================
// EMAIL EVENTS
// ============================================

export async function trackEmailEvent(data: {
  leadId: string;
  messageId: string;
  templateId?: string;
  templateName?: string;
  subject?: string;
  eventType: 'sent' | 'opened' | 'clicked';
  metadata?: EmailEvent['metadata'];
}): Promise<EmailEvent> {
  const store = getAnalyticsStore();
  const now = new Date().toISOString();

  const event: EmailEvent = {
    id: generateId(),
    leadId: data.leadId,
    messageId: data.messageId,
    templateId: data.templateId,
    templateName: data.templateName,
    subject: data.subject,
    eventType: data.eventType,
    timestamp: now,
    metadata: data.metadata,
  };

  // Save event
  await store.setJSON(`email_event_${event.id}`, event);

  // Update event index for this message
  await updateEmailEventIndex(data.messageId, event.id);

  // Update template metrics if template was used
  if (data.templateId) {
    await updateTemplateMetrics(data.templateId, data.templateName || data.templateId, 'email', data.eventType);
  }

  // Update daily metrics
  await updateDailyMetrics(data.eventType === 'sent' ? 'emailsSent' : data.eventType === 'opened' ? 'emailsOpened' : 'emailsClicked');

  return event;
}

export async function getEmailEvents(messageId: string): Promise<EmailEvent[]> {
  const store = getAnalyticsStore();
  const events: EmailEvent[] = [];

  try {
    const index = await store.get(`email_event_index_${messageId}`, { type: 'json' }) as string[] | null;
    if (!index) return [];

    for (const id of index) {
      const event = await store.get(`email_event_${id}`, { type: 'json' }) as EmailEvent | null;
      if (event) events.push(event);
    }

    return events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  } catch {
    return [];
  }
}

async function updateEmailEventIndex(messageId: string, eventId: string): Promise<void> {
  const store = getAnalyticsStore();

  let index: string[] = [];
  try {
    index = (await store.get(`email_event_index_${messageId}`, { type: 'json' }) as string[]) || [];
  } catch {
    index = [];
  }

  if (!index.includes(eventId)) {
    index.push(eventId);
  }

  await store.setJSON(`email_event_index_${messageId}`, index);
}

// ============================================
// SMS EVENTS
// ============================================

export async function trackSmsEvent(data: {
  leadId: string;
  messageId: string;
  templateId?: string;
  templateName?: string;
  eventType: 'sent' | 'delivered' | 'failed';
}): Promise<SmsEvent> {
  const store = getAnalyticsStore();
  const now = new Date().toISOString();

  const event: SmsEvent = {
    id: generateId(),
    leadId: data.leadId,
    messageId: data.messageId,
    templateId: data.templateId,
    templateName: data.templateName,
    eventType: data.eventType,
    timestamp: now,
  };

  await store.setJSON(`sms_event_${event.id}`, event);

  // Update template metrics
  if (data.templateId) {
    await updateTemplateMetrics(data.templateId, data.templateName || data.templateId, 'sms', data.eventType);
  }

  // Update daily metrics
  if (data.eventType === 'sent') {
    await updateDailyMetrics('smsSent');
  } else if (data.eventType === 'delivered') {
    await updateDailyMetrics('smsDelivered');
  }

  return event;
}

// ============================================
// TEMPLATE METRICS
// ============================================

export async function updateTemplateMetrics(
  templateId: string,
  templateName: string,
  type: 'email' | 'sms',
  eventType: string
): Promise<void> {
  const store = getAnalyticsStore();
  const key = `template_metrics_${type}_${templateId}`;

  let metrics: TemplateMetrics;
  try {
    metrics = (await store.get(key, { type: 'json' }) as TemplateMetrics) || {
      templateId,
      templateName,
      type,
      sent: 0,
      delivered: 0,
      opened: 0,
      clicked: 0,
      openRate: 0,
      clickRate: 0,
      lastUsed: new Date().toISOString(),
    };
  } catch {
    metrics = {
      templateId,
      templateName,
      type,
      sent: 0,
      delivered: 0,
      opened: 0,
      clicked: 0,
      openRate: 0,
      clickRate: 0,
      lastUsed: new Date().toISOString(),
    };
  }

  // Update counts
  if (eventType === 'sent') metrics.sent++;
  if (eventType === 'delivered') metrics.delivered++;
  if (eventType === 'opened') metrics.opened++;
  if (eventType === 'clicked') metrics.clicked++;

  // Calculate rates
  if (metrics.sent > 0) {
    metrics.openRate = Math.round((metrics.opened / metrics.sent) * 100);
    metrics.clickRate = Math.round((metrics.clicked / metrics.sent) * 100);
  }

  metrics.lastUsed = new Date().toISOString();

  await store.setJSON(key, metrics);

  // Update template index
  await updateTemplateIndex(templateId, type);
}

export async function getTemplateMetrics(type?: 'email' | 'sms'): Promise<TemplateMetrics[]> {
  const store = getAnalyticsStore();
  const metrics: TemplateMetrics[] = [];

  try {
    // Get all template IDs from indices
    const emailIndex = await store.get('template_index_email', { type: 'json' }) as string[] | null;
    const smsIndex = await store.get('template_index_sms', { type: 'json' }) as string[] | null;

    const indices = type === 'email' ? [emailIndex] : type === 'sms' ? [smsIndex] : [emailIndex, smsIndex];
    const types = type === 'email' ? ['email'] : type === 'sms' ? ['sms'] : ['email', 'sms'];

    for (let i = 0; i < indices.length; i++) {
      const index = indices[i];
      const t = types[i];
      if (!index) continue;

      for (const templateId of index) {
        const m = await store.get(`template_metrics_${t}_${templateId}`, { type: 'json' }) as TemplateMetrics | null;
        if (m) metrics.push(m);
      }
    }

    // Sort by sent count (most used first)
    return metrics.sort((a, b) => b.sent - a.sent);
  } catch {
    return [];
  }
}

async function updateTemplateIndex(templateId: string, type: 'email' | 'sms'): Promise<void> {
  const store = getAnalyticsStore();
  const key = `template_index_${type}`;

  let index: string[] = [];
  try {
    index = (await store.get(key, { type: 'json' }) as string[]) || [];
  } catch {
    index = [];
  }

  if (!index.includes(templateId)) {
    index.push(templateId);
    await store.setJSON(key, index);
  }
}

// ============================================
// DAILY METRICS
// ============================================

export async function updateDailyMetrics(field: keyof DailyMetrics): Promise<void> {
  const store = getAnalyticsStore();
  const today = new Date().toISOString().split('T')[0];
  const key = `daily_metrics_${today}`;

  let metrics: DailyMetrics;
  try {
    metrics = (await store.get(key, { type: 'json' }) as DailyMetrics) || {
      date: today,
      emailsSent: 0,
      emailsOpened: 0,
      emailsClicked: 0,
      smsSent: 0,
      smsDelivered: 0,
    };
  } catch {
    metrics = {
      date: today,
      emailsSent: 0,
      emailsOpened: 0,
      emailsClicked: 0,
      smsSent: 0,
      smsDelivered: 0,
    };
  }

  if (field !== 'date') {
    (metrics[field] as number)++;
  }

  await store.setJSON(key, metrics);

  // Update daily metrics index
  await updateDailyMetricsIndex(today);
}

export async function getDailyMetrics(days: number = 30): Promise<DailyMetrics[]> {
  const store = getAnalyticsStore();
  const metrics: DailyMetrics[] = [];

  try {
    const index = await store.get('daily_metrics_index', { type: 'json' }) as string[] | null;
    if (!index) return [];

    // Get last N days
    const sortedDates = index.sort().reverse().slice(0, days);

    for (const date of sortedDates) {
      const m = await store.get(`daily_metrics_${date}`, { type: 'json' }) as DailyMetrics | null;
      if (m) metrics.push(m);
    }

    return metrics;
  } catch {
    return [];
  }
}

async function updateDailyMetricsIndex(date: string): Promise<void> {
  const store = getAnalyticsStore();

  let index: string[] = [];
  try {
    index = (await store.get('daily_metrics_index', { type: 'json' }) as string[]) || [];
  } catch {
    index = [];
  }

  if (!index.includes(date)) {
    index.push(date);
    await store.setJSON('daily_metrics_index', index);
  }
}

// ============================================
// A/B TEST METRICS
// ============================================

interface ABTestMetric {
  templateBase: string;
  templateName: string;
  original: { sent: number; opened: number; clicked: number; openRate: number; clickRate: number };
  v2: { sent: number; opened: number; clicked: number; openRate: number; clickRate: number };
  winner: 'original' | 'v2' | 'tie' | 'insufficient_data';
  confidenceLevel: number;
}

interface ABTestSummary {
  totalOriginalSent: number;
  totalV2Sent: number;
  avgOriginalOpenRate: number;
  avgV2OpenRate: number;
  overallWinner: 'original' | 'v2' | 'tie' | 'insufficient_data';
  templatesWithWinner: number;
}

const TEMPLATE_BASES = [
  { base: 'cold_approved', name: "You've Been Approved" },
  { base: 'cold_unlocked', name: "[UNLOCKED] Improved Terms" },
  { base: 'cold_better_terms', name: "[UNLOCKED] Better Terms" },
  { base: 'cold_special_access', name: "Special Access" },
  { base: 'cold_invited', name: "You've Been Invited" },
  { base: 'cold_limited', name: "Limited Time Offer" },
  { base: 'cold_question', name: "Quick Question" },
  { base: 'cold_growth', name: "Fuel Your Growth" },
  { base: 'cold_potential', name: "Growth Potential" },
  { base: 'cold_60sec', name: "60-Second Offer" },
  { base: 'cold_seasonal', name: "Seasonal Opportunity" },
];

export async function getABTestMetrics(): Promise<{ templates: ABTestMetric[]; summary: ABTestSummary }> {
  const store = getAnalyticsStore();
  const templates: ABTestMetric[] = [];
  let totalOriginalSent = 0;
  let totalV2Sent = 0;
  let totalOriginalOpened = 0;
  let totalV2Opened = 0;
  let templatesWithWinner = 0;

  for (const { base, name } of TEMPLATE_BASES) {
    try {
      // Get original metrics
      const originalMetrics = await store.get(`template_metrics_email_${base}`, { type: 'json' }) as TemplateMetrics | null;
      // Get V2 metrics
      const v2Metrics = await store.get(`template_metrics_email_${base}_v2`, { type: 'json' }) as TemplateMetrics | null;

      const original = {
        sent: originalMetrics?.sent || 0,
        opened: originalMetrics?.opened || 0,
        clicked: originalMetrics?.clicked || 0,
        openRate: originalMetrics?.openRate || 0,
        clickRate: originalMetrics?.clickRate || 0,
      };

      const v2 = {
        sent: v2Metrics?.sent || 0,
        opened: v2Metrics?.opened || 0,
        clicked: v2Metrics?.clicked || 0,
        openRate: v2Metrics?.openRate || 0,
        clickRate: v2Metrics?.clickRate || 0,
      };

      // Only add if at least one has data
      if (original.sent > 0 || v2.sent > 0) {
        // Determine winner (need at least 50 sends per variant for statistical confidence)
        let winner: 'original' | 'v2' | 'tie' | 'insufficient_data' = 'insufficient_data';
        let confidenceLevel = 0;

        if (original.sent >= 50 && v2.sent >= 50) {
          const diff = Math.abs(original.openRate - v2.openRate);
          if (diff < 2) {
            winner = 'tie';
            confidenceLevel = 100;
          } else if (original.openRate > v2.openRate) {
            winner = 'original';
            confidenceLevel = Math.min(95, 50 + diff * 3);
          } else {
            winner = 'v2';
            confidenceLevel = Math.min(95, 50 + diff * 3);
          }
          templatesWithWinner++;
        }

        templates.push({
          templateBase: base,
          templateName: name,
          original,
          v2,
          winner,
          confidenceLevel,
        });

        totalOriginalSent += original.sent;
        totalV2Sent += v2.sent;
        totalOriginalOpened += original.opened;
        totalV2Opened += v2.opened;
      }
    } catch {
      // Skip templates with errors
    }
  }

  // Calculate overall winner
  const avgOriginalOpenRate = totalOriginalSent > 0 ? Math.round((totalOriginalOpened / totalOriginalSent) * 100) : 0;
  const avgV2OpenRate = totalV2Sent > 0 ? Math.round((totalV2Opened / totalV2Sent) * 100) : 0;

  let overallWinner: 'original' | 'v2' | 'tie' | 'insufficient_data' = 'insufficient_data';
  if (totalOriginalSent >= 100 && totalV2Sent >= 100) {
    const diff = Math.abs(avgOriginalOpenRate - avgV2OpenRate);
    if (diff < 2) {
      overallWinner = 'tie';
    } else if (avgOriginalOpenRate > avgV2OpenRate) {
      overallWinner = 'original';
    } else {
      overallWinner = 'v2';
    }
  }

  return {
    templates,
    summary: {
      totalOriginalSent,
      totalV2Sent,
      avgOriginalOpenRate,
      avgV2OpenRate,
      overallWinner,
      templatesWithWinner,
    },
  };
}

// ============================================
// AGGREGATE STATS
// ============================================

export async function getOverallStats(): Promise<{
  totalEmailsSent: number;
  totalEmailsOpened: number;
  totalEmailsClicked: number;
  totalSmsSent: number;
  totalSmsDelivered: number;
  overallOpenRate: number;
  overallClickRate: number;
  topTemplates: TemplateMetrics[];
}> {
  const dailyMetrics = await getDailyMetrics(90); // Last 90 days
  const templateMetrics = await getTemplateMetrics();

  const totals = dailyMetrics.reduce(
    (acc, day) => ({
      totalEmailsSent: acc.totalEmailsSent + day.emailsSent,
      totalEmailsOpened: acc.totalEmailsOpened + day.emailsOpened,
      totalEmailsClicked: acc.totalEmailsClicked + day.emailsClicked,
      totalSmsSent: acc.totalSmsSent + day.smsSent,
      totalSmsDelivered: acc.totalSmsDelivered + day.smsDelivered,
    }),
    {
      totalEmailsSent: 0,
      totalEmailsOpened: 0,
      totalEmailsClicked: 0,
      totalSmsSent: 0,
      totalSmsDelivered: 0,
    }
  );

  return {
    ...totals,
    overallOpenRate: totals.totalEmailsSent > 0
      ? Math.round((totals.totalEmailsOpened / totals.totalEmailsSent) * 100)
      : 0,
    overallClickRate: totals.totalEmailsSent > 0
      ? Math.round((totals.totalEmailsClicked / totals.totalEmailsSent) * 100)
      : 0,
    topTemplates: templateMetrics.slice(0, 5),
  };
}
