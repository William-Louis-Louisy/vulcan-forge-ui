# DS-170-06 — Public surfaces audit

## Objective

Align the public-facing VulcanForge UI surfaces with the validated editorial mockups while preserving honest product behavior, accessible navigation, localized content and the existing authentication contract.

## Validated product decisions

- use the approved VulcanForge symbol and wordmark treatment;
- use only the color system defined on page 2 of `VulcanForge UI — MVP mockups`;
- use Fraunces for editorial display typography;
- replace Geist globally with Inter Tight for interface typography;
- replace Geist Mono globally with JetBrains Mono for technical values;
- preserve Signup password confirmation and mismatch validation;
- preserve the 12-character minimum password rule;
- use one coherent public navbar on Landing, Pricing, Login and Signup;
- show only the brand lockup and burger trigger in the compact navbar;
- keep locale and authentication actions inside the compact menu;
- do not add Terms, Remember me or Forgot password controls without implemented behavior;
- do not show public links whose routes do not exist;
- do not show a waiting-list action without a real waiting-list workflow;
- redirect authenticated users away from Login and Signup;
- send authenticated public CTAs to the Dashboard;
- preserve FR/EN route switching and light/dark preferences;
- do not present bilingual support as a marketing differentiator.

## Route architecture

The public route group remains separated into marketing and authentication layouts without changing URLs:

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

Both layouts now use the same public navbar. The auth layout additionally redirects authenticated sessions to the localized Dashboard. The marketing layout renders the shared footer.

## Approved color system

The former OKLCH ink, paper, gold, red and green primitives are removed.

The global palette now contains only the approved mockup colors:

- white;
- Stone 50–900;
- Clay 50, 100, 300, 500, 600 and 700;
- Ink 500 for informational status;
- Moss 500 for success;
- Amber 500 for warning;
- Rust 500 for danger.

Semantic behavior is mapped as follows:

- primary action: Stone 900 on light surfaces and Stone 50 on dark surfaces;
- accent action: Clay 500 on light surfaces and Clay 300 on dark surfaces;
- focus border: Clay;
- status colors: the four approved status primitives;
- fixed inverse surfaces: Stone 900 with Stone 50 content.

The fixed inverse-surface contract prevents dark editorial sections from inheriting theme-dependent `content-inverse` values and becoming unreadable.

## Global typography migration

The locale root layout loads:

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
- the Clay accent on `Forge`;
- default and inverse-ready behavior;
- compact and standard sizes.

Repeated SVG instances use isolated clip-path identifiers.

## Public navigation

### Desktop

Every public route exposes the same functional navigation:

- Product;
- Pricing;
- Example;
- locale switcher;
- Sign in or Dashboard;
- Start for free for anonymous visitors.

### Mobile

The visible compact navbar contains only:

- the brand lockup;
- a real burger-menu button.

The menu:

- reports expanded state and controls relationship;
- closes on outside pointer interaction;
- closes on Escape;
- restores focus to its trigger after Escape;
- exposes Product, Example and Pricing;
- includes the full-width locale switcher;
- exposes Sign in and Start for free for anonymous visitors;
- exposes one Dashboard action for authenticated visitors.

No locale control or authentication CTA remains visible outside the burger menu on compact layouts.

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

The Landing surface follows the validated editorial hierarchy:

1. asymmetric hero with a Fraunces display title;
2. real CTA links with session-aware destinations;
3. a product preview based on the current Tokens workspace;
4. three explicit product problems;
5. four model capabilities;
6. a fixed inverse six-format export section;
7. honest target-audience guidance;
8. final CTA;
9. shared footer.

The previous gradient halo, repeated generic SaaS cards, duplicated pricing block, placeholder `VF` feature marks and non-functional preview button are removed.

The previous fictional customer-logo proof is not reproduced. Audience positioning is presented as `Built for` rather than an unsupported adoption claim.

Copy such as “English and French from day one” and “French and English content” is removed from marketing and pricing surfaces. Localization remains a product capability rather than a boast.

## Product-editor preview

Landing and Login share one localized `ProductEditorPreview` component.

The preview now mirrors the current application more closely:

- application topbar with workspace and project breadcrumb;
- saved state, validation score, Preview, Export and locale controls;
- project navigation with the Tokens route selected;
- Tokens workspace title, summary, filter and New token control;
- color, spacing, radius and typography tabs;
- primitive and semantic token rows;
- token preview and inspector rail;
- established Stone, Clay and status swatches.

The preview is static and uses no false interactive controls.

The final wrapping correction keeps compact labels, actions, breadcrumbs, token names, values and navigation items on one line with controlled truncation. Only the inspector description is intentionally allowed to wrap.

## Pricing

The Pricing page exposes three transparent product directions:

- Free beta — available now;
- Pro — coming later;
- Team — coming later.

Only Free beta has an actionable CTA. Pro and Team display non-interactive availability copy. No amount, subscription state or waiting-list behavior is invented.

The FAQ clarifies:

- what is currently free;
- which six formats can currently be exported;
- that Pro and Team cannot currently be purchased or joined.

## Authentication

### Shared navigation

Login and Signup use the same navbar as the other public routes. Authenticated sessions are still redirected to the localized Dashboard before either page is rendered.

### Login

Login retains:

- visible Email and Password labels;
- localized field and global errors;
- pending submit state;
- account-creation link;
- the registered-account success message.

The right desktop panel uses the current-product Tokens preview. It is removed from the visual flow below the desktop breakpoint.

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

The right desktop panel uses a fixed inverse product-value surface and remains readable in both appearance modes. It is hidden on compact layouts.

The forms use the established Tokens-inspector field contract:

- subtle semantic border;
- primary surface;
- compact padding;
- medium radius;
- Clay focus border;
- visible global focus outline.

## New design-system wizard

The project-creation wizard is visually aligned with the authenticated product:

- the duplicated elevated outer card is removed;
- the page width matches the content needs of the five-step workflow;
- the stepper uses integrated separators and an accent indicator instead of five isolated cards;
- the active, completed, unavailable and hover states use semantic tokens;
- text inputs, textarea and select use the Tokens-inspector field contract;
- platform, locale, visual-direction and accessibility choices use compact bordered rows with a Clay selected state;
- native radio and checkbox accents use the approved Clay token;
- review items use compact medium-radius surfaces rather than oversized cards.

No wizard behavior or validation contract changes in this correction.

## Internationalization

Public-surface copy remains isolated in `public-surface-messages.ts`.

The richer Tokens preview uses its own `product-editor-preview-messages.ts` namespace. Both are merged into the existing next-intl request and type contracts.

Automated coverage verifies:

- English and French public-message shape parity;
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

### Approved palette and appearances

- verify no gold action or focus color remains;
- verify primary actions use Stone and accent actions use Clay;
- verify status messages use only Ink, Moss, Amber and Rust;
- verify the exports section remains readable in light and dark appearances;
- verify Login and Signup side panels remain readable in light and dark appearances;
- verify no public section inherits black text on a dark surface.

### Global typography

- verify Fraunces display typography on Landing, Pricing, Login and Signup;
- verify Inter Tight throughout public and authenticated interfaces;
- verify JetBrains Mono on token values, slugs and generated source previews;
- verify Dashboard, Settings, Overview, Brand, Tokens, Themes, Components, Accessibility, Documentation, Exports and AI Instructions have no new truncation or overflow;
- verify button, input, segmented-control and topbar heights remain aligned.

### Header and footer

- verify the same navbar appears on Landing, Pricing, Login and Signup;
- verify the approved symbol and wordmark on every public route;
- verify the placeholder `VF` mark is absent;
- verify desktop Product, Pricing and Example navigation;
- verify anonymous Sign in and Start for free actions;
- verify authenticated Dashboard behavior and absence of a duplicate CTA;
- at 390 px, verify only the lockup and burger trigger remain visible;
- verify locale, Sign in and Start for free are present inside the burger menu;
- verify mobile menu outside-click dismissal;
- verify Escape dismissal and focus restoration;
- verify the locale switcher preserves the equivalent route;
- verify every footer link has a real destination.

### Landing

- verify the message is understandable without scrolling;
- verify the primary CTA opens Signup anonymously and Dashboard when authenticated;
- verify the Example CTA reaches the Tokens workspace preview;
- verify the preview resembles the current Tokens page structure;
- verify preview labels and actions do not wrap unexpectedly;
- verify no preview element implies unsupported interaction;
- verify all six export formats are visible;
- verify no fictional customer-adoption claim remains;
- verify no bilingual-support marketing boast remains;
- verify responsive layout at 390 px, tablet and wide desktop;
- verify light and dark appearances.

### New design-system wizard

- verify the stepper reads as one integrated workflow;
- verify active and completed states are distinguishable;
- verify future steps remain unavailable;
- verify all form controls match the Tokens inspector reference;
- verify selected option rows use Clay without gold;
- verify every step and the review screen in light and dark appearances;
- verify no project-creation behavior or validation has regressed.

### Pricing

- verify all three plans are visible;
- verify only Free beta is actionable;
- verify Pro and Team cannot receive focus as actions;
- verify no paid checkout or waiting-list behavior is implied;
- verify no plan advertises the presence of two interface languages;
- verify FR/EN wording and content density;
- verify mobile stacking and desktop three-column layout.

### Login and Signup

- verify anonymous access in FR and EN;
- verify the full public navbar on both routes;
- verify authenticated access redirects to the localized Dashboard;
- verify Login invalid credentials, field errors, registered feedback and pending state;
- verify Signup Name, Email, Password and Confirm password remain present;
- verify mismatched confirmation is rejected;
- verify password minimum guidance remains 12 characters;
- verify both visibility toggles affect only their associated field;
- verify duplicate email, field errors, global errors and pending state;
- verify successful registration preserves the existing redirect flow;
- verify desktop side panels are absent on compact layouts;
- verify complete keyboard operation and visible focus.

### Accessibility

- verify one H1 per page;
- verify landmarks are present and ordered correctly;
- verify all form fields have visible labels;
- verify field errors are linked with `aria-describedby`;
- verify status and alert feedback are announced;
- verify navigation controls expose correct names and expanded states;
- verify color contrast in light and dark appearances;
- verify no essential information depends on animation.

## Product-owner QA result

Product-owner QA is complete and approved for DS-170-06, including:

- the page-2 MVP palette and removal of legacy Gold usage;
- public Landing, Pricing, Login and Signup surfaces;
- unified public navigation and compact burger behavior;
- light and dark appearances;
- FR/EN content and route behavior;
- the current-product Tokens preview and its final wrapping correction;
- the new design-system wizard alignment;
- Signup confirmation and authentication flows;
- responsive, keyboard and accessibility smoke checks;
- authenticated typography non-regression review.

## Automated validation status

- lint: passing;
- strict typecheck: passing;
- formatting: passing;
- focused tests: passing;
- full test suite: passing;
- production build: passing;
- standard Quality workflow: passing on final implementation head, run #643;
- temporary formatter, font-migration, QA-correction and preview-formatter workflows: absent from the final diff;
- product-owner corrected-layout QA: approved.

## Definition of done

DS-170-06 is complete when:

- the approved public brand lockup replaces every placeholder public mark;
- only approved page-2 mockup colors remain in the global palette;
- all public routes use the same navbar;
- compact navigation exposes only the lockup and burger outside the menu;
- mobile public navigation is functional and accessible;
- the Landing matches the validated editorial hierarchy;
- the product example resembles the current Tokens workspace;
- Pricing communicates current availability without false actions or bilingual boasting;
- Login and Signup preserve their functional authentication contracts;
- Signup password confirmation remains enforced;
- the New design-system wizard matches the authenticated UI foundations;
- Fraunces, Inter Tight and JetBrains Mono form the global typography system;
- FR/EN, light/dark and responsive QA pass;
- authenticated screens pass the typography non-regression review;
- the standard Quality workflow passes on the final branch head;
- no temporary workflow remains;
- product-owner QA is complete.

All DS-170-06 definition-of-done criteria are satisfied.