# DS-180-03 — Design Tokens chapter

## Status

Implementation slice for Chapter 02 of the accepted Learn curriculum.

This iteration publishes only the Design Tokens chapter. It does not implement the Themes chapter, change token-domain behavior, migrate existing projects or alter export formats.

## Learning objective

By the end of the chapter, a learner should be able to explain:

1. why repeated raw values remain disconnected copies even after a team agrees on their meaning;
2. what a Design Token contributes beyond the raw value itself;
3. the practical distinction between primitive/value-oriented and semantic/intent-oriented token layers;
4. why a token reference preserves a dependency instead of duplicating the resolved value;
5. why tokens are broader than colors or CSS variables;
6. which parts of this model VulcanForgeUI currently implements explicitly.

## Pedagogical sequence

The chapter follows this progression:

```text
shared decision from Chapter 01
        ↓
repeated raw value
        ↓
named token
        ↓
primitive foundation value
        ↓
semantic intent
        ↓
reference / alias
        ↓
resolved value
        ↓
other token categories
        ↓
current VulcanForgeUI representation
        ↓
misconception + checkpoint
        ↓
Themes
```

The learner first sees the maintenance problem before receiving terminology.

## Recurring Demo project

Chapter 01 established `#A94E2F` as the shared primary-action decision.

The public `/examples` walkthrough already uses the simplified path:

```text
color.brand.600 → #A94E2F
```

The current VulcanForgeUI color authoring model is more explicit. Primitive and semantic color rows are recognized through these path prefixes:

```text
color.primitive.*
color.semantic.*
```

Therefore Chapter 02 teaches the current product relationship as:

```text
color.primitive.brand.600
        ↓
#A94E2F

color.semantic.action.primary
        ↓
{color.primitive.brand.600}
        ↓
#A94E2F
```

The chapter deliberately explains the difference between the short public-demo label and the current editor convention rather than silently changing the canonical Demo project story.

## Product facts audited for this chapter

### Domain token shape

`DesignToken` currently contains:

- `path`;
- `type`;
- `value`;
- optional localized `description`;
- optional `reference`;
- lifecycle `status`.

Current token statuses are:

```text
draft
ready
deprecated
```

Current token-set types are:

```text
color
spacing
radius
typography
motion
```

Typography can carry a structured value. Other current token types use scalar values.

### References

The domain validates token references with curly-brace syntax:

```text
{token.path}
```

The resolver follows those references from one project token to another.

### Primitive / semantic boundary

VulcanForgeUI does **not** currently store `primitive` or `semantic` as a generic `DesignToken.kind` field.

For color authoring, the editor recognizes:

```text
color.primitive.*
color.semantic.*
```

Semantic color creation is designed to reference an existing primitive color token.

This distinction matters pedagogically: the chapter can accurately teach primitive and semantic token architecture while avoiding the false claim that every VulcanForgeUI token type currently supports the same two-layer authoring workflow.

## External terminology baseline

The chapter's general terminology was checked against the Design Tokens Community Group (DTCG) current stable material.

As of this iteration:

- the first stable DTCG specification is `2025.10`;
- the DTCG describes design tokens as indivisible pieces of a Design System;
- the specification treats `alias` and `reference` as synonyms for token-to-token relationships;
- curly-brace syntax is supported for token references;
- the specification standardizes exchange format and leaves organizational methodology to Design System teams.

Important boundary:

**Primitive and semantic are common Design System architecture concepts, not universal DTCG token types.**

VulcanForgeUI is not described as DTCG-conformant by this chapter. Compatibility or conformance would require a dedicated audit and is outside DS-180-03.

Reference baseline:

- Design Tokens Community Group — Glossary;
- Design Tokens Format Module 2025.10;
- Design Tokens Community Group FAQ / Technical Reports.

## Chapter UI

The chapter adds:

- a raw-value repetition example using three implementation locations;
- a four-part token anatomy illustration;
- a raw value → primitive token transition;
- a primitive vs semantic comparison;
- a semantic → reference → resolved-value dependency flow;
- a before/after primitive-value change illustration;
- a token naming comparison;
- a five-category overview matching the current product model;
- a Demo project bridge that reconciles the public shorthand with current product paths;
- a current-product data-shape section;
- a misconception callout;
- a learning checkpoint;
- the existing compact curriculum navigation with Chapter 02 current.

The diagrams must remain understandable without relying on color alone.

## Curriculum publication state

After DS-180-03:

```text
01 Design Systems              published
02 Design Tokens               published
03 Themes                      next
04 Components                  planned
05 Accessibility               planned
06 Documentation & Delivery    planned
07 AI-ready Design Systems     planned
```

Chapter 03 remains non-interactive until it is actually implemented.

## Localization

The complete chapter is available in English and French.

Technical token paths and raw values are intentionally not translated. Explanatory labels and prose are localized.

EN/FR structural parity is covered by a focused test.

## Non-goals

DS-180-03 does not:

- change the token persistence model;
- change primitive or semantic authoring behavior;
- add primitive/semantic workflows to spacing, radius, typography or motion;
- change `/examples` to the longer primitive path;
- claim DTCG conformance;
- teach Theme authoring;
- implement a Theme route;
- change exports;
- redesign the application Tokens workspace.

## Automated validation

The branch must pass the repository Quality workflow, including:

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

- the seven-chapter curriculum order;
- chapters 01 and 02 are published;
- Themes is the only `next` chapter;
- no fake Themes href exists;
- EN/FR chapter structures match;
- the chapter retains the current product primitive/semantic boundary.

## Manual QA

Review:

```text
/en/learn
/fr/learn
/en/learn/design-tokens
/fr/learn/design-tokens
```

Validate:

1. Chapter 02 is clickable from the Learn hub and marked current on its page.
2. Chapter 03 is labelled Up next / Prochainement but remains non-interactive.
3. The raw-value example is understandable without inspecting source code.
4. The primitive vs semantic distinction is understandable to a learner unfamiliar with token architecture.
5. The reference chain visually reads in the correct order on desktop and mobile.
6. `{color.primitive.brand.600}` is displayed literally and resolves conceptually to `#A94E2F` in the example.
7. The difference between public-demo shorthand `color.brand.600` and current product convention is explicit rather than surprising.
8. The five token categories match current product terminology.
9. No text suggests that every category currently supports primitive/semantic authoring.
10. Locale switching preserves `/learn/design-tokens`.
11. Keyboard focus and curriculum navigation remain usable.
12. There is no horizontal overflow, especially around long token paths and the reference flow.

## Handoff to DS-180-04

Once DS-180-03 is merged and manually qualified, the next small iteration is:

**DS-180-04 — Chapter 03: Themes**

That chapter should start from the semantic token created here and explain why the same intent may need different resolved appearance decisions.

It must preserve the previously agreed product restraint: the educational concept may acknowledge that theming is broader than Light/Dark, but it must not imply that VulcanForgeUI currently offers arbitrary named themes or Sepia authoring before the Theme domain is intentionally evolved.
