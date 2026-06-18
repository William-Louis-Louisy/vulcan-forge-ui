# DS-160 — UX/UI mockup alignment plan

## Objective

Align VulcanForgeUI as closely as possible with the validated MVP mockups.

The goal of this phase is not to add major product features. The goal is to refactor and polish the existing UI so that the application feels coherent, premium, structured, and visually close to the mockup direction.

## Product principle

The implementation must preserve the functional work completed during DS-150.

The UI refactor must not break:

- authentication;
- localized FR/EN routes;
- project access control;
- token editing;
- theme editing;
- component contracts;
- visual token bindings;
- Visual Matrix;
- accessibility checks;
- exports;
- documentation generation;
- AI instructions generation.

## Main mockup targets

### 1. Authenticated app shell

Target structure:

- stable app topbar;
- stable app sidebar;
- workspace identity;
- dashboard/projects/archive/settings navigation;
- language switcher;
- export/action shortcuts where relevant;
- responsive layout.

Current implementation must be audited against this shell before individual pages are polished.

### 2. Project editor layout

Target structure:

- project topbar;
- breadcrumb-like project identity;
- project navigation;
- validation score area;
- main editor panel;
- preview panel;
- saved/unsaved state;
- export and preview actions;
- FR/EN controls.

This should become the shared layout foundation for project-level routes.

Affected routes:

- `/[locale]/app/design-systems/[projectSlug]`
- `/[locale]/app/design-systems/[projectSlug]/tokens`
- `/[locale]/app/design-systems/[projectSlug]/themes`
- `/[locale]/app/design-systems/[projectSlug]/components`
- `/[locale]/app/design-systems/[projectSlug]/accessibility`
- `/[locale]/app/design-systems/[projectSlug]/documentation`
- `/[locale]/app/design-systems/[projectSlug]/exports`
- `/[locale]/app/design-systems/[projectSlug]/ai-instructions`

### 3. Overview page

Target structure:

- validation score summary;
- token coverage;
- contrast status;
- component status;
- export status;
- recent exports;
- preview card;
- recommended next actions.

The page should feel like a project command center.

### 4. Tokens page

Target structure:

- token categories;
- searchable token list;
- grouped sections;
- compact token rows;
- right-side inspector;
- preview area;
- visible missing-description or validation status.

The current token functionality must be preserved.

### 5. Components page

Target structure:

- component list grouped by category;
- selected component contract;
- localized content controls;
- anatomy table;
- variants and states;
- visual token bindings;
- accessibility contract;
- Visual Matrix;
- AI Contract preview.

The DS-150 component foundations work must remain intact.

### 6. Bilingual behavior

The mockups explicitly show FR and EN versions of the same project experience.

All UI refactor work must preserve:

- localized routes;
- localized labels;
- localized errors;
- localized empty states;
- clear fallback behavior;
- no visible hardcoded English in P0 screens.

## Foundation alignment target

Before aligning individual screens, the UI refactor must align the shared visual foundations shown in the first mockup page.

### Type system

The refactor must define and reuse a coherent type hierarchy across the app:

- page eyebrow;
- page title;
- section title;
- card title;
- body text;
- muted helper text;
- metadata labels;
- table/list labels;
- button labels;
- status text.

The goal is to avoid each page inventing its own typography scale;

- table/list labels;
- button labels;
- status text.

The goal is to, font weight, letter spacing, and text density.

### Color system

The refactor must align the UI with the mockup color system and reuse semantic color roles consistently:

- app background;
- surface primary;
- surface secondary;
- subtle surface;
- border subtle;
- border strong;
- content primary;
- content secondary;
- content tertiary;
- action primary;
- action secondary;
- danger;
- warning;
- success;
- focus/ring state.

The goal is to avoid hardcoded, page-specific colors when a semantic token already exists or should exist.

### UI component foundations

The refactor must identify and standardize reusable UI primitives before rebuilding page-specific layouts:

- app shell;
- sidebar item;
- topbar;
- page header;
- project header;
- card;
- panel;
- inspector panel;
- toolbar;
- tabs;
- badge;
- button;
- form field;
- textarea;
- select;
- empty state;
- warning/notice;
- data row;
- preview block.

This is different from the product-level “Component Foundations” work completed in DS-150.  
Here, “component foundations” refers to the UI primitives used to build the application interface itself.

### Implementation rule

Each DS-160 implementation ticket must check whether the visual pattern already belongs to a shared UI primitive before adding page-specific markup.

The goal is to align the product to the mockup by building a consistent visual system, not by duplicating one-off layouts.

## Proposed implementation sequence

### DS-160-01 — Align UI foundations: type, color and primitives

First step:

Extract the visible foundation values from the first mockup page before implementation:

- typography scale;
- font weights;
- text hierarchy;
- semantic color roles;
- panel/card backgrounds;
- border colors;
- radius values;
- spacing density;
- button, badge, tab and form-field visual rules.

The extracted values must be documented in the DS-160-01 ticket notes before changing shared UI primitives.

Goal:

Align the shared UI foundations with the first mockup page before refactoring full screens.

Scope:

- typography hierarchy;
- semantic color usage;
- base cards/panels;
- buttons;
- badges;
- tabs;
- form fields;
- empty states;
- notices;
- layout density rules.

Non-goals:

- no page-level redesign yet;
- no product feature changes.

### DS-160-02 — Align AppShell / AppTopbar / AppSidebar

Goal:

Create the shared application frame used across authenticated screens.

Scope:

- app topbar;
- workspace identity;
- sidebar navigation;
- account area;
- language switcher;
- responsive behavior;
- active navigation states.

### DS-160-03 — Align Project Editor layout

Goal:

Create or refactor the shared project editor frame.

Scope:

- project topbar;
- project navigation;
- validation score summary;
- saved state area;
- main content + preview layout;
- responsive stacking.

Non-goals:

- no deep redesign of individual feature pages yet.

### DS-160-04 — Align Overview page

Goal:

Make the project overview match the command-center structure of the mockup.

Scope:

- validation score card;
- token/theme/component/accessibility/export summaries;
- recent exports;
- preview panel;
- recommended actions.

### DS-160-05 — Align Tokens page

Goal:

Make the Tokens page visually match the mockup while preserving editing behavior.

Scope:

- token list layout;
- tabs;
- grouped rows;
- inspector panel;
- preview panel;
- empty and invalid states;
- responsive behavior.

### DS-160-06 — Align Components page

Goal:

Make the Components page match the mockup while preserving DS-150 foundations.

Scope:

- grouped component list;
- contract editor layout;
- visual token bindings section;
- Visual Matrix;
- AI Contract preview;
- incomplete data warnings;
- responsive behavior.

### DS-160-07 — Align Accessibility / Documentation / Exports / AI pages

Goal:

Bring secondary project pages into the same visual system.

Scope:

- consistent page headers;
- consistent panels;
- consistent empty/loading/error states;
- localized labels;
- responsive behavior.

### DS-160-08 — Final responsive, i18n and visual QA

Goal:

Close the UI refactor phase with a full pass.

Scope:

- desktop/tablet/mobile review;
- FR/EN review;
- keyboard navigation smoke test;
- empty states;
- visual consistency;
- final quality checks.

## Shared UI rules

### Layout

- Prefer stable layout primitives over page-specific wrappers.
- Keep project pages visually consistent.
- Avoid one-off spacing and borders when a shared component is appropriate.

### Visual style

- Premium SaaS feel.
- Clean hierarchy.
- Dense but readable.
- Dark UI compatible.
- Strong cards and panels.
- Clear selected states.
- Avoid noisy decoration.

### Responsive behavior

- Desktop: sidebar + main editor + preview can coexist.
- Tablet: preview can stack or become secondary.
- Mobile: navigation and panels must remain usable without horizontal overflow.

### i18n

- Every visible label must be localized.
- FR and EN must be updated together.
- No new hardcoded visible English in project screens.

### Testing

Each implementation ticket should run at least:

- `npm run typecheck`
- `npm run lint`
- relevant targeted tests
- `npm run build` before merge

For larger UI refactor tickets, run:

- `npm run quality`

## Risks

### Risk 1 — Refactor too broad

Mitigation:

Each ticket must target one layer or one page group only.

### Risk 2 — Breaking DS-150 logic

Mitigation:

Do not rewrite business logic unless required. Keep token, theme, component, export and AI instruction data flows intact.

### Risk 3 — Overfitting to static mockups

Mitigation:

Match structure, hierarchy, spacing, density and interactions as closely as possible, while preserving real data and responsive constraints.

### Risk 4 — Losing bilingual quality

Mitigation:

Every ticket must include FR/EN review.

## Definition of done for DS-160

DS-160 is complete when:

- authenticated shell visually matches the mockup direction;
- project editor layout is consistent across project routes;
- overview, tokens, themes, components, accessibility, documentation, exports and AI pages share the same visual system;
- Components page keeps DS-150 functionality while matching the mockup layout;
- FR/EN labels are complete;
- desktop/tablet/mobile layouts are usable;
- `npm run quality` passes.
