# South Sound Senior Placement Tracker

A privacy-first, bilingual prototype for the Tumwater-area senior-placement coordination workflow.

> **Status: NOT APPROVED FOR REAL CLIENT DATA OR PUBLIC CLIENT INTAKE.** The former localhost project was not present in this GitHub repository at initial audit (2026-10-30); this repository begins as a clean, fictional-data-only baseline.

## Scope
- 40-mile working area around 3571 Cassie Drive SW, Tumwater, Washington.
- Tracks inquiries, consent, HCS/HCA verification questions, AFH placement stages, follow-ups, and operator review.
- Does **not** determine Medicaid / Apple Health / long-term care eligibility, guarantee availability, or send messages.
- No names, SSNs, diagnoses, immigration statuses, or financial account numbers.

## Release gates
1. Import/reconcile original local source before claiming functional equivalence.
2. Authentication and authorization; server-side persistent storage and row-level access enforcement.
3. Consent checks for external outreach; explicit human review for messaging.
4. Input validation, abuse protection, audit logging, retention/deletion and backup/restore tests.
5. Verify current WA referral agency laws (including chapter 18.330 RCW), privacy obligations, and relevant DSHS/HCA documentation.
6. Unit, integration, end-to-end, accessibility, and deployment smoke tests.
7. Authorize use of real client information only after legal/security review.

## Environment
This project intentionally has **no Supabase credentials** and **no real-case records**. The supplied https://github.com/supabase URL is the Supabase company's organization, not a Supabase project.

## Current implementation
A public informational page plus a fictional-only demonstration desk will be added on a development branch. No production suitability is implied.
