import { NextRequest, NextResponse } from 'next/server';

// Twilio Verify credentials
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_VERIFY_SERVICE_SID = process.env.TWILIO_VERIFY_SERVICE_SID;

// Format phone number to E.164 format
function formatPhoneE164(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) {
    return `+1${digits}`;
  }
  if (digits.length === 11 && digits.startsWith('1')) {
    return `+${digits}`;
  }
  return `+${digits}`;
}

export async function POST(request: NextRequest) {
  try {
    const { phone } = await request.json();

    if (!phone) {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      );
    }

    // Validate phone number format
    const digits = phone.replace(/\D/g, '');
    if (digits.length < 10) {
      return NextResponse.json(
        { error: 'Please enter a valid 10-digit phone number' },
        { status: 400 }
      );
    }

    const formattedPhone = formatPhoneE164(phone);

    console.log('📱 Sending OTP to:', formattedPhone);

    // Check if Twilio Verify is configured
    if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_VERIFY_SERVICE_SID) {
      console.error('❌ Twilio Verify not configured');
      console.error('  TWILIO_ACCOUNT_SID:', TWILIO_ACCOUNT_SID ? '✓ Set' : '✗ Missing');
      console.error('  TWILIO_AUTH_TOKEN:', TWILIO_AUTH_TOKEN ? '✓ Set' : '✗ Missing');
      console.error('  TWILIO_VERIFY_SERVICE_SID:', TWILIO_VERIFY_SERVICE_SID ? '✓ Set' : '✗ Missing');
      return NextResponse.json(
        { error: 'SMS service not configured. Please contact support.' },
        { status: 500 }
      );
    }

    // Send verification via Twilio Verify API
    const twilioUrl = `https://verify.twilio.com/v2/Services/${TWILIO_VERIFY_SERVICE_SID}/Verifications`;

    const response = await fetch(twilioUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString('base64'),
      },
      body: new URLSearchParams({
        To: formattedPhone,
        Channel: 'sms',
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ Twilio Verify error:', JSON.stringify(data, null, 2));

      // Handle common errors
      if (data.code === 60200) {
        return NextResponse.json(
          { error: 'Invalid phone number. Please check and try again.' },
          { status: 400 }
        );
      }

      if (data.code === 60203) {
        return NextResponse.json(
          { error: 'Too many attempts. Please wait a few minutes and try again.' },
          { status: 429 }
        );
      }

      return NextResponse.json(
        { error: data.message || 'Failed to send verification code. Please try again.' },
        { status: 500 }
      );
    }

    console.log('✅ OTP sent successfully via Twilio Verify! SID:', data.sid);

    return NextResponse.json({
      success: true,
      message: 'Verification code sent to your phone',
    });

  } catch (error: any) {
    console.error('❌ Send OTP error:', error.message);
    return NextResponse.json(
      { error: 'Failed to send verification code. Please try again.' },
      { status: 500 }
    );
  }
}
