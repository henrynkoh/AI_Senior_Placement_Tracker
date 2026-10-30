# Email provider integration runbook — blocked until authorized

## Verified 2026-10-30
- 7 recipient and 7 proposed sender addresses saved in encrypted Vercel settings.
- One ChatGPT Gmail connection is verified for `henrynkoh@gmail.com`. This is **NOT** an OAuth grant to Vercel.
- No Gmail aliases or university account send-as verification established.
- Mail delivery remains off; there are no provider credentials and no validated production email provider.
- Draft/review/approval demo is **browser-local and fictional only**. It is not a permanent audit trail.

## Recommended implementation
1. Set up an owned Google Cloud OAuth app (or a verified domain-based transactional email provider) with data handling policies and least-privilege scopes.
2. Each sender account must authorize the application, or an admin must explicitly grant delegated send-as. Query Gmail `users.settings.sendAs.list` with applicable permission and require a verified send-as address. Do not assume all seven listed addresses belong to one login.
3. Complete Google consent-screen verification if required. Store refresh credentials only in a secret manager with least privilege, not in GitHub, browser localStorage or client bundles.
4. Store drafts, consent receipts, approval event with authenticated approver identity, immutable delivery events, retries/idempotency and retention controls in a dedicated secured production database.
5. Use a server-side policy and do not expose an executable send route until all auth, sender verification, consent, human approval and privacy gates pass. `api/email/send.js` intentionally responds 503 for every POST.
6. Confirm the applicable university mail account restrictions, domain administration rights and sender policy. Do not spoof university domains.
7. Test refusal of unauthorized senders and non-consenting cases, provider failures, duplicate submissions, rate limits, and rollback in a protected environment.

Official references:
- https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.settings.sendAs
- https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.messages/send
- https://developers.google.com/workspace/gmail/api/auth/scopes

## Status
No message has been sent. No verified seven-account sending integration exists.
