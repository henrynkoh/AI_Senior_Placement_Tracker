# Email sender/recipient configuration — not yet active

The Vercel project `ai-senior-placement-tracker` now has these encrypted environment variables for production, preview and development:

- `ALLOWED_OUTBOUND_EMAIL_RECIPIENTS`: seven user-designated addresses.
- `ALLOWED_OUTBOUND_EMAIL_SENDERS`: the same seven user-designated addresses.
- `EMAIL_SENDER_VERIFICATION_REQUIRED=true`.
- `EMAIL_HUMAN_APPROVAL_REQUIRED=true`.
- `OUTBOUND_EMAIL_ENABLED=false`.

**These are configuration records only.** The current fictional demonstration web app has no email delivery endpoint or provider integration. No mail is sent, and the sender list alone cannot authorize any Gmail or university mail account as a From identity.

## Prelaunch requirements
1. Choose supported delivery method/provider and connect it without exposing credentials to GitHub or the client.
2. Verify ownership/delegated sending rights for every From address. University domains and Gmail accounts may have provider restrictions.
3. Authenticate sending identities in the provider, with appropriate SPF/DKIM/DMARC where domain-admin approval exists. Never spoof or silently rewrite From.
4. Add authenticated server-side dispatch with sender AND recipient allowlist, per-case consent, approved template, individual human send approval, rate limits, audit event, delivery status, retries with idempotency, and opt-out handling.
5. Run tests proving unverified senders, unapproved messages, fictional case drafts and consent-pending cases cannot be sent.
6. Recheck Washington privacy, elder referral laws, and marketing/email requirements before live operation.

Until all requirements are passed, `OUTBOUND_EMAIL_ENABLED` must remain `false`. 
