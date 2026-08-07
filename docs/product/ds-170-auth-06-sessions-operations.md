# DS-170-AUTH-06 — Sessions and authentication operations

## Status

Implementation complete on `feature/ds-170-auth-06-sessions-operations`. Automated validation and manual QA remain required before the draft pull request can be marked ready.

## Objective

Make authentication-session lifetime, revocation and operational expectations explicit without introducing the recent-reauthentication flow that was deliberately excluded from this slice by product decision.

## Audit coverage

This slice completes the operational portion of the authentication audit around:

- AUTH-15 — explicit session duration, revocation and logout behavior;
- AUTH-16 — targeted session and logout test coverage;
- AUTH-17 — authentication environment and operational documentation;
- AUTH-21 — structured authentication security events relevant to session operations;
- the Auth.js release-channel policy identified alongside the operational hardening work.

## Product decisions

### Absolute lifetime

Authenticated sessions have an explicit absolute lifetime of seven days.

The application stores an immutable `sessionStartedAt` value in the JWT when credentials are accepted. Every subsequent JWT callback checks this value before the persisted authentication version. Access at or after the seven-day boundary is rejected.

This application-level timestamp prevents Auth.js cookie/JWT renewal behavior from silently turning the policy into an inactivity or rolling lifetime. Auth.js `session.maxAge` and `jwt.maxAge` are also configured to seven days as outer bounds.

Existing sessions created before this rollout may use the JWT `iat` value once as their initial `sessionStartedAt`, after which the explicit field is preserved.

### No inactivity timeout

DS-170-AUTH-06 does not add a separate inactivity timer. Normal use therefore does not extend the seven-day absolute application lifetime and there is no second idle-expiry concept for the user to understand.

### No recent-reauthentication gate

The proposed 15-minute recent-authentication requirement was explicitly removed from this scope. No unused "recent authentication" abstraction, timestamp or password challenge is introduced.

A future product capability may introduce step-up authentication only when a concrete sensitive journey justifies it.

### Session revocation

The existing persisted `User.authVersion` remains the single session-revocation mechanism.

- every accepted Credentials login copies the current version into the JWT;
- authenticated session resolution checks the JWT version against persistence and fails closed if the account is missing or the lookup fails;
- password recovery already increments the version after a successful reset;
- "Sign out everywhere" increments the same version, invalidating every previously issued JWT for the account;
- after global revocation, the current browser also signs out through Auth.js.

No parallel deny-list or second revocation system is introduced.

### Logout behavior

Normal logout clears only the current Auth.js session and records a sanitized informational security event when an authenticated user can be resolved.

Global logout is exposed in account settings. Persistence must confirm the `authVersion` increment before the application reports success or clears the current session. A persistence failure therefore does not falsely tell the user that all devices were disconnected.

## Security events

The existing structured authentication event contract gains:

- `auth.logout.succeeded`;
- `auth.session.revoked_all`;
- `auth.session.revocation_failed`.

Events contain bounded operational metadata such as `userId` and a fixed failure reason. They do not contain passwords, password hashes, session JWTs, cookies, raw recovery tokens or provider secrets.

Existing login success, rejection and rate-limit events remain unchanged.

## Auth.js release policy

The repository currently pins `next-auth` to the exact version `5.0.0-beta.32` rather than accepting a floating beta range.

AUTH-06 documents the operational rule rather than changing the dependency during the session-policy implementation:

- keep an exact Auth.js version;
- upgrade in an isolated dependency pull request;
- review upstream release/security notes;
- run the complete Quality workflow plus authentication integration coverage;
- manually exercise login, logout, signup, recovery, email verification and session invalidation before merge;
- do not combine a beta-channel Auth.js upgrade with unrelated product work.

## Acceptance criteria

### Session lifetime

- the application session lifetime is explicitly seven days;
- normal requests do not reset the application-level absolute start time;
- a session at the seven-day boundary is rejected;
- malformed or missing lifetime metadata fails closed;
- rollout can adopt a valid legacy JWT `iat` without immediately discarding every existing session.

### Revocation and logout

- current-device logout continues to clear the local Auth.js session;
- global logout increments `User.authVersion` exactly once;
- JWTs carrying an older version no longer resolve to an authenticated user;
- global logout also clears the current browser after persistence succeeds;
- a failed global revocation does not claim success;
- password-reset session invalidation continues to use the same version mechanism.

### Operations

- session/logout events use the structured authentication security-event boundary;
- authentication runtime requirements and emergency controls are documented;
- the Auth.js beta dependency remains exactly pinned and has an explicit upgrade gate;
- no recent-reauthentication feature is introduced in this slice.

### Quality

- focused unit tests cover absolute expiry, legacy rollout, fail-closed invalidation, current logout and global revocation;
- repository lint, typecheck, formatting, UI audit, tests and build pass;
- manual session QA is recorded before merge.

## Manual QA checklist

- [ ] Sign in and confirm normal workspace navigation remains authenticated.
- [ ] Confirm account Settings exposes the localized Sessions section in English and French.
- [ ] Use normal logout and confirm only the current browser is signed out.
- [ ] Sign in to the same account in two browser contexts, use "Sign out everywhere" in one, then confirm both contexts lose authenticated access.
- [ ] Confirm the initiating browser is also signed out after global revocation.
- [ ] Confirm a global-revocation persistence failure is represented as an error rather than success when tested in a controlled failure environment.
- [ ] Confirm password reset still invalidates sessions created before the reset.
- [ ] Confirm no user-facing recent-reauthentication prompt was added.

## Deferred

- step-up or recent reauthentication for future concrete sensitive operations;
- final Terms/Privacy destinations and legal approval: DS-170-AUTH-07;
- passkeys, TOTP, recovery codes and external identity providers: DS-170-AUTH-08.
