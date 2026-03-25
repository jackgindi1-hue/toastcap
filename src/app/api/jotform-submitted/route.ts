import { NextRequest, NextResponse } from 'next/server';
import { sendSMS } from '@/lib/sms';
import { findLeadByEmail, findLeadByPhone, updateLead, createLead, Lead } from '@/lib/leads-db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Email template for Application Submitted (after JotForm on /upload)
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
              <img src="https://toastcapital.com/toast-capital-logo.png" alt="Toast Capital" width="200" style="display: block; margin: 0 auto; max-width: 200px; height: auto;">
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
                    <a href="https://toastcapital.com/dlvc" style="display: inline-block; background-color: #1E3A8A; color: #ffffff; font-weight: 600; font-size: 16px; padding: 16px 40px; border-radius: 8px; text-decoration: none;">
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

export async function POST(request: NextRequest) {
  const timestamp = new Date().toISOString();

  try {
    console.log('\n' + '='.repeat(60));
    console.log('📥 JOTFORM-SUBMITTED API CALLED (Client-side) -', timestamp);
    console.log('='.repeat(60));

    const body = await request.json();
    const {
      firstName = '',
      lastName = '',
      email = '',
      phone = '',
      businessName = '',
      source = 'client', // Track where the call came from
    } = body;

    console.log('📋 JotForm submission data:');
    console.log(`   Source: ${source}`);
    console.log(`   Name: ${firstName} ${lastName}`);
    console.log(`   Email: ${email}`);
    console.log(`   Phone: ${phone}`);
    console.log(`   Business: ${businessName}`);

    // ============================================
    // DEDUPLICATION CHECK
    // ============================================
    // Check if we've already processed this lead recently (webhook may have fired first)
    let existingLead: Lead | null = null;
    let skipEmails = false;

    try {
      if (email) {
        existingLead = await findLeadByEmail(email);
      }
      if (!existingLead && phone) {
        existingLead = await findLeadByPhone(phone);
      }

      if (existingLead?.applicationSubmittedAt) {
        const submittedAt = new Date(existingLead.applicationSubmittedAt);
        const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);

        if (submittedAt > twoMinutesAgo) {
          console.log('⚠️ Duplicate detected - application already processed within 2 minutes');
          console.log(`   Previous submission: ${existingLead.applicationSubmittedAt}`);
          console.log('   Skipping emails to prevent duplicates');
          skipEmails = true;
        }
      }
    } catch (leadCheckError: any) {
      console.error('⚠️ Lead check error (non-fatal):', leadCheckError?.message);
    }

    // ============================================
    // UPDATE LEAD IN DATABASE
    // ============================================
    let leadId = '';
    try {
      if (existingLead) {
        // Only update if not recently processed
        if (!skipEmails) {
          await updateLead(existingLead.id, {
            firstName: firstName || existingLead.firstName,
            lastName: lastName || existingLead.lastName,
            email: email || existingLead.email,
            phone: phone || existingLead.phone,
            businessName: businessName || existingLead.businessName,
            stage: 'application',
            applicationSubmittedAt: new Date().toISOString(),
          });
          console.log('✅ Updated lead to application stage:', existingLead.id);
        }
        leadId = existingLead.id;
      } else if (email || phone) {
        // Create new lead at application stage
        const newLead = await createLead({
          firstName,
          lastName,
          email,
          phone,
          businessName,
          stage: 'application',
          status: 'new',
          applicationSubmittedAt: new Date().toISOString(),
        });
        leadId = newLead.id;
        console.log('✅ Created new lead at application stage:', newLead.id);
      }
    } catch (leadError: any) {
      console.error('⚠️ Failed to update lead (non-fatal):', leadError?.message);
    }

    // If emails already sent by webhook, skip
    if (skipEmails) {
      console.log('📧 Skipping emails - already sent by webhook');
      return NextResponse.json({
        success: true,
        message: 'Duplicate - emails already sent',
        leadId,
        skipped: true,
      });
    }

    // Current timestamp for notification
    const submittedAt = new Date().toLocaleString('en-US', {
      timeZone: 'America/New_York',
      dateStyle: 'full',
      timeStyle: 'long'
    });

    // Format notification for support team
    const supportNotification = `
═══════════════════════════════════════════════════════════════
🎯 JOTFORM APPLICATION SUBMITTED
═══════════════════════════════════════════════════════════════

📋 APPLICANT INFORMATION:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
NAME:            ${firstName || 'Not provided'} ${lastName || ''}
EMAIL:           ${email || 'Not provided'}
PHONE:           ${phone || 'Not provided'}
BUSINESS NAME:   ${businessName || 'Not provided'}
LEAD ID:         ${leadId || 'N/A'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📍 SOURCE:       ${source === 'manual-button' ? 'Manual Continue Button' : 'JotForm Client-side Detection'}
🕐 DATE/TIME:    ${submittedAt}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚡ NEXT STEP: Customer will upload documents on /dlvc

═══════════════════════════════════════════════════════════════
    `;

    console.log(supportNotification);

    // Send emails
    try {
      const apiKey = process.env.RESEND_API_KEY;

      if (apiKey && apiKey !== 're_123456789_your_api_key_here' && apiKey.startsWith('re_')) {
        const { Resend } = await import('resend');
        const resend = new Resend(apiKey);

        // 1. Send notification to support team
        console.log('📧 Sending notification to support team...');
        const supportResult = await resend.emails.send({
          from: 'Toast Capital Leads <support@toastcapital.com>',
          to: 'support@toastcapital.com',
          subject: `🎯 Application Submitted: ${firstName} ${lastName}${businessName ? ` - ${businessName}` : ''}`,
          text: supportNotification,
          replyTo: email || undefined,
        });

        if (supportResult.error) {
          console.error('❌ Support email error:', supportResult.error);
        } else {
          console.log('✅ Support notification sent! ID:', supportResult.data?.id);
        }

        // 2. Send confirmation email to applicant
        if (email) {
          console.log('📧 Sending confirmation email to:', email);
          const applicantResult = await resend.emails.send({
            from: 'Toast Capital <support@toastcapital.com>',
            to: email,
            bcc: 'support@toastcapital.com',
            subject: `Application Submitted${firstName ? ` - ${firstName}` : ''}, One More Step!`,
            html: getApplicationSubmittedEmail(firstName || 'Valued Customer', businessName || ''),
            text: `Dear ${firstName || 'Valued Customer'},\n\nYour application has been submitted successfully!\n\nFinal Step: Upload your documents\n- 3 months of bank statements\n- Driver's License\n- Void Check\n\nUpload here: https://toastcapital.com/dlvc\n\nQuestions? Call us at (617) 533-3190\n\nBest regards,\nToast Capital Team`,
          });

          if (applicantResult.error) {
            console.error('❌ Applicant email error:', applicantResult.error);
          } else {
            console.log('✅ Applicant confirmation sent! ID:', applicantResult.data?.id);
          }
        }
      } else {
        console.log('⚠️ RESEND_API_KEY not configured');
      }
    } catch (emailError: any) {
      console.error('❌ Email error:', emailError?.message);
    }

    // Send SMS notifications
    if (phone) {
      try {
        console.log('📱 Sending SMS notifications...');

        // SMS to team
        await sendSMS({
          to: process.env.TEAM_PHONE_NUMBER || '6175333190',
          message: `🎯 New Application!\n${firstName} ${lastName}\n${businessName || 'No business name'}\n📞 ${phone}\nNext: Documents upload`,
        });

        // SMS to applicant
        await sendSMS({
          to: phone,
          message: `Hi ${firstName || 'there'}! Your Toast Capital application is submitted. Final step: upload your documents at toastcapital.com/dlvc. Questions? Call (617) 533-3190`,
        });

        console.log('✅ SMS notifications sent!');
      } catch (smsError: any) {
        console.error('⚠️ SMS error:', smsError?.message);
      }
    }

    console.log('='.repeat(60));
    console.log('✅ JOTFORM-SUBMITTED API COMPLETED');
    console.log('='.repeat(60) + '\n');

    return NextResponse.json({
      success: true,
      message: 'Application notification sent',
      leadId,
    });

  } catch (error: any) {
    console.error('❌ JotForm submission error:', error?.message);
    return NextResponse.json(
      { error: 'Failed to process submission' },
      { status: 500 }
    );
  }
}
