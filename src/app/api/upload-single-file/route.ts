import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Increase the body size limit for file uploads (25MB)
export const maxDuration = 60; // 60 seconds timeout for mobile uploads

// File type labels for email subject
const FILE_TYPE_LABELS: Record<string, string> = {
  'bankStatement1': 'Bank Statement - Month 1',
  'bankStatement2': 'Bank Statement - Month 2',
  'bankStatement3': 'Bank Statement - Month 3',
  'driversLicense': "Driver's License",
  'voidCheck': 'Void Check',
};

export async function POST(request: NextRequest) {
  try {
    console.log('📥 Single file upload received');
    console.log('📱 User-Agent:', request.headers.get('user-agent'));
    console.log('📦 Content-Length:', request.headers.get('content-length'));

    let formData;
    try {
      formData = await request.formData();
    } catch (parseError: any) {
      console.error('❌ Error parsing form data:', parseError);
      console.error('❌ Parse error details:', {
        name: parseError?.name,
        message: parseError?.message,
        code: parseError?.code,
      });

      // Provide more helpful error messages for common mobile issues
      if (parseError?.message?.includes('body exceeded') || parseError?.message?.includes('too large')) {
        return NextResponse.json(
          { error: 'File is too large. Please use a file under 20MB or compress it first.' },
          { status: 413 }
        );
      }
      if (parseError?.message?.includes('timeout') || parseError?.message?.includes('aborted')) {
        return NextResponse.json(
          { error: 'Upload timed out. Please check your connection and try again.' },
          { status: 408 }
        );
      }

      return NextResponse.json(
        { error: 'Failed to upload file. Please try again or use a different file format.' },
        { status: 400 }
      );
    }

    // Extract file and metadata
    const file = formData.get('file') as File | null;
    const fileType = formData.get('fileType') as string || 'unknown';
    const firstName = formData.get('firstName') as string || '';
    const lastName = formData.get('lastName') as string || '';
    const email = formData.get('email') as string || '';
    const phone = formData.get('phone') as string || '';
    const businessName = formData.get('businessName') as string || '';

    if (!file) {
      console.error('❌ No file provided');
      return NextResponse.json(
        { error: 'No file selected. Please tap to choose a file.' },
        { status: 400 }
      );
    }

    // Check file size (max 20MB)
    const maxSize = 20 * 1024 * 1024; // 20MB
    if (file.size > maxSize) {
      console.error(`❌ File too large: ${(file.size / 1024 / 1024).toFixed(2)} MB`);
      return NextResponse.json(
        { error: `File is too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum size is 20MB.` },
        { status: 413 }
      );
    }

    // Check for empty file
    if (file.size === 0) {
      console.error('❌ Empty file received');
      return NextResponse.json(
        { error: 'The file appears to be empty. Please try a different file.' },
        { status: 400 }
      );
    }

    // Log file info for debugging
    console.log(`📁 File details: name=${file.name}, type=${file.type}, size=${file.size} bytes`);

    const fileTypeLabel = FILE_TYPE_LABELS[fileType] || fileType;
    const customerName = firstName && lastName
      ? `${firstName} ${lastName}`
      : email || 'Unknown Customer';

    console.log(`📁 File received: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`);
    console.log(`📁 File type: ${fileTypeLabel}`);
    console.log(`📁 Customer: ${customerName}`);

    // Current timestamp
    const submittedAt = new Date().toLocaleString('en-US', {
      timeZone: 'America/New_York',
      dateStyle: 'full',
      timeStyle: 'long'
    });

    // Format email content
    const emailContent = `
═══════════════════════════════════════════════════════════════
📎 DOCUMENT UPLOADED: ${fileTypeLabel.toUpperCase()}
═══════════════════════════════════════════════════════════════

📋 CUSTOMER INFORMATION:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
NAME:            ${firstName || 'Not provided'} ${lastName || ''}
EMAIL:           ${email || 'Not provided'}
PHONE:           ${phone || 'Not provided'}
BUSINESS NAME:   ${businessName || 'Not provided'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📎 FILE DETAILS:
   Document Type: ${fileTypeLabel}
   File Name: ${file.name}
   File Size: ${(file.size / 1024 / 1024).toFixed(2)} MB

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🕐 UPLOADED AT:  ${submittedAt}
🌐 IP ADDRESS:   ${request.headers.get('x-forwarded-for') || 'Unknown'}

═══════════════════════════════════════════════════════════════
    `;

    // Log to console
    console.log(emailContent);

    // Convert file to buffer for email attachment
    let fileBuffer: Buffer;
    try {
      const bytes = await file.arrayBuffer();
      fileBuffer = Buffer.from(bytes);
      console.log(`✅ File buffer created: ${fileBuffer.length} bytes`);
    } catch (bufferError: any) {
      console.error('❌ Error creating file buffer:', bufferError?.message);
      return NextResponse.json(
        { error: 'Failed to process file' },
        { status: 500 }
      );
    }

    // Try to send email notification
    try {
      const apiKey = process.env.RESEND_API_KEY;

      if (apiKey && apiKey !== 're_123456789_your_api_key_here' && apiKey.startsWith('re_')) {
        console.log('📧 Sending file notification email...');

        const { Resend } = await import('resend');
        const resend = new Resend(apiKey);

        const prefix = fileType.startsWith('bankStatement') ? 'BS' :
                       fileType === 'driversLicense' ? 'DL' :
                       fileType === 'voidCheck' ? 'VC' : 'DOC';

        const attachments = [
          {
            filename: `${prefix}_${file.name}`,
            content: fileBuffer,
          },
        ];

        // Send notification email to support
        const notificationResult = await resend.emails.send({
          from: 'Toast Capital Support <support@toastcap.com>',
          to: 'support@toastcap.com',
          subject: `📎 ${fileTypeLabel}: ${customerName}${businessName ? ` - ${businessName}` : ''}`,
          text: emailContent,
          replyTo: email || undefined,
          attachments: attachments,
        });

        if (notificationResult.error) {
          console.error('❌ Resend error:', JSON.stringify(notificationResult.error, null, 2));
          // Don't fail the upload if email fails
        } else {
          console.log('✅ File notification sent! ID:', notificationResult.data?.id);
        }
      } else {
        console.log('⚠️ RESEND_API_KEY not configured. Email not sent.');
      }
    } catch (emailError: any) {
      console.error('❌ Email error (non-critical):', emailError?.message);
      // Don't fail the upload if email fails
    }

    console.log(`✅ File ${fileTypeLabel} processed successfully`);

    return NextResponse.json({
      success: true,
      message: `${fileTypeLabel} uploaded successfully`,
      fileType: fileType,
      fileName: file.name,
    });

  } catch (error: any) {
    console.error('❌ File upload error:', error?.message || error);
    console.error('❌ Full error:', JSON.stringify(error, null, 2));
    return NextResponse.json(
      { error: 'Failed to process file upload. Please try again.' },
      { status: 500 }
    );
  }
}
