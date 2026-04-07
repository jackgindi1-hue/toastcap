import { NextRequest, NextResponse } from 'next/server';
import { generateUploadConfirmationEmail } from '../submit-application/email-template';
import { sendSMS, smsTemplates } from '@/lib/sms';
import { processBufferWithWatermark } from '@/lib/watermark';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // Extract form fields
    const data = {
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      businessType: formData.get('businessType') as string,
      fundingAmount: formData.get('fundingAmount') as string,
      timeInBusiness: formData.get('timeInBusiness') as string,
      creditScore: formData.get('creditScore') as string,
      monthlyRevenue: formData.get('monthlyRevenue') as string,
      businessName: formData.get('businessName') as string,
      source: formData.get('source') as string,
    };

    // Extract files
    const files = formData.getAll('bankStatements') as File[];

    // Debug logging
    console.log('📁 Files received:', files.length);
    files.forEach((file, index) => {
      console.log(`  File ${index + 1}: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`);
    });

    // Validate files are present
    if (files.length === 0) {
      return NextResponse.json(
        { error: 'At least one bank statement is required' },
        { status: 400 }
      );
    }

    // Check if we have email for sending confirmations (more flexible - only needs email)
    const hasEmail = data.email && data.email.trim() !== '';
    const hasFullData = data.firstName && data.lastName && data.email;

    // Use email as the key indicator for sending notifications
    console.log('📧 Email provided:', data.email);
    console.log('📧 Has full application data:', hasFullData);
    console.log('📧 Has email for notifications:', hasEmail);

    // Current timestamp
    const submittedAt = new Date().toLocaleString('en-US', {
      timeZone: 'America/New_York',
      dateStyle: 'full',
      timeStyle: 'long'
    });

    // Format the DETAILED email content for support@ notification
    const supportNotificationContent = `
═══════════════════════════════════════════════════════════════
🔔 NEW LEAD NOTIFICATION - BANK STATEMENTS UPLOADED
═══════════════════════════════════════════════════════════════

📋 LEAD INFORMATION:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

NAME:            ${data.firstName || 'Not provided'} ${data.lastName || ''}
EMAIL:           ${data.email || 'Not provided'}
PHONE:           ${data.phone || 'Not provided'}
BUSINESS NAME:   ${data.businessName || 'Not provided'}
BUSINESS TYPE:   ${data.businessType || 'Not provided'}
FUNDING AMOUNT:  ${data.fundingAmount || 'Not provided'}
TIME IN BIZ:     ${data.timeInBusiness || 'Not provided'}
MONTHLY REVENUE: ${data.monthlyRevenue || 'Not provided'}
CREDIT SCORE:    ${data.creditScore || 'Not provided'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📎 UPLOADED FILES (${files.length} bank statements):
${files.map((file, index) => `   ${index + 1}. ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`).join('\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📍 SOURCE:       Bank Statements Upload (/upload)
🕐 DATE/TIME:    ${submittedAt}
🌐 IP ADDRESS:   ${request.headers.get('x-forwarded-for') || 'Unknown'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚡ ACTION REQUIRED: Review bank statements attached!
   User has been directed to /dlvc for identity verification.

═══════════════════════════════════════════════════════════════
    `;

    // Send email notification to support@toastcap.com
    try {
      const apiKey = process.env.RESEND_API_KEY;

      if (apiKey && apiKey !== 're_123456789_your_api_key_here' && apiKey.startsWith('re_')) {
        // Dynamic import of Resend to avoid build-time issues
        const { Resend } = await import('resend');
        const resend = new Resend(apiKey);

        // Convert files to attachments format for Resend
        // Send BOTH original (non-watermarked) AND watermarked copies for each file
        console.log('🖊️ Processing files - creating both ORIGINAL and WATERMARKED copies...');
        const attachments: { filename: string; content: Buffer }[] = [];

        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const statementNumber = i + 1;

          try {
            // Get original file buffer
            const originalBytes = await file.arrayBuffer();
            const originalBuffer = Buffer.from(originalBytes);

            // Add ORIGINAL (non-watermarked) copy first
            const originalFilename = `ORIGINAL_Statement${statementNumber}_${file.name}`;
            attachments.push({
              filename: originalFilename,
              content: originalBuffer,
            });
            console.log(`  Added ORIGINAL: ${originalFilename} (${originalBuffer.length} bytes)`);

            // Process and add WATERMARKED copy
            try {
              const { buffer: watermarkedBuffer, watermarked } = await processBufferWithWatermark(originalBuffer, file.name);
              const watermarkedFilename = `WATERMARKED_Statement${statementNumber}_${file.name}`;
              attachments.push({
                filename: watermarkedFilename,
                content: watermarked ? watermarkedBuffer : originalBuffer,
              });
              console.log(`  Added WATERMARKED: ${watermarkedFilename} (${watermarkedBuffer.length} bytes)`);
            } catch (wmErr) {
              // If watermarking fails, still add the original as the watermarked version
              console.error(`  ⚠️ Watermark failed for ${file.name}, using original as fallback`);
              const watermarkedFilename = `WATERMARKED_Statement${statementNumber}_${file.name}`;
              attachments.push({
                filename: watermarkedFilename,
                content: originalBuffer,
              });
            }
          } catch (err) {
            console.error(`  ⚠️ Error processing ${file.name}:`, err);
            // Fallback: try to add at least the original
            const bytes = await file.arrayBuffer();
            attachments.push({
              filename: `ORIGINAL_Statement${statementNumber}_${file.name}`,
              content: Buffer.from(bytes),
            });
          }
        }

        console.log(`📎 Total attachments prepared: ${attachments.length} (${files.length} original + ${files.length} watermarked)`);
        attachments.forEach((att, index) => {
          console.log(`  Attachment ${index + 1}: ${att.filename}`);
        });

        // 1. Send notification email to support@toastcap.com with attachments
        console.log('📧 Sending lead notification to support@toastcap.com...');
        try {
          const notificationResult = await resend.emails.send({
            from: 'Toast Capital Support <support@toastcap.com>',
            to: 'support@toastcap.com',
            subject: hasFullData
              ? `🔔 NEW BANK STATEMENTS: ${data.firstName} ${data.lastName} - ${data.businessName || 'Business'}`
              : hasEmail
              ? `🔔 BANK STATEMENTS UPLOADED: ${data.email}`
              : `📄 Bank Statements Uploaded (Anonymous)`,
            text: supportNotificationContent,
            replyTo: hasEmail ? data.email : undefined,
            attachments: attachments,
          });

          if (notificationResult.error) {
            console.error('❌ Resend notification error:', JSON.stringify(notificationResult.error, null, 2));
          } else {
            console.log('✅ Lead notification with attachments sent! ID:', notificationResult.data?.id);
          }
        } catch (notifyErr: any) {
          console.error('❌ Failed to send support notification:');
          console.error('  Error name:', notifyErr?.name);
          console.error('  Error message:', notifyErr?.message);
          console.error('  Error stack:', notifyErr?.stack);
        }

        // 2. Send confirmation email to applicant if we have their email
        if (hasEmail) {
          console.log('📧 Sending confirmation email to:', data.email);
          try {
            const firstName = data.firstName || 'Valued Customer';
            const confirmationResult = await resend.emails.send({
              from: 'Toast Capital Support <support@toastcap.com>',
              to: data.email,
              bcc: 'support@toastcap.com',
              subject: `One More Step - Complete Your Application${data.firstName ? ` for ${data.firstName}` : ''}`,
              html: generateUploadConfirmationEmail({
                firstName: firstName,
                lastName: data.lastName || '',
                fundingAmount: data.fundingAmount || '',
                businessName: data.businessName || '',
              }),
              text: `Dear ${firstName},\n\nGreat news! We've received your bank statements.\n\n✓ Bank Statements Received\n\nFINAL STEP!\nUpload your Driver's License and Void Check to complete your application:\nhttps://toastcap.com/dlvc\n\nWhat's Next:\n1. Upload Driver's License & Void Check\n2. Our team reviews your information\n3. Get funded - some lenders offer same-day funding!\n\nQuestions? Call us at (617) 533-3190\n\nBest regards,\nToast Capital Team\n333 Summer Street, Boston, MA 02210`,
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
          console.log('⚠️ No applicant email available - only notification email sent');
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

    // Send SMS notifications (INDEPENDENT of email - always try to send if we have phone)
    if (data.phone) {
      try {
        console.log('📱 Attempting to send SMS notifications...');

        const customerName = data.firstName && data.lastName
          ? `${data.firstName} ${data.lastName}`
          : data.email || 'Unknown';

        // SMS to team
        const teamResult = await sendSMS({
          to: process.env.TEAM_PHONE_NUMBER || '6175333190',
          message: smsTemplates.bankStatementsToTeam(
            customerName,
            data.businessName || 'Not provided',
            files.length
          ),
        });
        console.log('📱 Team SMS result:', teamResult);

        // SMS to applicant with link to next step (/dlvc)
        const applicantResult = await sendSMS({
          to: data.phone,
          message: smsTemplates.bankStatementsToApplicant(data.firstName || 'Valued Customer'),
        });
        console.log('📱 Applicant SMS result:', applicantResult);

        console.log('✅ SMS notifications sent!');
      } catch (smsError: any) {
        console.error('⚠️ SMS error (non-critical):', smsError.message);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Application submitted successfully with bank statements',
      applicationId: `APP-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      filesUploaded: files.length,
    });

  } catch (error: any) {
    console.error('Error processing application:', error?.message || error);
    return NextResponse.json(
      { error: 'Failed to process application. Please try again.' },
      { status: 500 }
    );
  }
}
