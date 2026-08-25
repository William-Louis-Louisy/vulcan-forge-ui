# DS-180-02 — What is a Design System?

## Status

- **Type:** public Learn content / curriculum implementation.
- **Parent curriculum:** `docs/product/ds-180-00-learning-architecture-curriculum.md`.
- **Parent roadmap:** `docs/product/ds-180-product-completion-roadmap.md`.
- **Route:** `/learn/design-systems` with EN/FR locale routing.
- **Scope:** Chapter 01 only.
- **Next chapter:** DS-180-03 — Design Tokens.

---

## 1. Goal

Teach the reason Design Systems exist before introducing implementation mechanics.

The learner should leave this chapter able to explain:

1. why individually reasonable UI decisions can still create product drift;
2. why a Design System preserves shared product knowledge rather than only reusable code;
3. why a component library is part of a Design System rather than the whole system;
4. why designers and developers benefit from a shared vocabulary and shared decisions;
5. where VulcanForgeUI fits without mistaking the tool for the concept itself.

This directly satisfies the DS-180-02 roadmap exit condition: a beginner should understand why a Design System exists before being introduced to VulcanForgeUI-specific authoring details.

---

## 2. Pedagogical sequence

The chapter follows the accepted DS-180-00 chapter contract.

```text
Opening problem
      ↓
Design drift
      ↓
Plain-language definition
      ↓
Component library vs Design System
      ↓
Why shared knowledge matters
      ↓
Demo project transformation
      ↓
Wider system mental model
      ↓
How VulcanForgeUI represents the system
      ↓
Misconception guardrail
      ↓
Checkpoint
      ↓
Preview of Design Tokens
```

The order is intentionally reason-first.

The chapter does not begin with Tokens, Themes, Components fields or VulcanForgeUI controls.

---

## 3. Canonical drift example

The chapter reuses the Demo project established by DS-180-00 and `/examples`.

Three teams independently create a primary action with small differences:

```text
Screen 1
#A94E2F
14 px radius
12 × 16 px padding
visible focus treatment

Screen 2
#A34B31
12 px radius
10 × 16 px padding
visible focus treatment

Screen 3
#A94E2F
14 px radius
12 × 16 px padding
no agreed focus treatment
```

The teaching point is not that one implementation is objectively wrong.

The teaching point is:

> the product has no shared answer to the same recurring decision.

This avoids presenting Design Systems as aesthetic policing.

---

## 4. Definition used by the chapter

The chapter describes a Design System as a shared system of:

- decisions;
- foundations;
- reusable components;
- guidance;
- accessibility expectations;
- common language across product disciplines.

It intentionally avoids claiming one universal Design System architecture.

Different organizations structure systems differently.

The curriculum therefore teaches a durable mental model rather than a rigid taxonomy.

---

## 5. External research baseline

The chapter copy was checked against current public Design System guidance on 2026-08-25.

### Atlassian Design System

Atlassian describes its Design System as a collection of design guidelines, foundations, tools and components. It also describes foundations as including tokens, guidelines and visual styles and emphasizes preservation and sharing of design decisions.

References:

- https://atlassian.design/get-started/about-atlassian-design-system
- https://atlassian.design/foundations

### GOV.UK Design System

GOV.UK defines components as reusable parts of a user interface and provides them together with styles, patterns, coded examples and usage guidance. This supports the chapter distinction between reusable components and the broader system around them.

References:

- https://design-system.service.gov.uk/components/
- https://design-system.service.gov.uk/styles/
- https://design-system.service.gov.uk/patterns/

### U.S. Web Design System

USWDS combines components, patterns, design tokens, utilities, accessibility guidance and broader design principles. Its public guidance also explicitly frames consistency as continuity rather than conformity.

References:

- https://designsystem.digital.gov/
- https://designsystem.digital.gov/design-principles/

### Research rule

These references support terminology and the general mental model.

They do not redefine VulcanForgeUI product behavior.

---

## 6. Component library distinction

The chapter deliberately contrasts two questions.

### Component library

```text
What reusable UI can I render?
```

Typical value:

- reusable building blocks;
- implementation APIs;
- faster screen construction.

### Design System

```text
Which recurring decision should we make?
Why?
How should it remain coherent across the product?
```

Typical value:

- shared foundations;
- components and behavior expectations;
- usage and accessibility guidance;
- shared vocabulary;
- preservation of product knowledge.

The chapter does not diminish component libraries. It positions them as one important layer inside a broader system.

---

## 7. Demo project progression

DS-180-02 introduces only the first transformation:

```text
raw repeated choices
        ↓
shared product decision
```

It explicitly defers the implementation layers:

```text
shared product decision
        ↓
Design Token            ← DS-180-03
        ↓
Theme / Component use   ← later chapters
```

This protects progressive complexity.

The learner sees `#A94E2F`, but the chapter does not yet teach primitive tokens, semantic tokens or aliases.

---

## 8. VulcanForgeUI bridge

Only after the general concept is established does the chapter describe the current product workspaces.

The bridge is intentionally restrained:

- Brand → project intent and direction;
- Tokens → reusable design decisions;
- Themes → semantic roles and appearance mappings;
- Components → structured component contracts;
- Accessibility → checks the product can evaluate;
- Documentation / Exports / AI Instructions → consumers of structured project data.

The copy does not imply automatic downstream synchronization, WCAG certification or control over external AI assistants.

---

## 9. Misconception guardrail

The chapter explicitly rejects this interpretation:

```text
Design System = everything must look identical
```

The intended model is:

```text
share decisions where shared decisions create value
+
leave room for genuine product needs
```

This is consistent with USWDS guidance that continuity does not necessarily mean conformity.

---

## 10. Curriculum publication state

With DS-180-02:

```text
01 Design Systems                 published
02 Design Tokens                  next
03 Themes                         planned
04 Components                     planned
05 Accessibility                  planned
06 Documentation & Delivery       planned
07 AI-ready Design Systems        planned
```

`getLearnChapterHref()` therefore returns a real route only for Chapter 01.

No placeholder route is created for Chapter 02.

---

## 11. Navigation and accessibility

The existing curriculum navigation now accepts `currentChapterKey`.

On a published chapter:

- the current chapter link receives `aria-current="page"`;
- future chapters remain non-interactive;
- the compact curriculum is available as a sticky desktop rail;
- the same curriculum appears after the article on smaller screens;
- the content remains understandable without interacting with diagrams;
- color swatches are accompanied by nearby text rather than carrying meaning alone.

The chapter keeps semantic heading order and uses static explanatory visuals rather than pointer-dependent interactions.

---

## 12. i18n strategy

The complete chapter ships in EN and FR in the same iteration.

The chapter-specific content lives in:

```text
src/messages/learn-design-systems-messages.ts
```

This prevents the general Learn hub message file from becoming the storage location for all future lesson copy.

Tests verify structural parity between EN and FR.

Technical values such as `#A94E2F` remain identical across locales.

---

## 13. Explicit non-goals

DS-180-02 does **not** implement:

- detailed Design Token teaching;
- primitive vs semantic token definitions;
- aliases / references;
- Theme authoring;
- component contract field teaching;
- quizzes or learning progress;
- complex teaching interactions;
- final SEO infrastructure;
- contextual Learn links throughout the authenticated app;
- persistence or schema changes.

---

## 14. Automated validation

Focused coverage includes:

- accepted curriculum order;
- Chapter 01 published state;
- Chapter 02 `next` state;
- no fake href for unpublished chapters;
- EN/FR chapter message structure parity;
- current chapter `aria-current` behavior;
- future chapter non-interactivity.

Full repository validation remains:

```bash
npm run db:generate
npm run lint
npm run typecheck
npm run format:check
npm run audit:ui
npm run test
npm run build
```

---

## 15. Manual QA

### Desktop

Check `/en/learn/design-systems` and `/fr/learn/design-systems`.

Verify:

- heading hierarchy is visually and semantically clear;
- the drift example reads as three related but inconsistent decisions;
- the distinction between component library and Design System is immediately understandable;
- the sticky curriculum rail does not overlap the public header;
- Chapter 01 is current/available;
- Chapter 02 is Up next / Prochainement and not clickable;
- Examples CTA reaches `/examples`;
- no horizontal page overflow occurs.

### Tablet / mobile

Verify:

- all grids stack without cramped text;
- the drift example remains legible;
- the five-step system map reflows without horizontal overflow;
- curriculum navigation remains reachable after the lesson;
- public mobile navigation still exposes Learn correctly;
- locale switching preserves the chapter path.

### Keyboard

Verify:

- public navigation focus remains visible;
- Chapter 01 curriculum link is keyboard reachable;
- unpublished chapters are not focusable fake links;
- Examples CTA is keyboard reachable.

---

## 16. Exit criteria

DS-180-02 is ready to merge when:

- [x] Chapter 01 has a real localized route;
- [x] the lesson begins with a concrete drift problem;
- [x] the definition stays concept-first;
- [x] component library vs Design System is explicitly distinguished;
- [x] the canonical Demo project continues consistently;
- [x] VulcanForgeUI appears only after the general concept is understood;
- [x] EN and FR structures are equivalent;
- [x] Chapter 01 is the only published lesson;
- [x] Chapter 02 becomes the honest `next` lesson;
- [x] chapter navigation identifies the current location;
- [x] no future capability is presented as current product behavior;
- [ ] full repository Quality CI is green;
- [ ] manual desktop/mobile/keyboard QA is accepted.

---

## 17. Next iteration

After DS-180-02 is merged and QA-approved, proceed to:

**DS-180-03 — Design Tokens**

That iteration will teach why raw values become named decisions, then introduce primitive tokens, semantic tokens and references without turning Learn into a tutorial for the Tokens form.
