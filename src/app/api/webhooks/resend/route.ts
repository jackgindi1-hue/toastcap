import { NextRequest, NextResponse } from 'next/server';
import { markEmailBouncedByAddress } from '@/lib/leads-db';
import crypto from 'crypto';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// SECURITY: Verify Resend webhook signature
// See: https://resend.com/docs/dashboard/webhooks/verify-webhook-signature
async function verifyResendSignature(request: NextRequest, body: string): Promise<boolean> {
  const webhookSecret = process.env.RESEND_WEBHOOK_SECRET;

  // If no secret configured, reject all webhooks in production
  if (!webhookSecret) {
    if (process.env.NODE_ENV === 'production') {
      console.warn('[Security] RESEND_WEBHOOK_SECRET not configured - rejecting webhook');
      return false;
    }
    // Allow in development without signature
    console.warn('[Security] RESEND_WEBHOOK_SECRET not configured - allowing in dev mode');
    return true;
  }

  const signature = request.headers.get('svix-signature');
  const timestamp = request.headers.get('svix-timestamp');
  const svixId = request.headers.get('svix-id');

  if (!signature || !timestamp || !svixId) {
    console.warn('[Security] Missing Resend webhook headers');
    return false;
  }

  // Check timestamp is within 5 minutes to prevent replay attacks
  const timestampMs = parseInt(timestamp) * 1000;
  const now = Date.now();
  if (Math.abs(now - timestampMs) > 5 * 60 * 1000) {
    console.warn('[Security] Resend webhook timestamp too old');
    return false;
  }

  // Verify signature
  const signedPayload = `${svixId}.${timestamp}.${body}`;
  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(signedPayload)
    .digest('base64');

  // Compare signatures (signature header may have "v1," prefix)
  const signatures = signature.split(' ').map(s => s.replace('v1,', ''));
  return signatures.some(sig => {
    try {
      return crypto.timingSafeEqual(
        Buffer.from(sig, 'base64'),
        Buffer.from(expectedSignature, 'base64')
      );
    } catch {
      return false;
    }
  });
}

// POST /api/webhooks/resend - Receive Resend webhook events
export async function POST(request: NextRequest) {
  try {
    // Get raw body for signature verification
    const body = await request.text();

    // SECURITY: Verify webhook signature
    const isValid = await verifyResendSignature(request, body);
    if (!isValid) {
      console.warn('[Security] Invalid Resend webhook signature - rejecting');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const payload = JSON.parse(body);

    // Resend webhook event types we care about:
    // - email.bounced
    // - email.complained (spam complaint)

    const eventType = payload.type;
    const data = payload.data;

    console.log(`Resend webhook received: ${eventType}`);

    if (eventType === 'email.bounced' || eventType === 'email.complained') {
      // Get the recipient email
      const email = data?.to?.[0] || data?.email;

      if (email) {
        // Mark this email as bounced in our system
        const result = await markEmailBouncedByAddress(email);

        if (result) {
          console.log(`Marked email as bounced: ${email}, lead: ${result.id}`);
        }
      }
    }

    // Always return 200 to acknowledge receipt
    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Resend webhook error:', error?.message);
    // Still return 200 to prevent retries for parse errors
    return NextResponse.json({ received: true, error: 'Parse error' });
  }
}

// GET endpoint for webhook verification (if needed)
export async function GET() {
  return NextResponse.json({ status: 'Resend webhook endpoint active' });
}
