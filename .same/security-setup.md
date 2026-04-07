# Security Setup Guide

## Required Environment Variables

Add these to your Netlify environment variables:

### Authentication (REQUIRED)
```
ADMIN_USERNAME=<your-admin-username>
ADMIN_PASSWORD_HASH=<generate-with-script>
AUTH_SECRET=<random-64-char-string>
```

**NEVER commit actual credentials to code or documentation.**

### Internal API Keys (RECOMMENDED)
```
INTERNAL_API_KEY=your-internal-api-key-for-server-calls
CRON_SECRET=your-cron-secret-for-scheduled-functions
```

### New Environment Variables Required:
- `RESEND_WEBHOOK_SECRET` - Get from Resend dashboard > Webhooks > Signing Secret
- `JOTFORM_WEBHOOK_SECRET` - Create a random string and add to JotForm webhook URL as `?secret=YOUR_SECRET`

## How to Generate a New Password Hash

```bash
node scripts/generate-password-hash.mjs "YourNewPassword" "your-auth-secret"
```

## Protected API Routes

The following routes now require authentication:

### Admin-Only Routes (require login)
- `GET /api/leads` - View all leads
- `POST /api/leads` - Create leads
- `GET/PUT/DELETE /api/leads/[id]` - Manage individual leads
- `GET/POST /api/leads/[id]/documents` - Lead documents
- `GET/POST /api/leads/[id]/notes` - Lead notes
- `POST /api/leads/[id]/send-email` - Send email to lead
- `POST /api/leads/[id]/send-sms` - Send SMS to lead
- `POST /api/leads/import` - Import leads from CSV
- `DELETE /api/leads/delete-all` - Delete all leads
- `POST /api/leads/bulk-send-email` - Bulk email sends
- `GET /api/analytics` - View analytics
- `POST /api/drip/start` - Start drip campaigns
- `POST /api/drip/manage` - Manage drip campaigns
- `GET /api/campaigns/preview` - Preview campaign templates
- `GET/DELETE /api/wipe-all-data` - Data management

### Internal/Cron Routes (require API key or cron secret)
- `GET /api/drip/process` - Process pending drip emails

### Public Routes (no auth required)
- `POST /api/submit-demo-request` - Quote form submission
- `POST /api/submit-dlvc` - Document upload submission
- `POST /api/jotform-submitted` - JotForm webhook
- `POST /api/webhooks/jotform` - JotForm webhook
- `POST /api/webhooks/resend` - Resend webhook (email events)
- `GET /api/track/open` - Email open tracking pixel
- `GET /api/track/click` - Link click tracking
- `POST /api/send-otp` - OTP verification
- `POST /api/verify-otp` - OTP verification

## Removed Debug Routes

The following dangerous routes have been removed:
- `/api/debug-env`
- `/api/debug-leads`
- `/api/debug/*`
- `/api/test-drip`
- `/api/setup-supabase`

## Security Audit Log (Updated: March 31, 2026)

### Issues Fixed:
1. **Removed hardcoded JotForm API key** - `src/app/api/submit-jotform/route.ts` now requires env var
2. **Removed debug console.logs exposing credentials** - Login route no longer logs username/password info
3. **Removed Supabase config debug logs** - `src/app/api/submit-demo-request/route.ts` no longer logs env vars
4. **Removed API key debug logs** - `src/app/api/submit-application/route.ts` and `src/app/api/submit-with-files/route.ts` cleaned
5. **Confirmed no debug/check-env endpoints exist** - All dangerous debug routes removed

### Security Audit v2 (March 31, 2026):
6. **Fixed Open Redirect Vulnerability** - `src/app/api/track/click/route.ts` now validates URLs against whitelist
7. **Added Resend Webhook Signature Verification** - `src/app/api/webhooks/resend/route.ts` requires `RESEND_WEBHOOK_SECRET`
8. **Added JotForm Webhook Secret Verification** - `src/app/api/webhooks/jotform/route.ts` requires `JOTFORM_WEBHOOK_SECRET`
9. **Added OTP Rate Limiting** - `src/app/api/send-otp/route.ts` limits to 5/phone/hour, 10/IP/hour
10. **Removed verbose error logs** - Cleaned up production logging
11. **Deleted duplicate/debug pages** - Removed `/admin-dashboard`, `/admin-check`, `/approval-designs`

### Verified Safe:
- `/api/auth/login` - Rate limited, no credential logging
- `/api/auth/session` - Only returns authenticated status
- `/api/auth/logout` - Safe session destruction
- `src/lib/auth.ts` - Credentials from env vars only

## How Authentication Works

1. **Admin Dashboard Login**
   - User enters username/password
   - Credentials are validated server-side against env vars
   - Secure httpOnly cookie is set with signed session token
   - Token expires after 24 hours

2. **API Authentication**
   - Each protected route checks for valid session cookie
   - Can also use `Authorization: Bearer <token>` header
   - Internal routes can use `X-API-Key` header

3. **Rate Limiting**
   - Login attempts are rate-limited (5 attempts per 15 minutes)
   - Failed attempts are logged with IP address

## Security Headers

Already configured in `netlify.toml`:
- `Strict-Transport-Security` - Forces HTTPS
- `X-Frame-Options` - Prevents clickjacking
- `X-Content-Type-Options` - Prevents MIME sniffing
- `X-XSS-Protection` - XSS protection
- `Referrer-Policy` - Strict referrer policy
