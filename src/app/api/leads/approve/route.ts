import { NextRequest, NextResponse } from 'next/server';
import { updateLead, getLeadById } from '@/lib/leads-db';
import { getApprovalEmailHtml, getApprovalEmailSubject, ApprovalDetails } from '@/lib/email-templates';
import { requireAuth } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// POST /api/leads/approve - Approve a lead and send approval email
export async function POST(request: NextRequest) {
  // Require authentication
  const authError = await requireAuth(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const {
      leadId,
      approvedAmount,
      term,
      repaymentType,
      repaymentAmount,
      feeAmount, // Optional: e.g., "$7,500"
      feePercent, // Optional: e.g., "15%"
      totalPayback, // Optional: e.g., "$57,500"
      lendingPartner, // Optional: e.g., "Funded via XYZ Capital"
      verificationLink, // Optional: Link for "Verify Bank and Proceed" button
      sendEmail = true
    } = body;

    if (!leadId || !approvedAmount || !term || !repaymentType || !repaymentAmount) {
      return NextResponse.json(
        { error: 'Missing required fields: leadId, approvedAmount, term, repaymentType, repaymentAmount' },
        { status: 400 }
      );
    }

    // Get the lead
    const lead = await getLeadById(leadId);
    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    // Update lead to approved stage
    await updateLead(leadId, {
      stage: 'approved',
      status: 'approved',
      approvedAt: new Date().toISOString(),
      approvedAmount,
      approvedTerm: term,
      approvedRepaymentType: repaymentType,
      approvedRepaymentAmount: repaymentAmount,
    });

    let emailSent = false;
    let emailId = null;

    // Send approval email if requested and lead has email
    if (sendEmail && lead.email) {
      const apiKey = process.env.RESEND_API_KEY;

      if (apiKey && apiKey.startsWith('re_')) {
        try {
          const { Resend } = await import('resend');
          const resend = new Resend(apiKey);

          const approvalDetails: ApprovalDetails = {
            firstName: lead.firstName || '',
            businessName: lead.businessName || 'Your Business',
            approvedAmount,
            term,
            repaymentType,
            repaymentAmount,
            feeAmount: feeAmount || undefined,
            feePercent: feePercent || undefined,
            totalPayback: totalPayback || undefined,
            lendingPartner: lendingPartner || undefined,
            verificationLink: verificationLink || undefined,
          };

          const result = await resend.emails.send({
            from: 'Toast Capital Support <support@toastcap.com>',
            to: lead.email,
            bcc: 'support@toastcap.com',
            subject: getApprovalEmailSubject(approvalDetails),
            html: getApprovalEmailHtml(approvalDetails),
          });

          if (result.data?.id) {
            emailSent = true;
            emailId = result.data.id;
            console.log('✅ Approval email sent:', result.data.id);
          }
        } catch (emailError: any) {
          console.error('❌ Approval email error:', emailError?.message);
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Lead approved successfully',
      emailSent,
      emailId,
      lead: {
        id: leadId,
        stage: 'approved',
        approvedAmount,
        term,
        repaymentType,
        repaymentAmount,
        lendingPartner: lendingPartner || undefined,
      },
    });
  } catch (error: any) {
    console.error('Approve lead error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to approve lead' },
      { status: 500 }
    );
  }
}
