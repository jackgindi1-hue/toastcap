# Toast Capital Project Rules

## CRITICAL: Git Backup with Every Deploy

**ALWAYS push to GitHub with every deploy for safety!**

### GitHub Repository
- **URL**: https://github.com/jackgindi1-hue/toastcap
- **Visibility**: Private
- **Branch**: master

### Workflow (MUST FOLLOW)

1. **Before making changes**: Commit current state as backup
   ```bash
   cd toastcap && git add -A && git commit -m "Pre-changes backup: [description]"
   ```

2. **After making changes**: Commit the changes
   ```bash
   cd toastcap && git add -A && git commit -m "Version X: [description]"
   ```

3. **Before every deploy**: Push to GitHub
   ```bash
   cd toastcap && git push origin master
   ```

4. **Deploy to Netlify**

### Why This Matters
- Git push is SAFE - it only copies data, never deletes
- If AI makes editing mistakes, we can recover with `git checkout`
- Full history of every change is preserved on GitHub
- Easy rollback: `git reset --hard <commit>` or `git checkout <commit> -- <file>`

### Recovery Commands
```bash
# See what changed
git diff

# Undo all uncommitted changes
git checkout .

# Go back to specific commit
git reset --hard <commit-hash>

# Restore specific file from commit
git checkout <commit-hash> -- path/to/file
```

---

## Other Project Rules

### Email Sending
- All applicant emails should BCC support@toastcapital.com
- Drip emails send at 9 AM and 1 PM Eastern Time
- Always use proper Eastern Time handling (DST-aware)

### Database
- Leads stored in Supabase PostgreSQL
- Analytics engagement data in Netlify Blobs (can be reset if corrupted)

### Deployment
- Deploy as dynamic site (not static) - has API routes
- Site URL: https://toastcapital.com

## FORBIDDEN ACTIONS
1. **DO NOT change ANYTHING without explicit user permission**
2. DO NOT change email subject lines without permission
3. DO NOT add or remove UI sections without permission
4. DO NOT modify email templates without permission
5. DO NOT change the user flow without permission

## BEFORE MAKING ANY CHANGE
1. Ask the user for permission
2. Explain exactly what will change
3. Wait for approval

## CURRENT APPROVED CONFIGURATIONS

### Email Subject Lines (LOCKED - DO NOT CHANGE)
- DLVC Support Email: `🎯 DLVC: ${firstName} ${lastName} - ${businessName} COMPLETED! (ALL 5 DOCS)`
- Quote Support Email: `🔔 NEW LEAD: ${firstName} ${lastName} - ${businessName}`
- JotForm Support Email: `🎯 Application: ${firstName} ${lastName} - ${businessName}`

### Pre-DLVC Drip Subjects (LOCKED):
1. `${firstName}, here's why restaurant owners trust Toast Capital`
2. `${firstName}, you could have funding as soon as tomorrow`
3. `${firstName}, don't let your verification expire`

### Post-DLVC Drip Subjects (LOCKED):
1. `${firstName}, great news! Your funding is approved!`
2. `${firstName}, your funding agreement is still waiting`
3. `${firstName}, don't let your funding approval expire`

### DLVC Page (LOCKED)
- NO contact information section at bottom
- Just file uploads and submit button

## DO NOT REMOVE
- Netlify Blobs (leads-db.ts)
- Pre-DLVC drip emails
- Post-DLVC drip emails
- Admin dashboard functionality
