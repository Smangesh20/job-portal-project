# AskYaCham Deployment and Domain Cutover Runbook

Last updated: 2026-03-10

## 1) Decision Summary

For the current full solution (React frontend + Node backend + Mongo + voice features), Streamlit Community Cloud is not the best primary production host.

Why:
- Streamlit Community Cloud deploys apps on `*.streamlit.app` subdomains.
- It supports custom subdomains on `streamlit.app`, not direct custom root domain hosting for `askyacham.com`.
- Apps without traffic can hibernate after inactivity (documented behavior).
- Shared resource limits apply and may change.

Use Streamlit Community Cloud only for:
- Public demo apps
- Side tools or prototypes
- Optional learning micro-apps

Use a full-stack platform (or split frontend/backend platforms) for production AskYaCham.

## 2) Recommended Production Topology

Option A (simple split):
- Frontend: Vercel or Netlify
- Backend API: Render / Railway / Fly.io
- Database: MongoDB Atlas
- Domain DNS: Namecheap (or Cloudflare + Namecheap registrar)

Option B (single host):
- Full stack on one VPS or PaaS with reverse proxy
- Domain and SSL managed on that host

## 3) Pre-Cutover Checklist

Before changing DNS:
1. Freeze deploys on the old production for 30-60 minutes.
2. Export all existing DNS records from Namecheap (A, CNAME, MX, TXT, CAA).
3. Record current TTL values.
4. Keep email records safe (MX/SPF/DKIM/DMARC) so email does not break.
5. Set new target infrastructure live first and verify with temporary URL.
6. Lower TTL (for existing records) to 300 at least a few hours before cutover.

## 4) Namecheap Cutover Steps

## Path 1: Hosting provider gives nameservers (most complete cutover)
1. Namecheap -> Domain List -> Manage (`askyacham.com`)
2. Nameservers -> `Custom DNS`
3. Enter provider nameservers (e.g., `ns1...`, `ns2...`)
4. Save
5. Recreate DNS records (especially email) at new DNS provider

## Path 2: Keep Namecheap BasicDNS and point records manually
1. Namecheap -> Domain List -> Manage -> `Advanced DNS`
2. Remove/replace conflicting old web records:
   - old `A @`
   - old `CNAME www`
   - old URL Redirect records for `@`/`www`
3. Add new records provided by host:
   - `A @ -> <new frontend IP>` (or ALIAS if required)
   - `CNAME www -> <provider target>`
   - API subdomain example: `CNAME api -> <backend target>`
4. Do not delete mail records:
   - MX
   - SPF TXT
   - DKIM TXT/CNAME
   - DMARC TXT
5. Save all changes

## 5) Post-Cutover Verification

Run checks from terminal:

```powershell
nslookup askyacham.com
nslookup www.askyacham.com
nslookup api.askyacham.com
```

Then verify:
1. `https://askyacham.com` loads
2. `https://www.askyacham.com` loads or redirects correctly
3. Login/OTP works
4. Learning module loads API data
5. Voice assistant widget works
6. SSL certificate valid
7. Email sending/receiving still works

## 6) Rollback Plan

If cutover fails:
1. Restore old DNS records (or old nameservers) immediately.
2. Flush CDN cache if any.
3. Verify old site returns.
4. Reattempt cutover only after fixing root cause.

## 7) GitHub Release Steps

Use a safe branch strategy:

```powershell
git checkout -b release/askyacham-voice-learning
git add .
git commit -m "feat: learning + voice assistant + pwa readiness"
git push -u origin release/askyacham-voice-learning
```

If you prefer direct main push, replace branch name accordingly.

## 8) Notes on “Lifetime Free”

For a production job platform with custom domain, always-on behavior, and growth traffic, no provider should be treated as guaranteed “lifetime free.”

Use free tiers for pilot phase, but plan a small monthly ops budget for reliability and scale.

