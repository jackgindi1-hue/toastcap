# Toast Capital CRM - Todos

## Phase 1 - COMPLETE ✅
- [x] Token auto-generation system implemented
- [x] Tokens auto-generated when sending drip/bulk emails
- [x] Token validation for /quote, /upload, /dlvc pages
- [x] Settings tab created for domain management
- [x] Database tables (tokens, settings) created in Supabase
- [x] Deployed to toastcap.com

## Phase 2 - CRM Separation - COMPLETE ✅
- [x] CRM deployed to `toastcap-crm.netlify.app`
- [x] All env vars copied to new site
- [x] Same database shared between both sites
- [x] Tracking domain set to `toastcap-crm.netlify.app` (bulletproof)
- [x] JotForm webhook → `toastcap-crm.netlify.app/api/webhooks/jotform`
- [x] Resend webhook → `toastcap-crm.netlify.app/api/webhooks/resend`
- [x] Email images (logo) served from bulletproof CDN

## Phase 3 - Token-Protected Site - COMPLETE ✅
- [x] Homepage (`/`) requires valid token to view
- [x] All public pages require tokens: `/`, `/quote`, `/upload`, `/dlvc`, `/privacy`
- [x] Without token → Generic 404 (no branding)
- [x] With valid token → Full page content
- [x] Internal links pass token through
- [x] CRM domain (`toastcap-crm.netlify.app`) continues to hide all non-essential pages

## Phase 3.5 - Session-Based Navigation - COMPLETE ✅
- [x] Token stored in sessionStorage after first validation
- [x] Users can browse site freely after validating once
- [x] Clicking logo/internal links maintains session
- [x] No need for `?token=xxx` in every URL after first validation
- [x] Click consumption only happens on first URL visit (prevents double-counting)
- [x] All pages (homepage, quote, upload, dlvc, privacy) use same session system

## April 6, 2026 - Bug Fixes ✅
- [x] Settings tab restored to CRM (was imported but missing from tabs array and render)
- [x] Cold outreach templates now use V2 versions with unique content
- [x] Flow tab updated with accurate 11-email drip campaign info
- [x] All 11 cold outreach emails now have distinct visual elements

## How Session-Based Navigation Works
```
FIRST VISIT (from email link):
┌─────────────────────────────────────────────────┐
│ User clicks: toastcap.com/quote?token=abc123    │
│ → Token found in URL                            │
│ → API validates token ✓                         │
│ → Token stored in sessionStorage                │
│ → Click consumed (tracked)                      │
│ → User sees /quote page                         │
└─────────────────────────────────────────────────┘

SUBSEQUENT NAVIGATION (clicking around site):
┌─────────────────────────────────────────────────┐
│ User clicks logo → goes to /                    │
│ → No token in URL                               │
│ → Check sessionStorage → token found!           │
│ → API validates token ✓                         │
│ → Click NOT consumed (already counted)          │
│ → User sees homepage                            │
│                                                 │
│ User clicks "Get Started" → goes to /quote      │
│ → Same flow, session maintained ✓               │
└─────────────────────────────────────────────────┘

SESSION ENDS:
┌─────────────────────────────────────────────────┐
│ User closes browser tab                         │
│ → sessionStorage cleared automatically          │
│ → Next visit requires new email link            │
└─────────────────────────────────────────────────┘
```

## Architecture Summary
```
┌─────────────────────────────────────┐
│       toastcap.com (PUBLIC)         │
│       TOKEN-PROTECTED SITE          │
│                                     │
│  /?token=xxx        → Homepage      │
│  /quote?token=xxx   → Quote form    │
│  /upload?token=xxx  → Upload docs   │
│  /dlvc?token=xxx    → DLVC form     │
│  /privacy?token=xxx → Privacy page  │
│                                     │
│  Without token:     → 404 (blank)   │
│                                     │
│  After first validation:            │
│  All pages accessible via session!  │
└─────────────────────┬───────────────┘
                      │
┌─────────────────────┴───────────────┐
│  toastcap-crm.netlify.app (HIDDEN)  │
│  BULLETPROOF CRM BACKEND            │
│                                     │
│  /crm               → Admin panel   │
│  /api/*             → All APIs      │
│  /logo.png          → Email CDN     │
│                                     │
│  Everything else:   → 404 (blank)   │
└─────────────────────┬───────────────┘
                      │
                      ▼
            ┌─────────────────┐
            │    Supabase     │
            │  (Shared DB)    │
            │  - leads        │
            │  - tokens       │
            │  - settings     │
            └─────────────────┘
```

## If toastcap.com Goes Down:
1. Go to toastcap-crm.netlify.app/crm
2. Go to Settings tab
3. Toggle send-from domain to backup (e.g., toastcap.net)
4. Toggle landing domain to backup
5. Update email templates to use new domain
6. Drips continue, emails send, images work, tracking works!

## User Action Items (When Ready)
- [ ] Buy backup domains (toastcap.net, toastcapital.co, etc.)
- [ ] Verify backup domains in Resend
- [ ] Add backup domains in Settings tab

## ALL TECHNICAL IMPLEMENTATION COMPLETE ✅
