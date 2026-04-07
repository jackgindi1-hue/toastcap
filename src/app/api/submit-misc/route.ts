import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const DOCUMENT_LABELS: Record<string, string> = {
  taxReturn: 'Tax Return',
  processingStatements: 'Processing Statements',
  einSS4: 'EIN / SS-4 Letter',
  articleOfIncorporation: 'Articles of Incorporation',
  businessLicense: 'Business License',
  leaseAgreement: 'Lease Agreement',
  other1: 'Other Document 1',
  other2: 'Other Document 2',
};

function base64ToBuffer(dataUrl: string): Buffer {
  const base64 = dataUrl.split(',')[1];
  return Buffer.from(base64, 'base64');
}

interface FileData {
  name: string;
  type: string;
  data: string;
}

interface SubmissionBody {
  email: string;
  phone?: string;
  businessName?: string;
  notes?: string;
  files: Record<string, FileData>;
}

export async function POST(request: NextRequest) {
  try {
    console.log('📥 Misc documents submission received');

    let body: SubmissionBody;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error('❌ Error parsing JSON:', parseError);
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const { email, phone, businessName, notes, files } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    if (!files || Object.keys(files).length === 0) {
      return NextResponse.json({ error: 'At least one document is required' }, { status: 400 });
    }

    // Convert files to buffers
    const fileBuffers: { name: string; buffer: Buffer; type: string; key: string }[] = [];

    console.log('📁 Processing files...');
    for (const [key, fileData] of Object.entries(files)) {
      if (fileData?.data) {
        try {
          const buffer = base64ToBuffer(fileData.data);
          fileBuffers.push({
            name: fileData.name,
            buffer: buffer,
            type: fileData.type,
            key: key,
          });
          console.log(`  ✓ ${DOCUMENT_LABELS[key] || key}: ${fileData.name}`);
        } catch (err) {
          console.error(`  ✗ ${key}: Failed to convert`);
        }
      }
    }

    const submittedAt = new Date().toLocaleString('en-US', {
      timeZone: 'America/New_York',
      dateStyle: 'full',
      timeStyle: 'long',
    });

    const fileListForEmail = fileBuffers.map((f, i) =>
      `${i + 1}. ${DOCUMENT_LABELS[f.key] || f.key}: ${f.name} (${(f.buffer.length / 1024 / 1024).toFixed(2)} MB)`
    );

    const emailContent = `
═══════════════════════════════════════════════════════════════
📎 MISC DOCUMENTS UPLOADED
═══════════════════════════════════════════════════════════════

📋 CONTACT INFORMATION:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

EMAIL:           ${email}
PHONE:           ${phone || 'Not provided'}
BUSINESS NAME:   ${businessName || 'Not provided'}

${notes ? `NOTES:\n${notes}\n` : ''}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📎 DOCUMENTS ATTACHED (${fileBuffers.length}):

${fileListForEmail.join('\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📍 SOURCE:       Misc Documents (/misc)
🕐 DATE/TIME:    ${submittedAt}

═══════════════════════════════════════════════════════════════
    `;

    console.log(emailContent);

    // Send email
    try {
      const apiKey = process.env.RESEND_API_KEY;

      if (apiKey && apiKey !== 're_123456789_your_api_key_here' && apiKey.startsWith('re_')) {
        const { Resend } = await import('resend');
        const resend = new Resend(apiKey);

        const attachments = fileBuffers.map((f) => ({
          filename: `${DOCUMENT_LABELS[f.key] || f.key}_${f.name}`.replace(/\s+/g, '_'),
          content: f.buffer,
        }));

        const result = await resend.emails.send({
          from: 'Toast Capital Support <support@toastcap.com>',
          to: 'support@toastcap.com',
          subject: `📎 Misc Documents: ${businessName || email} (${fileBuffers.length} files)`,
          text: emailContent,
          replyTo: email,
          attachments: attachments,
        });

        if (result.error) {
          console.error('❌ Email error:', result.error);
        } else {
          console.log('✅ Email sent with attachments:', result.data?.id);
        }

        // Send confirmation to user
        await resend.emails.send({
          from: 'Toast Capital Support <support@toastcap.com>',
          to: email,
          bcc: 'support@toastcap.com',
          subject: 'Documents Received - Toast Capital',
          text: `Hi,\n\nWe've received your documents:\n\n${fileListForEmail.join('\n')}\n\nOur team will review them shortly.\n\nQuestions? Call us at (617) 533-3190\n\nBest regards,\nToast Capital Team`,
        });
      }
    } catch (emailError: any) {
      console.error('❌ Email error:', emailError?.message);
    }

    return NextResponse.json({
      success: true,
      message: 'Documents submitted successfully',
      filesUploaded: fileBuffers.length,
    });

  } catch (error: any) {
    console.error('❌ Misc submission error:', error?.message);
    return NextResponse.json({ error: 'Failed to process documents' }, { status: 500 });
  }
}
