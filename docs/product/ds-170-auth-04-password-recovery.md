# DS-170-AUTH-04 — Password recovery

## Status

Architecture approved for implementation. Automated validation and manual product QA are required before the pull request leaves Draft.

## Objective

Provide a secure, localized password-recovery journey that lets a user replace a forgotten password without revealing whether an account exists.

This slice addresses audit finding AUTH-06 and adds targeted implementation coverage for session invalidation, authentication testing, operational documentation and security events.

## Product decisions

- The request surface always returns the same neutral success state for existing and nonexistent accounts.
- The request does not lock, disable or otherwise mutate an account before a valid recovery challenge is presented.
- Recovery email delivery runs after the neutral response so provider latency does not become a direct account-enumeration signal.
- A successful reset does not automatically sign the user in.
- A successful reset invalidates every previously issued password-recovery challenge for the account.
- A successful reset invalidates existing authenticated sessions by incrementing a version stored on the user and checked by JWT-backed sessions.
- The account receives a separate notification after its password has been changed.

## Request lifecycle

1. The user opens `/{locale}/forgot-password` from the login page.
2. The email value is normalized and validated.
3. Account and trusted-address rate-limit buckets are consumed.
4. The server returns a neutral success state regardless of account existence or throttling outcome.
5. When an eligible account exists, a post-response task creates a new single-use challenge and sends the localized recovery email.
6. Delivery failures revoke the challenge and emit a sanitized security event without changing the neutral user-facing response.

## Challenge security

Password-recovery challenges use:

- 32 cryptographically random bytes;
- Base64URL encoding for the delivered token;
- SHA-256 for the persisted token fingerprint;
- a 30-minute expiry;
- one active challenge per user;
- single-use transactional consumption;
- deletion after success, expiration, replacement, delivery failure or account deletion.

The raw token is never persisted or added to application security events.

The delivered link targets `/{locale}/reset-password#token=...`. A client bootstrap removes the fragment from browser history before sending it in a bounded same-origin `POST` body to `/api/auth/password-recovery/prepare`. The server inspects the challenge and stores the token briefly in a scoped `HttpOnly`, `SameSite=Lax` cookie. The password is changed only by a separate same-origin reset submission.

## New password policy

The reset form uses the same policy as signup:

- NFC normalization;
- 15–128 Unicode code points;
- no composition rules;
- compromised-password rejection through the Pwned Passwords k-anonymity service;
- Argon2id storage using the current application parameters;
- password confirmation required.

Passwords are never echoed into action state, query parameters, logs, events or emails.

## Session invalidation

The `User` model gains an integer authentication version. The value is copied into a JWT when credentials are accepted and checked against the database whenever an authenticated session is resolved.

A successful password reset increments the version in the same transaction that stores the new password and consumes the recovery challenge. JWTs issued before the reset then fail the version check and are treated as unauthenticated. The user must sign in again with the new password.

## Email delivery

The existing email infrastructure remains the single transport boundary:

- Mailpit in local development;
- Resend in deployed production environments;
- configured application origin rather than the request `Host` header;
- HTML and plain-text messages in English and French;
- bounded provider timeout and sanitized delivery failures.

Two email types are required:

1. password-reset link;
2. password-changed notification with no secret or reset link.

## Abuse controls

Planned fixed-window policies:

- recovery request account fingerprint: 5 per hour;
- recovery request trusted-address fingerprint: 20 per hour;
- reset-token fingerprint: 10 per 15 minutes;
- reset trusted-address fingerprint: 40 per 15 minutes.

Rate-limit keys contain HMAC fingerprints rather than raw email, IP or token values. Request throttling remains invisible in the neutral public response and is observable through security events.

## Security events

The lifecycle will emit sanitized events for:

- request accepted;
- request rate limited;
- challenge sent;
- delivery failed;
- link opened;
- reset rejected as invalid or expired;
- password reset completed;
- password-changed notification failed;
- unexpected errors.

Events may contain bounded reasons, user IDs, expiry timestamps, retry delays and HMAC fingerprints. They never contain raw email addresses, raw IP addresses, delivered tokens, token hashes, passwords, password hashes, provider credentials or session tokens.

## Automated coverage

Required automated coverage:

- token generation, parsing and hashing;
- persistence, replacement, expiry and single use;
- concurrent challenge creation and consumption;
- neutral request behavior for existing and nonexistent accounts;
- request and reset throttling;
- Mailpit and Resend localized payloads;
- fragment cleanup and same-origin preparation;
- password-policy and compromised-password failures;
- atomic password update, challenge deletion and authentication-version increment;
- invalidation of sessions issued before a reset;
- successful login with the new password and rejection of the old password;
- production build.

## Manual QA

### Request

- [ ] The login page exposes a localized “Forgot password?” destination.
- [ ] Existing and nonexistent emails produce the same visible response.
- [ ] The visible response does not change when request throttling applies.
- [ ] The workspace remains unaffected for an already authenticated account.

### Delivery

- [ ] A valid request produces a localized Mailpit message.
- [ ] The link uses the configured application origin and an URL fragment.
- [ ] No raw token appears in Next.js or reverse-proxy request logs.
- [ ] Repeated requests invalidate earlier links.
- [ ] Mailpit or provider failure remains invisible to account enumeration and is logged safely.

### Reset

- [ ] Opening the latest link displays the localized reset form.
- [ ] Invalid, expired, consumed and replaced links produce bounded states.
- [ ] Password confirmation is required.
- [ ] Too-short, too-long and compromised passwords are rejected consistently with signup.
- [ ] A successful reset does not automatically authenticate the user.
- [ ] The old password no longer works and the new password does.
- [ ] Reusing the link fails safely.

### Sessions and notification

- [ ] Sessions created before the reset lose access and are redirected to login.
- [ ] A password-changed notification appears in Mailpit.
- [ ] The notification contains no password or recovery token.

### Privacy

- [ ] User-facing responses do not reveal account existence.
- [ ] Security events contain no raw email, IP, token, token hash, password, password hash, API key or session token.
