import { NextRequest, NextResponse } from 'next/server';
import { generateDLVCConfirmationEmail } from './email-template';
import { getPostDlvcDrip1, getPostDlvcDrip2, getPostDlvcDrip3 } from './post-dlvc-drips';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// NO FILES ARE SENT HERE - files were already uploaded via /api/upload-single-file
// This endpoint just confirms the submission and sends summary emails

export async function POST(request: NextRequest) {
  console.log('\n' + '='.repeat(60));
  console.log('📥 DLVC FINAL SUBMISSION - ' + new Date().toISOString());
  console.log('='.repeat(60));

  try {
    // Parse form data (just metadata, no files needed)
    let formData: FormData;
    try {
      formData = await request.formData();
      console.log('✅ FormData parsed');
    } catch (parseError: any) {
      console.error('❌ Parse error:', parseError?.message);
      return NextResponse.json({ error: 'Invalid request. Please refresh and try again.' }, { status: 400 });
    }

    // Extract fields
    const data = {
      firstName: (formData.get('firstName') as string) || '',
      lastName: (formData.get('lastName') as string) || '',
      email: (formData.get('email') as string) || '',
      phone: (formData.get('phone') as string) || '',
      businessName: (formData.get('businessName') as string) || '',
      businessType: (formData.get('businessType') as string) || '',
      fundingAmount: (formData.get('fundingAmount') as string) || '',
      monthlyRevenue: (formData.get('monthlyRevenue') as string) || '',
    };

    console.log('📋 DLVC Complete:', data.firstName, data.lastName, '-', data.businessName);

    // SEND SUMMARY EMAIL - NO ATTACHMENTS (files were already sent individually)
    const apiKey = process.env.RESEND_API_KEY;

    if (apiKey && apiKey.startsWith('re_')) {
      try {
        const { Resend } = await import('resend');
        const resend = new Resend(apiKey);

        const submittedAt = new Date().toLocaleString('en-US', {
          timeZone: 'America/New_York',
          dateStyle: 'full',
          timeStyle: 'short',
        });

        // Send summary email to support (NO ATTACHMENTS - files were sent individually)
        console.log('📧 Sending DLVC summary email...');

        const result = await resend.emails.send({
          from: 'Toast Capital Leads <support@toastcapital.com>',
          to: 'support@toastcapital.com',
          subject: `🎯 DLVC COMPLETE: ${data.firstName} ${data.lastName} - ${data.businessName} (ALL 5 DOCS)`,
          html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 20px; background-color: #f9fafb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; border: 2px solid #22c55e;">
    <div style="background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); padding: 24px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 24px;">🎯 DLVC COMPLETED!</h1>
      <p style="color: #dcfce7; margin: 8px 0 0 0;">All 5 documents received - Ready for funding!</p>
    </div>

    <div style="padding: 24px;">
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #374151;">Name:</td>
          <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #111827;">${data.firstName} ${data.lastName}</td>
        </tr>
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #374151;">Email:</td>
          <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;"><a href="mailto:${data.email}" style="color: #2563eb;">${data.email}</a></td>
        </tr>
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #374151;">Phone:</td>
          <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;"><a href="tel:${data.phone}" style="color: #2563eb;">${data.phone}</a></td>
        </tr>
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #374151;">Business:</td>
          <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #111827;">${data.businessName}</td>
        </tr>
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #374151;">Revenue:</td>
          <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #111827;">${data.monthlyRevenue || 'Not specified'}</td>
        </tr>
        <tr>
          <td style="padding: 12px 0; font-weight: bold; color: #374151;">Submitted:</td>
          <td style="padding: 12px 0; color: #111827;">${submittedAt}</td>
        </tr>
      </table>

      <div style="margin-top: 24px; padding: 16px; background: #f0fdf4; border-radius: 8px; border-left: 4px solid #22c55e;">
        <p style="margin: 0; color: #166534; font-weight: bold;">✅ Documents Received:</p>
        <ul style="margin: 8px 0 0 0; padding-left: 20px; color: #166534;">
          <li>Bank Statement - Month 1</li>
          <li>Bank Statement - Month 2</li>
          <li>Bank Statement - Month 3</li>
          <li>Driver's License</li>
          <li>Void Check</li>
        </ul>
        <p style="margin: 12px 0 0 0; color: #166534; font-size: 14px;">
          📎 Documents were sent separately via individual upload notifications.
        </p>
      </div>

      <div style="margin-top: 24px; text-align: center;">
        <p style="color: #16a34a; font-weight: bold; font-size: 18px; margin: 0;">
          🚀 THIS LEAD IS READY FOR FUNDING!
        </p>
      </div>
    </div>
  </div>
</body>
</html>
          `,
          replyTo: data.email || undefined,
        });

        if (result.error) {
          console.error('❌ Email error:', result.error);
        } else {
          console.log('✅ Summary email sent! ID:', result.data?.id);
        }

        // Send confirmation to applicant (fire and forget)
        if (data.email) {
          resend.emails.send({
            from: 'Toast Capital <support@toastcapital.com>',
            to: data.email,
            subject: `Documents Received - ${data.firstName}, Your Approval is in Progress!`,
            html: generateDLVCConfirmationEmail({
              firstName: data.firstName || 'Valued Customer',
              lastName: data.lastName || '',
              fundingAmount: data.fundingAmount || '',
              businessName: data.businessName || '',
            }),
          }).then(r => {
            if (r.data?.id) console.log('✅ Confirmation sent:', r.data.id);
          }).catch(() => {});

          // POST-DLVC DRIP EMAILS - Fire and forget (non-blocking)
          const firstName = data.firstName || 'Valued Customer';
          const businessName = data.businessName || 'your business';

          Promise.allSettled([
            resend.emails.send({
              from: 'Toast Capital <support@toastcapital.com>',
              to: data.email,
              subject: `${firstName}, great news! Your funding is approved!`,
              html: getPostDlvcDrip1(firstName, businessName),
              scheduledAt: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(), // 3 hours
            }),
            resend.emails.send({
              from: 'Toast Capital <support@toastcapital.com>',
              to: data.email,
              subject: `${firstName}, your funding agreement is still waiting`,
              html: getPostDlvcDrip2(firstName, businessName),
              scheduledAt: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(), // 12 hours
            }),
            resend.emails.send({
              from: 'Toast Capital <support@toastcapital.com>',
              to: data.email,
              subject: `${firstName}, don't let your funding approval expire`,
              html: getPostDlvcDrip3(firstName, businessName),
              scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
            }),
          ]).then(results => {
            const count = results.filter(r => r.status === 'fulfilled' && (r.value as any).data?.id).length;
            console.log(`📧 Post-DLVC drips scheduled: ${count}/3`);
          }).catch(() => {});
        }

      } catch (emailError: any) {
        console.error('❌ Email error:', emailError?.message);
        // Don't fail - still return success
      }
    } else {
      console.log('⚠️ RESEND_API_KEY not configured');
    }

    console.log('✅ DLVC SUBMISSION SUCCESS');
    console.log('='.repeat(60) + '\n');

    // SUCCESS
    return NextResponse.json({
      success: true,
      message: 'Documents submitted successfully',
    });

  } catch (error: any) {
    console.error('❌ DLVC ERROR:', error?.message);
    console.error('Stack:', error?.stack);
    return NextResponse.json(
      { error: 'Failed to process submission. Please try again.' },
      { status: 500 }
    );
  }
}
