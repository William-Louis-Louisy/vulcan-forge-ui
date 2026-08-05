# DS-170-AUTH-03 — Email verification

## Status

Implementation is in progress. Automated validation and manual product QA are required before the pull request leaves Draft.

## Objective

Require proof of email ownership before an authenticated account can access VulcanForgeUI application routes, while preserving a recoverable pending-verification state when delivery is delayed or temporarily unavailable.

## Account lifecycle

A successful signup now:

1. validates the account and password under the existing abuse controls;
2. creates the user, preferences, workspace, settings and owner membership atomically;
3. creates a single-use email verification challenge;
4. sends a locale-aware verification message;
5. signs the user in;
6. redirects the authenticated account to `/{locale}/verify-email`.

An authenticated account whose `emailVerifiedAt` value is null cannot access `/{locale}/app/**`. The server-side application layout redirects it to the verification page. The account may sign in and resend the verification message, but application functionality remains unavailable until ownership is confirmed.

## Token security

Verification challenges use:

- 32 cryptographically random bytes;
- Base64URL encoding for the delivered token;
- SHA-256 for the persisted token fingerprint;
- a 30-minute expiry;
- one active challenge per user;
- single-use, transactional consumption;
- deletion after success, expiration, replacement or account deletion.

The raw token exists only while constructing and delivering the verification link. It is never persisted or logged.

Malformed, unknown, expired, already-consumed and replaced links use bounded result states. Concurrent consumption permits only one successful verification.

## Email delivery

Delivery uses the Resend HTTP API through the platform `fetch` implementation, without an additional SDK dependency.

Required production variables:

- `RESEND_API_KEY` — sending-only Resend key;
- `AUTH_EMAIL_FROM` — sender on a domain verified by Resend;
- `AUTH_EMAIL_BASE_URL` — public HTTPS application origin.

Messages include HTML and plain-text bodies in English and French. The provider request uses an idempotency key derived from the persisted challenge identifier. Provider credentials, raw tokens and destination addresses are not added to security events.

When initial delivery fails, account creation remains committed and the pending page exposes a resend action. A challenge whose delivery failed is revoked so an undelivered token cannot remain active.

## Abuse controls

Initial delivery and resends share the database-backed authentication rate limiter:

- account fingerprint: 5 requests per hour;
- trusted client-address fingerprint: 20 requests per hour.

The stored bucket key contains only HMAC fingerprints, not raw email or IP values. The existing fail-closed policy and emergency `AUTH_RATE_LIMIT_FAIL_OPEN` override also apply to verification delivery.

## Email address changes

A confirmed account that changes its email address must prove ownership again:

1. the current password is verified;
2. the new unique email is saved;
3. `emailVerifiedAt` is cleared in the same transaction;
4. existing verification challenges are removed;
5. a new challenge is sent;
6. the account is signed out.

Delivery failure does not roll back the completed email change. After signing in with the new address, the user is routed to the pending verification page and can retry delivery.

## Security events

The lifecycle emits sanitized events:

- `auth.email_verification.sent`;
- `auth.email_verification.rate_limited`;
- `auth.email_verification.delivery_failed`;
- `auth.email_verification.verified`;
- `auth.email_verification.already_verified`;
- `auth.email_verification.expired`;
- `auth.email_verification.invalid`.

Events may contain a user ID, account or client-address fingerprint, request ID, expiry timestamp, retry delay and bounded configuration flag. They never contain the raw email address, raw IP address, delivered token, token hash, provider API key or session token.

## Automated coverage

The implementation includes tests for:

- random URL-safe token generation and deterministic token hashing;
- malformed token rejection;
- locale-aware provider requests and idempotency headers;
- missing delivery configuration and provider failures;
- signup delivery and pending-state redirects;
- authenticated resend behavior;
- email-change reverification and old-token invalidation;
- PostgreSQL persistence of token hashes only;
- successful single-use consumption;
- expiration cleanup;
- concurrent token consumption.

## Manual QA checklist

### Signup and pending access

- [ ] A new English account receives an English verification email.
- [ ] A new French account receives a French verification email.
- [ ] The delivered link uses the configured public application origin.
- [ ] The authenticated new account lands on the localized pending page.
- [ ] Direct navigation to `/{locale}/app` redirects an unverified account to `/{locale}/verify-email`.
- [ ] The pending page identifies the signed-in account without exposing credentials or tokens.
- [ ] Delivery failure leaves the account recoverable and exposes the localized resend action.

### Token lifecycle

- [ ] A valid link sets `emailVerifiedAt` and unlocks application access.
- [ ] The same link cannot be used twice.
- [ ] A replaced link is invalid after a resend.
- [ ] A link older than 30 minutes shows the localized expired state.
- [ ] A malformed or unknown token shows the localized invalid state.
- [ ] Verification from another browser succeeds without requiring the original session.

### Resend controls

- [ ] A resend creates and delivers a new link.
- [ ] The previous link becomes invalid after resend.
- [ ] The sixth account-scoped request within an hour is rate-limited.
- [ ] A verified account cannot generate another challenge.
- [ ] An unauthenticated resend request does not send an email.

### Email changes

- [ ] Changing only the display name preserves verification.
- [ ] Changing the email requires the current password.
- [ ] A successful email change clears verification and removes older challenges.
- [ ] The account is signed out after the email change.
- [ ] Signing in with the new address leads to the verification page.
- [ ] Verification of the new address restores application access.

### Logging and privacy

- [ ] Successful delivery and verification emit their expected events.
- [ ] Expired, invalid, rate-limited and failed-delivery paths emit bounded events.
- [ ] Logs contain no raw email, raw IP, raw token, token hash, API key or session token.

## Known boundaries

- Resend domain verification and DNS configuration are external operational prerequisites and cannot be validated from repository code.
- Verification email delivery is provider-dependent. The pending account state and resend action preserve recoverability during provider outages.
- This lot gates all application routes rather than implementing feature-by-feature partial access. A later product decision may introduce a narrower limited onboarding surface.
- Password recovery and session revocation remain separate authentication roadmap items.
