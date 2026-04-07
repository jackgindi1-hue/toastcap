import { NextRequest, NextResponse } from 'next/server';
import { generateConfirmationEmail } from './email-template';
import { sendSMS, smsTemplates } from '@/lib/sms';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json();

    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'businessType', 'fundingAmount', 'timeInBusiness', 'creditScore', 'monthlyRevenue'];
    const missingFields = requiredFields.filter(field => !formData[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Current timestamp
    const submittedAt = new Date().toLocaleString('en-US', {
      timeZone: 'America/New_York',
      dateStyle: 'full',
      timeStyle: 'long'
    });

    // Format the DETAILED email content for support@ notification
    const supportNotificationContent = `
═══════════════════════════════════════════════════════════════
🔔 NEW LEAD NOTIFICATION - FUNDING APPLICATION
═══════════════════════════════════════════════════════════════

📋 LEAD INFORMATION:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

NAME:            ${formData.firstName} ${formData.lastName}
EMAIL:           ${formData.email}
PHONE:           ${formData.phone}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 BUSINESS INFORMATION:
${formData.businessName ? `BUSINESS NAME:   ${formData.businessName}\n` : ''}BUSINESS TYPE:   ${formData.businessType}
FUNDING AMOUNT:  ${formData.fundingAmount}
TIME IN BIZ:     ${formData.timeInBusiness}
MONTHLY REVENUE: ${formData.monthlyRevenue}
CREDIT SCORE:    ${formData.creditScore}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📍 SOURCE:       ${formData.source || 'Application Form'}
🕐 DATE/TIME:    ${submittedAt}
🌐 IP ADDRESS:   ${request.headers.get('x-forwarded-for') || 'Unknown'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚡ ACTION REQUIRED: Contact this lead within 2 hours!

═══════════════════════════════════════════════════════════════
    `;

    // Send email notification to support@toastcap.com
    try {
      const apiKey = process.env.RESEND_API_KEY;

      if (apiKey && apiKey !== 're_123456789_your_api_key_here' && apiKey.startsWith('re_')) {
        // Dynamic import of Resend to avoid build-time issues
        const { Resend } = await import('resend');
        const resend = new Resend(apiKey);

        // 1. Send notification email to support@toastcap.com
        console.log('📧 Sending lead notification to support@toastcap.com...');
        try {
          const notificationResult = await resend.emails.send({
            from: 'Toast Capital Support <support@toastcap.com>',
            to: 'support@toastcap.com',
            subject: `🔔 NEW LEAD: ${formData.firstName} ${formData.lastName} - ${formData.fundingAmount}`,
            text: supportNotificationContent,
            replyTo: formData.email,
          });

          if (notificationResult.error) {
            console.error('❌ Resend notification error:', JSON.stringify(notificationResult.error, null, 2));
          } else {
            console.log('✅ Lead notification sent! ID:', notificationResult.data?.id);
          }
        } catch (notifyErr: any) {
          console.error('❌ Failed to send support notification:');
          console.error('  Error name:', notifyErr?.name);
          console.error('  Error message:', notifyErr?.message);
          console.error('  Error stack:', notifyErr?.stack);
        }

        // 2. Send confirmation email to applicant with thank you page design
        console.log('📧 Sending confirmation email to:', formData.email);
        try {
          const confirmationResult = await resend.emails.send({
            from: 'Toast Capital Support <support@toastcap.com>',
            to: formData.email,
            bcc: 'support@toastcap.com',
            subject: `Application Received - Next Steps for ${formData.firstName}`,
            html: generateConfirmationEmail({
              firstName: formData.firstName,
              lastName: formData.lastName,
              fundingAmount: formData.fundingAmount,
              businessName: formData.businessName,
            }),
            text: `Dear ${formData.firstName},\n\nThank you for your funding application with Toast Capital.\n\nYour application has been received and is being reviewed by our team. A funding specialist will contact you within 24 hours to discuss your options.\n\nIf you have questions, please call us at (617) 533-3190.\n\nBest regards,\nToast Capital Team\n333 Summer Street, Boston, MA 02210`,
          });

          if (confirmationResult.error) {
            console.error('❌ Resend confirmation error:', JSON.stringify(confirmationResult.error, null, 2));
          } else {
            console.log('✅ User confirmation sent! ID:', confirmationResult.data?.id);
          }
        } catch (confirmErr: any) {
          console.error('❌ Failed to send user confirmation:');
          console.error('  Error name:', confirmErr?.name);
          console.error('  Error message:', confirmErr?.message);
        }
      } else {
        console.error('❌ RESEND_API_KEY issue:');
        console.error('  - Key is empty:', !apiKey);
        console.error('  - Key is placeholder:', apiKey === 're_123456789_your_api_key_here');
        console.error('  - Key starts with re_:', apiKey?.startsWith('re_'));
        console.log('⚠️ Emails NOT sent. Please configure RESEND_API_KEY in Netlify environment variables.');
      }
    } catch (emailError: any) {
      // Log detailed email error but don't fail the submission
      console.error('❌ Error in email sending block:');
      console.error('  Error name:', emailError?.name);
      console.error('  Error message:', emailError?.message);
      console.error('  Error stack:', emailError?.stack);
      console.error('  Full error:', JSON.stringify(emailError, null, 2));
    }

    // Send SMS notifications (INDEPENDENT of email - always try to send)
    try {
      console.log('📱 Attempting to send SMS notifications...');

      // SMS to team
      await sendSMS({
        to: process.env.TEAM_PHONE_NUMBER || '6175333190',
        message: smsTemplates.newApplicationToTeam(
          `${formData.firstName} ${formData.lastName}`,
          formData.businessName || 'Not provided',
          formData.fundingAmount,
          formData.phone
        ),
      });

      // SMS to applicant with link to next step (/upload)
      await sendSMS({
        to: formData.phone,
        message: smsTemplates.newApplicationToApplicant(
          formData.firstName,
          formData.businessName || 'your business'
        ),
      });

      console.log('✅ SMS notifications sent!');
    } catch (smsError: any) {
      console.error('⚠️ SMS error (non-critical):', smsError.message);
    }

    return NextResponse.json({
      success: true,
      message: 'Application submitted successfully',
      applicationId: `APP-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    });
  } catch (error: any) {
    console.error('Error processing application:', error?.message || error);
    return NextResponse.json(
      { error: 'Failed to process application. Please try again.' },
      { status: 500 }
    );
  }
}
