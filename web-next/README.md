# South Sound Senior Placement — Next.js concept

**Proposed domain:** southsoundseniorplacement.com (available when checked; not bought or owned).

A modern, responsive Next.js 16 + React 19 + TypeScript demonstration built alongside the original static fictional prototype. All client profiles, timeline entries, and statistics are invented. No real PHI, real lead intake, placement availability, HCS eligibility, verified license, or third-party outbound sending.

## Run
```sh
cd web-next
npm install
npm run dev
```

## Deploy
Use a separate Vercel project with **Root Directory** `web-next` and protect preview and production environments with Vercel authentication. Do not repoint the existing project's production root to this app without separate QA and explicit release approval.

## Security
- No API keys, no browser-side provider token, no live intake or email.
- /api/status is read-only, does not expose addresses, and always reports delivery disabled.
- Search engines disallowed for this internal prototype.
- Do not connect an unverified custom domain to the protected prototype.
- Actual consumer website needs qualified referral-agency review, Washington RCW 18.330 compliance, clear privacy policy, consumer disclosures, licensure claims vetted, authenticated intake/backend, consent, accessibility and secure email provider.
