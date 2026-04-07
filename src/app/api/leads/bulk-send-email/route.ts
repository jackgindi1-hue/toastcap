import { NextRequest, NextResponse } from 'next/server';
import { getLeadById } from '@/lib/leads-db';
import { getTemplateSubject, getTemplateHtml } from '@/lib/email-templates';
import { requireAuth } from '@/lib/auth';
import { getOrCreateTokenForLead } from '@/lib/tokens-db';
import { getSettings } from '@/lib/settings-db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 300; // 5 minutes max for Netlify Pro

// POST /api/leads/bulk-send-email - Send bulk emails (PROTECTED)
export async function POST(request: NextRequest) {
  // Require authentication
  const authError = await requireAuth(request);
  if (authError) return authError;

  try {
    const { leadIds, templateId, customSubject, customContent } = await request.json();

    if (!leadIds || !Array.isArray(leadIds) || leadIds.length === 0) {
      return NextResponse.json({ error: 'No lead IDs provided' }, { status: 400 });
    }

    if (!templateId && !customContent) {
      return NextResponse.json({ error: 'Template or custom content required' }, { status: 400 });
    }

    // Check for Resend API key
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey || !apiKey.startsWith('re_')) {
      return NextResponse.json({ error: 'Email service not configured' }, { status: 500 });
    }

    const { Resend } = await import('resend');
    const resend = new Resend(apiKey);

    // Get settings for dynamic domains
    const settings = await getSettings();
    const landingDomain = settings.activeLandingDomain || 'toastcap.com';
    const sendFromDomain = settings.activeSendFromDomain || 'toastcap.com';
    const trackingDomain = settings.trackingDomain || 'toastcap-crm.netlify.app';

    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[],
    };

    // Process in batches of 50
    const batchSize = 50;
    const batches = [];
    for (let i = 0; i < leadIds.length; i += batchSize) {
      batches.push(leadIds.slice(i, i + batchSize));
    }

    console.log(`📧 Starting bulk email: ${leadIds.length} leads in ${batches.length} batches`);

    for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
      const batch = batches[batchIndex];
      console.log(`📧 Processing batch ${batchIndex + 1}/${batches.length} (${batch.length} leads)`);

      // Process each lead in the batch
      const batchPromises = batch.map(async (leadId: string) => {
        try {
          const lead = await getLeadById(leadId);
          if (!lead || !lead.email) {
            return { success: false, error: 'No email' };
          }

          const firstName = lead.firstName || 'there';
          const businessName = lead.businessName || 'your business';

          let subject: string;
          let html: string;

          if (templateId) {
            subject = getTemplateSubject(templateId, firstName, businessName);
            html = getTemplateHtml(templateId, firstName, businessName);
          } else {
            subject = (customSubject || 'Message from Toast Capital')
              .replace(/{firstName}/g, firstName)
              .replace(/{businessName}/g, businessName);
            html = `<div style="font-family: Arial, sans-serif; padding: 20px;">
              ${(customContent || '')
                .replace(/{firstName}/g, firstName)
                .replace(/{businessName}/g, businessName)
                .replace(/\n/g, '<br>')}
            </div>`;
          }

          if (!subject || !html) {
            return { success: false, error: 'Invalid template' };
          }

          // Get or create token for this lead (AUTO-GENERATION!)
          const token = await getOrCreateTokenForLead(leadId);
          const tokenParam = token ? `?token=${token.token}` : '';

          // Replace all landing page links with tokenized versions
          html = html
            .replace(/https?:\/\/[^\/]+\/quote(?=["'\s>])/g, `https://${landingDomain}/quote${tokenParam}`)
            .replace(/https?:\/\/[^\/]+\/upload(?=["'\s>])/g, `https://${landingDomain}/upload${tokenParam}`)
            .replace(/https?:\/\/[^\/]+\/dlvc(?=["'\s>])/g, `https://${landingDomain}/dlvc${tokenParam}`);

          // Send email with dynamic from domain
          const result = await resend.emails.send({
            from: `Toast Capital Support <support@${sendFromDomain}>`,
            to: lead.email,
            bcc: `support@${sendFromDomain}`,
            subject: subject,
            html: html,
          });

          if (result.error) {
            return { success: false, error: (result.error as any).message };
          }

          return { success: true };
        } catch (error: any) {
          return { success: false, error: error.message };
        }
      });

      // Wait for all emails in this batch
      const batchResults = await Promise.all(batchPromises);

      // Count results
      for (const result of batchResults) {
        if (result.success) {
          results.success++;
        } else {
          results.failed++;
          if (result.error && results.errors.length < 10) {
            results.errors.push(result.error);
          }
        }
      }

      // Small delay between batches to avoid rate limiting
      if (batchIndex < batches.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    console.log(`📧 Bulk email complete: ${results.success} sent, ${results.failed} failed`);

    return NextResponse.json({
      success: true,
      sent: results.success,
      failed: results.failed,
      total: leadIds.length,
      errors: results.errors,
    });
  } catch (error: any) {
    console.error('Bulk email error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to send bulk emails' },
      { status: 500 }
    );
  }
}
