import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createLead } from '@/lib/leads-db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// SECURITY: API keys must come from environment variables only
const JOTFORM_API_KEY = process.env.JOTFORM_API_KEY || '';
const JOTFORM_FORM_ID = process.env.JOTFORM_FORM_ID || '260766365748067';

const STATE_NAMES: Record<string, string> = {
  'AL': 'Alabama', 'AK': 'Alaska', 'AZ': 'Arizona', 'AR': 'Arkansas', 'CA': 'California',
  'CO': 'Colorado', 'CT': 'Connecticut', 'DE': 'Delaware', 'FL': 'Florida', 'GA': 'Georgia',
  'HI': 'Hawaii', 'ID': 'Idaho', 'IL': 'Illinois', 'IN': 'Indiana', 'IA': 'Iowa',
  'KS': 'Kansas', 'KY': 'Kentucky', 'LA': 'Louisiana', 'ME': 'Maine', 'MD': 'Maryland',
  'MA': 'Massachusetts', 'MI': 'Michigan', 'MN': 'Minnesota', 'MS': 'Mississippi', 'MO': 'Missouri',
  'MT': 'Montana', 'NE': 'Nebraska', 'NV': 'Nevada', 'NH': 'New Hampshire', 'NJ': 'New Jersey',
  'NM': 'New Mexico', 'NY': 'New York', 'NC': 'North Carolina', 'ND': 'North Dakota', 'OH': 'Ohio',
  'OK': 'Oklahoma', 'OR': 'Oregon', 'PA': 'Pennsylvania', 'RI': 'Rhode Island', 'SC': 'South Carolina',
  'SD': 'South Dakota', 'TN': 'Tennessee', 'TX': 'Texas', 'UT': 'Utah', 'VT': 'Vermont',
  'VA': 'Virginia', 'WA': 'Washington', 'WV': 'West Virginia', 'WI': 'Wisconsin', 'WY': 'Wyoming'
};

export async function POST(request: NextRequest) {
  console.log('\n' + '='.repeat(60));
  console.log('📝 JOTFORM SUBMISSION - ' + new Date().toISOString());
  console.log('='.repeat(60));

  let ownerFirstName = '';
  let ownerLastName = '';
  let legalBusinessName = '';
  let email = '';
  let phone = '';
  let monthlyRevenue = '';
  let submissionId = '';

  try {
    const body = await request.json();

    // Extract all fields
    legalBusinessName = body.legalBusinessName || '';
    email = body.email || '';
    phone = body.phone || '';
    monthlyRevenue = body.monthlyRevenue || '';
    const businessStreet = body.businessStreet || '';
    const businessStreet2 = body.businessStreet2 || '';
    const businessCity = body.businessCity || '';
    const businessState = body.businessState || '';
    const businessZip = body.businessZip || '';
    const businessStartDate = body.businessStartDate || '';
    const ein = body.ein || '';
    ownerFirstName = body.ownerFirstName || '';
    ownerLastName = body.ownerLastName || '';
    const ownerStreet = body.ownerStreet || '';
    const ownerStreet2 = body.ownerStreet2 || '';
    const ownerCity = body.ownerCity || '';
    const ownerState = body.ownerState || '';
    const ownerZip = body.ownerZip || '';
    const ownerDob = body.ownerDob || '';
    const ownerSsn = body.ownerSsn || '';
    const ownershipPercentage = body.ownershipPercentage || '';
    const signatureDate = body.signatureDate || '';
    const signature = body.signature || '';

    console.log('📋 Form Data:');
    console.log(`   Name: ${ownerFirstName} ${ownerLastName}`);
    console.log(`   Email: ${email}`);
    console.log(`   Phone: ${phone}`);
    console.log(`   Business: ${legalBusinessName}`);
    console.log(`   Revenue: ${monthlyRevenue}`);

    // Build JotForm data
    const formData = new URLSearchParams();
    formData.append('submission[6]', legalBusinessName);
    formData.append('submission[4]', email);

    let formattedPhone = phone;
    if (!formattedPhone.includes('(')) {
      const digits = formattedPhone.replace(/\D/g, '');
      if (digits.length === 10) {
        formattedPhone = `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
      }
    }
    formData.append('submission[22][full]', formattedPhone);
    formData.append('submission[7]', monthlyRevenue);

    const businessStateFull = STATE_NAMES[businessState] || businessState;
    formData.append('submission[9][addr_line1]', businessStreet);
    formData.append('submission[9][addr_line2]', businessStreet2);
    formData.append('submission[9][city]', businessCity);
    formData.append('submission[9][state]', businessStateFull);
    formData.append('submission[9][postal]', businessZip);
    formData.append('submission[9][country]', 'United States');

    formData.append('submission[10]', businessStartDate);
    formData.append('submission[11]', ein);
    formData.append('submission[3][first]', ownerFirstName);
    formData.append('submission[3][last]', ownerLastName);

    const ownerStateFull = STATE_NAMES[ownerState] || ownerState;
    formData.append('submission[12][addr_line1]', ownerStreet);
    formData.append('submission[12][addr_line2]', ownerStreet2);
    formData.append('submission[12][city]', ownerCity);
    formData.append('submission[12][state]', ownerStateFull);
    formData.append('submission[12][postal]', ownerZip);
    formData.append('submission[12][country]', 'United States');

    formData.append('submission[13]', ownerDob);
    formData.append('submission[17]', ownerSsn);
    formData.append('submission[18]', ownershipPercentage);
    if (signature) formData.append('submission[20]', signature);
    formData.append('submission[21]', signatureDate);

    // Submit to JotForm
    console.log('📤 Submitting to JotForm API...');
    const jotformResponse = await fetch(
      `https://api.jotform.com/form/${JOTFORM_FORM_ID}/submissions?apiKey=${JOTFORM_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString(),
      }
    );

    const jotformResult = await jotformResponse.json();

    if (jotformResult.responseCode !== 200) {
      console.error('❌ JotForm API error:', jotformResult);
      throw new Error(jotformResult.message || 'JotForm submission failed');
    }

    submissionId = jotformResult.content?.submissionID || '';
    console.log('✅ JotForm API success! Submission ID:', submissionId);

    // ============================================
    // CREATE LEAD IN CRM DATABASE
    // ============================================
    try {
      console.log('📊 Creating lead in CRM database...');
      const lead = await createLead({
        firstName: ownerFirstName,
        lastName: ownerLastName,
        email: email,
        phone: phone,
        businessName: legalBusinessName,
        monthlyRevenue: monthlyRevenue,
        stage: 'application', // They've completed the quote + application form
        status: 'new',
        tags: [],
        jotformSubmissionId: submissionId,
        quoteSubmittedAt: new Date().toISOString(),
        applicationSubmittedAt: new Date().toISOString(),
      });
      console.log('✅ Lead created in CRM! ID:', lead.id);
    } catch (leadError: any) {
      console.error('⚠️ Failed to create lead in CRM (non-critical):', leadError?.message);
      // Don't fail the whole submission if CRM creation fails
    }

  } catch (error: any) {
    console.error('❌ JotForm submission error:', error?.message);
    return NextResponse.json(
      { error: error?.message || 'Failed to submit application' },
      { status: 500 }
    );
  }

  // ============================================
  // SEND EMAILS - MUST AWAIT, NOT FIRE-AND-FORGET
  // ============================================
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey || !apiKey.startsWith('re_')) {
    console.error('❌ RESEND_API_KEY not configured or invalid!');
    console.log('   Current value starts with:', apiKey?.substring(0, 10) || 'EMPTY');
  } else {
    console.log('📧 Sending emails via Resend...');

    try {
      const resend = new Resend(apiKey);

      // Fetch signed PDF from JotForm (optional - don't let it block emails)
      let pdfAttachment: { filename: string; content: Buffer } | null = null;

      try {
        // Wait a moment for JotForm to generate the PDF
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log('📄 Fetching signed PDF from JotForm...');

        // Try the submission PDF endpoint
        const pdfResponse = await fetch(
          `https://www.jotform.com/server.php?action=getSubmissionPDF&formID=${JOTFORM_FORM_ID}&sid=${submissionId}&apiKey=${JOTFORM_API_KEY}`,
          { method: 'GET' }
        );

        if (pdfResponse.ok) {
          const pdfBuffer = Buffer.from(await pdfResponse.arrayBuffer());
          if (pdfBuffer.length > 1000) {
            pdfAttachment = {
              filename: `Application_${ownerFirstName}_${ownerLastName}_${submissionId}.pdf`,
              content: pdfBuffer,
            };
            console.log('✅ PDF fetched, size:', pdfBuffer.length);
          }
        }
      } catch (pdfError: any) {
        console.log('⚠️ PDF fetch error (non-critical):', pdfError?.message);
      }

      // 1. SUPPORT NOTIFICATION EMAIL
      console.log('📧 Sending support notification...');
      const supportResult = await resend.emails.send({
        from: 'Toast Capital Support <support@toastcap.com>',
        to: 'support@toastcap.com',
        subject: `🎯 JOTFORM COMPLETE: ${ownerFirstName} ${ownerLastName} - ${legalBusinessName}`,
        html: `
<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f9fafb;">
  <div style="background: white; border-radius: 12px; overflow: hidden; border: 2px solid #FF6B35;">
    <div style="background: linear-gradient(135deg, #FF6B35 0%, #e55a2b 100%); padding: 20px; text-align: center;">
      <h1 style="color: white; margin: 0;">🎯 JOTFORM COMPLETE</h1>
      <p style="color: #ffe4d9; margin: 8px 0 0;">Application Submitted on /upload</p>
    </div>
    <div style="padding: 24px;">
      <table style="width: 100%; border-collapse: collapse;">
        <tr><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Name:</td><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${ownerFirstName} ${ownerLastName}</td></tr>
        <tr><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Email:</td><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><a href="mailto:${email}">${email}</a></td></tr>
        <tr><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Phone:</td><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><a href="tel:${phone}">${phone}</a></td></tr>
        <tr><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Business:</td><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${legalBusinessName}</td></tr>
        <tr><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Revenue:</td><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${monthlyRevenue}</td></tr>
        <tr><td style="padding: 8px 0; font-weight: bold;">JotForm ID:</td><td style="padding: 8px 0;">${submissionId}</td></tr>
      </table>
      <div style="margin-top: 20px; padding: 12px; background: #fef3c7; border-radius: 8px; border-left: 4px solid #f59e0b;">
        <p style="margin: 0; color: #92400e;"><strong>Next Step:</strong> Customer uploads documents on /dlvc</p>
      </div>
      ${pdfAttachment ? '<p style="margin-top: 16px; color: #16a34a;">📎 Signed application PDF attached</p>' : '<p style="margin-top: 16px; color: #6b7280;">⚠️ PDF could not be fetched - view on JotForm</p>'}
    </div>
  </div>
</body>
</html>
        `,
        ...(pdfAttachment ? { attachments: [pdfAttachment] } : {}),
      });

      if (supportResult.error) {
        console.error('❌ Support email FAILED:', supportResult.error);
      } else {
        console.log('✅ Support email sent! ID:', supportResult.data?.id);
      }

      // 2. APPLICANT CONFIRMATION EMAIL
      if (email) {
        console.log('📧 Sending applicant confirmation to:', email);
        const applicantResult = await resend.emails.send({
          from: 'Toast Capital Support <support@toastcap.com>',
          to: email,
          bcc: 'support@toastcap.com',
          subject: `Application Received - Next Step: Upload Documents`,
          html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
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
                Great progress, ${ownerFirstName}! You're almost there.
              </p>

              <!-- Progress Tracker -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 32px;">
                <tr>
                  <td align="center">
                    <table cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="text-align: center; padding: 0 8px;">
                          <div style="width: 40px; height: 40px; background-color: #FF6B35; border-radius: 50%; margin: 0 auto 8px; line-height: 40px; color: #ffffff; font-weight: bold;">✓</div>
                          <p style="margin: 0; font-size: 11px; color: #FF6B35; font-weight: 600;">COMPLETE</p>
                          <p style="margin: 4px 0 0; font-size: 12px; color: #374151;">Quote</p>
                        </td>
                        <td style="padding: 0 4px; vertical-align: top; padding-top: 18px;">
                          <div style="width: 40px; height: 3px; background-color: #FF6B35;"></div>
                        </td>
                        <td style="text-align: center; padding: 0 8px;">
                          <div style="width: 40px; height: 40px; background-color: #FF6B35; border-radius: 50%; margin: 0 auto 8px; line-height: 40px; color: #ffffff; font-weight: bold;">✓</div>
                          <p style="margin: 0; font-size: 11px; color: #FF6B35; font-weight: 600;">COMPLETE</p>
                          <p style="margin: 4px 0 0; font-size: 12px; color: #374151;">Application</p>
                        </td>
                        <td style="padding: 0 4px; vertical-align: top; padding-top: 18px;">
                          <div style="width: 40px; height: 3px; background-color: #e5e7eb;"></div>
                        </td>
                        <td style="text-align: center; padding: 0 8px;">
                          <div style="width: 40px; height: 40px; background-color: #FEF3C7; border: 2px solid #F59E0B; border-radius: 50%; margin: 0 auto 8px; line-height: 36px; color: #D97706; font-weight: bold;">3</div>
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
</html>
          `,
        });

        if (applicantResult.error) {
          console.error('❌ Applicant email FAILED:', applicantResult.error);
        } else {
          console.log('✅ Applicant email sent! ID:', applicantResult.data?.id);
        }
      } else {
        console.log('⚠️ No email address provided, skipping applicant email');
      }

    } catch (emailError: any) {
      console.error('❌ EMAIL SENDING ERROR:', emailError?.message);
      console.error('   Stack:', emailError?.stack);
    }
  }

  console.log('='.repeat(60));
  console.log('✅ JOTFORM SUBMISSION COMPLETE');
  console.log('='.repeat(60) + '\n');

  return NextResponse.json({
    success: true,
    submissionId,
    message: 'Application submitted successfully',
  });
}
