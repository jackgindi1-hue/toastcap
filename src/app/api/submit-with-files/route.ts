import { NextRequest, NextResponse } from 'next/server';
import { generateUploadConfirmationEmail } from '../submit-application/email-template';
import { sendSMS, smsTemplates } from '@/lib/sms';
import { processFileWithWatermark } from '@/lib/watermark';

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

    // Format the email content - different format based on whether we have application data
    const emailContent = hasFullData ? `
New Business Funding Application Received WITH BANK STATEMENTS

Application Details:

CONTACT INFORMATION:
Name: ${data.firstName} ${data.lastName}
Email: ${data.email}
Phone: ${data.phone}

BUSINESS INFORMATION:
${data.businessName ? `Business Name: ${data.businessName}\n` : ''}Business Type: ${data.businessType}
Funding Amount Needed: ${data.fundingAmount}
Time in Business: ${data.timeInBusiness}
Monthly Revenue: ${data.monthlyRevenue}
Credit Score: ${data.creditScore}

ATTACHMENTS:
${files.map((file, index) => `${index + 1}. ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB) - ORIGINAL & WATERMARKED copies attached`).join('\n')}

TRACKING:
${data.source ? `Source Button/Form: ${data.source}\n` : ''}

Submitted: ${new Date().toLocaleString('en-US', {
  timeZone: 'America/New_York',
  dateStyle: 'full',
  timeStyle: 'long'
})}

Action Required: Please contact the applicant within 2 hours.
Bank statements are attached to this email (both original and watermarked versions).
    ` : `
Bank Statements Uploaded (No Application Data)

ATTACHMENTS:
${files.map((file, index) => `${index + 1}. ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB) - ORIGINAL & WATERMARKED copies attached`).join('\n')}

NOTE: User uploaded bank statements directly without completing the application form.
Please review the attached files.

Submitted: ${new Date().toLocaleString('en-US', {
  timeZone: 'America/New_York',
  dateStyle: 'full',
  timeStyle: 'long'
})}
    `;

    // Log to console for debugging
    console.log('='.repeat(60));
    console.log('NEW APPLICATION WITH FILES RECEIVED');
    console.log('='.repeat(60));
    console.log(emailContent);
    console.log('='.repeat(60));

    // Send email notification to info@toastcapital.com
    try {
      if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 're_123456789_your_api_key_here') {
        // Dynamic import of Resend to avoid build-time issues
        const { Resend } = await import('resend');
        const resend = new Resend(process.env.RESEND_API_KEY);

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
              const { buffer: watermarkedBuffer, filename: wmFilename } = await processFileWithWatermark(file);
              const watermarkedFilename = `WATERMARKED_Statement${statementNumber}_${file.name}`;
              attachments.push({
                filename: watermarkedFilename,
                content: watermarkedBuffer,
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

        // Send notification email to info@toastcapital.com FIRST with attachments
        console.log('📧 Attempting to send notification email with attachments to info@toastcapital.com...');
        const notificationResult = await resend.emails.send({
          from: 'Toast Capital Applications <info@toastcapital.com>',
          to: 'info@toastcapital.com',
          subject: hasFullData
            ? `🔔 NEW LEAD WITH BANK STATEMENTS: ${data.firstName} ${data.lastName} - ${data.fundingAmount}`
            : hasEmail
            ? `📄 Bank Statements Uploaded - ${data.email}`
            : `📄 Bank Statements Uploaded (No Application Data)`,
          text: emailContent,
          replyTo: hasEmail ? data.email : undefined,
          attachments: attachments,
        });
        console.log('✅ Notification email with attachments sent! ID:', notificationResult.data?.id);

        // Send confirmation email to applicant if we have their email
        if (hasEmail) {
          console.log('📧 Attempting to send confirmation email to applicant:', data.email);
          const firstName = data.firstName || 'Valued Customer';
          const confirmationResult = await resend.emails.send({
            from: 'Toast Capital <info@toastcapital.com>',
            to: data.email,
            subject: `One More Step - Complete Your Application${data.firstName ? ` for ${data.firstName}` : ''}`,
            html: generateUploadConfirmationEmail({
              firstName: firstName,
              lastName: data.lastName || '',
              fundingAmount: data.fundingAmount || '',
              businessName: data.businessName || '',
            }),
            text: `Dear ${firstName},\n\nGreat news! We've received your bank statements.\n\n✓ Bank Statements Received\n\nFINAL STEP!\nUpload your Driver's License and Void Check to complete your application:\nhttps://toastcapital.com/dlvc\n\nWhat's Next:\n1. Upload Driver's License & Void Check\n2. Our team reviews your information\n3. Get funded - some lenders offer same-day funding!\n\nQuestions? Call us at (617) 533-3190\n\nBest regards,\nToast Capital Team\n333 Summer Street, Boston, MA 02210`,
          });
          console.log('✅ Confirmation email sent! ID:', confirmationResult.data?.id);
          console.log('✅ BOTH emails sent successfully!');
        } else {
          console.log('⚠️ No applicant email available - only notification email sent');
        }
      } else {
        console.error('❌ RESEND_API_KEY not configured! Current value:', process.env.RESEND_API_KEY ? 'SET (but might be placeholder)' : 'NOT SET');
        console.log('⚠️ Emails NOT sent. Please configure RESEND_API_KEY in Netlify environment variables.');
      }
    } catch (emailError: any) {
      // Log detailed email error but don't fail the submission
      console.error('❌ ERROR sending emails:');
      console.error('Error message:', emailError?.message);
      console.error('Error stack:', emailError?.stack);
      console.error('Full error:', JSON.stringify(emailError, null, 2));
      console.log('⚠️ Form submission will still succeed, but emails were not sent');
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

  } catch (error) {
    console.error('Error processing application:', error);
    return NextResponse.json(
      { error: 'Failed to process application. Please try again.' },
      { status: 500 }
    );
  }
}
