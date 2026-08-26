# DS-180-04 — Themes chapter

## Status

Implementation slice for Chapter 03 of the accepted Learn curriculum.

This iteration publishes only the Themes chapter. It does not evolve the Theme persistence model, add new Theme modes, create Sepia authoring, redesign the authenticated Themes workspace or change generated export formats.

## Learning objective

By the end of the chapter, a learner should be able to explain:

1. why a token value that works in one appearance can fail in another;
2. what a Theme contributes on top of token identity;
3. the difference between a stable interface role and the token reference mapped to that role;
4. why a component should consume shared intent rather than hard-code Light/Dark presentation decisions;
5. why theming is conceptually broader than Light and Dark;
6. why each appearance still needs accessibility review;
7. which parts of this model VulcanForgeUI currently implements and which it deliberately does not.

## Pedagogical sequence

The chapter follows this progression:

```text
shared token decisions from Chapter 02
        ↓
one fixed value used in two appearances
        ↓
value becomes inappropriate in one context
        ↓
stable Theme role
        ↓
Light mapping / Dark mapping
        ↓
role → token reference → resolved value
        ↓
component consumes the role
        ↓
contrast/accessibility review per appearance
        ↓
general theming concept
        ↓
current VulcanForgeUI Light/Dark boundary
        ↓
misconception + checkpoint
        ↓
Components
```

The learner sees the contextual problem before receiving the Theme abstraction.

## Product facts audited for this chapter

### Theme identity

The current domain schema defines:

```text
ThemeMode = light | dark
```

A Theme seed contains:

- `mode`;
- `name`;
- `tokens`.

Persistence currently enforces one Theme per `(projectId, mode)`, so a project can have at most one Light and one Dark Theme.

This is the most important product boundary for the chapter: the educational definition of theming can be broader than Light/Dark without implying that the current product can author arbitrary appearances.

### Theme color roles

Current protected core color roles are:

```text
background
surface
content
muted
accent
```

Current protected status color roles are:

```text
info
success
warning
danger
```

Projects can add custom color roles, but those roles live inside an existing Light or Dark Theme. A custom role does not create another Theme identity.

### Role mappings

Theme color role values can be token references. The current resolver accepts references to resolved color tokens and exposes the final hex value for preview and contrast calculations.

The current seed illustrates the intended relationship clearly.

Light:

```text
background → {color.primitive.neutral.50}      → #F7F3EB
surface    → {color.primitive.neutral.0}       → #ffffff
content    → {color.primitive.neutral.950}     → #070707
muted      → {color.primitive.neutral.700}     → #3A4454
accent     → {color.primitive.accent.secondary} → #586644
```

Dark:

```text
background → {color.primitive.neutral.950}    → #070707
surface    → {color.primitive.neutral.900}    → #1E1E1E
content    → {color.primitive.neutral.100}    → #E2E7EF
muted      → {color.primitive.neutral.400}    → #A0B1CA
accent     → {color.primitive.accent.primary} → #FF8731
```

Status roles similarly use Light/Dark-specific semantic status tokens in the current seed.

## Relationship with Chapter 02

Chapter 02 established token identity and references.

Chapter 03 deliberately adds another responsibility rather than redefining tokens:

```text
Token layer
“What design decision exists?”

Theme layer
“Which token should fulfill this appearance role now?”
```

The Theme layer therefore should not be taught as a replacement for semantic tokens.

The current product also does not require every Theme role to point only to `color.semantic.*`; Theme role options are built from resolved color tokens generally. The chapter avoids claiming otherwise.

## Recurring Demo project

The Demo project now demonstrates a stable vocabulary across appearances.

A simple example is the `content` role:

```text
content
  ├─ Light → {color.primitive.neutral.950} → #070707
  └─ Dark  → {color.primitive.neutral.100} → #E2E7EF
```

The interface can continue asking for `content`; the active Theme supplies the appropriate mapping.

The `accent` role demonstrates that appearance changes need not be simple inversion:

```text
accent
  ├─ Light → #586644
  └─ Dark  → #FF8731
```

This keeps the example visually obvious while remaining grounded in the actual VulcanForgeUI seed.

## Accessibility boundary

The current Theme domain computes contrast pairs from resolved role mappings.

The chapter therefore teaches:

- theme changes create new foreground/background relationships;
- each supported appearance needs evaluation;
- Light and Dark are not automatically accessible by virtue of being Light or Dark;
- automated contrast checks are useful but do not certify the whole interface.

The detailed accessibility model remains intentionally deferred to Chapter 05.

## Broader theming concept

External terminology was checked against current Atlassian Design System guidance during this iteration.

That guidance defines a theme as a collection of token values used to produce a particular look/style and explicitly gives Light, Dark and high-contrast as theming examples while also acknowledging non-color theming possibilities.

This supports a deliberately broader educational statement:

**Theme is not synonymous with Dark mode.**

Potential Design System themes can include, depending on the product:

- Light;
- Dark;
- high contrast;
- Sepia;
- density preferences;
- reduced-motion variants;
- typography variants.

This is conceptual context only.

## Current VulcanForgeUI boundary

The chapter must state unambiguously:

```text
Current product
  ✓ Light Theme
  ✓ Dark Theme
  ✓ color-role mappings
  ✓ built-in core/status roles
  ✓ custom color roles inside existing Themes
  ✓ preview of resolved Theme values
  ✓ contrast matrix per Theme
  ✓ Theme data consumed by generated outputs

Not current product
  ✗ arbitrary named Theme creation
  ✗ Sepia mode
  ✗ high-contrast Theme mode
  ✗ Theme inheritance/composition
  ✗ unlimited Theme families
```

This preserves the product decision already recorded in the roadmap: the requirement is to avoid assuming that visual appearance can only ever be Light/Dark, while postponing the persistence and UX model until DS-182.

## Downstream consumers audited

Theme data currently participates in several downstream surfaces:

- authenticated Themes preview;
- Theme contrast calculations;
- project source data;
- generated CSS-variable output;
- TypeScript Theme export;
- React Native Theme export;
- generated documentation / other structured consumers through project source data.

The Learn chapter explains the existence of this dependency chain without turning into export documentation.

## Chapter UI

The chapter adds:

- a deliberately obvious fixed-value failure across Light and Dark surfaces;
- a stable-role → Light mapping / Dark mapping diagram;
- a five-role comparison table using the real seed mappings;
- a component → Theme role → resolved mapping flow;
- a focused accessibility section;
- a “Theme ≠ Dark mode” conceptual callout;
- a current-product capability/boundary section;
- a four-step Demo project continuity block;
- a misconception callout;
- a learning checkpoint;
- the existing compact curriculum navigation with Chapter 03 current.

All mapping diagrams include text labels and values so they do not rely on color alone.

## Curriculum publication state

After DS-180-04:

```text
01 Design Systems              published
02 Design Tokens               published
03 Themes                      published
04 Components                  next
05 Accessibility               planned
06 Documentation & Delivery    planned
07 AI-ready Design Systems     planned
```

Chapter 04 remains non-interactive until it is actually implemented.

## Localization

The complete chapter is available in English and French.

Technical role names, token paths, Theme mode identifiers and raw values remain intentionally untranslated where they represent actual product-domain identifiers.

EN/FR structural parity is covered by focused tests.

## Non-goals

DS-180-04 does not:

- alter `ThemeMode`;
- create a third Theme mode;
- add Sepia authoring;
- change Prisma schema or migrations;
- change Theme mutation behavior;
- redesign the authenticated Themes workspace;
- change contrast algorithms;
- change token semantics;
- change generated exports;
- claim that all Design Systems must use the same Theme architecture;
- implement the Components Learn route.

## Automated validation

The branch must pass the complete repository Quality workflow:

- Prisma generation;
- migrations;
- authentication integration tests;
- lint;
- strict typecheck;
- formatting;
- UI audit;
- Vitest;
- production build.

Focused coverage additionally verifies:

- the accepted seven-chapter order;
- Chapters 01–03 are published;
- Components is the only `next` chapter;
- no fake Components href exists;
- EN/FR Theme chapter structures match;
- the lesson contains real Light/Dark mappings;
- the arbitrary-Theme/Sepia boundary remains explicit.

## Manual QA

Review:

```text
/en/learn
/fr/learn
/en/learn/themes
/fr/learn/themes
```

Validate:

1. Chapter 03 is clickable from the Learn hub and marked current on its page.
2. Chapter 04 is labelled Up next / Prochainement but remains non-interactive.
3. The opening fixed-value problem is immediately understandable without DevTools.
4. The same `content` role clearly resolves differently between Light and Dark.
5. The five real seed mappings remain legible on desktop and mobile.
6. Long token references do not create horizontal overflow.
7. The component → role → mapping flow reads in the correct order on narrow and wide screens.
8. The accessibility section does not imply certification.
9. “Theme ≠ Dark mode” is clear without implying unsupported product functionality.
10. The current Light/Dark-only product boundary is explicit.
11. Custom color roles are not confused with custom Theme creation.
12. Locale switching preserves `/learn/themes`.
13. Keyboard focus and curriculum navigation remain usable.

## Handoff to DS-180-05

Once DS-180-04 is merged and manually qualified, the next small iteration is:

**DS-180-05 — Chapter 04: Components**

That chapter should explain:

- component contract vs rendered instance;
- anatomy;
- variants;
- sizes;
- states;
- localized content guidance;
- accessibility guidance;
- token bindings;
- why structured component semantics matter for documentation and AI.

It must also act as a product-research input for DS-181 Components Workspace V2: concepts that are difficult to explain clearly should be recorded as evidence about where the current authoring UX may need a stronger visual model.
