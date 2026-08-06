# DS-170-AUTH-05 — Journey continuity and accessibility

## Status

Implementation in progress on `feature/ds-170-auth-05-continuity-accessibility`.

## Objective

Complete the directly perceptible authentication improvements identified by the signup/sign-in audit without changing the session policy reserved for DS-170-AUTH-06 or inventing legal content reserved for DS-170-AUTH-07.

## Audit coverage

- AUTH-10 — preserve the originally requested application destination;
- AUTH-11 — add an accessible error summary and predictable focus recovery;
- AUTH-12 — identify the account email as `autocomplete="username"`;
- AUTH-13 — add an accessible password reveal control to login;
- AUTH-14 — align authentication forms on shared fields and native constraints;
- AUTH-18 — localize the initial personal workspace name;
- AUTH-19 — prepare the technical trust/legal integration boundary while deferring approved legal copy and final destinations to DS-170-AUTH-07.

## Decisions

### Secure return destinations

A single server-safe contract validates `returnTo` values.

Accepted values:

- are relative paths beginning with exactly one `/`;
- stay inside `/{locale}/app`;
- may preserve a query string;
- use the locale currently handling the authentication journey.

Rejected values include:

- absolute URLs;
- protocol-relative URLs;
- paths containing backslashes or control characters;
- paths for another locale;
- paths outside the authenticated application boundary;
- malformed or ambiguous encodings.

Every rejection falls back to `/{locale}/app`.

The existing Next.js 16 proxy records the original GET/HEAD application target in a private upstream request header. The application layout overwrites any client-supplied value at the proxy boundary, validates it again, and includes only the validated value in the login redirect.

### Shared authentication fields

Authentication forms share:

- an accessible error summary;
- a reusable password field;
- one visibility-control implementation;
- consistent help and error associations;
- consistent styles based on the shared `Input` primitive.

The password field preserves value and focus when visibility changes and supports both `current-password` and `new-password` autocomplete purposes.

### Direct password feedback

Signup and reset provide deterministic local feedback while the user types:

- password length is measured after NFC normalization in Unicode code points;
- the accepted range is 15–128 code points;
- confirmation matching updates locally;
- no arbitrary weak/medium/strong score is shown;
- the feedback is not announced on every keystroke through a noisy live region.

Compromised-password checks, Argon2id availability, throttling and all authoritative acceptance decisions remain server-side and run on submission.

HTML `minLength` and `maxLength` are not used for the password policy because DOM length uses UTF-16 code units and would disagree with the server's Unicode code-point contract. `required` remains appropriate.

### Native constraints

- login and signup email identifiers use `type="email"` and `autocomplete="username"`;
- required fields expose `required`;
- name constraints mirror the existing 2–80 character schema;
- server-side Zod and password services remain authoritative.

### Workspace localization

The initial personal workspace name is formatted from the validated signup locale before persistence:

- English: `{name}'s workspace`;
- French: `Espace de travail de {name}`.

The fallback identity is localized instead of embedding the English word `User` in every locale.

### Legal and trust boundary

DS-170-AUTH-05 may introduce a reusable technical slot/component for signup legal destinations, but it must not:

- publish generic Terms or Privacy copy as approved legal text;
- create broken links to absent pages;
- combine service acceptance with optional marketing consent;
- add pre-checked consent.

Final pages, wording, policy versioning and legal validation belong to DS-170-AUTH-07.

## Acceptance criteria

### Continuity

- an unauthenticated request to a nested application route reaches login with a validated `returnTo`;
- successful login returns to that route and preserves its query string;
- malformed, external and cross-locale destinations fall back to the locale application root;
- signup links preserve a valid destination when the journey starts from login.

### Accessibility and forms

- login, signup and reset use the shared password field;
- login supports reveal/hide without losing focus or value;
- field-validation failures render one focusable summary linked to invalid fields;
- focus moves to the summary after a failed submission;
- inline errors and `aria-invalid` remain aligned with the summary;
- email identifiers expose `autocomplete="username"`;
- native constraints match the server contract where browser and server semantics agree;
- FR and EN visible copy remains localized.

### Direct feedback

- signup and reset show password-length progress before submission;
- confirmation mismatch feedback updates before submission;
- long passphrases, spaces and Unicode remain supported;
- compromised-password checks are not called while typing.

### Persistence

- new English accounts receive an English workspace name;
- new French accounts receive a French workspace name;
- existing workspaces are not renamed.

### Quality

- focused unit/component tests cover return-target validation, reveal behavior, focus recovery, autocomplete, direct password feedback and localized workspace naming;
- `npm run quality` passes;
- manual keyboard and password-manager QA is recorded before merge.

## Manual QA checklist

- [ ] Request a nested protected route with a query string while signed out.
- [ ] Confirm login preserves and restores that destination.
- [ ] Confirm an external or malformed `returnTo` falls back safely.
- [ ] Test login, signup and reset with keyboard-only navigation.
- [ ] Confirm error-summary focus and links in English and French.
- [ ] Confirm password reveal keeps focus, selection and value.
- [ ] Confirm password managers recognize email as username and the correct password purpose.
- [ ] Confirm password feedback with ASCII, spaces, accents and supplementary Unicode characters.
- [ ] Confirm the compromised-password check still runs only on submission.
- [ ] Create English and French accounts and inspect their initial workspace names.

## Deferred

- absolute session lifetime, renewal, all-device logout and reauthentication policy: DS-170-AUTH-06;
- final Terms, Privacy, policy versions and legal review: DS-170-AUTH-07;
- passkeys, TOTP, recovery codes and external identity providers: DS-170-AUTH-08.
