import { NextRequest, NextResponse } from 'next/server';

// Twilio Verify credentials
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_VERIFY_SERVICE_SID = process.env.TWILIO_VERIFY_SERVICE_SID;

// ============================================
// RATE LIMITING - Prevent SMS bombing/abuse
// ============================================
const otpAttempts = new Map<string, { count: number; firstAttempt: number; lastAttempt: number }>();
const MAX_OTP_PER_PHONE_PER_HOUR = 5; // Max OTPs per phone number per hour
const MAX_OTP_PER_IP_PER_HOUR = 10; // Max OTPs per IP per hour
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour

function getClientIP(request: NextRequest): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
         request.headers.get('x-real-ip') ||
         'unknown';
}

function checkRateLimit(key: string, maxAttempts: number): { allowed: boolean; remaining: number; resetIn: number } {
  const now = Date.now();
  const attempts = otpAttempts.get(key);

  if (!attempts) {
    otpAttempts.set(key, { count: 1, firstAttempt: now, lastAttempt: now });
    return { allowed: true, remaining: maxAttempts - 1, resetIn: RATE_LIMIT_WINDOW_MS };
  }

  // Reset if window has passed
  if (now - attempts.firstAttempt > RATE_LIMIT_WINDOW_MS) {
    otpAttempts.set(key, { count: 1, firstAttempt: now, lastAttempt: now });
    return { allowed: true, remaining: maxAttempts - 1, resetIn: RATE_LIMIT_WINDOW_MS };
  }

  // Check if over limit
  if (attempts.count >= maxAttempts) {
    const resetIn = RATE_LIMIT_WINDOW_MS - (now - attempts.firstAttempt);
    return { allowed: false, remaining: 0, resetIn };
  }

  // Increment and allow
  attempts.count++;
  attempts.lastAttempt = now;
  return { allowed: true, remaining: maxAttempts - attempts.count, resetIn: RATE_LIMIT_WINDOW_MS - (now - attempts.firstAttempt) };
}

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
  const clientIP = getClientIP(request);
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

    // SECURITY: Rate limit by phone number
    const phoneRateLimit = checkRateLimit(`phone:${formattedPhone}`, MAX_OTP_PER_PHONE_PER_HOUR);
    if (!phoneRateLimit.allowed) {
      const minutesLeft = Math.ceil(phoneRateLimit.resetIn / 60000);
      console.warn(`[Security] OTP rate limit exceeded for phone: ${formattedPhone}`);
      return NextResponse.json(
        { error: `Too many verification attempts. Please try again in ${minutesLeft} minutes.` },
        { status: 429 }
      );
    }

    // SECURITY: Rate limit by IP address
    const ipRateLimit = checkRateLimit(`ip:${clientIP}`, MAX_OTP_PER_IP_PER_HOUR);
    if (!ipRateLimit.allowed) {
      const minutesLeft = Math.ceil(ipRateLimit.resetIn / 60000);
      console.warn(`[Security] OTP rate limit exceeded for IP: ${clientIP}`);
      return NextResponse.json(
        { error: `Too many verification attempts from your network. Please try again in ${minutesLeft} minutes.` },
        { status: 429 }
      );
    }

    // Check if Twilio Verify is configured
    if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_VERIFY_SERVICE_SID) {
      console.error('[Config] Twilio Verify not configured');
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
