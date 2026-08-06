# DS-170-AUTH-03 — Email verification

## Status

Implementation and automated validation are complete. Quality run #1112 passed on commit `4bc7ea9` after the non-blocking product policy and URL-fragment protection for raw verification tokens were applied. Manual product QA remains required before the pull request leaves Draft.

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

Automated coverage includes:

- token hashing and single-use verification;
- expiration and challenge replacement;
- concurrent challenge creation and consumption;
- account and trusted-address throttling;
- localized Resend and Mailpit delivery payloads;
- fragment-based verification URLs that keep tokens out of request paths;
- immediate browser-fragment cleanup and bounded same-origin preparation;
- same-origin confirmation and cross-origin rejection;
- signup continuation when delivery is unavailable;
- non-blocking application access and reminder rendering;
- changed-email reverification;
- localized action and page states.

## Manual QA

### Local setup

- [ ] `npm run dev:up` starts PostgreSQL and Mailpit.
- [ ] Mailpit is available at `http://localhost:8025`.
- [ ] The application starts without a Resend key.

### Signup and workspace access

- [ ] A new account is signed in and redirected directly to its localized workspace.
- [ ] Workspace pages remain usable while `emailVerifiedAt` is null.
- [ ] A visible verification reminder is shown without covering or disabling workspace content.
- [ ] An unavailable local email service does not block signup or workspace access.

### Local email delivery and verification

- [ ] The initial or resent message appears in Mailpit in the selected locale.
- [ ] The delivered link uses the configured application origin.
- [ ] The delivered link carries the raw token only in the URL fragment, not in the query string.
- [ ] Opening the link does not expose the raw token in Next.js or reverse-proxy request logs.
- [ ] Opening the link displays a confirmation state without immediately setting `emailVerifiedAt`.
- [ ] Explicit confirmation sets `emailVerifiedAt`, deletes the challenge and removes the reminder.
- [ ] Reusing the consumed link produces a bounded invalid or already-verified state.
- [ ] An expired link produces the localized expired state.
- [ ] A replacement challenge invalidates the previous link.

### Resend and throttling

- [ ] A resend creates one new challenge and invalidates the previous one.
- [ ] Successful resend feedback is announced accessibly.
- [ ] The account limit produces a localized cooldown state.
- [ ] Delivery failure produces a recoverable localized state without restricting the workspace.

### Changed email

- [ ] Changing a verified address clears `emailVerifiedAt` and invalidates old challenges.
- [ ] The user can sign in with the new address and continue using the workspace before reverification.
- [ ] The new verification message is localized and confirms the updated address.

### Privacy

- [ ] Security events do not contain raw email addresses, raw IP addresses, raw verification tokens, token hashes, provider API keys or session tokens.
- [ ] Application and reverse-proxy request logs do not contain raw verification tokens.
