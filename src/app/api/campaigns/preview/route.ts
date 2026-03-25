import { NextRequest, NextResponse } from 'next/server';
import { getTemplateHtml } from '@/lib/email-templates';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET /api/campaigns/preview?template=cold_approved&firstName=John&businessName=Sample Restaurant
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const templateId = searchParams.get('template') || '';
  const firstName = searchParams.get('firstName') || 'John';
  const businessName = searchParams.get('businessName') || 'Sample Restaurant';

  const html = getTemplateHtml(templateId, firstName, businessName);

  if (!html) {
    return NextResponse.json({ error: 'Template not found' }, { status: 404 });
  }

  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html' },
  });
}
