import { NextRequest, NextResponse } from 'next/server';
import { markEmailBouncedByAddress } from '@/lib/leads-db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// POST /api/webhooks/resend - Receive Resend webhook events
export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();

    // Resend webhook event types we care about:
    // - email.bounced
    // - email.complained (spam complaint)

    const eventType = payload.type;
    const data = payload.data;

    console.log(`Resend webhook received: ${eventType}`, JSON.stringify(data).slice(0, 200));

    if (eventType === 'email.bounced' || eventType === 'email.complained') {
      // Get the recipient email
      const email = data?.to?.[0] || data?.email;

      if (email) {
        // Mark this email as bounced in our system
        const result = await markEmailBouncedByAddress(email);

        if (result) {
          console.log(`Marked email as bounced: ${email}, lead: ${result.id}`);
        } else {
          console.log(`Email not found in leads: ${email}`);
        }
      }
    }

    // Always return 200 to acknowledge receipt
    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Resend webhook error:', error);
    // Still return 200 to prevent retries
    return NextResponse.json({ received: true, error: error.message });
  }
}

// GET endpoint for webhook verification (if needed)
export async function GET() {
  return NextResponse.json({ status: 'Resend webhook endpoint active' });
}
