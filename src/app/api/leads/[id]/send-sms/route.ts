import { NextRequest, NextResponse } from 'next/server';
import { getLead, createMessage, updateMessageStatus } from '@/lib/leads-db';
import { sendSMS } from '@/lib/sms';
import { trackSmsEvent } from '@/lib/analytics-db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// POST /api/leads/[id]/send-sms - Send SMS to a lead
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { message, template } = await request.json();

    // Get the lead
    const lead = await getLead(id);
    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    if (!lead.phone) {
      return NextResponse.json({ error: 'Lead has no phone number' }, { status: 400 });
    }

    // Get message content (from template or custom)
    let messageContent = message;
    const templateId = template || 'custom';
    const templateName = template ? getSmsTemplateName(template) : 'Custom SMS';

    if (template) {
      messageContent = getSmsTemplate(template, lead);
    }

    if (!messageContent || !messageContent.trim()) {
      return NextResponse.json({ error: 'Message content is required' }, { status: 400 });
    }

    // Send SMS via Twilio
    const result = await sendSMS({
      to: lead.phone,
      message: messageContent,
    });

    // Log the message
    const msgRecord = await createMessage({
      leadId: id,
      type: 'sms',
      content: messageContent,
      twilioSid: result?.messageId,
    });

    // Update status based on Twilio response
    if (result?.success && result?.messageId) {
      await updateMessageStatus(msgRecord.id, 'delivered', new Date().toISOString());
    }

    // Track SMS sent event for analytics
    try {
      await trackSmsEvent({
        leadId: id,
        messageId: msgRecord.id,
        templateId: templateId,
        templateName: templateName,
        eventType: result?.success ? 'sent' : 'failed',
      });

      // If delivered, track that too
      if (result?.success && result?.messageId) {
        await trackSmsEvent({
          leadId: id,
          messageId: msgRecord.id,
          templateId: templateId,
          templateName: templateName,
          eventType: 'delivered',
        });
      }
    } catch (trackError) {
      console.error('Failed to track SMS event:', trackError);
      // Don't fail the request if tracking fails
    }

    return NextResponse.json({
      success: result?.success || false,
      message: msgRecord,
      twilioSid: result?.messageId,
    });
  } catch (error: any) {
    console.error('Error sending SMS:', error);
    return NextResponse.json({ error: error.message || 'Failed to send SMS' }, { status: 500 });
  }
}

// SMS Templates (includes both individual and campaign templates)
function getSmsTemplate(templateId: string, lead: any): string {
  const firstName = lead.firstName || 'there';
  const businessName = lead.businessName || 'your business';

  const templates: Record<string, string> = {
    // Individual lead templates
    'follow_up': `Hi ${firstName}! This is Toast Capital following up on your funding application for ${businessName}. Give us a call at (617) 533-3190 when you have a moment!`,
    'docs_reminder': `Hi ${firstName}! We're still waiting on your documents to complete your funding application for ${businessName}. Upload them here: toastcapital.com/dlvc`,
    'approval': `Great news ${firstName}! Your funding for ${businessName} has been approved! Call us at (617) 533-3190 to finalize.`,
    'checking_in': `Hi ${firstName}, just checking in on your Toast Capital application. Any questions? Call us: (617) 533-3190`,
    'thank_you': `Thank you ${firstName} for completing your application! Our team is reviewing it now and will be in touch shortly. - Toast Capital`,

    // Campaign templates
    'cold_outreach': `Hi ${firstName}! Toast Capital here. Based on your Toast POS activity, ${businessName} may qualify for up to $250,000 in funding. No cost to check! Call us: (617) 533-3190`,
    'follow_up_quote': `Hi ${firstName}! You started a funding application for ${businessName} but haven't completed it yet. Finish in 2 minutes: toastcapital.com/upload - Questions? (617) 533-3190`,
    'special_offer': `${firstName}, special offer for ${businessName}! Apply this week for reduced fees + priority processing. Limited time: toastcapital.com/quote - Call: (617) 533-3190`,
    'seasonal': `Hi ${firstName}! Peak season is coming - is ${businessName} ready? Get funded now to stock up & hire. Check your offer: toastcapital.com/quote`,
  };

  return templates[templateId] || '';
}

// Helper to get SMS template names for analytics
function getSmsTemplateName(templateId: string): string {
  const templateNames: Record<string, string> = {
    'follow_up': 'Follow Up',
    'docs_reminder': 'Docs Reminder',
    'approval': 'Approval Notice',
    'checking_in': 'Checking In',
    'thank_you': 'Thank You',
    'cold_outreach': 'Cold Outreach',
    'follow_up_quote': 'Follow Up Quote',
    'special_offer': 'Special Offer',
    'seasonal': 'Seasonal Prep',
  };
  return templateNames[templateId] || templateId;
}
