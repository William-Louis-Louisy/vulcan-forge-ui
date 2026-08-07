# Authentication operations

This document defines the repository-level operational contract for authentication. Values containing credentials or high-entropy secrets must be injected through the deployment environment and must never be committed.

## Runtime requirements

### Database

`DATABASE_URL` is required for PostgreSQL-backed users, rate limits, verification challenges, password-recovery challenges and authentication-version checks.

Session resolution intentionally fails closed when the persisted authentication version cannot be read. A database outage can therefore make an existing JWT unusable until persistence is available again rather than silently bypassing revocation checks.

### Auth.js secret

`AUTH_SECRET` must be a high-entropy production secret stored outside version control. Rotating it invalidates Auth.js JWT/cookie material and should be treated as a deliberate all-session invalidation event.

### Abuse-control fingerprint secret

`AUTH_RATE_LIMIT_SECRET` should be a distinct high-entropy secret in production. The application can fall back to `AUTH_SECRET`, but production deployments should keep the concerns separate so authentication fingerprints cannot be correlated with other application secrets.

### Forwarded client addresses

`AUTH_TRUST_PROXY_HEADERS` must remain `false` unless the deployment is behind a trusted reverse proxy that strips spoofed incoming forwarding headers before writing its own values. Vercel's managed forwarding behavior is handled by the existing request-context policy.

### Rate-limit emergency override

`AUTH_RATE_LIMIT_FAIL_OPEN` is an emergency availability control, not a normal deployment setting. The default is fail-closed. Enabling fail-open temporarily removes application-level abuse protection and must therefore be time-bounded and accompanied by infrastructure-level monitoring/protection.

### Email delivery

Authentication verification and password recovery use the variables documented in `.env.example`:

- `AUTH_EMAIL_TRANSPORT`;
- `AUTH_EMAIL_BASE_URL`;
- `AUTH_MAILPIT_BASE_URL` for local development;
- `AUTH_EMAIL_FROM`;
- `RESEND_API_KEY` when using the production Resend transport.

Production verification/recovery URLs must use the configured HTTPS application origin rather than an untrusted request `Host` value.

## Session policy

- strategy: Auth.js JWT;
- absolute application lifetime: seven days;
- separate inactivity timeout: none;
- recent-reauthentication window: not implemented by product decision;
- persisted revocation signal: `User.authVersion`.

`sessionStartedAt` is captured when credentials are accepted and is preserved for the lifetime of the JWT. Requests at or after the absolute seven-day boundary are treated as unauthenticated even if Auth.js has re-encoded its own envelope.

During rollout, a legacy JWT without `sessionStartedAt` may use a valid `iat` once, avoiding a forced logout of every pre-existing session solely because the explicit field is new.

## Revocation operations

### Current browser

Normal logout uses Auth.js `signOut` and clears only the current local session. It does not change `authVersion`.

### Every device

The account Settings surface exposes a global logout operation. It increments `User.authVersion`, making every JWT issued with the previous version fail the next persisted version check. The initiating browser signs out only after the database confirms the increment.

### Password recovery

A successful password reset increments the same `authVersion`. No separate revocation mechanism should be added for password changes unless the session model itself is redesigned.

## Security-event contract

Authentication emits JSON-structured entries through `recordAuthSecurityEvent`.

Relevant session events are:

- `auth.login.succeeded`;
- `auth.login.rejected`;
- `auth.login.rate_limited`;
- `auth.logout.succeeded`;
- `auth.session.revoked_all`;
- `auth.session.revocation_failed`.

The contract may include fixed reasons, request fingerprints already defined by the abuse-control layer, retry delays and internal user IDs. It must never include passwords, password hashes, raw emails when a fingerprint is sufficient, raw IP addresses, JWTs, cookies, raw verification/recovery tokens, token hashes or provider credentials.

These structured entries are the source for operational counters/alerts in the hosting/logging platform; the repository does not introduce a second metrics store for authentication.

## Auth.js release-channel policy

`next-auth` is intentionally pinned to the exact beta version declared in `package.json`. Do not replace the exact version with a caret, tilde or broad beta range.

For every Auth.js upgrade:

1. use a dedicated dependency branch/pull request;
2. review upstream release notes, migration notes and relevant security advisories;
3. inspect changes to JWT/session defaults, cookie behavior, callback signatures, Credentials behavior and CSRF/origin handling;
4. run repository Quality checks and authentication database integration tests;
5. manually verify signup, login, current logout, global logout, email verification, password recovery and stale-session invalidation;
6. merge the dependency change separately from unrelated product features.

A security advisory may justify an accelerated upgrade, but it does not justify skipping the authentication regression gate.

## Incident notes

- Suspected `AUTH_SECRET` compromise: rotate the secret, expect all Auth.js sessions to be invalidated, and investigate access logs/security events.
- Suspected account-session compromise: use the global logout operation or increment the affected account's `authVersion` through an audited administrative procedure.
- Rate-limit persistence outage: prefer restoring persistence; use fail-open only as a documented emergency availability decision.
- Email-provider outage: verification/recovery public responses should retain their neutral anti-enumeration behavior while delivery failures remain observable through sanitized security events.
