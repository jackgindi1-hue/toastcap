import { NextRequest, NextResponse } from 'next/server';
import { getOverallStats, getDailyMetrics, getTemplateMetrics } from '@/lib/analytics-db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET /api/analytics - Get overall stats and metrics
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'overview', 'daily', 'templates'
    const days = parseInt(searchParams.get('days') || '30');
    const templateType = searchParams.get('templateType') as 'email' | 'sms' | undefined;

    if (type === 'daily') {
      const metrics = await getDailyMetrics(days);
      return NextResponse.json({ success: true, metrics });
    }

    if (type === 'templates') {
      const metrics = await getTemplateMetrics(templateType);
      return NextResponse.json({ success: true, metrics });
    }

    // Default: overview
    const stats = await getOverallStats();
    const dailyMetrics = await getDailyMetrics(7); // Last 7 days for chart
    const emailTemplates = await getTemplateMetrics('email');
    const smsTemplates = await getTemplateMetrics('sms');

    return NextResponse.json({
      success: true,
      stats,
      dailyMetrics,
      emailTemplates,
      smsTemplates,
    });
  } catch (error: any) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
