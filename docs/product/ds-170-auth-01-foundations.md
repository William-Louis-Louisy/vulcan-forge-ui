# DS-170-AUTH-01 — Authentication foundations

## Metadata

| Field                | Value                                             |
| -------------------- | ------------------------------------------------- |
| Parent audit         | `docs/product/ds-170-auth-signup-signin-audit.md` |
| Branch               | `feature/ds-170-auth-01-foundations`              |
| Status               | Implementation in progress                        |
| Primary findings     | AUTH-01, AUTH-03, AUTH-05, AUTH-08, AUTH-09       |
| Transversal findings | AUTH-16, AUTH-17, AUTH-21                         |

---

## Objective

Harden the current Credentials-based signup and sign-in implementation before email verification, password recovery and the wider DS-170 final journey.

This slice deliberately avoids mixing in the later password-hash migration, verification-token infrastructure, session redesign or strong-auth roadmap.

---

## Implemented controls

### Database-backed temporary throttling

Login and signup attempts are consumed from PostgreSQL-backed fixed-window buckets.

| Operation | Account bucket           | Client-address bucket    |
| --------- | ------------------------ | ------------------------ |
| Login     | 8 attempts / 15 minutes  | 40 attempts / 15 minutes |
| Signup    | 10 attempts / 60 minutes | 30 attempts / 60 minutes |

Important behavior:

- every attempted authentication consumes a bucket before expensive password or account work;
- a successful login or signup clears only the account bucket;
- the client-address bucket is not cleared by a successful login, preventing an attacker from clearing a shared abuse budget with their own valid account;
- the cooldown is temporary and resets automatically;
- buckets expired for more than 24 hours are deleted through bounded periodic cleanup;
- the rate limiter fails closed by default;
- `AUTH_RATE_LIMIT_FAIL_OPEN=true` is an emergency operational override, not a normal configuration.

### Privacy-safe bucket keys

Raw email addresses and IP addresses are not persisted in the rate-limit table.

The application derives HMAC-SHA-256 fingerprints with a server-side secret and separates scopes so an account value cannot be correlated directly with the same raw value used as an IP or another future identifier.

Secret order:

1. `AUTH_RATE_LIMIT_SECRET`;
2. `AUTH_SECRET` as a fallback;
3. a development-only constant outside production.

Production starts without a fingerprint secret only by failing explicitly.

### Trusted client-address policy

Vercel requests use `x-vercel-forwarded-for`, falling back to Vercel's overwritten `x-forwarded-for` header.

Self-hosted deployments ignore forwarding headers by default. They may enable `AUTH_TRUST_PROXY_HEADERS=true` only when the reverse proxy removes spoofed incoming forwarding headers and supplies a controlled client address.

When no trusted address is available, account throttling still applies and the IP bucket is skipped rather than persisting an attacker-controlled header.

### Login timing equalization

The Credentials provider always performs one bcrypt comparison after a valid login payload:

- real account: compare against the stored hash;
- missing account: compare against a valid cost-12 dummy hash.

This removes the previous immediate return for nonexistent accounts. It reduces the most obvious timing distinction but does not claim perfect constant-time network behavior. Rate limiting remains the primary anti-enumeration control.

### Neutral and explicit error classes

- ordinary credential failures remain generic;
- a blocked credentials request throws a dedicated `CredentialsSignin` subclass with code `rate_limited`;
- the login Server Action maps only expected credential rejection to `invalidCredentials`;
- throttling maps to `rateLimited`;
- other Auth.js errors map to `unexpected` instead of being blamed on the user.

### Concurrency-safe signup

The preliminary `findUnique` duplicate check is removed.

The database unique constraint is the source of truth. A concurrent `P2002` race maps to the neutral `signupUnavailable` state rather than an unhandled error.

The user, preferences, personal workspace, workspace settings and owner membership remain created inside a single Prisma transaction.

### Recoverable post-creation sign-in failure

Account creation commits before the automatic credentials sign-in. If Auth.js rejects or fails after the commit, the action returns `accountCreatedSignInFailed` and instructs the user to sign in with the same credentials.

This prevents a committed account from being presented as though no account exists.

### Sanitized security events

Authentication security events are emitted as structured JSON through the server logger.

Events may include:

- generated request ID;
- account fingerprint;
- client-address fingerprint;
- operation and reason category;
- retry delay;
- internal user ID after successful creation or login.

They never include:

- password or password hash;
- raw email address;
- raw IP address;
- session token;
- verification or recovery token.

This logger is an initial contract. A later observability slice will route it to the selected monitoring system and define retention and alert thresholds.

---

## Auth.js version policy

The dependency is pinned to the exact reviewed prerelease version `5.0.0-beta.32` rather than a floating beta range.

Before every Auth.js update:

1. review the official release notes and security policy;
2. update the exact version intentionally;
3. run the complete authentication test matrix;
4. run `npm run quality`;
5. perform manual login, signup, logout and protected-route QA;
6. avoid automated dependency merges for this package.

The project should migrate to the stable Auth.js v5 channel when an appropriate stable release is available and the migration has been reviewed.

---

## Environment contract

See `.env.example`.

### Required in production

- `DATABASE_URL`;
- `AUTH_SECRET`;
- preferably a distinct `AUTH_RATE_LIMIT_SECRET`.

### Deployment-dependent

- `AUTH_TRUST_PROXY_HEADERS` defaults to `false` and is not needed on Vercel;
- `AUTH_RATE_LIMIT_FAIL_OPEN` defaults to `false` and should remain disabled.

### Secret handling

- use high-entropy secrets generated outside the repository;
- store production values in the deployment secret manager;
- never expose them through `NEXT_PUBLIC_*` variables;
- rotate only with a documented impact assessment because rotating `AUTH_SECRET` invalidates current Auth.js JWT sessions;
- rotate `AUTH_RATE_LIMIT_SECRET` only when accepting that existing rate-limit fingerprints become unreachable and expire naturally.

---

## Database migration

Migration:

```text
prisma/migrations/20260803143000_add_auth_rate_limit_buckets/migration.sql
```

Apply locally with:

```bash
npm run db:up
npm run db:migrate
```

Production deployment must apply the migration before serving application code that consumes authentication buckets.

---

## Automated validation

The slice adds focused coverage for:

- trusted and untrusted forwarding headers;
- stable and scope-separated HMAC fingerprints;
- allowed, blocked, fail-closed and emergency fail-open limiter behavior;
- missing-account dummy bcrypt comparison;
- blocking before database/password work;
- successful account bucket reset;
- Auth.js error classification;
- Prisma `P2002` signup races;
- account-created but automatic-sign-in-failed recovery.

The standard project `quality` command remains the release gate.

---

## Manual QA checklist

### Prerequisites

```bash
npm ci
npm run db:up
npm run db:migrate
npm run dev
```

### Login

- [ ] Valid credentials still redirect to the application.
- [ ] Invalid email/password combinations show the same generic credentials message.
- [ ] A nonexistent account shows the same visible message as a wrong password.
- [ ] Repeated failed attempts eventually show the cooldown message.
- [ ] A successful login clears the account cooldown state.
- [ ] An unexpected Auth.js failure shows a retryable unexpected-error message.
- [ ] Security logs contain no raw email, IP address or password.

### Signup

- [ ] A valid signup creates one user, one personal workspace and one owner membership.
- [ ] Repeated attempts eventually show the signup cooldown message.
- [ ] Submitting the same email concurrently creates only one account graph.
- [ ] Duplicate signup uses the neutral unavailable message.
- [ ] A simulated automatic-sign-in failure leaves the account usable through login.
- [ ] Password values are never restored after an error.

### Deployment

- [ ] Vercel deployment reads the overwritten client-address header.
- [ ] A self-hosted deployment without trusted-proxy configuration ignores spoofed forwarding headers.
- [ ] A hardened self-hosted proxy can explicitly enable trusted forwarding headers.
- [ ] Rate-limit persistence failure blocks authentication by default.
- [ ] The emergency fail-open override is documented in the runbook and disabled afterward.

---

## Known limits and follow-up

This slice does not complete the whole authentication program.

Still planned:

- Argon2id and the modern password policy;
- email verification;
- password recovery;
- secure `returnTo` continuity;
- shared accessible password fields and error summaries;
- explicit session lifetime, revocation and reauthentication;
- legal trust surfaces;
- passkeys, MFA and external identity providers.

Account enumeration is reduced but cannot become fully neutral while successful signup immediately creates an authenticated session and duplicate signup returns a non-success path. Email verification will allow a stronger neutral-response design in DS-170-AUTH-03.

---

## Primary implementation references

- Auth.js Credentials provider: <https://authjs.dev/reference/core/providers/credentials>
- Auth.js errors: <https://authjs.dev/reference/core/errors>
- Auth.js security policy: <https://authjs.dev/security>
- Next.js backend rate limiting guidance: <https://nextjs.org/docs/app/guides/backend-for-frontend#rate-limiting>
- Vercel request headers: <https://vercel.com/docs/headers/request-headers>
- OWASP Authentication Cheat Sheet: <https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html>
