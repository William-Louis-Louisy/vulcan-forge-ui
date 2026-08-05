# DS-170-AUTH-02 — Password modernization

## Status

Implementation, automated validation and manual product QA are complete. Quality run #1024 passed on commit `2e3fb1a`; the full manual checklist was validated on 2026-08-05. The pull request may now leave Draft when the maintainer chooses.

## Objective

Replace bcrypt for newly created accounts with a versioned Argon2id password service while preserving authentication for existing bcrypt accounts and migrating eligible legacy hashes after successful login.

## Password policy

New passwords use the following policy:

- 15 to 128 Unicode code points after NFC normalization;
- spaces and passphrases are allowed;
- no mandatory uppercase, lowercase, number or symbol composition rules;
- malformed Unicode containing lone surrogate code units is rejected;
- password confirmation is compared after NFC normalization;
- passwords found in the Pwned Passwords corpus are rejected during signup.

The compromised-password lookup uses the Pwned Passwords range API. Only the first five hexadecimal characters of the normalized password's SHA-1 digest are sent. Response padding is requested and the complete password is never transmitted.

Signup fails closed when the compromised-password service is unavailable or returns an invalid response. No account or password hash is created in that state.

## Argon2id storage

The application requires Node.js 24 and uses the runtime's built-in Argon2id implementation. No additional native hashing dependency is installed.

Current parameters:

- memory: 19 MiB;
- passes: 2;
- parallelism: 1;
- random salt: 16 bytes;
- derived key: 32 bytes.

Hashes are stored in a strict application-owned versioned format:

```text
$vulcan$argon2id$v=1$m=19456,t=2,p=1,l=32$<salt-base64url>$<derived-key-base64url>
```

The parser rejects unknown versions, malformed encodings, non-canonical Base64URL values, unsafe parameter ranges and derived-key length mismatches before invoking Argon2id.

## Signup integration

The signup action now performs these operations in order:

1. consume the existing account and trusted-address rate limits;
2. validate and normalize the submitted fields;
3. check the password against the compromised-password corpus;
4. create a random-salt Argon2id hash;
5. create the user, preferences, personal workspace, settings and owner membership atomically;
6. reset the signup account bucket;
7. attempt the existing automatic sign-in.

A compromised password is returned as an accessible password field error. Compromised-password lookup failure and Argon2id runtime failure use distinct localized form errors.

## Login and legacy migration

Login accepts both current Argon2id hashes and legacy bcrypt hashes.

A valid bcrypt login is migrated opportunistically:

1. bcrypt verifies the submitted password using its historical input semantics;
2. the complete submitted password is normalized and rehashed with current Argon2id parameters;
3. the database update requires both the user ID and the previously read hash to still match;
4. a concurrent password-hash change therefore cannot be overwritten.

Migration is intentionally non-blocking after successful credential verification. Login still succeeds when:

- a legacy password is shorter than the new 15-character creation policy;
- Argon2id hashing is temporarily unavailable during migration;
- the conditional database update loses a concurrent race;
- migration persistence fails.

These outcomes emit sanitized security events for operational follow-up.

Missing accounts are verified against a deterministic valid Argon2id dummy hash. Unsupported or malformed stored hashes also receive dummy Argon2id work before rejection.

## Other credential confirmation paths

Account email changes and permanent account deletion now use the shared password verifier. Both Argon2id and legacy bcrypt accounts therefore retain access to those confirmation flows during migration.

## Security events

The implementation adds these sanitized events:

- `auth.signup.password_compromised`;
- `auth.signup.password_check_unavailable`;
- `auth.signup.password_hashing_unavailable`;
- `auth.password.rehash_succeeded`;
- `auth.password.rehash_skipped`;
- `auth.password.rehash_failed`.

Metadata may include a user ID, account or address fingerprint, request ID, source hash scheme, occurrence count, and a bounded reason code. Events never include the submitted password, raw email address, raw IP address, stored hash, generated hash, salt, derived key or session token.

## Automated coverage

Focused tests cover:

- Node.js 24 Argon2id availability;
- random salts and complete-password verification beyond bcrypt's 72-byte boundary;
- NFC normalization and Unicode code-point boundaries;
- malformed Unicode rejection;
- strict versioned hash parsing;
- the deterministic dummy Argon2id hash;
- bcrypt verification and rehash signalling;
- compromised-password k-anonymity, padding and fail-closed behavior;
- signup error mapping before hashing or persistence;
- conditional bcrypt-to-Argon2id migration;
- non-blocking migration for policy-ineligible legacy passwords;
- Argon2id verification in account email-change and deletion flows.

## Manual QA checklist

### New signup

- [x] A 14-character password is rejected with the localized minimum-length message.
- [x] A 15-character password is accepted when it is not present in the compromised-password corpus.
- [x] A password longer than 128 Unicode code points is rejected.
- [x] A passphrase containing spaces is accepted.
- [x] Canonically equivalent composed and decomposed Unicode values match in password confirmation.
- [x] A known compromised password is rejected before account creation.
- [x] Blocking access to `api.pwnedpasswords.com` produces the localized unavailable state and creates no account.
- [x] A successful account stores a hash beginning with `$vulcan$argon2id$` rather than `$2`.
- [x] Automatic sign-in still redirects the new account to the localized application route.

### Existing accounts

- [x] An existing bcrypt account can still sign in.
- [x] An eligible bcrypt hash changes to `$vulcan$argon2id$` after successful login.
- [x] A wrong password does not migrate the stored hash.
- [x] A legacy password below 15 characters can still sign in and emits `auth.password.rehash_skipped` with `policy_ineligible`.
- [x] An existing Argon2id account can sign in without rewriting a current hash.
- [x] An Argon2id account can confirm an email change with its current password.
- [x] An Argon2id account can confirm permanent account deletion with its current password.

### Logging and privacy

- [x] Successful migration emits `auth.password.rehash_succeeded`.
- [x] Migration failure or a lost conditional update does not block login.
- [x] Logs contain no raw password, raw email, raw IP address, password hash, salt, derived key or session token.

## Known boundaries

- Existing passwords are not checked against Pwned Passwords during ordinary login. Blocking an established account on an external lookup would create an availability and account-recovery problem. Compromised-password enforcement applies when accepting a new password.
- Legacy passwords that do not meet the new creation policy remain usable until a dedicated password-change or recovery journey lets the user replace them safely.
- The application-level authentication throttling from DS-170-AUTH-01 remains the primary protection against resource exhaustion from password verification attempts.
