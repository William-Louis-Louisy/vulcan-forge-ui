# DS-180-01 — Learn shell and hub

## Status

- **Type:** public product UI / information architecture foundation.
- **Parent curriculum:** `docs/product/ds-180-00-learning-architecture-curriculum.md`.
- **Scope:** Learn hub, curriculum registry/navigation foundation, public discoverability, EN/FR baseline and development metadata.
- **Out of scope:** chapter lesson copy, complex teaching interactions, progress persistence, final SEO/social infrastructure and authenticated contextual help.

## Product objective

Make Learn a real public destination before publishing the first lesson.

The hub must let a visitor understand:

- what Learn is for;
- who it is for;
- the seven-chapter progression;
- what is available vs still planned;
- how Learn differs from the existing Examples walkthrough.

The implementation must not create fake chapter pages simply to make the curriculum look complete.

## Chapter publication model

The curriculum is defined centrally in `src/features/learn/learn-curriculum.ts`.

Each chapter has:

- a stable key;
- a sequence number;
- a durable slug;
- a publication status.

The current statuses are:

- `next` — the next chapter planned for implementation;
- `planned` — part of the accepted V1 curriculum but not yet authored;
- `published` — content exists and the chapter can become navigable.

`getLearnChapterHref()` deliberately returns no route until a chapter is `published`.

This means DS-180-01 ships no broken or empty lesson route. DS-180-02 will publish `/learn/design-systems` and change only the corresponding registry status when the lesson actually exists.

## Reusable navigation foundation

`LearnCurriculumNav` reads the shared curriculum registry and supports two presentations:

- `cards` for the hub curriculum overview;
- `compact` for future chapter-level navigation.

Both presentations derive chapter order, status and future links from the same registry so the hub and lessons cannot silently drift apart.

## Hub structure

The `/learn` hub contains four conceptual regions:

1. **Hero** — explains that Learn is concept-first and requires no previous Design System expertise.
2. **Curriculum** — exposes the seven chapters in their accepted order and current publication status.
3. **Mental model** — summarizes the progression from product intent through structured decisions, accessibility, delivery and AI context.
4. **Learn vs Examples** — keeps the public-surface boundary explicit: Learn teaches concepts; Examples demonstrates the VulcanForge UI workflow.

This is intentionally not Chapter 0 and does not contain lesson-level teaching copy.

## Public navigation

Learn is a first-class public destination and is therefore exposed consistently in:

- desktop public header;
- fullscreen public mobile navigation;
- public footer.

The mobile menu keeps the explicit-close behavior already qualified in PR #161.

## Localization

Learn copy lives in `src/messages/learn-messages.ts` and is merged through the existing scoped-message architecture.

The message module also contributes the `learn` label to `PublicHeader` and `PublicFooter`, avoiding a rewrite of the large legacy public-surface message module.

English and French use the same message shape and chapter keys.

## Metadata boundary

`/learn` receives a localized title and description as a development baseline.

DS-180-01 does **not** claim completion of:

- canonical URL strategy;
- hreflang/alternate strategy;
- sitemap/robots policy;
- Open Graph/social cards;
- structured data;
- final search-intent optimization.

Those remain DS-185 responsibilities.

## Automated coverage

Focused tests protect:

- the accepted seven-chapter order;
- the absence of fake chapter routes before publication;
- durable slug generation once a chapter becomes published;
- EN/FR Learn message parity;
- concept-first Learn vs product-first Examples messaging;
- Learn availability in fullscreen mobile navigation;
- Learn availability in the public footer.

## Manual QA before merge

### Desktop

- open `/en/learn` and `/fr/learn`;
- confirm header Learn navigation reaches the localized route;
- confirm the hero and curriculum hierarchy is visually clear;
- confirm all seven chapters are visible in order;
- confirm Chapter 01 is marked as next and Chapters 02–07 as planned;
- confirm unavailable chapter cards do not behave like links;
- confirm the mental-model grid reads in the intended sequence;
- confirm the Examples CTA reaches `/examples`;
- confirm Learn is present in the footer.

### Mobile physical device

- open `/en/learn` and `/fr/learn`;
- confirm no page-level horizontal overflow;
- confirm chapter cards remain readable without compressed text;
- open the fullscreen public menu and confirm Learn is present;
- tap Learn and confirm navigation closes the menu as expected;
- switch locale while on Learn and confirm the localized route remains usable.

### Keyboard

- tab through public header/footer and the Examples CTA;
- confirm visible focus treatment;
- confirm unpublished chapter cards are not inserted into the tab order;
- confirm curriculum semantics are exposed as ordered navigation content.

## DS-180-01 exit criteria

DS-180-01 is complete when:

- `/learn` is a real localized public route;
- the hub communicates the curriculum without lesson content;
- the seven-chapter order has one canonical code source;
- chapter publication status is honest and future-proof;
- the reusable curriculum navigation foundation exists;
- Learn is discoverable from desktop, mobile and footer navigation;
- EN/FR structures are equivalent;
- the hub is responsive and keyboard-usable;
- no future chapter capability is falsely represented as already published;
- focused automated checks and manual QA pass.

## Next slice

After DS-180-01 is accepted, proceed to **DS-180-02 — What is a Design System?**.

That slice should publish the first real chapter at `/learn/design-systems`, use the canonical Demo project as the teaching thread and change the first curriculum entry from `next` to `published` only when the route contains the accepted lesson content.
