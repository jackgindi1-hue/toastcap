import { NextRequest, NextResponse } from 'next/server';
import { generateDemoConfirmationEmail } from './email-template';
import { getDripEmail1, getDripEmail2, getDripEmail3 } from './drip-emails';
import { findLeadByEmail, stopDripCampaign, createLead, updateLead } from '@/lib/leads-db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  console.log('\n📝 QUOTE SUBMISSION - ' + new Date().toISOString());

  try {
    const formData = await request.json();

    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'businessName'];
    const missingFields = requiredFields.filter(field => !formData[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    console.log('📋 Lead:', formData.firstName, formData.lastName, '-', formData.businessName);

    // ============================================
    // CREATE OR UPDATE LEAD IN CRM DATABASE
    // ============================================
    let leadId = '';
    try {
      const existingLead = await findLeadByEmail(formData.email);

      if (existingLead) {
        // Update existing lead (e.g., from CSV import or cold outreach)
        console.log('📊 Updating existing lead in CRM...');
        const updated = await updateLead(existingLead.id, {
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          businessName: formData.businessName,
          monthlyRevenue: formData.monthlyRevenue || undefined,
          stage: 'quote',
          quoteSubmittedAt: new Date().toISOString(),
        });
        if (updated) {
          leadId = existingLead.id;
          console.log('✅ Lead updated in CRM! ID:', leadId);
        } else {
          console.error('❌ Lead update returned null - Supabase may be misconfigured');
        }

        // STOP COLD OUTREACH DRIP - They filled out the quote!
        if (existingLead.dripCampaign) {
          await stopDripCampaign(existingLead.id);
          console.log('🛑 Stopped cold outreach drip for:', formData.email);
        }
      } else {
        // Create new lead
        console.log('📊 Creating new lead in CRM...');
        const newLead = await createLead({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          businessName: formData.businessName,
          monthlyRevenue: formData.monthlyRevenue || undefined,
          stage: 'quote',
          status: 'new',
          tags: [],
          quoteSubmittedAt: new Date().toISOString(),
        });
        if (newLead && newLead.id) {
          leadId = newLead.id;
          console.log('✅ Lead created in CRM! ID:', leadId);
        } else {
          console.error('❌ Lead creation returned invalid result - Supabase may be misconfigured');
          console.error('   Result:', JSON.stringify(newLead));
        }
      }
    } catch (leadError: any) {
      console.error('⚠️ CRM lead operation failed:', leadError?.message);
      console.error('   Stack:', leadError?.stack);
      // Don't fail the whole submission if CRM creation fails
    }

    // SEND EMAILS
    const apiKey = process.env.RESEND_API_KEY;

    if (apiKey && apiKey.startsWith('re_')) {
      try {
        const { Resend } = await import('resend');
        const resend = new Resend(apiKey);

        // Send both critical emails in parallel
        const [supportResult, userResult] = await Promise.all([
          // Support notification
          resend.emails.send({
            from: 'Toast Capital Support <support@toastcap.com>',
            to: 'support@toastcap.com',
            subject: `🔔 NEW LEAD: ${formData.firstName} ${formData.lastName} - ${formData.businessName}`,
            text: `
NEW QUOTE REQUEST
=================
Name: ${formData.firstName} ${formData.lastName}
Email: ${formData.email}
Phone: ${formData.phone}
Business: ${formData.businessName}
Monthly Revenue: ${formData.monthlyRevenue || 'Not provided'}

User is proceeding to /upload for verification.
            `,
            replyTo: formData.email,
          }),

          // User confirmation
          resend.emails.send({
            from: 'Toast Capital Support <support@toastcap.com>',
            to: formData.email,
            bcc: 'support@toastcap.com',
            subject: `Welcome ${formData.firstName}! Your Toast Capital Application`,
            html: generateDemoConfirmationEmail({
              firstName: formData.firstName,
              lastName: formData.lastName,
              businessName: formData.businessName,
              businessType: formData.businessType || 'Restaurant',
            }),
          }),
        ]);

        if (supportResult.data?.id) console.log('✅ Support email sent');
        if (userResult.data?.id) console.log('✅ User email sent');

        // PRE-DLVC DRIP EMAILS - NO BCC (drips don't get BCC, only trigger emails do)
        // These run in background after response is sent
        Promise.allSettled([
          resend.emails.send({
            from: 'Toast Capital Support <support@toastcap.com>',
            to: formData.email,
            subject: `${formData.firstName}, here's why restaurant owners trust Toast Capital`,
            html: getDripEmail1(formData.firstName, formData.businessName),
            scheduledAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(), // 5 minutes
          }),
          resend.emails.send({
            from: 'Toast Capital Support <support@toastcap.com>',
            to: formData.email,
            subject: `${formData.firstName}, you could have funding as soon as tomorrow`,
            html: getDripEmail2(formData.firstName, formData.businessName),
            scheduledAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours
          }),
          resend.emails.send({
            from: 'Toast Capital Support <support@toastcap.com>',
            to: formData.email,
            subject: `${formData.firstName}, don't let your verification expire`,
            html: getDripEmail3(formData.firstName, formData.businessName),
            scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
          }),
        ]).then(results => {
          const count = results.filter(r => r.status === 'fulfilled' && (r.value as any).data?.id).length;
          console.log(`📧 Drip emails scheduled: ${count}/3`);
        }).catch(() => {});

      } catch (emailError: any) {
        console.error('❌ Email error:', emailError?.message);
      }
    }

    console.log('✅ Quote submission complete\n');

    // Return immediately - drips schedule in background
    return NextResponse.json({
      success: true,
      message: 'Demo request submitted successfully',
    });

  } catch (error: any) {
    console.error('❌ Quote error:', error?.message);
    return NextResponse.json(
      { error: 'Failed to process request. Please try again.' },
      { status: 500 }
    );
  }
}
