# DS-170-05 — Brand profile audit

## Objective

Implement the Brand workspace as the canonical product-identity source for a design-system project, with localized content, deterministic editorial guidance and direct integration into Documentation, Exports and AI Instructions.

## Product boundary

The Brand workspace:

- persists structured product and editorial guidance;
- supports English and French through the project locale contract;
- exposes missing translations without blocking a valid fallback-based save;
- provides a deterministic local preview;
- does not call an AI service;
- does not regenerate the project slug after a product-name change;
- does not change public marketing surfaces;
- does not introduce historical audit-log persistence.

## Canonical identity decisions

- `DesignSystemProject.name` remains the canonical language-neutral product name.
- `DesignSystemProject.slug` remains stable and read-only in Brand.
- `DesignSystemProject.description` mirrors the Brand short description resolved in the project default locale, with fallback when required.
- visual direction is owned by `BrandProfile`; the duplicated project-level field is removed.
- the former `enterprise` direction is migrated to the validated `technical` style.
- new and migrated profiles use `cozy` as the default UI density.

## Domain model

The validated Brand profile contains:

### Global guidance

- visual style: `minimal`, `premium`, `editorial`, `technical`, `playful`, `bold`, `neutral` or `custom`;
- UI density: `compact`, `cozy` or `comfortable`;
- optional inspiration keywords.

### Localized content

- tagline;
- short description;
- personality;
- audience;
- tone of voice.

Each localized value may contain English, French or both. At least one non-empty locale is required whenever the value exists.

### Structured editorial guidance

Terminology entries contain:

- one preferred localized term;
- zero or more localized terms to avoid.

Editorial rules are stored as localized list items. This structure allows Documentation and AI Instructions to render explicit guidance without attempting to infer rules from prose.

## Persistence and migration

The Prisma migration:

- introduces `BrandVisualStyle` and `BrandUiDensity` enums;
- adds visual style, UI density, inspiration keywords and localized JSON content to `BrandProfile`;
- migrates the previous Brand description into `shortDescription` using each project’s default locale;
- maps the legacy `enterprise` direction to `technical`;
- removes duplicated Brand name, description and visual-direction columns;
- removes the duplicated project visual-direction column.

The creation foundation now creates the structured Brand profile directly. The onboarding visual-direction step exposes the same eight validated styles as the Brand workspace; the legacy `enterprise` value is retained only in migration normalization and is rejected for new project payloads.

## Brand workspace

The route is:

```text
/[locale]/app/projects/[projectSlug]/brand
```

The workspace includes:

- a canonical product-name field;
- a read-only slug;
- localized tagline, short description, personality, audience and tone-of-voice fields;
- an FR/EN editing control restricted to project-supported locales;
- visual-style and density controls;
- inspiration keywords;
- structured terminology and editorial guidance;
- missing-translation status;
- deterministic tone and AI-guidance previews;
- saved, unsaved, saving, invalid and error states.

Brand is enabled in persistent desktop navigation and in the compact application menu.

## Authorization and save behavior

The save action:

- requires an authenticated user;
- resolves the project through workspace membership;
- validates product identity and the complete Brand payload with Zod;
- updates project identity and Brand profile atomically;
- keeps the existing slug unchanged;
- synchronizes the project summary from the default-locale short description;
- revalidates localized Dashboard, Overview, Brand, Documentation, AI Instructions and Exports routes.

Missing translations do not invalidate an otherwise valid profile. The UI reports the missing values and generated outputs record fallback usage.

## Documentation integration

The Markdown generator now includes Brand guidance in the Overview section:

- visual style and UI density;
- inspiration keywords;
- localized tagline, description, personality, audience and tone;
- preferred and avoided terminology;
- editorial rules.

Brand fallback usage participates in the existing missing-translation diagnostics.

## AI Instructions integration

AI Instructions now always include a Brand and voice section when Brand data exists. It contains:

- personality and target audience;
- tone-of-voice guidance;
- visual style and density signals;
- inspiration keywords;
- preferred and prohibited equivalent terms;
- deterministic editorial rules.

These rules complement the existing token, component, accessibility and anti-hallucination guidance. No AI-generated interpretation is introduced.

## Exports integration

The Export Center loads the same Brand profile and forwards it to Documentation and AI Instructions generation. Export formats unrelated to editorial content preserve their previous behavior.

## Overview integration

Brand `updatedAt` participates in the project content timestamp. Consequently:

- a Brand change makes older successful exports stale;
- the change appears in recent project activity;
- the Overview’s existing export recommendation logic can surface regeneration as a next action.

No new activity table is introduced.

## Internationalization

All Brand workspace copy is scoped under `BrandProfilePage` and available in English and French.

The interface locale controls application copy. The Brand content locale controls the edited and previewed product content. These concerns remain independent.

## Responsive behavior

### Wide desktop

- the form is the primary scrollable workspace;
- the deterministic preview is presented in an independent right rail;
- save status and locale controls remain available in the workspace header.

### Tablet and mobile

- the form remains first in document order;
- the preview follows the editor rather than being compressed into a narrow rail;
- style and density choices reflow into smaller grids;
- translation warnings and save feedback remain visible;
- no horizontal overflow is expected.

## Automated coverage

Focused tests cover:

- complete and malformed Brand-profile validation;
- visual-style and density constraints;
- acceptance of all eight validated styles during onboarding;
- rejection of the legacy `enterprise` value in new project payloads;
- project-creation seeding and `enterprise` migration semantics;
- localized fallback resolution;
- missing-translation counting across fields, terminology and editorial rules;
- Brand-aware Documentation generation;
- Brand-aware AI Instructions generation;
- Brand fallback diagnostics in both generators;
- Brand update activity and stale-export detection in Overview.

The standard Quality workflow validates the final branch head through:

- lint;
- strict TypeScript typecheck;
- formatting;
- tests;
- production build.

Temporary diagnostic and auto-format workflow changes are absent from the final diff.

## Manual QA checklist

### Migration and project creation

- apply the migration to a database containing an existing project;
- verify the previous description is available in the project default locale;
- verify `enterprise` becomes `technical`;
- verify the previous project slug is unchanged;
- create a new project with each representative visual style;
- verify the onboarding options and resulting Brand style match;
- verify a new project’s Brand profile opens without repair steps.

### Identity and persistence

- edit the product name and verify the slug remains unchanged;
- save and reload the route;
- verify Dashboard and Overview display the updated product name and summary;
- verify invalid or empty product names cannot be saved;
- verify membership isolation prevents access to another workspace’s project.

### Localized content

- edit every field in English and French;
- leave one locale incomplete and verify the missing counter;
- save successfully with fallback content;
- switch content locale and verify independent values;
- verify an existing translation is preserved when another locale is cleared.

### Structured guidance

- add and remove terminology entries;
- enter multiple preferred and avoided terms by typing comma-separated values;
- verify commas remain editable while composing the list;
- enter multiple editorial rules on separate lines;
- verify new lines remain editable while composing the list;
- add and remove editorial rules;
- verify malformed empty structured items prevent saving until completed or removed;
- verify inspiration keywords respect the configured limit.

### Preview

- verify product name, tagline and description update from the current draft;
- verify tone, editorial and terminology rules update the AI preview;
- verify the fallback notice appears only when the selected locale uses fallback content;
- verify the preview does not require a network or AI request.

### Generated outputs

- open Documentation and verify the Brand section in FR and EN;
- verify missing Brand translations appear in generation diagnostics;
- open AI Instructions and verify personality, audience, tone, terminology and editorial rules;
- generate Brand-aware Documentation and AI exports from Export Center;
- edit Brand and verify older exports become stale in Overview.

### Navigation and route states

- verify Brand is enabled in desktop project navigation;
- verify Brand is enabled in the compact menu;
- verify project switching from Brand opens Brand in the target project;
- verify localized loading and recoverable error states;
- verify the topbar save status reflects saved, unsaved, saving and error states.

### Responsive and appearance

- review desktop with the independent preview rail;
- review tablet and mobile stacking;
- verify long bilingual content remains contained;
- verify no horizontal overflow;
- verify light and dark application appearances;
- verify warning, success, error and selected states remain distinguishable.

### Keyboard and accessibility smoke test

- reach every input, locale option, style, density and action by keyboard;
- activate style and density choices with Enter or Space;
- verify visible focus throughout the workspace;
- verify field labels and locale context are announced;
- verify status and error feedback use live semantic regions;
- verify read-only slug semantics;
- verify source order remains editor then preview on compact layouts.

## Validation status

- implementation: complete;
- focused automated tests: implemented and passing;
- standard Quality workflow: passing on the final implementation and documentation branch state;
- temporary diagnostic workflow changes: removed;
- migration review: pending product-owner local database verification;
- responsive FR/EN manual QA: pending;
- keyboard and light/dark review: pending.

## Definition of done

DS-170-05 is complete when:

- the migration succeeds against representative existing data;
- new and existing projects expose a valid Brand profile;
- Brand navigation is enabled on desktop and compact layouts;
- localized editing, fallback warnings and persistence work in FR and EN;
- the slug remains stable after product-name changes;
- Documentation, Exports and AI Instructions consume Brand data;
- Brand changes invalidate older exports and appear in Overview activity;
- loading, error, invalid, unsaved, saving and saved states pass;
- desktop, tablet and mobile layouts pass;
- keyboard and light/dark smoke tests pass;
- the standard Quality workflow passes on the final branch head;
- no temporary diagnostic workflow or artifact-producing step remains in the final diff;
- product-owner manual QA is complete.
