# DS-180-07 — Documentation & Delivery chapter

## Status

- **Phase:** DS-180 — Learn & Product Education.
- **Curriculum chapter:** 06 — Documentation & Delivery.
- **Route:** `/learn/documentation-and-delivery`.
- **Languages:** EN / FR.
- **Implementation type:** public educational content only.
- **Product behavior changes:** none.

## Purpose

Teach the practical payoff of structured Design System data: one canonical project can generate human-readable documentation and several code-oriented representations without requiring teams to maintain the same decision independently in every format.

The chapter must preserve the accepted Learn boundary:

```text
concept
  ↓
problem it solves
  ↓
concrete example
  ↓
relationship to the wider system
  ↓
current VulcanForgeUI representation
  ↓
what the learner can now explain
```

This is not an operational tutorial for the Export Center.

## Iteration-numbering note

The initial `ds-180-product-completion-roadmap.md` grouped documentation, exports and AI-ready systems under DS-180-07.

The later accepted curriculum in `ds-180-00-learning-architecture-curriculum.md` deliberately split that material into two coherent chapters:

1. Chapter 06 — Documentation & Delivery;
2. Chapter 07 — AI-ready Design Systems.

The implementation sequence has shipped one focused Learn chapter per PR. DS-180-07 therefore implements Chapter 06 only. AI Instructions remain deferred to the final curriculum chapter so AI is taught as a consumer of good Design System structure rather than the reason to create that structure.

## Product audit

### Export Center formats

The current `exportCenterFormats` registry contains six entries:

```text
cssVariables
tailwindV4
typescriptTheme
reactNativeTheme
documentationMarkdown
aiInstructions
```

Chapter 06 teaches the first five. `aiInstructions` remains visible as current product truth but is not taught until Chapter 07.

### CSS variables

`generateCssVariablesExport()`:

- resolves design tokens before export;
- converts token paths to CSS custom-property names;
- emits resolved token values;
- can emit Theme variables for current Light/Dark Themes;
- resolves Theme token references before output;
- skips unresolved token references;
- excludes deprecated tokens by default;
- can include deprecated tokens explicitly;
- reports Theme-resolution issues.

Canonical teaching example:

```css
--color-semantic-action-primary: #ff8731;
```

The exact project-generated file name depends on the project name.

### Tailwind v4

`generateTailwindV4Export()` builds on the CSS-variable output and adds a Tailwind v4 `@theme` representation.

Important boundary: this is generated CSS for Tailwind v4. It is not a Tailwind configuration file and does not imply Tailwind adoption in the consuming application.

### TypeScript Theme

`generateTypeScriptThemeExport()` emits resolved nested token and Theme objects and exports TypeScript values/types for web or shared-package consumption.

Token paths are represented as nested object structure rather than literal dotted keys.

### React Native Theme

`generateReactNativeThemeExport()` similarly emits resolved nested token/Theme data for native consumption and includes helpers for the current Light/Dark Theme model.

The presence of React Native output does not mean VulcanForgeUI modifies an Expo/React Native application automatically.

### Markdown Documentation

The current documentation format is Markdown.

The current configurable documentation sections are:

```text
overview
tokens
themes
components
accessibility
```

The Documentation profile also selects a locale. When localized content is missing and a fallback locale is used, the generator records missing-translation diagnostics rather than silently presenting fallback content as complete translation coverage.

### Export Center delivery behavior

The current Export Center:

- generates output from current project data;
- lets users inspect code/content previews;
- supports copying generated content;
- supports downloading generated files;
- records export actions;
- exposes diagnostics such as skipped tokens, Theme resolution issues and missing translations.

It does **not** currently:

- push generated files to arbitrary Git repositories;
- open or merge downstream pull requests;
- update already copied/downloaded files automatically;
- synchronize changes bidirectionally with consuming applications;
- treat an exported artifact as a second canonical source.

## Pedagogical model

### Opening problem — duplicated knowledge

Start with one semantic decision:

```text
color.semantic.action.primary = #FF8731
```

Show it manually copied into documentation, CSS, TypeScript and React Native. Then change only one copy.

The learner should see that drift emerges because every manual copy can become an independent authority.

### Canonical source vs consumers

Teach:

```text
Structured Design System project
            │
            ├── Markdown documentation
            ├── CSS variables
            ├── Tailwind v4
            ├── TypeScript Theme
            └── React Native Theme
```

The outputs are consumers/representations, not competing sources of truth.

### One decision, several representations

Show the same resolved semantic token in several code-oriented formats.

The goal is not to teach CSS or TypeScript syntax. The learner only needs to recognize that different formats can preserve the same underlying decision.

### Documentation is more than a dump

Explain that generated Markdown can selectively represent structured sections and localized content.

The learner should understand why structured component purpose, anatomy, token descriptions and accessibility data can become readable documentation without being rewritten by hand.

### Diagnostics

Generation should not be framed as blindly serializing everything.

Teach the existing behaviors around:

- unresolved references;
- deprecated tokens;
- Theme-resolution issues;
- missing translations.

### Snapshot boundary

This is a required teaching point:

```text
canonical source changes
        ↓
regenerate output
        ↓
review / version / integrate downstream
```

Do not imply live synchronization.

## Current-value anchors

The chapter reuses current MVP seed truth:

```text
color.primitive.accent.primary = #FF8731
color.semantic.action.primary → color.primitive.accent.primary
resolved value = #FF8731
```

This is intentionally aligned with the current domain seed rather than inventing an isolated lesson value.

## French typography guardrails

Following QA feedback from DS-180-06, new French content should already avoid known typographic regressions even though DS-180 final QA will run a dedicated editorial rewrite.

For this chapter:

- French guillemets use narrow no-break spaces: `« … »`;
- punctuation in checkpoint list items uses commas rather than English-style semicolon chaining;
- line-breaking-sensitive quoted phrases use non-breaking typography instead of relying on `text-balance` alone;
- long headings use `text-pretty` rather than assuming balanced wrapping will preserve French punctuation groups.

This does not replace the final Learn-wide French editorial and typography pass.

## Non-goals

This slice does not:

- change export generators;
- add export formats;
- change Documentation profiles;
- add Git/GitHub synchronization;
- change token-resolution behavior;
- add deployment/package publication;
- teach AI Instructions in depth;
- create the Chapter 07 route;
- add contextual Learn links in authenticated workspaces;
- perform the final Learn-wide French rewrite.

## Validation contract

Automated coverage should verify:

- EN/FR structural parity;
- current `#FF8731` teaching anchor;
- current five Chapter-06 formats;
- current Markdown section model;
- explicit export-snapshot/no-sync boundary;
- Chapter 06 published and Chapter 07 `next`;
- current-chapter navigation behavior;
- French guillemet narrow no-break spacing in the quoted misconception title.

Full Quality CI must pass before manual QA.

## Manual QA

Test:

```text
/en/learn
/fr/learn
/en/learn/documentation-and-delivery
/fr/learn/documentation-and-delivery
```

Verify:

- Chapter 06 is published;
- Chapter 07 is Up next and non-interactive;
- duplicated-copy drift is understandable without reading implementation details;
- canonical source → consumers graph remains legible on mobile;
- long code snippets scroll inside their own cards rather than overflowing the page;
- CSS/Tailwind/TypeScript/React Native representations clearly read as different representations of one decision;
- Markdown sections match current product capability;
- diagnostics do not imply that generation can repair source data automatically;
- export snapshot/no-sync boundary is prominent;
- AI Instructions are acknowledged but clearly deferred;
- locale switching preserves `/learn/documentation-and-delivery`;
- the French quoted misconception title never strands a guillemet on its own line;
- no page-level horizontal overflow.

## Handoff

The next Learn content slice is Chapter 07 — AI-ready Design Systems.

Its required framing remains:

```text
Good Design System structure helps humans
        ↓
that explicit structure is machine-readable
        ↓
it can therefore provide better AI context
```

Do not frame AI as the reason the Design System exists, and do not imply control, enforcement or live synchronization of external AI assistants.
