# DS-170-AUTH-03 — Email verification

## Status

Implementation is in progress. The product policy has been corrected so email verification remains visible and recoverable without blocking the authenticated workspace. Automated validation and manual product QA are required before the pull request leaves Draft.

## Objective

Confirm email ownership with single-use verification challenges while allowing an authenticated account to use VulcanForgeUI before verification is complete.

Email verification is a trust and account-recovery signal. It is not a global authorization boundary for the current design-system workspace. Selected future capabilities may require a verified address when they create a meaningful security or collaboration dependency.

## Account lifecycle

A successful signup now:

1. validates the account and password under the existing abuse controls;
2. creates the user, preferences, workspace, settings and owner membership atomically;
3. creates and sends an email verification challenge;
4. signs the user in;
5. redirects the account to `/{locale}/app`.

An authenticated account whose `emailVerifiedAt` value is null can use the application. The application shell displays a persistent, non-blocking reminder with a resend action until ownership is confirmed.

The dedicated `/{locale}/verify-email` page remains available for verification results, resends and explicit confirmation. An authenticated pending account can always return to the workspace.

## Token security

Verification challenges use:

- 32 cryptographically random bytes;
- Base64URL encoding for the delivered token;
- SHA-256 for the persisted token fingerprint;
- a 30-minute expiry;
- one active challenge per user;
- single-use, transactional consumption;
- deletion after success, expiration, replacement or account deletion.

The raw token exists only while constructing and delivering the verification link. It is never persisted. The delivered URL carries it in the fragment, which browsers do not send in HTTP requests, referrer headers or access-log paths.

The delivered link targets `/{locale}/verify-email#token=...`. A small client bootstrap removes the fragment from browser history before sending the token in a bounded same-origin `POST` body to `/api/auth/verify-email/prepare`. The server inspects the challenge and stores the token briefly in a scoped `HttpOnly` cookie. Final verification still requires a separate same-origin `POST`. This keeps raw tokens out of HTTP URL logs while preventing automated email link scanners from validating accounts without an explicit user action.

Malformed, unknown, expired, already-consumed and replaced links use bounded result states. Concurrent consumption permits only one successful verification.

## Email delivery

### Local development

Local development uses Mailpit through its HTTP send API. No external provider account or API key is required.

Start PostgreSQL and Mailpit together:

```bash
npm run dev:up
```

Or start Mailpit independently:

```bash
npm run mail:up
```

Captured messages are available at `http://localhost:8025`.

Development defaults:

- transport: `mailpit`;
- Mailpit origin: `http://localhost:8025`;
- application origin: `http://localhost:3000`;
- sender: `VulcanForgeUI <auth@vulcanforge.local>`.

These values can be overridden through `.env` without introducing an external dependency.

### Deployed environments

Production accepts only the Resend transport and requires:

- `AUTH_EMAIL_TRANSPORT=resend`;
- `RESEND_API_KEY` — a sending-only key;
- `AUTH_EMAIL_FROM` — a sender on a domain verified by Resend;
- `AUTH_EMAIL_BASE_URL` — the public HTTPS application origin.

Messages include HTML and plain-text bodies in English and French. Resend requests use an idempotency key derived from the persisted challenge identifier. Provider credentials, raw tokens and destination addresses are not added to security events.

Delivery failure never prevents workspace access. The pending banner and dedicated verification page expose a resend action.

## Abuse controls

Initial delivery and resends share the database-backed authentication rate limiter:

- account fingerprint: 5 requests per hour;
- trusted client-address fingerprint: 20 requests per hour.

The stored bucket key contains only HMAC fingerprints, not raw email or IP values. The existing fail-closed policy and emergency `AUTH_RATE_LIMIT_FAIL_OPEN` override also apply to verification delivery.

## Email address changes

A confirmed account that changes its email address must prove ownership of the new address again:

1. the current password is verified;
2. the new unique email is saved;
3. `emailVerifiedAt` is cleared in the same transaction;
4. existing verification challenges are removed;
5. a new challenge is sent;
6. the account is signed out so the next session uses the new login address.

After signing in with the new address, the user can use the workspace and sees the non-blocking verification reminder. Delivery failure does not roll back the completed email change.

## Current product boundary

Verification is not required for the existing single-user design-system authoring journey.

A verified email may later become a prerequisite for capabilities where ownership proof materially reduces risk, for example:

- password recovery;
- inviting collaborators;
- transferring workspace ownership;
- public sharing or publication;
- security-sensitive account operations.

Each future restriction must be attached to a specific capability rather than applied to the entire application.

## Security events

The lifecycle emits sanitized events:

- `auth.email_verification.sent`;
- `auth.email_verification.rate_limited`;
- `auth.email_verification.delivery_failed`;
- `auth.email_verification.link_opened`;
- `auth.email_verification.verified`;
- `auth.email_verification.already_verified`;
- `auth.email_verification.expired`;
- `auth.email_verification.invalid`;
- `auth.email_verification.unexpected_error`.

Events may contain a user ID, account or client-address fingerprint, request ID, expiry timestamp, retry delay and bounded reason or configuration flags. They never contain the raw email address, raw IP address, delivered token, token hash, provider API key or session token.

## Automated coverage

The implementation includes tests for:

- random URL-safe token generation and deterministic token hashing;
- malformed token rejection;
- locale-aware Resend requests and idempotency headers;
- local Mailpit payloads and transport selection;
- production rejection of the Mailpit transport;
- missing delivery configuration and provider failures;
- signup delivery followed by a normal workspace redirect;
- authenticated resend behavior;
- non-blocking authenticated sessions;
- persistent verification reminder rendering;
- email-change reverification and old-token invalidation;
- fragment extraction with immediate browser URL cleanup;
- bounded same-origin preparation using a request body rather than a token-bearing URL;
- same-origin confirmation on `POST`;
- PostgreSQL persistence of token hashes only;
- successful single-use consumption;
- expiration cleanup;
- concurrent token consumption.

## Manual QA checklist

### Local development and workspace access

- [ ] `npm run dev:up` starts PostgreSQL and Mailpit.
- [ ] Mailpit is available at `http://localhost:8025`.
- [ ] A new English account receives an English message in Mailpit.
- [ ] A new French account receives a French message in Mailpit.
- [ ] A new account is redirected to the localized application route.
- [ ] An unverified account can navigate throughout the existing workspace.
- [ ] The application shell displays the localized verification reminder.
- [ ] The reminder does not cover or disable workspace content.
- [ ] Delivery failure leaves the workspace usable and exposes the resend action.

### Token lifecycle

- [ ] The delivered link uses the configured application origin.
- [ ] The delivered link carries the raw token only in the URL fragment, not in the query string.
- [ ] Opening the link does not expose the raw token in Next.js or reverse-proxy request logs.
- [ ] Opening the link displays a confirmation state without immediately setting `emailVerifiedAt`.
- [ ] Confirming the link sets `emailVerifiedAt` and removes the active challenge.
- [ ] The same link cannot be used twice.
- [ ] A replaced link is invalid after a resend.
- [ ] A link older than 30 minutes shows the localized expired state.
- [ ] A malformed or unknown token shows the localized invalid state.
- [ ] A cross-origin confirmation request is rejected.
- [ ] Verification from another browser succeeds without requiring the original session.

### Resend controls

- [ ] A resend creates and delivers a new link.
- [ ] The previous link becomes invalid after resend.
- [ ] The sixth account-scoped request within an hour is rate-limited.
- [ ] A verified account cannot generate another challenge.
- [ ] An unauthenticated resend request does not send an email.
- [ ] A successful resend displays accessible status feedback in the application banner.

### Email changes

- [ ] Changing only the display name preserves verification.
- [ ] Changing the email requires the current password.
- [ ] A successful email change clears verification and removes older challenges.
- [ ] The account is signed out after the email change.
- [ ] Signing in with the new address permits workspace access and displays the reminder.
- [ ] Verification of the new address removes the reminder on the next application request.

### Production configuration

- [ ] Production rejects `AUTH_EMAIL_TRANSPORT=mailpit`.
- [ ] Missing Resend configuration produces a bounded delivery failure without blocking access.
- [ ] A configured Resend sender receives a successful provider response.

### Logging and privacy

- [ ] Successful delivery, link opening and verification emit their expected events.
- [ ] Expired, invalid, rate-limited and failed-delivery paths emit bounded events.
- [ ] Logs contain no raw email, raw IP, raw token, token hash, API key or session token.

## Known boundaries

- Resend domain verification and DNS configuration are external operational prerequisites and cannot be validated from repository code.
- Mailpit is a development-only capture service and must not be exposed as a production transport.
- Verification does not currently restrict product functionality. Future restrictions require an explicit capability-level product decision.
- Password recovery and session revocation remain separate authentication roadmap items.
