import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const JOTFORM_API_KEY = process.env.JOTFORM_API_KEY || 'e8fe28095f36030abeba1485454c83f8';
const JOTFORM_FORM_ID = '260766365748067';

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
  console.log('\n📝 JOTFORM SUBMISSION - ' + new Date().toISOString());

  try {
    const body = await request.json();
    const {
      legalBusinessName, email, phone, monthlyRevenue,
      businessStreet, businessStreet2, businessCity, businessState, businessZip,
      businessStartDate, ein,
      ownerFirstName, ownerLastName,
      ownerStreet, ownerStreet2, ownerCity, ownerState, ownerZip,
      ownerDob, ownerSsn, ownershipPercentage,
      signatureDate, signature,
    } = body;

    console.log('📋 Form:', ownerFirstName, ownerLastName, '-', legalBusinessName);

    // Build JotForm data
    const formData = new URLSearchParams();
    formData.append('submission[6]', legalBusinessName || '');
    formData.append('submission[4]', email || '');

    let formattedPhone = phone || '';
    if (!formattedPhone.includes('(')) {
      const digits = formattedPhone.replace(/\D/g, '');
      if (digits.length === 10) {
        formattedPhone = `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
      }
    }
    formData.append('submission[22][full]', formattedPhone);
    formData.append('submission[7]', monthlyRevenue || '');

    const businessStateFull = STATE_NAMES[businessState] || businessState || '';
    formData.append('submission[9][addr_line1]', businessStreet || '');
    formData.append('submission[9][addr_line2]', businessStreet2 || '');
    formData.append('submission[9][city]', businessCity || '');
    formData.append('submission[9][state]', businessStateFull);
    formData.append('submission[9][postal]', businessZip || '');
    formData.append('submission[9][country]', 'United States');

    formData.append('submission[10]', businessStartDate || '');
    formData.append('submission[11]', ein || '');
    formData.append('submission[3][first]', ownerFirstName || '');
    formData.append('submission[3][last]', ownerLastName || '');

    const ownerStateFull = STATE_NAMES[ownerState] || ownerState || '';
    formData.append('submission[12][addr_line1]', ownerStreet || '');
    formData.append('submission[12][addr_line2]', ownerStreet2 || '');
    formData.append('submission[12][city]', ownerCity || '');
    formData.append('submission[12][state]', ownerStateFull);
    formData.append('submission[12][postal]', ownerZip || '');
    formData.append('submission[12][country]', 'United States');

    formData.append('submission[13]', ownerDob || '');
    formData.append('submission[17]', ownerSsn || '');
    formData.append('submission[18]', ownershipPercentage || '');
    if (signature) formData.append('submission[20]', signature);
    formData.append('submission[21]', signatureDate || '');

    // Submit to JotForm
    console.log('📤 Submitting to JotForm...');
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
      console.error('❌ JotForm error:', jotformResult);
      throw new Error(jotformResult.message || 'JotForm submission failed');
    }

    const submissionId = jotformResult.content?.submissionID;
    console.log('✅ JotForm success! ID:', submissionId);

    // Send emails (fire and forget for speed)
    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey && apiKey.startsWith('re_')) {
      import('resend').then(async ({ Resend }) => {
        const resend = new Resend(apiKey);

        // Fetch signed PDF from JotForm - try multiple endpoints
        let pdfAttachment: { filename: string; content: Buffer } | null = null;

        // Wait a moment for JotForm to generate the PDF
        await new Promise(resolve => setTimeout(resolve, 2000));

        try {
          console.log('📄 Fetching signed PDF from JotForm...');

          // Try the submission PDF endpoint first
          let pdfResponse = await fetch(
            `https://www.jotform.com/server.php?action=getSubmissionPDF&formID=${JOTFORM_FORM_ID}&sid=${submissionId}&apiKey=${JOTFORM_API_KEY}`,
            { method: 'GET' }
          );

          // If that fails, try the PDF converter endpoint
          if (!pdfResponse.ok) {
            console.log('⚠️ First PDF endpoint failed, trying alternative...');
            pdfResponse = await fetch(
              `https://api.jotform.com/submission/${submissionId}/pdf?apiKey=${JOTFORM_API_KEY}`,
              { method: 'GET' }
            );
          }

          // If still failing, try one more endpoint
          if (!pdfResponse.ok) {
            console.log('⚠️ Second PDF endpoint failed, trying PDF converter...');
            pdfResponse = await fetch(
              `https://api.jotform.com/pdf-converter/${submissionId}?apiKey=${JOTFORM_API_KEY}`,
              { method: 'GET' }
            );
          }

          if (pdfResponse.ok) {
            const contentType = pdfResponse.headers.get('content-type');
            console.log('📄 PDF response content-type:', contentType);

            const pdfBuffer = Buffer.from(await pdfResponse.arrayBuffer());
            if (pdfBuffer.length > 1000) { // Make sure it's not an error page
              pdfAttachment = {
                filename: `Application_${ownerFirstName}_${ownerLastName}_${submissionId}.pdf`,
                content: pdfBuffer,
              };
              console.log('✅ PDF fetched successfully, size:', pdfBuffer.length);
            } else {
              console.log('⚠️ PDF buffer too small:', pdfBuffer.length);
            }
          } else {
            console.log('⚠️ All PDF endpoints failed:', pdfResponse.status);
          }
        } catch (pdfError: any) {
          console.log('⚠️ PDF fetch error:', pdfError?.message);
        }

        // Support notification with PDF attachment (or without if PDF failed)
        const supportEmail = await resend.emails.send({
          from: 'Toast Capital Leads <support@toastcapital.com>',
          to: 'support@toastcapital.com',
          subject: `🎯 JOTFORM COMPLETE: ${ownerFirstName} ${ownerLastName} - ${legalBusinessName}`,
          html: `
<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f9fafb;">
  <div style="background: white; border-radius: 12px; overflow: hidden; border: 2px solid #FF6B35;">
    <div style="background: linear-gradient(135deg, #FF6B35 0%, #e55a2b 100%); padding: 20px; text-align: center;">
      <h1 style="color: white; margin: 0;">🎯 JOTFORM COMPLETE</h1>
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

        if (supportEmail.data?.id) {
          console.log('✅ Support email sent:', supportEmail.data.id, pdfAttachment ? '(with PDF)' : '(no PDF)');
        } else {
          console.log('⚠️ Support email error:', supportEmail.error);
        }

        // Applicant confirmation
        resend.emails.send({
          from: 'Toast Capital <support@toastcapital.com>',
          to: email,
          subject: `Application Received - Next Step: Upload Documents`,
          html: `
<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <img src="https://toastcapital.com/toast-capital-logo.png" alt="Toast Capital" style="width: 200px; margin-bottom: 20px;">
  <h1 style="color: #1f2937;">Application Submitted!</h1>
  <p>Great progress, ${ownerFirstName}! You're almost there.</p>
  <div style="background: #f0fdf4; border: 1px solid #bbf7d0; padding: 16px; border-radius: 8px; margin: 20px 0;">
    <p style="color: #166534; margin: 0;"><strong>✓ What we received:</strong> Your verification has been completed</p>
  </div>
  <div style="background: #fef3c7; border: 1px solid #fcd34d; padding: 16px; border-radius: 8px; margin: 20px 0;">
    <p style="color: #92400e; margin: 0;"><strong>→ Final Step:</strong> Upload bank statements, Driver's License, and Void Check</p>
  </div>
  <a href="https://toastcapital.com/dlvc" style="display: inline-block; background: #1e3a8a; color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: bold;">Upload Documents →</a>
  <p style="margin-top: 20px; color: #6b7280;">Questions? Call <a href="tel:6175333190" style="color: #ff6b35;">(617) 533-3190</a></p>
</body>
</html>
          `,
        }).then(r => r.data?.id && console.log('✅ Applicant email sent'));
      }).catch(() => {});
    }

    console.log('✅ JotForm submission complete\n');

    return NextResponse.json({
      success: true,
      submissionId,
      message: 'Application submitted successfully',
    });

  } catch (error: any) {
    console.error('❌ JotForm error:', error?.message);
    return NextResponse.json(
      { error: error?.message || 'Failed to submit application' },
      { status: 500 }
    );
  }
}
