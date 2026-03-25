import { NextRequest, NextResponse } from 'next/server';
import { getDripEmail1 } from '../submit-demo-request/drip-emails';

// Test endpoint to verify drip email scheduling
// Usage: POST /api/test-drip with { "email": "test@example.com" }
export async function POST(request: NextRequest) {
  try {
    const { email, testType = 'immediate' } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey || apiKey === 're_123456789_your_api_key_here' || !apiKey.startsWith('re_')) {
      return NextResponse.json({
        success: false,
        error: 'RESEND_API_KEY not configured properly',
        debug: {
          keyExists: !!apiKey,
          keyLength: apiKey?.length || 0,
          keyPrefix: apiKey?.substring(0, 10) || 'NOT SET',
        }
      }, { status: 500 });
    }

    const { Resend } = await import('resend');
    const resend = new Resend(apiKey);

    const results: any = {
      timestamp: new Date().toISOString(),
      email,
      testType,
      tests: [],
    };

    // Test 1: Send immediate email
    console.log('🧪 Test: Sending immediate email to', email);
    try {
      const immediateResult = await resend.emails.send({
        from: 'Toast Capital Test <support@toastcapital.com>',
        to: email,
        subject: '🧪 TEST: Immediate Email - Toast Capital',
        html: `<h1>Immediate Test Email</h1><p>This email was sent immediately at ${new Date().toISOString()}</p>`,
      });

      results.tests.push({
        name: 'Immediate Email',
        success: !immediateResult.error,
        id: immediateResult.data?.id,
        error: immediateResult.error,
      });
    } catch (err: any) {
      results.tests.push({
        name: 'Immediate Email',
        success: false,
        error: err.message,
      });
    }

    // Test 2: Schedule email for 1 minute from now
    if (testType === 'scheduled' || testType === 'both') {
      console.log('🧪 Test: Scheduling email for 1 minute from now');
      const scheduledTime = new Date(Date.now() + 60 * 1000); // 1 minute

      try {
        const scheduledResult = await resend.emails.send({
          from: 'Toast Capital Test <support@toastcapital.com>',
          to: email,
          subject: '🧪 TEST: Scheduled Email (1 min) - Toast Capital',
          html: `<h1>Scheduled Test Email</h1><p>This email was scheduled at ${new Date().toISOString()} to be delivered at ${scheduledTime.toISOString()}</p>`,
          scheduledAt: scheduledTime.toISOString(),
        });

        results.tests.push({
          name: 'Scheduled Email (1 min)',
          success: !scheduledResult.error,
          id: scheduledResult.data?.id,
          scheduledFor: scheduledTime.toISOString(),
          error: scheduledResult.error,
        });
      } catch (err: any) {
        results.tests.push({
          name: 'Scheduled Email (1 min)',
          success: false,
          error: err.message,
        });
      }
    }

    // Test 3: Test actual drip email template
    if (testType === 'drip' || testType === 'both') {
      console.log('🧪 Test: Sending drip email 1 immediately');
      try {
        const dripResult = await resend.emails.send({
          from: 'Toast Capital <support@toastcapital.com>',
          to: email,
          subject: "🧪 TEST: Drip Email 1 - Toast Capital",
          html: getDripEmail1('Test', 'Test Business'),
        });

        results.tests.push({
          name: 'Drip Email 1 Template',
          success: !dripResult.error,
          id: dripResult.data?.id,
          error: dripResult.error,
        });
      } catch (err: any) {
        results.tests.push({
          name: 'Drip Email 1 Template',
          success: false,
          error: err.message,
        });
      }
    }

    // Summary
    const successCount = results.tests.filter((t: any) => t.success).length;
    results.summary = {
      total: results.tests.length,
      successful: successCount,
      failed: results.tests.length - successCount,
    };

    console.log('🧪 Test results:', JSON.stringify(results, null, 2));

    return NextResponse.json(results);
  } catch (error: any) {
    console.error('Test error:', error);
    return NextResponse.json(
      { error: error.message || 'Test failed' },
      { status: 500 }
    );
  }
}

// GET endpoint to check API configuration
export async function GET() {
  const apiKey = process.env.RESEND_API_KEY;

  return NextResponse.json({
    status: 'Drip Campaign Test Endpoint',
    apiKeyConfigured: !!apiKey && apiKey !== 're_123456789_your_api_key_here' && apiKey.startsWith('re_'),
    usage: {
      immediate: 'POST with { "email": "your@email.com" }',
      scheduled: 'POST with { "email": "your@email.com", "testType": "scheduled" }',
      drip: 'POST with { "email": "your@email.com", "testType": "drip" }',
      both: 'POST with { "email": "your@email.com", "testType": "both" }',
    },
    timestamp: new Date().toISOString(),
  });
}
