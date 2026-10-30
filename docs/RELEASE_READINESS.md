# Release readiness and compliance gates

**CURRENT STATUS: DEMO ONLY — NOT A PUBLIC CLIENT INTAKE SERVICE.**

## Independently verified
- GitHub repo development branch and draft PR #1.
- Static CI and Chromium Playwright job on Ubuntu 24.04 succeeded (run 41115791201).
- Vercel team access authorized, but new-project creation returned `too_many_projects` (200 Hobby projects).
- Supabase account contained only unrelated inactive projects `suna` and `ai-kjv`; no dedicated Senior Placement backend exists.

## Compliance research (Washington)
- RCW 18.330.020: insurance, independence and required agency identification on websites.
- RCW 18.330.040: referral and agreement records; six-year retention requirements.
- RCW 18.330.050: client disclosure acknowledgment before referrals.
- RCW 18.330.060: standardized intake before referrals, including sensitive health/support needs.
- RCW 18.330.070: provider vetting, contact and documented verification before referral.

See official chapter https://app.leg.wa.gov/rcw/default.aspx?cite=18.330&full=true

**Important:** Unlike a fictional demo, a legally compliant real-client referral intake may require medical, medication and financial information. Do not simply block all such fields and then claim legal compliance. Instead, design a separately verified private workflow for minimally necessary sensitive information, with legal/privacy advice, encryption, access controls, audit and retention policy. Never place such information in a public GitHub repo, browser localStorage, general AI prompt, or unmanaged analytics.

## Release blockers
1. Obtain original Mac localhost source and perform full code/data migration (cannot read user's computer from this connector).
2. Dedicated database (not unrelated Supabase projects); authenticate users and test owner-scoped RLS under multiple identities.
3. Browser-based authorization tests, request validation, backup and restore drills, service monitoring and privacy review.
4. Comply with applicable RCW 18.330 referral disclosures, intake, provider checks, record retention and business requirements.
5. Obtain an available Vercel project slot or explicitly authorize plan upgrade; do not delete/repurpose existing resources without identification.
6. Protected staging deployment followed by live deployment checks.
7. Independent public-release acceptance review; no automated referral messages before consent.

## Database
`database/secure-fictional-schema.sql` is **draft SQL, not an applied migration**. It intentionally only handles fictional data. To support real clients, complete the privacy and compliance design before modifying the database schema.

## Security and operations
- Do not put secrets in public client bundles or Git.
- Use Supabase publishable key only in public client; never service role key.
- Require server-side checks for authorization and every eligibility claim; model outputs are only suggestions.
- Validate RLS after any change using both same-owner and cross-owner tokens.
- Document 6-year referral record retention, lawful deletion exceptions, export requests and access logs.
- Add authenticated audit trail before actual case operations.
