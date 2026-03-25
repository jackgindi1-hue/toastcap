import { NextRequest, NextResponse } from 'next/server';
import { trackEmailEvent } from '@/lib/analytics-db';
import { updateMessageStatus } from '@/lib/leads-db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET /api/track/click?url=encodedUrl&mid=messageId&tid=templateId
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');
  const mid = searchParams.get('mid'); // Message ID
  const tid = searchParams.get('tid'); // Template ID
  const tn = searchParams.get('tn'); // Template Name

  // Default redirect URL
  const redirectUrl = url ? decodeURIComponent(url) : 'https://toastcapital.com';

  try {
    if (mid) {
      // Parse leadId from mid (format: leadId-timestamp)
      const parts = mid.split('-');
      const leadId = parts.slice(0, -1).join('-');

      // Track the click event
      await trackEmailEvent({
        leadId: leadId || 'unknown',
        messageId: mid,
        templateId: tid || undefined,
        templateName: tn || undefined,
        eventType: 'clicked',
        metadata: {
          linkUrl: redirectUrl,
          userAgent: request.headers.get('user-agent') || undefined,
        },
      });

      // Update message status
      if (leadId) {
        try {
          await updateMessageStatus(mid, 'clicked', new Date().toISOString());
        } catch {
          // Message might not exist
        }
      }
    }
  } catch (error) {
    console.error('Error tracking email click:', error);
  }

  // Redirect to the actual URL
  return NextResponse.redirect(redirectUrl, { status: 302 });
}
