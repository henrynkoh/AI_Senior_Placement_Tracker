# Release plan and verified status (2026-10-30)

## Verified
- Connected GitHub repository initially empty; standalone prototype developed on `develop/fictional-demo-audit` and retained as draft PR #1.
- GitHub Actions static and Chromium end-to-end jobs succeeded on run 41115791201.
- Vercel authorization succeeded, but **new Vercel project creation rejected**: Hobby team has reached its 200-project quota. No existing project was deleted or repurposed.
- Connected Supabase account contains two **INACTIVE** existing projects named `suna` and `ai-kjv`. Both appear unrelated. Neither was modified. A Supabase company GitHub URL is not a personal database.
- User's localhost tracker is readable in an open browser tab, but filesystem/code access from this session is not available.

## Exact production blockers
1. Obtain the original `senior-placement-tracker` source to reconcile UI, fields, workflows, human reviews, and safety assertions. Current demo is **not** a code migration.
2. Free one Vercel project slot explicitly or use an approved hosting plan/team. Never delete/overwrite another project without reviewing ownership, traffic, and data.
3. Provision a **dedicated** Supabase project, not either unrelated inactive project, after evaluating billing and authorization.
4. Implement Supabase Auth, role permissions, strictly scoped RLS, backend validation, audit logs, backups and restore drills. `docs/proposed-supabase-schema.sql` is *not deployed* and contains fictional data only.
5. Validate real-world Washington referral agency obligations and privacy/security controls before accepting client information or disclosing family details.
6. Add real production integration tests, session and consent adversarial tests, accessible UI audit, observability, uptime checks, load tests, performance budgets, incident response, backup and rollback.
7. Perform protected preview deployment, security tests and release gate review. No actual customer account data or outbound contacts before that.

## Release rules
- No real-client data in public GitHub, AI tools, demos, client-side localStorage, or unsecured endpoints.
- Do not represent fake test cases as real Medicaid determinations or bed confirmations.
- Browser demo checks are not proof of production security or compliance.
- Disallow public real-client intake until written verification of controls and explicit go-live approval.
