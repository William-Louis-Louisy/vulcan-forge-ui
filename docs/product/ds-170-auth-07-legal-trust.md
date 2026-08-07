# DS-170-AUTH-07 — Legal and trust surfaces

## Status

Implementation complete on `feature/ds-170-auth-07-legal-trust`. Automated Quality and manual product QA remain required before the draft pull request can be marked ready.

## Objective

Close AUTH-19 by making Terms and Privacy destinations visible from signup and the public surface without pretending that repository-generated copy is a substitute for publisher-specific legal review.

## Product decisions

- public routes are `/{locale}/terms` and `/{locale}/privacy`;
- Terms and Privacy remain separate documents;
- signup states that creating an account means accepting the Terms and acknowledging the Privacy Notice;
- no extra mandatory checkbox is introduced for the current service-acceptance flow;
- no marketing consent is added, pre-checked or bundled into account creation;
- no database policy-version or consent ledger is introduced until a concrete legal/product requirement exists;
- both pages display an explicit last-updated date;
- publisher identity and privacy/legal contact are deployment configuration rather than hard-coded personal data.

## Official basis reviewed

The implementation was checked against official sources before the copy was drafted:

- GDPR Article 13 requires information including controller identity/contact, purposes, legal basis, recipients, relevant transfers, retention information and data-subject rights when data is collected from the person: https://eur-lex.europa.eu/legal-content/FR-EN/TXT/?uri=CELEX:32016R0679
- CNIL guidance recommends concise, transparent, understandable and easily accessible information, and specifically recommends a clearly visible privacy link while keeping the privacy policy distinct from Terms/CGU: https://www.cnil.fr/fr/conformite-rgpd-information-des-personnes-et-transparence
- CNIL examples are guidance to adapt to the real processing rather than universal ready-to-publish templates: https://www.cnil.fr/fr/passer-laction/rgpd-exemples-de-mentions-dinformation
- CNIL complaint guidance is linked from the privacy page: https://www.cnil.fr/fr/adresser-une-plainte

These sources establish the information categories and transparency expectations. They do not determine the publisher's corporate identity, final legal bases, contracts with deployment providers, transfer mechanisms or governing-law clauses.

## Implemented surfaces

### Terms

The Terms page documents the current beta boundary:

- beta status and absence of billing;
- account and credential responsibilities;
- acceptable-use/security restrictions;
- responsibility for project content and generated exports;
- beta availability expectations;
- account deletion/suspension boundary;
- operator/contact publication details and update-date handling.

The Terms deliberately do not invent a governing-law, venue, corporate-registration or commercial-contract clause that has not been approved by the publisher.

### Privacy

The Privacy page describes processing that is supported by the current repository:

- account identity, email-verification state, locale and preferences;
- password hashes, authentication version/session metadata and security events;
- HMAC fingerprints used by abuse controls rather than raw email/IP values;
- hashed verification and recovery challenges;
- workspace and design-system project data;
- production Resend email delivery when configured;
- Pwned Passwords k-anonymity using only the first five hexadecimal SHA-1 characters;
- 30-minute verification/recovery challenge expiry;
- account deletion as the primary-database deletion boundary;
- Auth.js session/security cookies;
- CNIL complaint destination and the principal data-subject rights.

Deployment-specific hosting, backup/log retention, processing locations and transfer safeguards are explicitly not invented because the repository cannot determine them.

## Publication configuration

Two server-side deployment values are documented in `.env.example`:

- `LEGAL_OPERATOR_NAME`;
- `LEGAL_CONTACT_EMAIL`.

If both values are configured, the public legal pages render them as the operator/controller publication details.

If either value is missing or invalid, the pages remain accessible for internal/manual QA but display a clear publication-readiness warning. The fallback never fabricates an email address or personal/company identity.

This lets AUTH-07 land safely without silently presenting incomplete publisher data as finalized legal compliance.

## Signup integration

The account-creation form now places localized Terms and Privacy links directly beside the submit action. The wording distinguishes:

- agreement to the Terms of Use;
- acknowledgement of the Privacy Notice.

No marketing opt-in is attached to the account action.

## Public navigation

The existing public footer now exposes localized Terms and Privacy links. The marketing route group supplies the normal public header/footer around both legal pages, so the documents remain reachable without authentication and preserve the selected locale through next-intl navigation.

## Automated coverage

Focused tests cover:

- legal publisher configuration and transparent incomplete-state behavior;
- EN/FR legal document availability;
- inclusion of implemented Pwned Passwords, Resend and 30-minute challenge facts;
- configured controller/contact interpolation;
- signup Terms/Privacy destinations;
- footer Terms/Privacy destinations.

The repository Quality workflow remains the merge gate for lint, strict TypeScript, formatting, UI audit, tests and production build.

## Manual QA checklist

- [ ] Open `/en/terms`, `/fr/terms`, `/en/privacy` and `/fr/privacy` while signed out.
- [ ] Verify both legal pages use the public header/footer and remain readable in light and dark themes.
- [ ] Verify headings, lists, links and the CNIL external link are keyboard reachable and visibly focused.
- [ ] Verify the footer exposes localized Terms/Privacy links on Home and Pricing.
- [ ] Verify signup shows the legal acknowledgement directly below account creation in EN and FR.
- [ ] Verify signup legal links preserve the active locale.
- [ ] Verify no checkbox or marketing consent was added to signup.
- [ ] With `LEGAL_OPERATOR_NAME` and `LEGAL_CONTACT_EMAIL` unset, verify the publication warning is visible and no fake contact is shown.
- [ ] With both values configured in `.env.local`, restart the app and verify the warning disappears and the configured operator/contact are rendered.
- [ ] Check mobile and desktop layouts for long FR legal copy.

## Legal-review boundary before public launch

AUTH-07 makes the product transparent and structurally ready; it does not certify legal compliance.

Before a real public/commercial launch, the publisher must still confirm at minimum:

- legal operator/controller identity and contact;
- whether additional French website publisher notices are required for the actual business status;
- final legal-basis mapping;
- infrastructure subprocessors, locations, contractual safeguards and international transfers;
- backup/log retention periods;
- governing law, dispute and limitation clauses appropriate to the service;
- whether future billing, analytics, collaboration, marketing or AI-provider integrations change the disclosures;
- whether policy-version acceptance must later be recorded.

## Deferred

- passkeys, TOTP, recovery codes and external identity providers: DS-170-AUTH-08;
- commercial billing terms and paid-plan cancellation rules: deferred until billing exists;
- marketing-consent management: deferred until a marketing processing purpose actually exists.
