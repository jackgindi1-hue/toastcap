import { NextRequest, NextResponse } from 'next/server';
import { findLeadByEmail, findLeadByPhone, updateLead, createLead } from '@/lib/leads-db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Email template for JotForm submission (Application Submitted)
function getApplicationSubmittedEmail(firstName: string, businessName: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Toast Capital - Application Submitted</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f5;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f4f4f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">

          <!-- Logo Header -->
          <tr>
            <td style="padding: 32px 40px; text-align: center; background-color: #ffffff; border-bottom: 1px solid #e5e7eb;">
              <img src="https://toastcap.com/toast-capital-logo.png" alt="Toast Capital" width="200" style="display: block; margin: 0 auto; max-width: 200px; height: auto;">
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 40px;">
              <h1 style="margin: 0 0 8px; color: #1f2937; font-size: 26px; text-align: center; font-weight: 700;">
                Application Submitted!
              </h1>
              <p style="margin: 0 0 32px; color: #6b7280; font-size: 16px; text-align: center; line-height: 1.5;">
                Great progress, ${firstName}! You're almost there.
              </p>

              <!-- Progress Tracker -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 32px;">
                <tr>
                  <td align="center">
                    <table cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="text-align: center; padding: 0 8px;">
                          <div style="width: 40px; height: 40px; background-color: #FF6B35; border-radius: 50%; margin: 0 auto 8px; line-height: 40px; color: #ffffff; font-weight: bold; font-size: 16px;">✓</div>
                          <p style="margin: 0; font-size: 11px; color: #FF6B35; font-weight: 600;">COMPLETE</p>
                          <p style="margin: 4px 0 0; font-size: 12px; color: #374151;">Quote</p>
                        </td>
                        <td style="padding: 0 4px; vertical-align: top; padding-top: 18px;">
                          <div style="width: 40px; height: 3px; background-color: #FF6B35;"></div>
                        </td>
                        <td style="text-align: center; padding: 0 8px;">
                          <div style="width: 40px; height: 40px; background-color: #FF6B35; border-radius: 50%; margin: 0 auto 8px; line-height: 40px; color: #ffffff; font-weight: bold; font-size: 16px;">✓</div>
                          <p style="margin: 0; font-size: 11px; color: #FF6B35; font-weight: 600;">COMPLETE</p>
                          <p style="margin: 4px 0 0; font-size: 12px; color: #374151;">Application</p>
                        </td>
                        <td style="padding: 0 4px; vertical-align: top; padding-top: 18px;">
                          <div style="width: 40px; height: 3px; background-color: #e5e7eb;"></div>
                        </td>
                        <td style="text-align: center; padding: 0 8px;">
                          <div style="width: 40px; height: 40px; background-color: #FEF3C7; border: 2px solid #F59E0B; border-radius: 50%; margin: 0 auto 8px; line-height: 36px; color: #D97706; font-weight: bold; font-size: 16px;">3</div>
                          <p style="margin: 0; font-size: 11px; color: #D97706; font-weight: 600;">FINAL STEP</p>
                          <p style="margin: 4px 0 0; font-size: 12px; color: #6b7280;">Documents</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Confirmation Box -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #F0FDF4; border: 1px solid #BBF7D0; border-radius: 8px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 16px 20px;">
                    <p style="margin: 0 0 4px; color: #166534; font-size: 14px; font-weight: 600;">✓ What we received:</p>
                    <p style="margin: 0; color: #15803D; font-size: 14px;">Your verification has been completed successfully</p>
                  </td>
                </tr>
              </table>

              <!-- Next Step Box -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #FEF3C7; border: 1px solid #FCD34D; border-radius: 8px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 16px 20px;">
                    <p style="margin: 0 0 4px; color: #92400E; font-size: 14px; font-weight: 600;">→ Final Step Required:</p>
                    <p style="margin: 0; color: #B45309; font-size: 14px;">Upload your bank statements (3 months), Driver's License, and Void Check</p>
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 24px;">
                <tr>
                  <td align="center">
                    <a href="https://toastcap.com/dlvc" style="display: inline-block; background-color: #1E3A8A; color: #ffffff; font-weight: 600; font-size: 16px; padding: 16px 40px; border-radius: 8px; text-decoration: none;">
                      Upload Documents →
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 0; color: #6b7280; font-size: 14px; text-align: center;">
                Questions? Call us at <a href="tel:6175333190" style="color: #FF6B35; text-decoration: none; font-weight: 600;">(617) 533-3190</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px; background-color: #f9fafb; border-top: 1px solid #e5e7eb; text-align: center;">
              <p style="margin: 0 0 8px; color: #6b7280; font-size: 13px;">Toast Capital | 333 Summer Street, Boston, MA 02210</p>
              <p style="margin: 0; color: #9ca3af; font-size: 12px;">© 2026 Toast Capital. All rights reserved.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// Parse JotForm field names to extract data
function parseJotFormData(formData: Record<string, any>): {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  businessName: string;
  submissionId: string;
} {
  let firstName = '';
  let lastName = '';
  let email = '';
  let phone = '';
  let businessName = '';
  let submissionId = '';

  // JotForm sends data with various field naming conventions
  for (const [key, value] of Object.entries(formData)) {
    const keyLower = key.toLowerCase();
    const val = typeof value === 'string' ? value.trim() : '';

    // Submission ID
    if (keyLower === 'submissionid' || keyLower === 'submission_id') {
      submissionId = val;
    }

    // Name fields
    if (keyLower.includes('firstname') || keyLower.includes('first_name') || keyLower === 'name[first]' || keyLower === 'fullname[first]') {
      firstName = val || firstName;
    }
    if (keyLower.includes('lastname') || keyLower.includes('last_name') || keyLower === 'name[last]' || keyLower === 'fullname[last]') {
      lastName = val || lastName;
    }
    // Full name field (parse first/last)
    if ((keyLower === 'name' || keyLower === 'fullname') && typeof value === 'string' && !firstName) {
      const parts = value.trim().split(' ');
      firstName = parts[0] || '';
      lastName = parts.slice(1).join(' ') || '';
    }

    // Email
    if (keyLower.includes('email') && val.includes('@')) {
      email = val || email;
    }

    // Phone
    if (keyLower.includes('phone') || keyLower.includes('mobile') || keyLower.includes('cell')) {
      const cleanPhone = val.replace(/\D/g, '');
      if (cleanPhone.length >= 10) {
        phone = cleanPhone || phone;
      }
    }

    // Business name
    if (keyLower.includes('business') || keyLower.includes('company') || keyLower.includes('companyname')) {
      businessName = val || businessName;
    }
  }

  return { firstName, lastName, email, phone, businessName, submissionId };
}

// SECURITY: Verify JotForm webhook authenticity
// JotForm doesn't have built-in signatures, so we use a secret token in the webhook URL
function verifyJotFormWebhook(request: NextRequest): boolean {
  const webhookSecret = process.env.JOTFORM_WEBHOOK_SECRET;

  // If no secret configured, allow in development but warn
  if (!webhookSecret) {
    if (process.env.NODE_ENV === 'production') {
      console.warn('[Security] JOTFORM_WEBHOOK_SECRET not configured - rejecting in production');
      return false;
    }
    return true;
  }

  // Check for secret in query params or headers
  const url = new URL(request.url);
  const tokenFromQuery = url.searchParams.get('secret') || url.searchParams.get('token');
  const tokenFromHeader = request.headers.get('x-jotform-secret');

  const providedToken = tokenFromQuery || tokenFromHeader;

  if (!providedToken) {
    console.warn('[Security] JotForm webhook missing secret token');
    return false;
  }

  // Timing-safe comparison
  if (providedToken.length !== webhookSecret.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < providedToken.length; i++) {
    result |= providedToken.charCodeAt(i) ^ webhookSecret.charCodeAt(i);
  }
  return result === 0;
}

// Handle both GET and POST (JotForm can send either)
export async function GET(request: NextRequest) {
  return handleJotFormWebhook(request);
}

export async function POST(request: NextRequest) {
  return handleJotFormWebhook(request);
}

async function handleJotFormWebhook(request: NextRequest) {
  const timestamp = new Date().toISOString();

  // SECURITY: Verify webhook authenticity
  if (!verifyJotFormWebhook(request)) {
    console.warn('[Security] Invalid JotForm webhook - rejecting');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  console.log(`🔔 JotForm webhook received - ${timestamp}`);

  let leadId = '';
  let firstName = '';
  let lastName = '';
  let email = '';
  let phone = '';
  let businessName = '';
  let submissionId = '';

  try {
    // Parse the request body (JotForm sends form-urlencoded or JSON)
    let formData: Record<string, any> = {};

    const contentType = request.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      formData = await request.json();
    } else if (contentType.includes('application/x-www-form-urlencoded') || contentType.includes('multipart/form-data')) {
      const form = await request.formData();
      form.forEach((value, key) => {
        formData[key] = value;
      });
    } else {
      // Try to parse as JSON first, then as form data
      const text = await request.text();
      try {
        formData = JSON.parse(text);
      } catch {
        // Parse as query string
        const params = new URLSearchParams(text);
        params.forEach((value, key) => {
          formData[key] = value;
        });
      }
    }

    // Also check URL query params (JotForm sometimes sends data there)
    const url = new URL(request.url);
    url.searchParams.forEach((value, key) => {
      if (!formData[key]) {
        formData[key] = value;
      }
    });

    console.log('📋 Raw form data keys:', Object.keys(formData));

    // Parse the JotForm data
    const parsed = parseJotFormData(formData);
    firstName = parsed.firstName;
    lastName = parsed.lastName;
    email = parsed.email;
    phone = parsed.phone;
    businessName = parsed.businessName;
    submissionId = parsed.submissionId;

    console.log('📋 Parsed JotForm submission:');
    console.log(`   Submission ID: ${submissionId || 'N/A'}`);
    console.log(`   Name: ${firstName} ${lastName}`);
    console.log(`   Email: ${email}`);
    console.log(`   Phone: ${phone}`);
    console.log(`   Business: ${businessName}`);

    if (!email && !phone) {
      console.log('⚠️ No email or phone found in submission - cannot process');
      return NextResponse.json({ success: true, message: 'Received but no contact info' });
    }

    // Check if we've already processed this submission (deduplication)
    let existingLead = null;
    if (email) {
      existingLead = await findLeadByEmail(email);
    }
    if (!existingLead && phone) {
      existingLead = await findLeadByPhone(phone);
    }

    // Check if this lead already completed application stage recently (within 5 minutes)
    // This prevents duplicate emails if webhook fires multiple times
    if (existingLead?.applicationSubmittedAt) {
      const submittedAt = new Date(existingLead.applicationSubmittedAt);
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      if (submittedAt > fiveMinutesAgo) {
        console.log('⚠️ Duplicate submission detected (within 5 minutes) - skipping email');
        return NextResponse.json({
          success: true,
          message: 'Duplicate submission - already processed',
          leadId: existingLead.id
        });
      }
    }

    // Update or create lead
    if (existingLead) {
      await updateLead(existingLead.id, {
        firstName: firstName || existingLead.firstName,
        lastName: lastName || existingLead.lastName,
        email: email || existingLead.email,
        phone: phone || existingLead.phone,
        businessName: businessName || existingLead.businessName,
        stage: 'application',
        applicationSubmittedAt: new Date().toISOString(),
        jotformSubmissionId: submissionId,
      });
      leadId = existingLead.id;
      console.log('✅ Updated existing lead:', leadId);
    } else {
      const newLead = await createLead({
        firstName,
        lastName,
        email,
        phone,
        businessName,
        stage: 'application',
        status: 'new',
        applicationSubmittedAt: new Date().toISOString(),
        jotformSubmissionId: submissionId,
      });
      leadId = newLead.id;
      console.log('✅ Created new lead:', leadId);
    }

  } catch (error: any) {
    console.error('❌ Error processing webhook data:', error?.message);
    // Still try to continue - return success to prevent JotForm retries
  }

  // Send emails (wrapped in try/catch to prevent crashes)
  try {
    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey && apiKey !== 're_123456789_your_api_key_here' && apiKey.startsWith('re_')) {
      const { Resend } = await import('resend');
      const resend = new Resend(apiKey);

      // Send notification to support team
      const supportNotification = `
🔔 JOTFORM WEBHOOK - APPLICATION SUBMITTED

📋 APPLICANT INFORMATION:
NAME:            ${firstName || 'Not provided'} ${lastName || ''}
EMAIL:           ${email || 'Not provided'}
PHONE:           ${phone || 'Not provided'}
BUSINESS NAME:   ${businessName || 'Not provided'}
SUBMISSION ID:   ${submissionId || 'N/A'}
LEAD ID:         ${leadId}

📍 SOURCE:       JotForm Webhook (Server-side)
🕐 TIMESTAMP:    ${timestamp}

⚡ NEXT STEP: Customer needs to upload documents on /dlvc
      `;

      console.log('📧 Sending notification to support team...');
      const supportResult = await resend.emails.send({
        from: 'Toast Capital Support <support@toastcap.com>',
        to: 'support@toastcap.com',
        subject: `🔔 [WEBHOOK] Application: ${firstName} ${lastName}${businessName ? ` - ${businessName}` : ''}`,
        text: supportNotification,
        replyTo: email || undefined,
      });

      if (supportResult.error) {
        console.error('❌ Support email error:', supportResult.error);
      } else {
        console.log('✅ Support notification sent! ID:', supportResult.data?.id);
      }

      // Send confirmation to applicant
      if (email) {
        console.log('📧 Sending confirmation email to:', email);
        const applicantResult = await resend.emails.send({
          from: 'Toast Capital Support <support@toastcap.com>',
          to: email,
          bcc: 'support@toastcap.com',
          subject: `Application Submitted${firstName ? ` - ${firstName}` : ''}, One More Step!`,
          html: getApplicationSubmittedEmail(firstName || 'Valued Customer', businessName || ''),
          text: `Dear ${firstName || 'Valued Customer'},\n\nYour application has been submitted successfully!\n\nFinal Step: Upload your documents\n- 3 months of bank statements\n- Driver's License\n- Void Check\n\nUpload here: https://toastcap.com/dlvc\n\nQuestions? Call us at (617) 533-3190\n\nBest regards,\nToast Capital Team`,
        });

        if (applicantResult.error) {
          console.error('❌ Applicant email error:', applicantResult.error);
        } else {
          console.log('✅ Applicant confirmation sent! ID:', applicantResult.data?.id);
        }
      }
    } else {
      console.log('⚠️ RESEND_API_KEY not configured - skipping emails');
    }
  } catch (emailError: any) {
    console.error('⚠️ Email sending failed (non-fatal):', emailError?.message);
    // Don't throw - continue and return success
  }

  // Send SMS to applicant only (no team notification)
  if (phone) {
    try {
      const { sendSMS } = await import('@/lib/sms');
      console.log('📱 Sending SMS to applicant...');
      await sendSMS({
        to: phone,
        message: `Hi ${firstName || 'there'}! Your Toast Capital application is submitted. Final step: upload your documents at toastcap.com/dlvc. Questions? Call (617) 533-3190`,
      });
      console.log('✅ SMS sent to applicant!');
    } catch (smsError: any) {
      console.error('⚠️ SMS error (non-fatal):', smsError?.message);
      // Don't throw - continue and return success
    }
  }

  console.log(`${'='.repeat(60)}`);
  console.log('✅ JOTFORM WEBHOOK PROCESSED SUCCESSFULLY');
  console.log(`${'='.repeat(60)}\n`);

  return NextResponse.json({
    success: true,
    message: 'JotForm submission processed',
    leadId,
  });
}
