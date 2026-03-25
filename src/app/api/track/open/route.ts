import { NextRequest, NextResponse } from 'next/server';
import { trackEmailEvent } from '@/lib/analytics-db';
import { updateMessageStatus } from '@/lib/leads-db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// 1x1 transparent GIF
const TRACKING_PIXEL = Buffer.from(
  'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
  'base64'
);

// GET /api/track/open?mid=leadId-timestamp&tid=templateId&tn=templateName
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const mid = searchParams.get('mid'); // Message ID (leadId-timestamp format)
    const tid = searchParams.get('tid'); // Template ID
    const tn = searchParams.get('tn'); // Template Name

    if (mid) {
      // Parse leadId from mid (format: leadId-timestamp)
      const parts = mid.split('-');
      const leadId = parts.slice(0, -1).join('-'); // Everything except last part is leadId

      // Track the open event
      await trackEmailEvent({
        leadId: leadId || 'unknown',
        messageId: mid,
        templateId: tid || undefined,
        templateName: tn || undefined,
        eventType: 'opened',
        metadata: {
          userAgent: request.headers.get('user-agent') || undefined,
        },
      });

      // Try to update message status if we have a valid message ID
      if (leadId) {
        try {
          await updateMessageStatus(mid, 'opened', new Date().toISOString());
        } catch {
          // Message might not exist, that's okay
        }
      }
    }
  } catch (error) {
    console.error('Error tracking email open:', error);
  }

  // Always return the tracking pixel
  return new NextResponse(TRACKING_PIXEL, {
    status: 200,
    headers: {
      'Content-Type': 'image/gif',
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
  });
}
