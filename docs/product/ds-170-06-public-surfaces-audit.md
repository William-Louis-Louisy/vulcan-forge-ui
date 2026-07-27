# DS-170-06 — Public surfaces audit

## Objective

Align the public-facing VulcanForge UI surfaces with the validated editorial mockup while preserving honest product behavior, accessible navigation, localized content and the existing authentication contract.

## Validated product decisions

- use the approved VulcanForge symbol and wordmark treatment;
- use Fraunces for editorial display typography;
- replace Geist globally with Inter Tight for interface typography;
- replace Geist Mono globally with JetBrains Mono for technical values;
- preserve Signup password confirmation and mismatch validation;
- preserve the 12-character minimum password rule;
- do not add Terms, Remember me or Forgot password controls without implemented behavior;
- do not show public links whose routes do not exist;
- do not show a waiting-list action without a real waiting-list workflow;
- redirect authenticated users away from Login and Signup;
- send authenticated public CTAs to the Dashboard;
- preserve FR/EN route switching and light/dark preferences.

## Route architecture

The public route group is separated into two nested layouts without changing URLs:

```text
(public)/
├── (marketing)/
│   ├── layout.tsx
│   ├── page.tsx
│   └── pricing/page.tsx
└── (auth)/
    ├── layout.tsx
    ├── login/page.tsx
    └── signup/page.tsx
```

The resulting routes remain:

- `/[locale]`;
- `/[locale]/pricing`;
- `/[locale]/login`;
- `/[locale]/signup`.

The marketing layout renders the shared public header and footer. The auth layout renders the compact logo-and-locale header and redirects authenticated sessions to the localized Dashboard.

## Global typography migration

The locale root layout now loads:

- Fraunces;
- Inter Tight;
- JetBrains Mono.

Inter Tight and JetBrains Mono replace the former Geist font files globally so authenticated and public surfaces use one validated typography foundation. Fraunces is used explicitly for editorial display levels on Landing, Pricing and Auth surfaces.

The migration intentionally does not redesign authenticated workspaces. Manual QA must verify that the new metrics do not introduce truncation, overflow, density shifts or misalignment in existing application screens.

## Public identity

The former public `VF` placeholder is removed.

The shared public lockup combines:

- the approved VulcanForge symbol;
- the `VulcanForge UI` wordmark;
- the clay accent on `Forge`;
- default and inverse-ready color behavior;
- compact and standard sizes.

Repeated SVG instances use isolated clip-path identifiers.

## Public navigation

### Desktop

The marketing header exposes only functional destinations:

- Product;
- Pricing;
- Example;
- locale switcher;
- Sign in or Dashboard;
- Start for free for anonymous visitors.

### Mobile

The compact menu:

- opens from a real button;
- reports expanded state and controls relationship;
- closes on outside pointer interaction;
- closes on Escape;
- restores focus to its trigger after Escape;
- exposes Product, Example and Pricing;
- includes the full-width locale switcher;
- exposes Sign in and Start for free for anonymous visitors;
- exposes one Dashboard action for authenticated visitors.

No Docs, Changelog, About, Contact, Status or legal destination is shown because those public routes are not part of the current product.

## Footer

The shared marketing footer contains:

- approved branding;
- localized product positioning;
- Product and Example anchors;
- Pricing;
- Sign in or Dashboard;
- localized copyright copy.

It does not contain placeholder or unavailable destinations.

## Landing

The Landing surface is restructured around the validated editorial hierarchy:

1. asymmetric hero with a Fraunces display title;
2. real CTA links with session-aware destinations;
3. reusable static product-editor preview;
4. three explicit product problems;
5. four model capabilities;
6. a dark six-format export section;
7. honest target-audience guidance;
8. final CTA;
9. shared footer.

The previous gradient halo, repeated generic SaaS cards, duplicated pricing block, placeholder `VF` feature marks and non-functional preview button are removed.

The previous fictional customer-logo proof is not reproduced. Audience positioning is presented as `Built for` rather than an unsupported adoption claim.

## Pricing

The Pricing page exposes three transparent product directions:

- Free beta — available now;
- Pro — coming later;
- Team — coming later.

Only Free beta has an actionable CTA. Pro and Team display non-interactive availability copy. No amount, subscription state or waiting-list behavior is invented.

The FAQ clarifies:

- what is currently free;
- how FR/EN export content behaves;
- that Pro and Team cannot currently be purchased or joined.

## Authentication

### Login

Login retains:

- visible Email and Password labels;
- localized field and global errors;
- pending submit state;
- account-creation link;
- the registered-account success message.

The right desktop panel uses the reusable product-editor preview. It is removed from the visual flow below the desktop breakpoint.

### Signup

Signup retains:

- Name;
- Email;
- Password;
- Confirm password;
- independent password-visibility controls;
- 12-character minimum guidance;
- mismatch validation;
- localized field and global errors;
- pending submit state;
- Login link.

The right desktop panel uses a full-height dark product-value surface. It is hidden on compact layouts.

The forms use the established Tokens-inspector field contract:

- subtle semantic border;
- primary surface;
- compact padding;
- medium radius;
- primary semantic focus border;
- visible global focus outline.

## Reusable preview

Landing and Login share one static `ProductEditorPreview` component.

The preview:

- uses non-interactive presentation elements;
- does not render false buttons;
- localizes interface labels;
- keeps technical token names and sample values visually distinct with the global mono font;
- exposes intentional fixed token-color samples as visual swatches.

## Internationalization

Public-surface copy is isolated in `public-surface-messages.ts` and merged into the existing next-intl message contract.

Automated coverage verifies:

- English and French message-shape parity;
- actionable Free beta copy;
- intentionally empty Pro and Team CTA copy;
- explicit unavailable-plan messages;
- preservation of Signup password-confirmation validation.

## Product boundary

DS-170-06 does not introduce:

- billing;
- waiting-list persistence;
- password recovery;
- Remember me persistence;
- legal-consent persistence;
- new public Docs or Company routes;
- a Prisma migration;
- changes to the authenticated product domain.

## Manual QA checklist

### Global typography

- verify Fraunces display typography on Landing, Pricing, Login and Signup;
- verify Inter Tight throughout public and authenticated interfaces;
- verify JetBrains Mono on token values, slugs and generated source previews;
- verify Dashboard, Settings, Overview, Brand, Tokens, Themes, Components, Accessibility, Documentation, Exports and AI Instructions have no new truncation or overflow;
- verify button, input, segmented-control and topbar heights remain aligned.

### Header and footer

- verify the approved symbol and wordmark on every public route;
- verify the placeholder `VF` mark is absent;
- verify desktop Product, Pricing and Example navigation;
- verify anonymous Sign in and Start for free actions;
- verify authenticated Dashboard behavior and absence of a duplicate CTA;
- verify mobile menu outside-click dismissal;
- verify Escape dismissal and focus restoration;
- verify the locale switcher preserves the equivalent route;
- verify every footer link has a real destination.

### Landing

- verify the message is understandable without scrolling;
- verify the primary CTA opens Signup anonymously and Dashboard when authenticated;
- verify the Example CTA reaches the product preview;
- verify no preview element implies unsupported interaction;
- verify all six export formats are visible;
- verify no fictional customer-adoption claim remains;
- verify responsive layout at 390 px, tablet and wide desktop;
- verify light and dark themes.

### Pricing

- verify all three plans are visible;
- verify only Free beta is actionable;
- verify Pro and Team cannot receive focus as actions;
- verify no paid checkout or waiting-list behavior is implied;
- verify FR/EN wording and content density;
- verify mobile stacking and desktop three-column layout.

### Login

- verify anonymous access in FR and EN;
- verify authenticated access redirects to the localized Dashboard;
- verify invalid credentials and field errors;
- verify registered-account success feedback;
- verify pending state prevents duplicate submission;
- verify the preview is present on desktop and absent on compact layouts;
- verify complete keyboard operation and visible focus.

### Signup

- verify Name, Email, Password and Confirm password remain present;
- verify mismatched confirmation is rejected;
- verify password minimum guidance remains 12 characters;
- verify both visibility toggles affect only their associated field;
- verify duplicate email, field errors and global error states;
- verify pending state prevents duplicate submission;
- verify successful registration preserves the existing redirect flow;
- verify the value panel is present on desktop and absent on compact layouts;
- verify complete keyboard operation and visible focus.

### Accessibility

- verify one H1 per page;
- verify landmarks are present and ordered correctly;
- verify all form fields have visible labels;
- verify field errors are linked with `aria-describedby`;
- verify status and alert feedback are announced;
- verify navigation controls expose correct names and expanded states;
- verify color contrast in light and dark themes;
- verify no essential information depends on animation.

## Automated validation status

- lint: passing;
- strict typecheck: passing;
- formatting: passing after the scoped formatter pass;
- focused tests: passing;
- full test suite: passing;
- production build: passing;
- temporary formatter workflow: removed from the final diff;
- product-owner responsive and visual QA: pending.

## Definition of done

DS-170-06 is complete when:

- the approved public brand lockup replaces every placeholder public mark;
- marketing and auth layouts render their correct navigation chrome;
- mobile public navigation is functional and accessible;
- the Landing matches the validated editorial hierarchy;
- Pricing communicates current availability without false actions;
- Login and Signup preserve their functional authentication contracts;
- Signup password confirmation remains enforced;
- Fraunces, Inter Tight and JetBrains Mono form the global typography system;
- FR/EN, light/dark and responsive QA pass;
- authenticated screens pass the typography non-regression review;
- the standard Quality workflow passes on the final branch head;
- no temporary workflow remains;
- product-owner QA is complete.
