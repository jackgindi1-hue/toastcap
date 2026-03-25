import { NextRequest, NextResponse } from 'next/server';
import {
  getLeadsDueForDrip,
  advanceDripStep,
  markEmailBounced,
} from '@/lib/leads-db';
import { trackEmailEvent } from '@/lib/analytics-db';
import {
  DRIP_TEMPLATE_ORDER,
  DRIP_TOTAL_STEPS,
  getTemplateSubject,
  getTemplateHtml,
} from '@/lib/email-templates';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET /api/drip/process - Process all pending drip emails (called by cron or manually)
export async function GET(request: NextRequest) {
  // Optional: Add secret key protection for cron jobs
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  // Allow if no secret configured (dev mode) or if secret matches
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const leadsDue = await getLeadsDueForDrip();

    const results = {
      processed: 0,
      sent: 0,
      failed: 0,
      bounced: 0,
      details: [] as { leadId: string; step: number; status: string; error?: string }[],
    };

    for (const lead of leadsDue) {
      const nextStep = (lead.dripStep || 0) + 1;

      // Validate step
      if (nextStep > DRIP_TOTAL_STEPS) {
        results.details.push({
          leadId: lead.id,
          step: nextStep,
          status: 'skipped',
          error: 'Already completed drip',
        });
        continue;
      }

      const templateId = DRIP_TEMPLATE_ORDER[nextStep - 1];

      try {
        // Send the email via the existing send-email endpoint logic
        const emailResult = await sendDripEmail(lead, templateId, nextStep);

        if (emailResult.success) {
          // Advance to next step
          await advanceDripStep(lead.id);
          results.sent++;
          results.details.push({
            leadId: lead.id,
            step: nextStep,
            status: 'sent',
          });
        } else if (emailResult.bounced) {
          // Mark as bounced
          await markEmailBounced(lead.id);
          results.bounced++;
          results.details.push({
            leadId: lead.id,
            step: nextStep,
            status: 'bounced',
            error: emailResult.error,
          });
        } else {
          results.failed++;
          results.details.push({
            leadId: lead.id,
            step: nextStep,
            status: 'failed',
            error: emailResult.error,
          });
        }
      } catch (error: any) {
        results.failed++;
        results.details.push({
          leadId: lead.id,
          step: nextStep,
          status: 'error',
          error: error.message,
        });
      }

      results.processed++;

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      leadsProcessed: results.processed,
      emailsSent: results.sent,
      emailsFailed: results.failed,
      emailsBounced: results.bounced,
      details: results.details,
    });
  } catch (error: any) {
    console.error('Drip processing error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process drip emails' },
      { status: 500 }
    );
  }
}

// Helper function to send drip email
async function sendDripEmail(
  lead: any,
  templateId: string,
  step: number
): Promise<{ success: boolean; bounced?: boolean; error?: string }> {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey || !apiKey.startsWith('re_')) {
      return { success: false, error: 'Email service not configured' };
    }

    const { Resend } = await import('resend');
    const resend = new Resend(apiKey);

    const firstName = lead.firstName || 'there';
    const businessName = lead.businessName || 'your business';

    // Get full template HTML from shared module
    const templateHtml = getTemplateHtml(templateId, firstName, businessName);
    const subject = getTemplateSubject(templateId, firstName, businessName);

    if (!templateHtml || !subject) {
      return { success: false, error: `Template ${templateId} not found` };
    }

    // Create message ID for tracking
    const messageId = `drip-${lead.id}-${step}-${Date.now()}`;

    // Add tracking pixel
    const trackingParams = new URLSearchParams({
      mid: messageId,
      tid: templateId,
      tn: `Drip ${step}/${DRIP_TOTAL_STEPS}`,
    });
    const trackingPixel = `<img src="${process.env.NEXT_PUBLIC_SITE_URL || 'https://toastcapital.com'}/api/track/open?${trackingParams.toString()}" width="1" height="1" style="display:none" />`;
    const htmlWithTracking = templateHtml + trackingPixel;

    const result = await resend.emails.send({
      from: 'Toast Capital <support@toastcapital.com>',
      to: lead.email,
      subject: subject,
      html: htmlWithTracking,
    });

    if (result.error) {
      // Check if it's a bounce
      const errorMessage = (result.error as any).message || '';
      if (errorMessage.includes('bounce') || errorMessage.includes('invalid')) {
        return { success: false, bounced: true, error: errorMessage };
      }
      return { success: false, error: errorMessage };
    }

    // Track email sent
    try {
      await trackEmailEvent({
        leadId: lead.id,
        messageId: messageId,
        templateId: templateId,
        templateName: `Drip ${step}/${DRIP_TOTAL_STEPS}`,
        subject: subject,
        eventType: 'sent',
      });
    } catch {
      // Tracking failure shouldn't fail the send
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
