import { NextRequest, NextResponse } from 'next/server';
import { getTemplateHtml, getTemplateSubject } from '@/lib/email-templates';
import { requireAuth } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET /api/campaigns/preview?templateId=cold_approved&firstName=John&businessName=Sample%20Restaurant
// PROTECTED - requires authentication to prevent exposure of email templates
export async function GET(request: NextRequest) {
  // Require authentication
  const authError = await requireAuth(request);
  if (authError) return authError;

  const templateId = request.nextUrl.searchParams.get('templateId');

  if (!templateId) {
    return NextResponse.json({ error: 'templateId is required' }, { status: 400 });
  }

  // Use parameters or sample data for preview
  const firstName = request.nextUrl.searchParams.get('firstName') || 'John';
  const businessName = request.nextUrl.searchParams.get('businessName') || 'Sample Restaurant';

  const html = getTemplateHtml(templateId, firstName, businessName);
  const subject = getTemplateSubject(templateId, firstName, businessName);

  if (!html) {
    return NextResponse.json({ error: 'Template not found' }, { status: 404 });
  }

  return NextResponse.json({
    templateId,
    subject,
    html,
  });
}
