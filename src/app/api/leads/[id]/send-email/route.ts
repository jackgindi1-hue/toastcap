import { NextRequest, NextResponse } from 'next/server';
import { getLead, createMessage } from '@/lib/leads-db';
import { trackEmailEvent } from '@/lib/analytics-db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// POST /api/leads/[id]/send-email - Send email to a lead
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { subject, content, html, template } = await request.json();

    // Get the lead
    const lead = await getLead(id);
    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    if (!lead.email) {
      return NextResponse.json({ error: 'Lead has no email address' }, { status: 400 });
    }

    // Get email content (from template or custom)
    let emailSubject = subject;
    let emailHtml = html || content;
    const templateId = template || 'custom';
    const templateName = template ? getTemplateName(template) : 'Custom Email';

    if (template) {
      const templateData = getEmailTemplate(template, lead);
      emailSubject = templateData.subject;
      emailHtml = templateData.html;
    }

    if (!emailSubject || !emailHtml) {
      return NextResponse.json({ error: 'Email subject and content are required' }, { status: 400 });
    }

    // Send email via Resend
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey || !apiKey.startsWith('re_')) {
      return NextResponse.json({ error: 'Email service not configured' }, { status: 500 });
    }

    const { Resend } = await import('resend');
    const resend = new Resend(apiKey);

    // Create message ID for tracking
    const messageId = `${id}-${Date.now()}`;

    // Add tracking pixel for open tracking with template info
    const trackingParams = new URLSearchParams({
      mid: messageId,
      tid: templateId,
      tn: templateName,
    });
    const trackingPixel = `<img src="${process.env.NEXT_PUBLIC_SITE_URL || 'https://toastcapital.com'}/api/track/open?${trackingParams.toString()}" width="1" height="1" style="display:none" />`;
    const htmlWithTracking = emailHtml + trackingPixel;

    const result = await resend.emails.send({
      from: 'Toast Capital <support@toastcapital.com>',
      to: lead.email,
      subject: emailSubject,
      html: htmlWithTracking,
    });

    if (result.error) {
      console.error('Resend error:', result.error);
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }

    // Log the message
    const msgRecord = await createMessage({
      leadId: id,
      type: 'email',
      subject: emailSubject,
      content: emailHtml,
      resendEmailId: result.data?.id,
    });

    // Track email sent event for analytics
    try {
      await trackEmailEvent({
        leadId: id,
        messageId: messageId,
        templateId: templateId,
        templateName: templateName,
        subject: emailSubject,
        eventType: 'sent',
      });
    } catch (trackError) {
      console.error('Failed to track email event:', trackError);
      // Don't fail the request if tracking fails
    }

    return NextResponse.json({
      success: true,
      message: msgRecord,
      emailId: result.data?.id,
    });
  } catch (error: any) {
    console.error('Error sending email:', error);
    return NextResponse.json({ error: error.message || 'Failed to send email' }, { status: 500 });
  }
}

// Email Templates (includes both individual and campaign templates)
function getEmailTemplate(templateId: string, lead: any): { subject: string; html: string } {
  const firstName = lead.firstName || 'Valued Customer';
  const businessName = lead.businessName || 'your business';

  const templates: Record<string, { subject: string; html: string }> = {
    // Individual lead templates
    'follow_up': {
      subject: `${firstName}, following up on your Toast Capital application`,
      html: getFollowUpHtml(firstName, businessName),
    },
    'docs_reminder': {
      subject: `${firstName}, we still need your documents`,
      html: getDocsReminderHtml(firstName, businessName),
    },
    'approval': {
      subject: `Great news ${firstName}! Your funding is approved!`,
      html: getApprovalHtml(firstName, businessName),
    },
    'checking_in': {
      subject: `${firstName}, checking in on your application`,
      html: getCheckingInHtml(firstName, businessName),
    },

    // Campaign templates (cold outreach)
    'cold_approved': {
      subject: `${firstName}, You've Been Approved for a Toast Lending Offer!`,
      html: getColdApprovedHtml(firstName, businessName),
    },
    'cold_unlocked': {
      subject: `${firstName}, You've Unlocked a Special Funding Offer!`,
      html: getColdUnlockedHtml(firstName, businessName),
    },
    'cold_invited': {
      subject: `${firstName}, You've been invited to apply for a Toast Capital Loan`,
      html: getColdInvitedHtml(firstName, businessName),
    },
    'cold_limited': {
      subject: `${firstName}, Don't Miss Out on This Opportunity`,
      html: getColdLimitedHtml(firstName, businessName),
    },
    'cold_question': {
      subject: `Quick question for you, ${firstName}`,
      html: getColdQuestionHtml(firstName, businessName),
    },
    'cold_growth': {
      subject: `What Could ${businessName} Accomplish With Extra Capital?`,
      html: getColdGrowthHtml(firstName, businessName),
    },
    'cold_potential': {
      subject: `What's holding ${businessName} back from its next level?`,
      html: getColdPotentialHtml(firstName, businessName),
    },
    'cold_60sec': {
      subject: '60 seconds to see your funding offer',
      html: getCold60SecHtml(firstName, businessName),
    },
    'cold_seasonal': {
      subject: `Peak season is coming. Is ${businessName} ready?`,
      html: getColdSeasonalHtml(firstName, businessName),
    },
  };

  return templates[templateId] || { subject: '', html: '' };
}

function getFollowUpHtml(firstName: string, businessName: string): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <img src="https://toastcapital.com/toast-capital-logo.png" alt="Toast Capital" width="180" style="margin-bottom: 20px;">
  <p>Hi ${firstName},</p>
  <p>I wanted to follow up on your funding application for <strong>${businessName}</strong>.</p>
  <p>We're here to help you get the capital you need quickly and easily. If you have any questions or need assistance completing your application, please don't hesitate to reach out.</p>
  <p>Call us at <a href="tel:6175333190" style="color: #FF6B35;">(617) 533-3190</a> or reply to this email.</p>
  <p>Best regards,<br>The Toast Capital Team</p>
</body>
</html>`;
}

function getDocsReminderHtml(firstName: string, businessName: string): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <img src="https://toastcapital.com/toast-capital-logo.png" alt="Toast Capital" width="180" style="margin-bottom: 20px;">
  <p>Hi ${firstName},</p>
  <p>We're still waiting on your documents to complete the funding application for <strong>${businessName}</strong>.</p>
  <p>To continue, please upload:</p>
  <ul>
    <li>3 months of bank statements</li>
    <li>Driver's License</li>
    <li>Void Check</li>
  </ul>
  <p><a href="https://toastcapital.com/dlvc" style="display: inline-block; background: #1E3A8A; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Upload Documents</a></p>
  <p>Questions? Call us at <a href="tel:6175333190" style="color: #FF6B35;">(617) 533-3190</a></p>
  <p>Best regards,<br>The Toast Capital Team</p>
</body>
</html>`;
}

function getApprovalHtml(firstName: string, businessName: string): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <img src="https://toastcapital.com/toast-capital-logo.png" alt="Toast Capital" width="180" style="margin-bottom: 20px;">
  <div style="background: #F0FDF4; border: 2px solid #22C55E; border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 20px;">
    <h1 style="color: #166534; margin: 0;">Congratulations!</h1>
    <p style="color: #15803D; margin: 10px 0 0;">Your funding has been approved!</p>
  </div>
  <p>Hi ${firstName},</p>
  <p>Great news! Your funding application for <strong>${businessName}</strong> has been approved.</p>
  <p>Our team will be calling you shortly to discuss the next steps and finalize your funding agreement.</p>
  <p>If you'd like to speed things up, give us a call at <a href="tel:6175333190" style="color: #FF6B35;">(617) 533-3190</a>.</p>
  <p>Congratulations again!<br>The Toast Capital Team</p>
</body>
</html>`;
}

function getCheckingInHtml(firstName: string, businessName: string): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <img src="https://toastcapital.com/toast-capital-logo.png" alt="Toast Capital" width="180" style="margin-bottom: 20px;">
  <p>Hi ${firstName},</p>
  <p>Just checking in on your Toast Capital application for <strong>${businessName}</strong>.</p>
  <p>Is there anything we can help with? Any questions about the process?</p>
  <p>We're here to make funding easy for you. Call us anytime at <a href="tel:6175333190" style="color: #FF6B35;">(617) 533-3190</a> or reply to this email.</p>
  <p>Looking forward to hearing from you!<br>The Toast Capital Team</p>
</body>
</html>`;
}

// ============================================
// CAMPAIGN EMAIL TEMPLATES (Cold Outreach)
// ============================================

function getColdApprovedHtml(firstName: string, businessName: string): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f5;">
  <div style="background: white; border-radius: 12px; padding: 40px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
    <img src="https://toastcapital.com/toast-capital-logo.png" alt="Toast Capital" width="180" style="margin-bottom: 20px;">
    <div style="background: linear-gradient(135deg, #FF6B35 0%, #FF8F5E 100%); padding: 16px; text-align: center; border-radius: 8px; margin-bottom: 24px;">
      <p style="margin: 0; color: white; font-weight: 600; letter-spacing: 1px;">CONGRATULATIONS!</p>
    </div>
    <h1 style="color: #1f2937; font-size: 24px; margin-bottom: 16px;">${firstName}, You've Been Approved for a Toast Lending Offer!</h1>
    <p style="color: #6b7280; line-height: 1.6;">Based on your recent revenue processed through your Toast POS, <strong style="color: #1f2937;">${businessName}</strong> has been approved for funding!</p>
    <div style="background: #F0FDF4; border: 2px solid #22C55E; border-radius: 12px; padding: 24px; text-align: center; margin: 24px 0;">
      <p style="margin: 0 0 8px; color: #166534; font-size: 14px; font-weight: 600;">YOUR PRE-APPROVED AMOUNT</p>
      <p style="margin: 0; color: #15803D; font-size: 32px; font-weight: 700;">Up to $250,000</p>
    </div>
    <p style="text-align: center;"><a href="https://toastcapital.com/quote" style="display: inline-block; background: #1E3A8A; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600;">See My Approved Amount →</a></p>
    <p style="color: #9ca3af; font-size: 14px; text-align: center; margin-top: 24px;">No cost to apply • No obligation • No credit impact</p>
  </div>
</body>
</html>`;
}

function getColdUnlockedHtml(firstName: string, businessName: string): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f5;">
  <div style="background: white; border-radius: 12px; padding: 40px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
    <img src="https://toastcapital.com/toast-capital-logo.png" alt="Toast Capital" width="180" style="margin-bottom: 20px;">
    <div style="background: linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%); padding: 16px; text-align: center; border-radius: 8px; margin-bottom: 24px;">
      <p style="margin: 0; color: white; font-weight: 600; letter-spacing: 1px;">EXCLUSIVE ACCESS UNLOCKED</p>
    </div>
    <h1 style="color: #1f2937; font-size: 24px; margin-bottom: 16px;">${firstName}, You've Unlocked a Special Funding Offer!</h1>
    <p style="color: #6b7280; line-height: 1.6;">As a valued Toast customer, <strong style="color: #1f2937;">${businessName}</strong> has unlocked exclusive access to Toast Capital funding.</p>
    <div style="background: #EFF6FF; border: 2px solid #3B82F6; border-radius: 12px; padding: 24px; margin: 24px 0;">
      <p style="margin: 0 0 8px; color: #1E40AF; font-size: 14px; font-weight: 600; text-align: center;">WHAT YOU'VE UNLOCKED</p>
      <div style="display: flex; justify-content: space-around; text-align: center;">
        <div><p style="margin: 0; color: #1E3A8A; font-size: 24px; font-weight: 700;">$2K-$2M</p><p style="margin: 0; color: #6b7280; font-size: 12px;">Funding Range</p></div>
        <div><p style="margin: 0; color: #1E3A8A; font-size: 24px; font-weight: 700;">Next Day</p><p style="margin: 0; color: #6b7280; font-size: 12px;">Funding Speed</p></div>
      </div>
    </div>
    <p style="text-align: center;"><a href="https://toastcapital.com/quote" style="display: inline-block; background: #1E3A8A; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600;">Check My Offer →</a></p>
  </div>
</body>
</html>`;
}

function getColdInvitedHtml(firstName: string, businessName: string): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f5;">
  <div style="background: white; border-radius: 12px; padding: 40px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
    <img src="https://toastcapital.com/toast-capital-logo.png" alt="Toast Capital" width="180" style="margin-bottom: 20px;">
    <p style="color: #6b7280;">Hi ${firstName},</p>
    <p style="color: #6b7280;">I'm reaching out from <strong style="color: #1f2937;">Toast Capital</strong>.</p>
    <h1 style="color: #1f2937; font-size: 24px; margin: 20px 0;">You've been invited to apply for a Toast Capital Loan</h1>
    <p style="color: #6b7280; line-height: 1.6;">Based on your recent revenue processed through your Toast POS, <strong style="color: #1f2937;">${businessName}</strong> has been pre-selected for our exclusive lending program.</p>
    <div style="background: linear-gradient(135deg, #1f2937 0%, #374151 100%); border-radius: 12px; padding: 24px; text-align: center; margin: 24px 0;">
      <p style="margin: 0 0 8px; color: #9ca3af; font-size: 12px; letter-spacing: 1px;">YOU'RE INVITED TO ACCESS</p>
      <p style="margin: 0; color: white; font-size: 28px; font-weight: 700;">Up to $2,000,000</p>
      <p style="margin: 0; color: #9ca3af; font-size: 14px;">in business funding</p>
    </div>
    <p style="text-align: center;"><a href="https://toastcapital.com/quote" style="display: inline-block; background: #FF6B35; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600;">Accept Invitation →</a></p>
    <p style="color: #9ca3af; font-size: 13px; text-align: center;">Takes less than 2 minutes to see your offer</p>
  </div>
</body>
</html>`;
}

function getColdLimitedHtml(firstName: string, businessName: string): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f5;">
  <div style="background: white; border-radius: 12px; padding: 40px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
    <img src="https://toastcapital.com/toast-capital-logo.png" alt="Toast Capital" width="180" style="margin-bottom: 20px;">
    <div style="background: #DC2626; padding: 12px; text-align: center; border-radius: 8px; margin-bottom: 24px;">
      <p style="margin: 0; color: white; font-weight: 600; letter-spacing: 1px;">LIMITED TIME: SPECIAL RATES AVAILABLE</p>
    </div>
    <h1 style="color: #1f2937; font-size: 24px; margin-bottom: 16px;">${firstName}, Don't Miss Out on This Opportunity</h1>
    <p style="color: #6b7280; line-height: 1.6;">Toast Capital is offering <strong style="color: #DC2626;">special rates</strong> for qualified Toast merchants this month. Based on your POS activity, <strong style="color: #1f2937;">${businessName}</strong> may qualify.</p>
    <div style="background: #FEF2F2; border: 2px solid #DC2626; border-radius: 12px; padding: 24px; text-align: center; margin: 24px 0;">
      <p style="margin: 0 0 8px; color: #991B1B; font-size: 14px; font-weight: 600;">THIS MONTH ONLY</p>
      <p style="margin: 0; color: #DC2626; font-size: 24px; font-weight: 700;">Reduced Fees + Faster Approval</p>
    </div>
    <p style="text-align: center;"><a href="https://toastcapital.com/quote" style="display: inline-block; background: #DC2626; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600;">Check My Special Rate →</a></p>
  </div>
</body>
</html>`;
}

function getColdQuestionHtml(firstName: string, businessName: string): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f5;">
  <div style="background: white; border-radius: 12px; padding: 40px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
    <img src="https://toastcapital.com/toast-capital-logo.png" alt="Toast Capital" width="180" style="margin-bottom: 20px;">
    <p style="color: #6b7280; font-size: 16px;">Hi ${firstName},</p>
    <p style="color: #374151; font-size: 16px;">Quick question for you:</p>
    <h1 style="color: #1f2937; font-size: 22px; line-height: 1.4; margin: 20px 0;">If you could access up to $250,000 for ${businessName} with no credit impact and no obligation... would you at least want to see the offer?</h1>
    <p style="color: #374151; font-size: 16px; line-height: 1.7;">Most restaurant owners say yes. Even if you don't need capital right now, knowing what you qualify for is valuable information.</p>
    <div style="background: #f9fafb; border-radius: 8px; padding: 20px; margin: 24px 0;">
      <p style="margin: 0 0 8px; color: #1f2937; font-weight: 600;">Here's the deal:</p>
      <p style="margin: 0 0 8px; color: #374151;">• Takes 2 minutes to check</p>
      <p style="margin: 0 0 8px; color: #374151;">• No cost whatsoever</p>
      <p style="margin: 0 0 8px; color: #374151;">• No obligation to accept</p>
      <p style="margin: 0; color: #374151;">• Zero impact on your credit score</p>
    </div>
    <p style="text-align: center;"><a href="https://toastcapital.com/quote" style="display: inline-block; background: #1E3A8A; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600;">Yes, Show Me My Offer →</a></p>
    <p style="color: #9ca3af; font-size: 14px; text-align: center;">(No spam, no pressure, just your numbers)</p>
  </div>
</body>
</html>`;
}

function getColdGrowthHtml(firstName: string, businessName: string): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f5;">
  <div style="background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
    <div style="background: linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%); padding: 32px; text-align: center;">
      <p style="margin: 0 0 8px; color: #93C5FD; font-size: 14px; letter-spacing: 1px;">FUEL YOUR NEXT CHAPTER</p>
      <h1 style="margin: 0; color: white; font-size: 24px;">What Could ${businessName} Accomplish With Extra Capital?</h1>
    </div>
    <div style="padding: 40px;">
      <img src="https://toastcapital.com/toast-capital-logo.png" alt="Toast Capital" width="150" style="margin-bottom: 20px;">
      <p style="color: #374151; font-size: 16px; line-height: 1.7;">Hi ${firstName}, whether you're dreaming of a second location, upgrading your kitchen, hiring more staff, or just want a cash cushion for peace of mind — Toast Capital can help make it happen.</p>
      <div style="background: #1f2937; border-radius: 12px; padding: 24px; text-align: center; margin: 24px 0;">
        <p style="margin: 0 0 4px; color: #9ca3af; font-size: 13px;">BASED ON YOUR TOAST REVENUE</p>
        <p style="margin: 0 0 8px; color: white; font-size: 24px; font-weight: 700;">You May Qualify for Up to $500,000</p>
        <p style="margin: 0; color: #9ca3af; font-size: 14px;">Funding available as fast as next business day</p>
      </div>
      <p style="text-align: center;"><a href="https://toastcapital.com/quote" style="display: inline-block; background: #FF6B35; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600;">See What I Qualify For →</a></p>
    </div>
  </div>
</body>
</html>`;
}

function getColdPotentialHtml(firstName: string, businessName: string): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f5;">
  <div style="background: white; border-radius: 12px; padding: 40px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
    <img src="https://toastcapital.com/toast-capital-logo.png" alt="Toast Capital" width="180" style="margin-bottom: 20px;">
    <p style="color: #6b7280;">Hi ${firstName},</p>
    <h1 style="color: #1f2937; font-size: 24px; margin: 16px 0;">What's holding ${businessName} back from its next level?</h1>
    <p style="color: #374151; font-size: 16px; line-height: 1.7;">Every restaurant has that one thing they'd do if capital wasn't a barrier. What's yours?</p>
    <div style="margin: 24px 0;">
      <div style="padding: 16px; background: #FFF7ED; border-radius: 8px; border-left: 4px solid #FF6B35; margin-bottom: 12px;">
        <p style="margin: 0 0 4px; color: #9A3412; font-weight: 700;">Expand Your Space</p>
        <p style="margin: 0; color: #C2410C; font-size: 14px;">Patio seating, private dining room, or a second location</p>
      </div>
      <div style="padding: 16px; background: #F0FDF4; border-radius: 8px; border-left: 4px solid #22C55E; margin-bottom: 12px;">
        <p style="margin: 0 0 4px; color: #166534; font-weight: 700;">Upgrade Your Kitchen</p>
        <p style="margin: 0; color: #15803D; font-size: 14px;">New equipment that speeds up service and reduces waste</p>
      </div>
      <div style="padding: 16px; background: #EFF6FF; border-radius: 8px; border-left: 4px solid #1E3A8A;">
        <p style="margin: 0 0 4px; color: #1E40AF; font-weight: 700;">Build Your Team</p>
        <p style="margin: 0; color: #1E3A8A; font-size: 14px;">Hire key staff and invest in training that pays dividends</p>
      </div>
    </div>
    <p style="text-align: center;"><a href="https://toastcapital.com/quote" style="display: inline-block; background: #FF6B35; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600;">See What I Qualify For →</a></p>
  </div>
</body>
</html>`;
}

function getCold60SecHtml(firstName: string, businessName: string): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f5;">
  <div style="background: white; border-radius: 12px; padding: 40px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
    <img src="https://toastcapital.com/toast-capital-logo.png" alt="Toast Capital" width="180" style="margin-bottom: 20px;">
    <p style="color: #6b7280; font-size: 16px;">${firstName},</p>
    <h1 style="color: #1f2937; font-size: 48px; text-align: center; margin: 24px 0;">60 seconds.</h1>
    <p style="color: #374151; font-size: 18px; text-align: center; line-height: 1.6;">That's all it takes to see if ${businessName} qualifies for up to <strong style="color: #FF6B35;">$500,000</strong> in funding.</p>
    <div style="text-align: center; padding: 24px 0;">
      <p style="margin: 8px 0; color: #22C55E; font-size: 18px;">✓ No cost</p>
      <p style="margin: 8px 0; color: #22C55E; font-size: 18px;">✓ No obligation</p>
      <p style="margin: 8px 0; color: #22C55E; font-size: 18px;">✓ No credit impact</p>
    </div>
    <p style="text-align: center;"><a href="https://toastcapital.com/quote" style="display: inline-block; background: #1E3A8A; color: white; padding: 16px 40px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 18px;">Check My Offer →</a></p>
    <p style="color: #9ca3af; font-size: 14px; text-align: center; margin-top: 16px;">Seriously, that's it. 60 seconds.</p>
  </div>
</body>
</html>`;
}

function getColdSeasonalHtml(firstName: string, businessName: string): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f5;">
  <div style="background: white; border-radius: 12px; padding: 40px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
    <img src="https://toastcapital.com/toast-capital-logo.png" alt="Toast Capital" width="180" style="margin-bottom: 20px;">
    <div style="background: linear-gradient(135deg, #059669 0%, #10B981 100%); padding: 16px; text-align: center; border-radius: 8px; margin-bottom: 24px;">
      <p style="margin: 0; color: white; font-weight: 600; letter-spacing: 1px;">PREPARE FOR YOUR BUSIEST SEASON</p>
    </div>
    <p style="color: #6b7280;">Hi ${firstName},</p>
    <h1 style="color: #1f2937; font-size: 24px; margin: 16px 0;">Peak season is coming. Is ${businessName} ready?</h1>
    <p style="color: #374151; font-size: 16px; line-height: 1.7;">Smart restaurant owners prepare <em>before</em> the rush hits. Whether it's summer patios, holiday catering, or weekend brunch crowds—now is the time to gear up.</p>
    <div style="background: #F0FDF4; border-radius: 12px; padding: 24px; margin: 24px 0;">
      <p style="margin: 0 0 12px; color: #166534; font-weight: 700;">Get ahead of the season:</p>
      <p style="margin: 0 0 6px; color: #15803D;">→ Stock up on inventory before prices spike</p>
      <p style="margin: 0 0 6px; color: #15803D;">→ Hire and train staff ahead of time</p>
      <p style="margin: 0 0 6px; color: #15803D;">→ Upgrade equipment before the crunch</p>
      <p style="margin: 0; color: #15803D;">→ Launch marketing campaigns early</p>
    </div>
    <p style="text-align: center;"><a href="https://toastcapital.com/quote" style="display: inline-block; background: #059669; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600;">Prepare for Peak Season →</a></p>
  </div>
</body>
</html>`;
}

// Helper to get template names for analytics
function getTemplateName(templateId: string): string {
  const templateNames: Record<string, string> = {
    'follow_up': 'Follow Up',
    'docs_reminder': 'Docs Reminder',
    'approval': 'Approval Notice',
    'checking_in': 'Checking In',
    'cold_approved': "You've Been Approved",
    'cold_unlocked': "You've Unlocked Access",
    'cold_invited': "You've Been Invited",
    'cold_limited': 'Limited Time Offer',
    'cold_question': 'Quick Question',
    'cold_growth': 'Fuel Your Growth',
    'cold_potential': 'Growth Potential',
    'cold_60sec': '60-Second Offer',
    'cold_seasonal': 'Seasonal Opportunity',
  };
  return templateNames[templateId] || templateId;
}
