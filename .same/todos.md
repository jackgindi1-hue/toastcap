# Toast Capital - Status Mar 25

## ✅ JUST DEPLOYED (Version 151) - Supabase Migration
- [x] **Migrated leads storage from Netlify Blobs to Supabase PostgreSQL**
- [x] Bulk import now works instantly (303 leads in ~2 seconds)
- [x] No more rate limiting, batching, or delays
- [x] Ready for large imports (2500+ leads)

---

## Current Architecture

### Lead Storage: **Supabase PostgreSQL**
- **Project URL**: `https://plnzztkvzpbvemkvltvh.supabase.co`
- **Table**: `leads`
- **Key Functions**:
  - `createLead()` - Single lead creation
  - `createLeadsBulk()` - Bulk insert (used by CSV import)
  - `getAllLeads()` - Fetch all leads
  - `updateLead()` - Update single lead
  - `deleteLead()` - Delete single lead
  - `deleteAllLeads()` - Wipe all leads

### Document/Message/Note Storage: **Netlify Blobs**
- Still using Netlify Blobs for:
  - `documents` store - File uploads (bank statements, IDs, etc.)
  - `messages` store - Email/SMS history
  - `notes` store - Admin notes on leads
- These are low-volume operations, so rate limits aren't an issue

### Environment Variables (Netlify)
```
NEXT_PUBLIC_SUPABASE_URL=https://plnzztkvzpbvemkvltvh.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbG... (service role key)
JOTFORM_API_KEY=e8fe28095f36030abeba1485454c83f8
```

---

## Key Files

### Lead Management
- `src/lib/supabase.ts` - Supabase client initialization
- `src/lib/leads-db.ts` - All lead CRUD operations (Supabase-based)
- `src/app/api/leads/import/route.ts` - Bulk import endpoint
- `src/app/api/leads/delete-all/route.ts` - Delete all leads
- `src/components/admin/LeadImportTab.tsx` - CSV import UI

### Application Flow
- `src/app/api/submit-jotform/route.ts` - Quote form submission
- `src/app/api/submit-dlvc/route.ts` - Document upload completion
- `src/lib/email-templates.ts` - All email templates
- `src/lib/drip-emails.ts` - Drip campaign logic

---

## Email Flows

### Pre-DLVC Drips (after quote form)
1. **5 minutes** - "Your funding quote is ready"
2. **2 hours** - "Complete your application"
3. **24 hours** - "Don't miss out on funding"

### Post-DLVC Drips (after document upload)
1. **3 hours** - "Great news! Your funding is approved!"
2. **12 hours** - "Your funding agreement is still waiting"
3. **24 hours** - "Don't let your funding approval expire"

### Cold Outreach Drip (9-step campaign)
- Days: 0, 1, 2, 5, 6, 7, 13, 14, 15
- Alternates between 9 AM and 1 PM sends

---

## Admin Panel Features

### Leads Tab (`/admin`)
- View all leads with filtering
- Click lead to see details, notes, messages
- Update lead stage/status
- Start/pause drip campaigns

### Import Tab
- Upload CSV file
- Auto-detect column mapping
- Preview before import
- **Bulk import via Supabase** (instant)

### Drip Campaign Tab
- View leads in drip campaigns
- Start campaigns for selected leads
- Pause/resume/stop campaigns

---

## Previous Fixes Reference

### Version 144 - EIN Field
- Validates 9 digits in XX-XXXXXXX format

### Version 140 - DLVC Mobile Fix
- Individual file uploads via `/api/upload-single-file`
- Final submission only sends metadata (no attachments)

---

## Database Schema (Supabase)

```sql
CREATE TABLE leads (
  id TEXT PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  phone TEXT,
  phone_verified BOOLEAN,
  business_name TEXT,
  business_type TEXT,
  monthly_revenue TEXT,
  funding_amount TEXT,
  num_locations TEXT,
  stage TEXT,           -- quote, application, dlvc, funded
  status TEXT,          -- new, contacted, in_review, approved, funded, lost
  tags TEXT[],
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  quote_submitted_at TIMESTAMPTZ,
  application_submitted_at TIMESTAMPTZ,
  dlvc_submitted_at TIMESTAMPTZ,
  documents JSONB,
  documents_complete BOOLEAN,
  ready_for_review BOOLEAN,
  drip_campaign TEXT,
  drip_step INTEGER,
  drip_total_steps INTEGER,
  next_drip_at TIMESTAMPTZ,
  drip_paused BOOLEAN,
  drip_completed_at TIMESTAMPTZ,
  email_bounced BOOLEAN,
  last_drip_sent_at TIMESTAMPTZ,
  jotform_submission_id TEXT
);
```
