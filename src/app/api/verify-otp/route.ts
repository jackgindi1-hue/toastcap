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
    const { phone, otp } = await request.json();

    if (!phone || !otp) {
      return NextResponse.json(
        { error: 'Phone number and verification code are required' },
        { status: 400 }
      );
    }

    if (otp.length !== 6) {
      return NextResponse.json(
        { error: 'Please enter the 6-digit verification code' },
        { status: 400 }
      );
    }

    const formattedPhone = formatPhoneE164(phone);

    console.log('🔐 Verifying OTP for:', formattedPhone);

    // Check if Twilio Verify is configured
    if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_VERIFY_SERVICE_SID) {
      console.error('❌ Twilio Verify not configured');
      return NextResponse.json(
        { error: 'Verification service not configured. Please contact support.' },
        { status: 500 }
      );
    }

    // Verify the code via Twilio Verify API
    const twilioUrl = `https://verify.twilio.com/v2/Services/${TWILIO_VERIFY_SERVICE_SID}/VerificationCheck`;

    const response = await fetch(twilioUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString('base64'),
      },
      body: new URLSearchParams({
        To: formattedPhone,
        Code: otp,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ Twilio Verify check error:', JSON.stringify(data, null, 2));

      if (data.code === 60202) {
        return NextResponse.json(
          { error: 'Too many failed attempts. Please request a new code.' },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { error: data.message || 'Verification failed. Please try again.' },
        { status: 400 }
      );
    }

    // Check if verification was approved
    if (data.status === 'approved') {
      console.log('✅ OTP verified successfully!');
      return NextResponse.json({
        success: true,
        message: 'Phone number verified successfully',
      });
    } else {
      console.log('❌ OTP verification failed. Status:', data.status);
      return NextResponse.json(
        { error: 'Invalid verification code. Please try again.' },
        { status: 400 }
      );
    }

  } catch (error: any) {
    console.error('❌ Verify OTP error:', error.message);
    return NextResponse.json(
      { error: 'Verification failed. Please try again.' },
      { status: 500 }
    );
  }
}
