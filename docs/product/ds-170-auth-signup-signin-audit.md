# DS-170 — Signup and sign-in audit

## Metadata

| Field | Value |
| --- | --- |
| Product | VulcanForge UI |
| Audit date | 3 August 2026 |
| Branch | `audit/ds-170-auth-signup-signin` |
| Scope | Signup, sign-in, credential verification, sessions, recovery readiness, form UX and accessibility |
| Reference baseline | `main` after the tester guide merge |
| Audit status | Complete — recommendations pending product-owner review |
| Implementation status | No corrective implementation included in this audit |

---

## 1. Executive summary

The current authentication journey is functional and provides a better baseline than the earlier DS-150 review:

- signup includes password confirmation;
- both signup password fields can be revealed or hidden;
- a successful signup automatically signs the new user in;
- validation is repeated on the server with Zod;
- passwords are hashed with bcrypt using cost factor 12;
- login failures are presented to the user as a generic credentials error;
- authenticated application routes are checked on the server;
- authenticated users are redirected away from login and signup;
- pending submissions disable their submit button;
- form fields have visible labels and appropriate password autocomplete values.

No confirmed issue blocks a controlled, internal DS-170-08 journey on a local or otherwise restricted environment.

The implementation should nevertheless not be considered ready for unrestricted public signup. The main release risks are:

1. no application-level abuse or attempt throttling was found;
2. the signup password limit is expressed in JavaScript characters while bcrypt truncates after 72 bytes;
3. account existence can be inferred from signup responses and potentially from login timing;
4. email ownership is not verified even though the data model already contains `emailVerifiedAt`;
5. there is no password-recovery flow;
6. concurrent signup and post-creation sign-in failures are not handled as explicit product states.

### Recommended release gates

| Gate | Decision |
| --- | --- |
| Controlled internal DS-170-08 QA | Can proceed after product review of this audit |
| Hosted test open to invited external testers | Address AUTH-01 and AUTH-02 first, or protect the environment at the infrastructure level |
| Public beta with self-service signup | Complete all P1 recommendations |
| Wider production release | Complete P1 and P2 recommendations and define the P3 roadmap |

Infrastructure protections such as a CDN, WAF or reverse-proxy limiter are outside this repository and could reduce some risks. No such protection can be confirmed from the audited source code, so the report treats it as unknown rather than absent.

---

## 2. Scope and method

### Audited surfaces

- Auth.js configuration and Credentials provider;
- Auth.js route handlers;
- login and signup Zod schemas;
- login and signup Server Actions;
- login and signup forms and pages;
- authenticated and unauthenticated route guards;
- Prisma user model and signup transaction;
- localization and form-state contracts;
- existing authentication tests;
- public trust surfaces relevant to account creation.

### Review dimensions

- security and abuse resistance;
- identity and account lifecycle;
- session lifecycle;
- product and onboarding continuity;
- accessibility and password-manager compatibility;
- error handling and observability;
- test coverage and operational readiness.

### Classification used in this report

- **Confirmed defect:** the source code directly produces an incorrect or unsafe behavior.
- **Confirmed gap:** an expected capability is not implemented in the repository.
- **Conditional risk:** the implementation is exposed if an external protection or operational control is not present.
- **Improvement:** the current behavior works but can be made clearer, more resilient or easier to use.

### Priority scale

- **P0:** blocks the controlled DS-170-08 journey or creates immediate destructive exposure.
- **P1:** required before unrestricted public signup or a serious public beta.
- **P2:** strongly recommended for a polished and operationally robust beta.
- **P3:** post-MVP hardening or strategic authentication roadmap.

---

## 3. Current implementation

### 3.1 Sign-in flow

1. The login page renders a locale-aware form.
2. The Server Action normalizes the email and validates the payload with `loginSchema`.
3. The action calls Auth.js `signIn('credentials')`.
4. The Credentials provider validates the payload again.
5. The provider retrieves the user by normalized email.
6. bcrypt compares the submitted password with `passwordHash`.
7. Auth.js creates a JWT-backed session containing the user identifier and locale.
8. The user is redirected to `/{locale}/app`.

### 3.2 Signup flow

1. The signup page renders name, email, password and password-confirmation fields.
2. The Server Action validates and normalizes the payload with `signupSchema`.
3. A preliminary database query checks whether the normalized email exists.
4. bcrypt hashes the password with cost factor 12.
5. A Prisma transaction creates:
   - the user;
   - user preferences;
   - a personal workspace;
   - workspace settings;
   - the owner membership.
6. The action signs the user in through the Credentials provider.
7. Auth.js redirects the user to `/{locale}/app`.

### 3.3 Route protection

- `/{locale}/app/**` is protected in the authenticated layout with a server-side `auth()` call.
- Unauthenticated users are redirected to login with an `authentication-required` reason.
- Authenticated users visiting the login or signup route are redirected to the application.

### 3.4 Session model

- Auth.js uses the JWT session strategy.
- The token contains the user identifier and locale.
- No explicit session lifetime, session-version field, revocation strategy or authentication-event logging policy is configured in the audited source.

---

## 4. Existing strengths

### AUTH-S01 — Validation is performed on the server

**Status:** positive control

Both authentication Server Actions validate untrusted form data with Zod. The Credentials provider validates the credentials again before querying the database. This is appropriate because Server Actions and authentication endpoints remain externally reachable HTTP entry points.

### AUTH-S02 — Passwords are never returned in action state

**Status:** positive control

Only non-secret values such as email and name are retained after a validation failure. Password and confirmation values are not echoed back to the client state.

### AUTH-S03 — Login uses a generic user-facing failure message

**Status:** positive control

A missing account and a wrong password both result in the same visible `invalidCredentials` state. The UI therefore does not explicitly reveal which part of the credentials was incorrect.

A timing distinction remains and is covered by AUTH-03.

### AUTH-S04 — Signup creation is mostly atomic

**Status:** positive control

The user, preferences, workspace, workspace settings and membership are created in one Prisma transaction. A failure during these database writes should therefore avoid leaving the main account graph partially created.

The subsequent sign-in occurs after the transaction and needs separate handling; see AUTH-05.

### AUTH-S05 — Password hashing parameters are not weak defaults

**Status:** positive control

The implementation uses asynchronous bcrypt hashing with cost factor 12. This exceeds OWASP's minimum bcrypt work factor of 10 for systems that continue to use bcrypt.

This does not resolve bcrypt's 72-byte limit or make bcrypt the preferred algorithm for a new application; see AUTH-02 and AUTH-07.

### AUTH-S06 — Password-manager metadata is partly correct

**Status:** positive control

- login password: `current-password`;
- signup password and confirmation: `new-password`;
- full name: `name`;
- email fields: `email`.

The password values are appropriate. AUTH-12 recommends identifying the email as the account username to improve credential pairing.

### AUTH-S07 — Signup includes password confirmation and reveal controls

**Status:** positive control

The earlier DS-150 signup concerns have been addressed:

- confirmation is required by the Zod schema;
- both password fields have independent show/hide controls;
- the controls expose an accessible label, `aria-controls` and `aria-pressed`;
- successful account creation proceeds directly to an authenticated session.

### AUTH-S08 — Pending submissions prevent repeated button activation

**Status:** positive control

Both forms disable their primary action while the Server Action is pending and replace the button label with localized progress copy.

This reduces accidental duplicate submissions in the current browser session, but it is not an abuse-control mechanism and cannot prevent direct or concurrent HTTP requests.

### AUTH-S09 — Route guards are server-side

**Status:** positive control

The authenticated application layout checks the session on the server. The public authentication layout also redirects an already authenticated user away from login and signup.

Authorization must still remain enforced in each data-access layer and mutation; layout protection alone is not a complete authorization boundary.

### AUTH-S10 — Auth.js standard handlers are used

**Status:** positive control

The repository exports Auth.js GET and POST handlers rather than implementing a custom credential-cookie endpoint. No custom weakening of Auth.js cookie or CSRF behavior was found in the audited configuration.

---

## 5. Findings overview

| ID | Priority | Type | Finding |
| --- | --- | --- | --- |
| AUTH-01 | P1 | Conditional risk | No application-level login or signup throttling was found |
| AUTH-02 | P1 | Confirmed defect | The 72-character validation does not protect bcrypt's 72-byte boundary |
| AUTH-03 | P1 | Conditional risk | Account existence can be inferred from signup responses and login timing |
| AUTH-04 | P1 | Confirmed gap | Email ownership is not verified before account activation |
| AUTH-05 | P1 | Confirmed defect | Concurrent signup and post-transaction sign-in failures are not handled explicitly |
| AUTH-06 | P1 | Confirmed gap | No password-recovery flow exists |
| AUTH-07 | P1 | Improvement | Password policy does not meet the current target for password-only authentication |
| AUTH-08 | P1 | Conditional risk | Auth.js is consumed through a beta range without a documented release-channel policy |
| AUTH-09 | P2 | Confirmed defect | All Auth.js errors are presented as invalid credentials |
| AUTH-10 | P2 | Improvement | The originally requested protected destination is discarded |
| AUTH-11 | P2 | Improvement | Error recovery does not move focus or provide an error summary |
| AUTH-12 | P2 | Improvement | Account email is not identified as `username` for password managers |
| AUTH-13 | P2 | Improvement | Login has no password reveal control |
| AUTH-14 | P2 | Improvement | Signup fields do not reuse the shared Input primitive or native constraints |
| AUTH-15 | P2 | Improvement | Session duration, revocation and reauthentication rules are implicit |
| AUTH-16 | P2 | Confirmed gap | Authentication behavior has limited action and integration test coverage |
| AUTH-17 | P2 | Documentation gap | Authentication environment and secret requirements are not documented |
| AUTH-18 | P2 | Improvement | The personal workspace name is generated only in English |
| AUTH-19 | P2 | Conditional gap | Legal and trust destinations are absent near account creation |
| AUTH-20 | P3 | Roadmap | MFA, passkeys and external identity providers are not planned in the current flow |
| AUTH-21 | P3 | Improvement | Authentication security events and product metrics are not defined |

No P0 issue was identified for a controlled internal DS-170-08 run.

---

## 6. Detailed findings

## AUTH-01 — Add abuse and attempt throttling

**Priority:** P1  
**Classification:** conditional risk  
**Applies to:** login, signup, future verification and password reset

### Evidence

No application-level limiter, progressive delay, challenge or account/IP attempt tracker was found in the audited repository.

Because the Credentials provider performs a bcrypt comparison, repeated requests can consume server CPU in addition to enabling brute-force and credential-stuffing attempts. Disabling the submit button only affects the current rendered form and does not limit direct requests.

An infrastructure-level WAF or reverse-proxy limiter may exist outside the repository. That cannot be verified here.

### Recommendation

Introduce a shared authentication abuse-control service with:

- a coarse IP or network limiter;
- an account-keyed limiter based on a non-reversible fingerprint of the normalized email;
- progressive delays or temporary cooldowns rather than a permanent account lock;
- a separate signup-creation budget;
- generic user-facing errors;
- server-side metrics for blocked, delayed and successful attempts;
- bounded storage and expiration;
- trusted-proxy handling that does not accept a spoofable forwarded address blindly.

Enforcement should cover both the product Server Action and the actual Credentials-provider authorization path so the lower-level Auth.js endpoint cannot bypass the policy.

A human-verification challenge should be considered only after suspicious thresholds, not as the first-line experience for every user.

### Acceptance criteria

- Direct requests cannot bypass the limiter.
- Existing and nonexistent accounts receive equivalent visible responses.
- A successful login resets or reduces the account-scoped failure state.
- Cooldown behavior is localized and accessible.
- The limiter fails safely when its backing store is unavailable according to a documented policy.
- Tests use a deterministic clock and do not wait in real time.

---

## AUTH-02 — Prevent bcrypt byte truncation

**Priority:** P1  
**Classification:** confirmed defect  
**Applies to:** signup now; future password change and reset

### Evidence

The signup schema allows at most 72 JavaScript characters. bcrypt, including bcrypt.js, uses only the first 72 **bytes** of a password. A multi-byte Unicode password can therefore pass the current character limit while exceeding the bcrypt byte boundary. Distinct user-visible passwords can then resolve to the same truncated bcrypt input.

### Recommendation

Immediate safe correction:

- reject any password for which `bcrypt.truncates(password)` is true;
- use the same validation in every password-creation and password-verification entry point;
- provide clear localized copy that explains the supported maximum without exposing implementation detail unnecessarily;
- add Unicode regression tests.

Preferred medium-term correction:

- migrate new hashes to Argon2id;
- preserve bcrypt verification for existing users;
- rehash with Argon2id after the next successful bcrypt login;
- store or infer the hash algorithm from the encoded hash format;
- benchmark memory and time settings in the real deployment environment.

### Acceptance criteria

- A password that bcrypt would truncate is rejected before hashing.
- The same policy is applied on signup, reset and password change.
- Existing valid bcrypt users can still sign in during a migration.
- Unicode test cases cover byte length rather than only JavaScript string length.

---

## AUTH-03 — Reduce account enumeration and timing differences

**Priority:** P1  
**Classification:** conditional risk

### Evidence

Signup returns a specific `emailAlreadyUsed` state after a preliminary lookup. This directly confirms that an account exists.

Login displays a generic message, which is positive, but the Credentials provider returns immediately when no user is found. An existing account with a wrong password performs an expensive bcrypt comparison. The two paths can therefore have measurably different response times.

### Recommendation

For login:

- maintain a valid precomputed dummy bcrypt or Argon2 hash;
- execute one password verification for both existing and nonexistent accounts;
- keep the same generic visible error;
- combine this with AUTH-01 because timing equalization alone is not sufficient.

For signup, choose and document a product policy:

1. **Higher privacy:** always return a neutral message and send an email only when an action is possible.
2. **Lower-friction MVP:** keep a specific duplicate-email message but accept and document the enumeration trade-off, with strong throttling and monitoring.

The higher-privacy approach is recommended before unrestricted public signup.

### Acceptance criteria

- Missing-user and wrong-password paths both perform one password verification.
- Visible login responses are identical.
- Signup account-existence policy is explicit and covered by tests.
- Throttling prevents high-volume probing.

---

## AUTH-04 — Verify email ownership

**Priority:** P1  
**Classification:** confirmed gap

### Evidence

The Prisma user model contains `emailVerifiedAt`, but signup does not create or send a verification challenge, and successful signup immediately creates an authenticated session. No other use of `emailVerifiedAt` was found.

A user can therefore register an address they do not control and immediately use the account under that identity.

### Recommendation

Implement an email-verification lifecycle:

- generate a cryptographically random, single-use token;
- store only a hash of the token when practical;
- apply a short, documented expiry;
- send a locale-aware verification message;
- rate-limit initial sends and resends;
- return neutral responses that do not reveal account existence;
- set `emailVerifiedAt` only after token consumption;
- invalidate the token after use;
- define which capabilities are available while verification is pending.

Recommended product behavior for VulcanForge UI:

- allow the new user to enter a limited onboarding state after signup;
- require verification before durable exports, invitations, billing or other abuse-sensitive capabilities;
- make resend and change-email actions available;
- keep the pending state understandable in both French and English.

### Acceptance criteria

- A token is single-use and expires.
- Resend is throttled.
- Changing the account email clears verification and invalidates earlier email tokens.
- The application clearly distinguishes pending, verified, expired and invalid states.
- Automated tests do not require a real email provider.

---

## AUTH-05 — Handle signup races and post-creation failures

**Priority:** P1  
**Classification:** confirmed defect

### Evidence

Signup performs an existence query before the create transaction. Two concurrent requests can both pass that query and then race on the database's unique email constraint. The action does not map Prisma `P2002` or other expected database failures to a controlled state.

The user transaction commits before the automatic Auth.js sign-in. If sign-in fails after the commit, the account exists but the action has no explicit recovery state. A retry then reports that the email is already used.

### Recommendation

- Treat the unique database constraint as the source of truth.
- Keep the preliminary check only as an optional UX optimization.
- Map `P2002` to the chosen duplicate-account policy.
- Separate account creation outcome from automatic sign-in outcome.
- After a committed account and failed sign-in, direct the user to login or a neutral continuation state rather than presenting signup as wholly failed.
- Log a sanitized correlation identifier for unexpected transaction or Auth.js failures.
- Consider an idempotency token for repeated signup submission if infrastructure retries are possible.

### Acceptance criteria

- Two concurrent submissions for the same canonical email create one account and one workspace.
- Neither request produces an unhandled database error.
- A simulated post-commit sign-in failure leaves a recoverable user journey.
- No password or token is logged.

---

## AUTH-06 — Add password recovery

**Priority:** P1  
**Classification:** confirmed gap

### Evidence

No forgot-password page, reset token model, reset action or recovery email flow was found. A user who loses their password cannot recover the account through the product.

### Recommendation

Implement a standard reset lifecycle:

- one neutral request response for existing and nonexistent addresses;
- comparable response timing;
- rate limits by account fingerprint and network source;
- cryptographically random, single-use, expiring token;
- token hash stored server-side;
- password validation shared with signup;
- no automatic login after reset;
- revoke or version existing sessions after reset;
- send a notification after a successful password change;
- do not reveal the password or generate a password for the user.

### Acceptance criteria

- Reset requests do not enumerate accounts.
- Tokens are single-use, expire and become invalid after a successful reset.
- Existing sessions are invalidated according to the session policy.
- The user returns to login with an explicit success message.
- Tests cover expired, reused, malformed and superseded tokens.

---

## AUTH-07 — Modernize the password policy

**Priority:** P1  
**Classification:** improvement

### Evidence

Signup requires 12 characters and applies no compromised-password check. The application currently uses password-only authentication, with no second factor.

Current NIST guidance sets a 15-character minimum for passwords used as a single authentication factor, requires support for at least 64 characters, discourages arbitrary composition rules and requires comparison against a blocklist of commonly used or compromised values.

### Recommendation

For the password-only public beta:

- require at least 15 characters;
- support at least 64 characters after moving away from bcrypt's byte restriction;
- allow spaces and Unicode;
- do not require arbitrary mixtures of uppercase, lowercase, digits or symbols;
- check a locally maintained or privacy-preserving compromised-password blocklist;
- allow paste and password managers;
- keep password reveal available;
- provide concise guidance before submission.

Do not add a simplistic visual strength meter unless it is backed by a credible estimator and gives actionable feedback.

### Acceptance criteria

- Common and compromised passwords are rejected with a useful generic explanation.
- Long passphrases and password-manager output are accepted.
- Validation is identical across signup, change and reset flows.
- Password values are never sent to a third-party strength or breach API in plain text.

---

## AUTH-08 — Define the Auth.js dependency policy

**Priority:** P1  
**Classification:** conditional risk

### Evidence

The project depends on `next-auth` through the range `^5.0.0-beta.31`. The audited package is therefore on a beta release channel and can receive compatible prerelease updates according to package-manager resolution and the lockfile.

This is not evidence of a known vulnerability. It is a release-management risk for a security-sensitive subsystem.

### Recommendation

Before public beta:

- confirm the latest supported Auth.js release and security status;
- pin the exact reviewed version rather than a floating beta range;
- document the update and security-advisory process;
- review release notes before every authentication dependency update;
- run focused authentication integration tests against the resolved package;
- establish a migration plan to the stable channel when available.

### Acceptance criteria

- The resolved authentication package is intentionally selected and documented.
- Renovation or dependency updates cannot silently merge without auth tests.
- The team knows where Auth.js security advisories are published.

---

## AUTH-09 — Distinguish invalid credentials from Auth.js failures

**Priority:** P2  
**Classification:** confirmed defect

### Evidence

The login action maps every `AuthError` to `invalidCredentials`. An Auth.js configuration, callback or internal authentication error can therefore be presented as a user mistake and disappear from the product's operational signal.

### Recommendation

- Map only the expected credentials-rejection error to `invalidCredentials`.
- Map unexpected authentication errors to the localized `unexpected` state.
- Log the error type and a correlation identifier without credentials or tokens.
- Keep detailed error information out of the browser response.

### Acceptance criteria

- Wrong passwords remain generic.
- Simulated provider or callback failures display a retryable unexpected-error message.
- Unexpected failures are observable server-side.

---

## AUTH-10 — Preserve the originally requested destination

**Priority:** P2  
**Classification:** improvement

### Evidence

An unauthenticated visit to any protected application route is redirected to login with only `reason=authentication-required`. Login and signup then always redirect to `/{locale}/app`. The requested project, editor or settings route is lost.

### Recommendation

- Add a `returnTo` value containing only an internal application path.
- Preserve path and relevant query parameters through login and optionally signup.
- Reject absolute URLs, protocol-relative URLs and paths outside the localized application boundary.
- Fall back to `/{locale}/app` when validation fails.

### Acceptance criteria

- A user requesting a protected project route returns to that route after login.
- An external or malformed `returnTo` cannot create an open redirect.
- Locale changes preserve a valid destination.

---

## AUTH-11 — Improve accessible error recovery

**Priority:** P2  
**Classification:** improvement

### Evidence

Field errors are rendered as text and associated with their inputs, and form-level errors use `role="alert"`. This is a sound baseline.

After a failed server submission, however, the form does not explicitly focus an error summary or the first invalid field. A keyboard or screen-reader user can remain on the submit button and must navigate backward to discover field errors.

### Recommendation

- Add a focusable error summary when field errors exist.
- Focus the summary after a failed submission.
- Link each summary item to its invalid field.
- Keep inline errors and `aria-invalid`.
- Consider `aria-errormessage` where support and component conventions are acceptable.
- Do not announce the same error through multiple competing live regions.

### Acceptance criteria

- Keyboard focus moves predictably after a failed submission.
- Screen readers receive the number and nature of errors.
- Selecting a summary item moves focus to the related field.
- Visual and programmatic error text remain aligned in French and English.

---

## AUTH-12 — Identify the account email as the username

**Priority:** P2  
**Classification:** improvement

### Evidence

Email fields use `autocomplete="email"`. The password fields correctly use `current-password` or `new-password`.

The HTML autocomplete model defines `current-password` as the password for the account identified by the `username` field. Many password managers therefore pair credentials more reliably when the login identifier uses `autocomplete="username"`, even when that identifier is an email address.

### Recommendation

- Use `autocomplete="username"` on the login email.
- Use `autocomplete="username"` on the signup email when creating the account credential.
- Keep `type="email"`, appropriate input mode and email validation.
- Test with the major browser password managers rather than relying only on DOM assertions.

---

## AUTH-13 — Add password reveal to login

**Priority:** P2  
**Classification:** improvement

### Evidence

Signup provides accessible reveal controls but login does not. This produces an inconsistent experience and makes correction of long passphrases harder.

### Recommendation

Reuse the signup visibility-control pattern in a shared password field component. Preserve `current-password`, input value and focus when toggling the input type.

---

## AUTH-14 — Align signup with shared form primitives and native constraints

**Priority:** P2  
**Classification:** improvement

### Evidence

Login uses the shared `Input` primitive. Signup duplicates its own input class string and native inputs. The signup inputs also do not expose `required`, `minLength` or `maxLength` attributes matching the server schema.

Server validation remains authoritative, but aligned native metadata improves mobile keyboards, browser assistance, consistency and no-JavaScript behavior.

### Recommendation

- Reuse `Input` and a shared password-field composition.
- Add native constraints that mirror non-sensitive schema requirements.
- Keep server-side validation as the source of truth.
- Centralize IDs and described-by relationships to prevent collisions if multiple forms are ever rendered together.

---

## AUTH-15 — Define session and reauthentication policy

**Priority:** P2  
**Classification:** improvement

### Evidence

The Auth.js configuration selects JWT sessions but leaves lifetime and revocation semantics implicit. The token contains no session or credential version that can be checked after password reset, email change, account deletion or a security event.

### Recommendation

Document and implement:

- explicit absolute session lifetime;
- renewal or inactivity behavior;
- a server-side `sessionVersion` or equivalent revocation signal;
- session invalidation after password reset and security-sensitive account changes;
- reauthentication before destructive or identity-sensitive actions;
- logout behavior across devices, when supported;
- safe authentication-event logging.

A pure stateless JWT cannot be revoked immediately without a server-side check or a short lifetime. The selected compromise should be explicit.

---

## AUTH-16 — Expand authentication tests

**Priority:** P2  
**Classification:** confirmed gap

### Evidence

The repository currently covers basic login and signup schema cases. Signup form tests cover password confirmation and reveal controls. No focused login form test, Server Action test, Credentials-provider authorization test or authentication integration suite was found.

### Recommended test matrix

#### Schemas

- canonical email normalization;
- Unicode and bcrypt byte-boundary cases;
- long passphrases;
- compromised-password rejection;
- mismatch and missing-field message keys;
- exact FR/EN message parity.

#### Login action and provider

- valid credentials;
- wrong password;
- nonexistent user with dummy verification;
- malformed credentials;
- limiter allowed, delayed and blocked states;
- expected credentials error versus unexpected Auth.js error;
- database failure without credential leakage;
- valid and rejected `returnTo` values.

#### Signup action

- valid account graph creation;
- canonical duplicate email;
- concurrent duplicate requests and `P2002`;
- transaction rollback;
- committed account followed by sign-in failure;
- limiter behavior;
- localized preferences and workspace naming.

#### Forms and accessibility

- pending state;
- preserved non-secret values;
- password visibility and focus;
- error summary focus and links;
- autocomplete values;
- keyboard-only submission;
- FR/EN labels and validation copy.

#### Verification and recovery

- token expiry, reuse and supersession;
- neutral responses for unknown accounts;
- resend throttling;
- password reset invalidates previous sessions;
- email change invalidates prior verification tokens.

---

## AUTH-17 — Document authentication environment requirements

**Priority:** P2  
**Classification:** documentation gap

### Evidence

The repository README explains database and application startup, but no `.env.example` was found and authentication secret requirements are not documented there.

This does not prove that a deployment secret is absent. It means a new developer or deployment reviewer cannot verify the required authentication configuration from the repository documentation.

### Recommendation

Add a non-secret `.env.example` and deployment checklist covering:

- database URL;
- Auth.js secret generation and rotation responsibility;
- canonical application URL and trusted-host behavior where applicable;
- email provider configuration once verification and recovery exist;
- rate-limit backing store;
- proxy/header trust assumptions;
- secure production cookie and HTTPS expectations;
- prohibition on committing real tokens or secrets.

---

## AUTH-18 — Localize the personal workspace name

**Priority:** P2  
**Classification:** improvement

### Evidence

Signup generates the initial workspace name with the English template `${name}'s workspace` regardless of the selected locale.

### Recommendation

Generate the initial name through a server-safe localized formatter, or use a locale-neutral product name such as the user's display name until the user renames the workspace.

---

## AUTH-19 — Add trust and legal destinations near signup

**Priority:** P2  
**Classification:** conditional gap

### Evidence

No Terms or Privacy destinations were found beside signup or in the audited public footer.

The exact legal requirement depends on the service, deployment countries and data practices and requires appropriate legal review. Independently of legal scope, the absence reduces user clarity about account data handling.

### Recommendation

Before public signup:

- publish accessible Terms and Privacy destinations;
- state the consequence of creating an account in concise copy;
- avoid a pre-checked marketing consent;
- collect optional communications consent separately from service acceptance;
- record policy versions only when the product and legal design requires it.

---

## AUTH-20 — Plan stronger authentication options

**Priority:** P3  
**Classification:** roadmap

### Recommendation

After the password flow is hardened, evaluate:

- WebAuthn/passkeys;
- optional TOTP or recovery codes for higher-risk accounts;
- trusted OAuth/OIDC providers when they reduce onboarding friction;
- step-up authentication for destructive actions;
- organization-level SSO as a later B2B capability.

These options should not delay the immediate P1 controls.

---

## AUTH-21 — Define security events and product metrics

**Priority:** P3  
**Classification:** improvement

### Recommendation

Create a privacy-conscious event contract for:

- signup attempted, completed and failed by reason category;
- verification sent, completed and expired;
- login succeeded, rejected, delayed and blocked;
- recovery requested and completed;
- password changed;
- sessions revoked;
- suspicious volume thresholds.

Never log raw passwords, reset or verification tokens, session tokens, full authorization headers or unnecessary personal data. Prefer correlation IDs and irreversible account fingerprints for aggregate abuse signals.

---

## 7. Recommended target architecture

### Authentication boundary

- Auth.js remains the session and credential-provider integration layer.
- Zod schemas remain shared validation contracts.
- A dedicated authentication service owns password hashing, verification and migration.
- A dedicated abuse-control service is called by every sensitive entry point.
- Database uniqueness remains the final identity constraint.
- Server-side data access continues to enforce authorization independently of layouts.

### Password service

Recommended interface responsibilities:

- validate password length and compromised-password policy;
- reject bcrypt truncation during transition;
- hash new passwords with Argon2id when adopted;
- verify legacy bcrypt and new Argon2id hashes;
- signal when rehashing is required;
- expose no hash details to client code.

### Token service

One reusable token lifecycle for verification and recovery should provide:

- cryptographically random token generation;
- server-side token hashing;
- purpose, subject, expiry and consumed timestamps;
- single-use consumption in a transaction;
- supersession of older active tokens;
- rate-limited delivery.

Separate token purposes must not be interchangeable.

### Session model

Recommended user-level fields or equivalent storage:

- `sessionVersion` or `credentialsVersion`;
- `passwordChangedAt`;
- optional `lastAuthenticatedAt` for step-up decisions.

The session callback or authorization layer should reject a token whose version is older than the current user record when immediate revocation is required.

---

## 8. Proposed implementation sequence

## DS-170-AUTH-01 — Harden credentials and abuse controls

**Priority:** first

### Scope

- shared auth limiter;
- missing-user dummy password verification;
- bcrypt byte-boundary rejection;
- precise Auth.js error mapping;
- signup `P2002` and post-commit recovery handling;
- focused tests and sanitized observability.

### Reason for grouping

These changes address the highest-risk public exposure while keeping the existing account model and email infrastructure unchanged.

---

## DS-170-AUTH-02 — Add email verification and password recovery

**Priority:** second

### Scope

- verification and reset token models;
- email-delivery abstraction;
- pending-verification product state;
- resend and reset request throttling;
- password reset and session invalidation;
- localized pages, emails and tests.

### Prerequisite

The abuse-control and password-policy foundations from AUTH-01 should be reusable here.

---

## DS-170-AUTH-03 — Improve journey continuity and form UX

**Priority:** third

### Scope

- secure `returnTo` preservation;
- login password reveal;
- `username` autocomplete;
- accessible error summary and focus;
- shared signup inputs and native constraints;
- localized workspace name;
- Terms and Privacy destinations when content is approved.

---

## DS-170-AUTH-04 — Define session and dependency operations

**Priority:** fourth

### Scope

- explicit session policy and versioning;
- reauthentication rules;
- auth event contract and metrics;
- environment documentation;
- exact Auth.js version policy;
- security-update procedure and integration gate.

---

## DS-170-AUTH-05 — Strong-auth roadmap

**Priority:** post-MVP

### Scope

- passkeys;
- optional MFA;
- OAuth/OIDC providers;
- step-up authentication;
- organization SSO exploration.

---

## 9. Minimal gate before external hosted testing

When testers access an internet-reachable deployment rather than a restricted environment, the recommended minimum is:

1. application or infrastructure throttling is confirmed and tested;
2. bcrypt-truncated passwords are rejected;
3. concurrent duplicate signup is handled without a 500 response;
4. unexpected Auth.js failures are distinguishable and observable;
5. the environment uses a reviewed Auth.js version and properly managed secret;
6. test accounts and email addresses are disposable until verification exists;
7. destructive and billing-like capabilities remain unavailable to unverified or test identities.

---

## 10. Manual QA checklist for the current flow

This checklist validates the implementation as it exists before corrections.

### Signup

- [ ] Create an account in French.
- [ ] Create an account in English.
- [ ] Verify that name and email survive a validation error.
- [ ] Verify that password values do not survive a validation error.
- [ ] Verify independent reveal controls for password and confirmation.
- [ ] Verify mismatch, short password, invalid email and short name errors.
- [ ] Verify duplicate-email behavior.
- [ ] Verify automatic sign-in and workspace creation.
- [ ] Verify the selected locale is persisted.
- [ ] Inspect the initial workspace name in both locales.

### Login

- [ ] Sign in with canonical lowercase email.
- [ ] Sign in using uppercase characters and surrounding email whitespace.
- [ ] Submit a wrong password.
- [ ] Submit a nonexistent account and compare only visible behavior.
- [ ] Verify the pending button state.
- [ ] Verify the authentication-required notice.
- [ ] Verify redirect to the application.
- [ ] Confirm that the originally requested route is currently not restored.

### Accessibility and responsive behavior

- [ ] Complete both flows using only the keyboard.
- [ ] Verify labels and errors with a screen reader.
- [ ] Verify error discovery after submission.
- [ ] Verify password visibility buttons retain focus.
- [ ] Verify browser and password-manager autofill.
- [ ] Test at 390 px, desktop width, 200% zoom, light mode and dark mode.
- [ ] Repeat critical paths in French and English.

---

## 11. Final product decision

### Recommended decision

- Accept the current flow as sufficient to enter **controlled DS-170-08 internal QA**.
- Do not open unrestricted public self-service signup before the P1 work is complete.
- Implement the work in the proposed sequence rather than combining verification, recovery, session redesign and strong authentication into one large pull request.

### Product-owner decisions required

1. Should duplicate signup reveal that an account already exists, or use a neutral response?
2. Can an unverified account enter the application, and which capabilities remain blocked?
3. What session lifetime and reauthentication policy should apply?
4. Is password-only authentication acceptable for the first public beta, provided the password policy and throttling are hardened?
5. Which email delivery provider and sender identity will support verification and recovery?
6. Are Terms and Privacy contents ready for public signup?

---

## 12. Primary references

- NIST SP 800-63B — Authenticators: <https://pages.nist.gov/800-63-4/sp800-63b/authenticators/>
- OWASP Authentication Cheat Sheet: <https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html>
- OWASP Password Storage Cheat Sheet: <https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html>
- OWASP Forgot Password Cheat Sheet: <https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html>
- OWASP Session Management Cheat Sheet: <https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html>
- OWASP Email Validation and Verification Cheat Sheet: <https://cheatsheetseries.owasp.org/cheatsheets/Email_Validation_and_Verification_Cheat_Sheet.html>
- Auth.js Credentials provider reference: <https://authjs.dev/reference/core/providers/credentials>
- Auth.js custom sign-in page guide: <https://authjs.dev/guides/pages/signin>
- Auth.js security policy: <https://authjs.dev/security>
- Next.js authentication guide: <https://nextjs.org/docs/app/guides/authentication>
- Next.js data security guide: <https://nextjs.org/docs/app/guides/data-security>
- HTML autocomplete field definitions: <https://html.spec.whatwg.org/dev/form-control-infrastructure.html#autofill>
- WCAG 2.2 — Error Identification: <https://www.w3.org/WAI/WCAG22/Understanding/error-identification.html>
- WCAG 2.2 — Labels or Instructions: <https://www.w3.org/WAI/WCAG22/Understanding/labels-or-instructions.html>
- bcrypt.js package documentation: <https://www.npmjs.com/package/bcryptjs>
