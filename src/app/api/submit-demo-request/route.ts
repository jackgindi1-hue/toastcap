import { NextRequest, NextResponse } from 'next/server';
import { generateDemoConfirmationEmail } from './email-template';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json();

    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'businessName', 'businessType'];
    const missingFields = requiredFields.filter(field => !formData[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Get business type label
    const businessTypeLabels: Record<string, string> = {
      'full-service': 'Full Service Restaurant',
      'quick-service': 'Quick Service Restaurant',
      'bar-nightclub': 'Bar / Nightclub',
      'other': 'Other Business'
    };
    const businessTypeLabel = businessTypeLabels[formData.businessType] || formData.businessType;

    // Format the email content for team notification
    const emailContent = `
New Demo Request Received

CONTACT INFORMATION:
Name: ${formData.firstName} ${formData.lastName}
Email: ${formData.email}
Phone: ${formData.phone}

BUSINESS INFORMATION:
Business Name: ${formData.businessName}
Business Type: ${businessTypeLabel}
${formData.monthlyRevenue ? `Monthly Revenue: ${formData.monthlyRevenue}\n` : ''}

Submitted: ${new Date().toLocaleString('en-US', {
  timeZone: 'America/New_York',
  dateStyle: 'full',
  timeStyle: 'long'
})}

Action Required: Please contact this lead within 2 hours.
The user has been directed to the /upload page to complete their application.
    `;

    // Log to console for debugging
    console.log('='.repeat(60));
    console.log('NEW DEMO REQUEST RECEIVED');
    console.log('='.repeat(60));
    console.log(emailContent);
    console.log('='.repeat(60));

    // Send email notifications
    try {
      if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 're_123456789_your_api_key_here') {
        const { Resend } = await import('resend');
        const resend = new Resend(process.env.RESEND_API_KEY);

        // Send notification email to team
        console.log('📧 Sending demo request notification to team...');
        const notificationResult = await resend.emails.send({
          from: 'Toast Capital Demo Requests <info@toastcapital.com>',
          to: 'info@toastcapital.com',
          subject: `🎯 NEW DEMO REQUEST: ${formData.firstName} ${formData.lastName} - ${formData.businessName}`,
          text: emailContent,
          replyTo: formData.email,
        });
        console.log('✅ Team notification sent! ID:', notificationResult.data?.id);

        // Send confirmation email to user
        console.log('📧 Sending confirmation email to user...');
        const confirmationResult = await resend.emails.send({
          from: 'Toast Capital <info@toastcapital.com>',
          to: formData.email,
          subject: `Welcome ${formData.firstName}! Your Toast Capital Demo Request`,
          html: generateDemoConfirmationEmail({
            firstName: formData.firstName,
            lastName: formData.lastName,
            businessName: formData.businessName,
            businessType: businessTypeLabel,
          }),
          text: `Hi ${formData.firstName},\n\nThank you for your interest in Toast Capital!\n\nWe've received your demo request for ${formData.businessName}. A funding specialist will reach out to you within 24 hours to discuss how we can help your business grow.\n\nIn the meantime, you can continue with your application by uploading your documents at https://toastcapital.com/upload\n\nQuestions? Call us at (617) 533-3190.\n\nBest regards,\nThe Toast Capital Team`,
        });
        console.log('✅ User confirmation sent! ID:', confirmationResult.data?.id);

      } else {
        console.log('⚠️ RESEND_API_KEY not configured. Emails not sent.');
      }
    } catch (emailError: any) {
      console.error('❌ Error sending emails:', emailError?.message);
      // Don't fail the request if email fails
    }

    return NextResponse.json({
      success: true,
      message: 'Demo request submitted successfully',
      requestId: `DEMO-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    });
  } catch (error) {
    console.error('Error processing demo request:', error);
    return NextResponse.json(
      { error: 'Failed to process demo request. Please try again.' },
      { status: 500 }
    );
  }
}
