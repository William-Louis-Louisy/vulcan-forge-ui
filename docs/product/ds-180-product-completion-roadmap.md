# DS-180+ — Product completion roadmap

## Status

- **Purpose:** canonical product-continuity plan after the DS-170 series and PR #161.
- **Starting point:** `main` at `6ec277df29b99fe8aff428882e5d69290240a7a8` (`Unify public and app mobile navigation (#161)`).
- **Current decision:** do **not** move VulcanForgeUI to public production yet.
- **Next active phase:** **DS-180 — Learn & Product Education**.
- **Delivery strategy:** small, independently reviewable iterations with explicit product questions, focused QA, and no speculative cross-cutting refactors.

This document exists to preserve the reasoning behind the next product sequence, not only the list of features. If later implementation pressure conflicts with the decisions recorded here, update this document deliberately rather than silently changing direction.

---

## 1. Why the roadmap changed

After the DS-170 product, architecture, authentication, responsive and public-surface work, VulcanForgeUI is already functionally broad:

- Brand profile;
- design tokens;
- theme mappings and previews;
- component contracts;
- accessibility analysis;
- generated documentation;
- export formats;
- AI instructions;
- authentication and account recovery;
- public landing, examples and pricing surfaces;
- responsive public and authenticated navigation.

The next question is therefore not simply whether the existing flows work. The product still has important gaps in **expressiveness, education and market readiness**.

Four product concerns are now considered material before public launch:

1. **Learn / product education** — users need a strong mental model of Design Systems and of the concepts VulcanForgeUI exposes.
2. **Components Workspace V2** — Components has strategic potential to become a major differentiator, but the current editor is still primarily a structured contract form rather than a visual component-authoring workspace.
3. **Theme extensibility** — the current product assumes Light and Dark. Real products can need additional visual appearances such as Sepia, but the correct product model must be discovered before changing persistence.
4. **SEO and social reach** — public launch should happen only after the public product and educational surfaces are technically and semantically ready for search engines and social sharing.

Production readiness remains important, but it moves **after** these product-completion phases.

---

## 2. Core roadmap principles

### 2.1 Product depth before production

Do not treat deployment itself as the next milestone. Production is valuable only when the product we expose is sufficiently complete, understandable and discoverable.

The current target sequence is:

```text
Product understanding
        ↓
Component-authoring direction
        ↓
Targeted theme extensibility
        ↓
Component workspace evolution
        ↓
SEO / social reach
        ↓
Release qualification
        ↓
Production
```

This sequence can evolve, but moving production earlier requires an explicit product decision.

### 2.2 Small iterations over broad epics

Every phase below is intentionally decomposed into small slices.

A normal implementation PR should answer **one primary product question** or deliver **one coherent behavior**. A PR should not combine, for example:

- new Learn content architecture;
- a Prisma Theme migration;
- a Components layout rewrite;
- and SEO infrastructure.

If a slice cannot be explained clearly in a short PR summary, it is probably too large.

### 2.3 Discovery before irreversible architecture

When the desired product behavior is not yet certain, prefer:

1. audit;
2. product model;
3. UX / information architecture;
4. domain contract;
5. persistence change;
6. UI implementation.

Do not start with Prisma merely because the current schema blocks an idea.

### 2.4 Existing behavior is a constraint, not disposable scaffolding

The application already contains qualified behavior and strong tests. New phases should preserve existing guarantees unless a product decision explicitly replaces them.

In particular:

- strict TypeScript remains mandatory;
- architecture boundaries introduced during the refactor series remain protected;
- downstream consumers should continue to use the canonical Design System project source rather than reconstructing project data independently;
- responsive behavior and EN/FR support remain first-class requirements;
- UI primitives should be reused rather than reimplemented locally;
- no unrelated cleanup should be hidden inside a feature PR.

### 2.5 Manual QA is part of completion

Automated quality is necessary but not sufficient for visually rich product changes.

Each visible iteration should define a short manual QA journey before merge. Responsive work should include real-device QA where interaction behavior is material.

### 2.6 Future ambition must not inflate the current slice

Two areas have intentionally ambitious long-term visions:

- arbitrary theme appearances;
- visual component authoring approaching some of the ergonomics of design tools such as Figma.

Those ambitions should guide architecture, but they must not force every near-term iteration to implement the final system immediately.

---

## 3. Decisions already made

### Decision A — Learn is the next active product phase

Learn provides high immediate value with low architectural risk and prepares three later concerns at once:

- user onboarding and education;
- product positioning and differentiation;
- SEO content architecture.

It also forces us to articulate the Design System concepts that Components V2 will later need to make visual and intuitive.

### Decision B — Theme extensibility is a real requirement, but the final model is intentionally undecided

A tester correctly observed that modern applications can need more than Light and Dark, for example Sepia.

That feedback is accepted as a **product requirement for extensibility**, not as proof that VulcanForgeUI immediately needs a complex hierarchy such as Theme → multiple Modes.

The current implementation is structurally limited:

- Prisma `ThemeMode` contains only `light` and `dark`;
- `Theme` is unique by `[projectId, mode]`;
- the editor switches between modes using the current mode-driven Theme switcher.

Before changing this model, DS-182 must determine what users actually need.

### Decision C — Components Workspace V2 is strategically important

The current Components feature already models substantial semantic information:

- anatomy;
- variants;
- sizes;
- states;
- accessibility expectations;
- localized purpose and usage guidance;
- forbidden patterns;
- visual token bindings;
- AI contract preview.

However, this information is still edited mainly through a long structured contract editor. The long-term opportunity is to make component authoring significantly more visual and expressive while preserving the structured data that powers Documentation, Accessibility and AI Instructions.

### Decision D — Components V2 will not be implemented as one rewrite

The future workspace must be discovered and introduced progressively. The first Components V2 phase is therefore product/UX architecture and safe layout foundations, not an immediate attempt to create a full graphical editor.

### Decision E — SEO is pre-launch work

Search, sharing and crawlability are not post-launch polish. VulcanForgeUI should be technically SEO-ready before public production.

Learn should be designed from the beginning so that its public information architecture can later support strong indexable educational content.

### Decision F — Release readiness is deferred until the product-completion sequence is qualified

Hosting, managed Postgres, production email, observability, backups, analytics, legal publication details and final environment hardening remain required. They are simply not the next product milestone.

---

# 4. DS-180 — Learn & Product Education

## 4.1 Product objective

Create a public educational experience that helps a user:

1. understand what a Design System is;
2. understand why Design Systems matter;
3. learn the concepts VulcanForgeUI models;
4. see how those concepts connect to one another;
5. understand how VulcanForgeUI turns them into a structured source usable by humans, applications and AI tools;
6. acquire enough knowledge to use the product intentionally rather than mechanically.

Learn must be **education first**, not a disguised feature list and not a click-by-click help center.

## 4.2 Core pedagogical model

Each important topic should try to answer the same sequence:

```text
What is it?
   ↓
What problem does it solve?
   ↓
What does a concrete example look like?
   ↓
How does it relate to the rest of a Design System?
   ↓
How does VulcanForgeUI represent it?
   ↓
What should the user do with that knowledge?
```

Where possible, prefer one coherent example carried across multiple chapters instead of unrelated isolated examples.

## 4.3 Proposed Learn information architecture

The exact route structure remains subject to DS-180-00, but the current target is a hub plus focused chapters rather than one extremely long page.

Candidate structure:

```text
/learn
/learn/design-systems
/learn/design-tokens
/learn/themes
/learn/components
/learn/accessibility
/learn/documentation-and-delivery
/learn/ai-ready-design-systems
```

Potential later subtopics can include:

- primitive vs semantic tokens;
- variants vs states;
- component anatomy;
- token references and aliases;
- contrast and accessibility;
- design-system drift;
- why structured design data matters for AI coding assistants.

Do not create separate routes merely for SEO volume. A route should exist because it forms a coherent learning unit.

## 4.4 Content boundaries

Learn should explain VulcanForgeUI truthfully.

Avoid claims that the product:

- synchronizes external AI tools automatically;
- replaces a full design application;
- guarantees WCAG compliance;
- controls downstream generated applications;
- provides collaboration capabilities that are not implemented.

When showing generated outputs or AI instructions, describe them as consumers of the same structured project source.

## 4.5 DS-180 iteration plan

### DS-180-00 — Learning architecture and curriculum

**Type:** documentation / product design only.

Define:

- target learner profiles;
- assumed knowledge;
- learning outcomes;
- chapter order;
- vocabulary and terminology rules;
- the canonical example used across chapters;
- relationships between Learn, Examples and the authenticated product;
- route proposal;
- EN/FR content strategy;
- visual teaching patterns to reuse.

**Exit criteria:** we can explain why every planned chapter exists and what a user should understand after completing it.

Do not implement public pages in this slice.

### DS-180-01 — Learn shell and hub

Introduce only the public Learn foundation:

- `/learn` route;
- public navigation entry where appropriate;
- Learn layout / chapter navigation foundation;
- responsive structure;
- chapter-card or curriculum overview;
- EN/FR routing and baseline messages;
- metadata baseline sufficient for development, without claiming the final SEO phase is complete.

**Exit criteria:** users can understand the curriculum and navigate the empty/initial learning structure without layout ambiguity.

### DS-180-02 — What is a Design System?

Teach the foundational mental model:

- repeated UI decisions;
- inconsistency and drift;
- shared language between design and development;
- the relationship between foundations, tokens, components and documentation;
- the distinction between a component library and a broader Design System.

Use a concrete progressive example rather than only definitions.

**Exit criteria:** a beginner can explain why a Design System exists before being introduced to VulcanForgeUI-specific implementation details.

### DS-180-03 — Design Tokens

Teach:

- why raw values become tokens;
- primitive tokens;
- semantic tokens;
- aliases / references;
- token categories currently supported by VulcanForgeUI;
- why names and semantics matter more than merely storing values;
- how tokens flow into later Themes and Components.

Connect the chapter to the actual Tokens workspace without turning the chapter into UI documentation.

### DS-180-04 — Themes

Teach the current product truth:

- a theme maps semantic roles to token references;
- Light and Dark are the currently implemented appearances;
- contrast changes with theme mappings;
- the same component contracts can consume different resolved values through themes.

Do **not** teach arbitrary custom appearance authoring until DS-182 defines and implements it.

The chapter may acknowledge conceptually that Design Systems can support appearances beyond Light and Dark, while clearly distinguishing that general concept from the current product capability.

### DS-180-05 — Components

Teach:

- component contract vs rendered instance;
- anatomy;
- variants;
- sizes;
- states;
- usage/content guidance;
- accessibility expectations;
- token bindings;
- why structured component semantics are useful for documentation and AI instructions.

This chapter is strategically important because its content will become input for DS-181 Components Workspace V2 discovery.

### DS-180-06 — Accessibility

Teach:

- accessibility as a system property rather than a final checklist;
- contrast relationships;
- focus-visible and component states;
- automated checks vs manual validation;
- what the VulcanForgeUI score/report does and does not prove.

The chapter must not imply automated certification.

### DS-180-07 — Documentation, exports and AI-ready systems

Teach how one structured project can feed multiple consumers:

- Markdown documentation;
- CSS variables;
- Tailwind v4;
- TypeScript theme output;
- React Native theme output;
- AI Instructions.

Explain the benefit of a canonical source and the reduction of drift. Be precise about AI boundaries: generated context can guide an assistant, but VulcanForgeUI does not control the assistant.

### DS-180-08 — Product bridges and contextual learning

Once the curriculum is stable, add restrained bridges between Learn and product surfaces where they genuinely reduce confusion.

Examples:

- Learn links from public marketing surfaces;
- contextual “Learn this concept” links from selected application areas;
- links from Learn chapters to the relevant product or Examples section.

Avoid turning every UI control into documentation chrome.

### DS-180-09 — Learn final content, responsive and i18n QA

Run a dedicated qualification pass for:

- conceptual consistency across chapters;
- EN/FR parity;
- terminology consistency;
- mobile reading ergonomics;
- keyboard navigation;
- heading hierarchy;
- illustration semantics;
- links between chapters;
- links into product/public surfaces;
- no unsupported marketing claims.

**DS-180 completion condition:** Learn forms a coherent curriculum and a user can move from no Design System knowledge to understanding the concepts necessary to use VulcanForgeUI meaningfully.

---

# 5. DS-181 — Components Workspace V2 discovery and foundations

## 5.1 Strategic objective

Evolve Components from a structured contract form into a more visual authoring workspace while preserving the structured semantics that make VulcanForgeUI valuable to Accessibility, Documentation and AI Instructions.

The guiding opportunity is not “clone Figma”. It is:

> make component-system intent visible, editable and machine-readable in the same workspace.

## 5.2 Current architectural constraints

The current persistence model intentionally supports a finite MVP registry:

```text
button
textField
card
alert
dialog
```

`ComponentContract` is unique by `[projectId, type]`.

This means arbitrary user-defined components such as `SearchBar`, `ProductCard` or `NavigationItem` are not yet first-class persistence entities.

The current editor already has rich semantics but exposes them mostly as grouped form sections. That is sufficient for the current contract model but not the final visual-workspace ambition.

## 5.3 Important distinction: Workspace V2 vs arbitrary component creation

Do not combine these two problems automatically.

### Problem 1 — Workspace V2

Can the existing component contracts be authored through a clearer, more visual layout?

This can begin without a Prisma migration.

### Problem 2 — Open component model

Should users be allowed to define arbitrary component identities and structures beyond the seeded enum registry?

This requires domain and persistence decisions and should be handled only after the workspace mental model is validated.

## 5.4 DS-181 iteration plan

### DS-181-00 — Components product-model audit

Document:

- every field currently stored in a component contract;
- which fields users understand easily;
- which fields are primarily machine-oriented;
- which fields should be visible on a canvas;
- which fields belong in an inspector;
- which fields should become progressive disclosure;
- how component data currently affects previews, Accessibility, Documentation and AI Instructions;
- gaps revealed by the Learn Components chapter.

No UI rewrite yet.

### DS-181-01 — Workspace interaction model

Define the proposed desktop and mobile composition.

Candidate desktop mental model:

```text
Component navigation | Canvas / Preview | Inspector
```

But do not commit to this merely because it resembles design tools. Validate:

- navigation density;
- canvas purpose;
- inspector responsibilities;
- responsive fallback;
- save model;
- selection model;
- how anatomy / variants / states are represented.

Produce implementation-ready UX rules before changing persistence.

### DS-181-02 — Editor decomposition without product behavior change

Refactor only where necessary to make the existing editor capable of moving into the new workspace safely.

Potential goals:

- isolate section-level state boundaries;
- keep the existing draft/fingerprint/save behavior intact;
- preserve preview updates;
- reduce coupling between visual layout and contract mutation logic.

This slice must be behavior-preserving and strongly regression-tested.

### DS-181-03 — Workspace frame

Implement the new page composition around the existing editor semantics:

- component navigation;
- preview/canvas region;
- inspector region;
- responsive stacking/drawer strategy;
- sticky/save behavior appropriate to the new frame.

Do not introduce arbitrary component creation in this slice.

### DS-181-04 — Visual anatomy authoring

Explore a first genuinely visual authoring capability using component anatomy.

The goal is not freeform vector drawing. The goal is to make the structure of a component understandable and selectable.

Questions:

- can anatomy parts be represented as a tree or layered schematic?
- can selecting a part focus its relevant contract fields?
- can optional / required / derived semantics be represented visually?
- how does this remain usable for non-visual components?

### DS-181-05 — Variants, sizes and states matrix

Make the relationship between axes visible instead of only presenting independent text collections.

Investigate a controlled matrix / configuration browser that can answer:

- what combinations exist?
- which state is being previewed?
- which variant/size/state selection drives the canvas?

Avoid generating an uncontrolled Cartesian explosion.

### DS-181-06 — Token-binding inspector

Make visual bindings feel like component styling semantics rather than a generic form collection.

Preserve canonical token reference rules and type safety.

Potential capabilities:

- select a component/anatomy target;
- assign semantic roles such as background, foreground, border, radius, padding or motion;
- resolve token values in preview;
- surface missing/deprecated references clearly.

### DS-181-07 — Accessibility and guidance integration

Bring relevant component accessibility expectations and usage guidance into the workspace context without overwhelming the canvas.

The product should make it clear that visual authoring and semantic/component guidance belong to the same contract.

### DS-181-08 — AI contract enrichment audit

Evaluate whether the richer workspace produces structured information that AI Instructions can use more effectively.

Do not add fields solely because they sound useful to AI. Every new contract field must have a clear product meaning for humans as well.

### DS-181-09 — Open component model decision

Only after the Workspace V2 interaction model has been used and qualified, decide whether to replace the fixed `ComponentContractType` model with arbitrary user-defined component identities.

This decision must address:

- stable identifiers;
- display names vs keys;
- seeded component templates;
- duplicate names/keys;
- delete/rename semantics;
- references from other components if composition is introduced later;
- migration of existing projects;
- export and AI-instruction representation.

This slice may conclude with a design document rather than a migration.

---

# 6. DS-182 — Targeted Theme extensibility

## 6.1 Product objective

Remove the assumption that a Design System can only ever expose Light and Dark appearances, while avoiding unnecessary complexity in the Themes workspace.

The motivating example is simple and valid:

> a product may want a Sepia appearance in addition to Light and Dark.

The roadmap must solve that need without automatically building a full enterprise theming platform.

## 6.2 Current constraint

The current schema encodes appearance and theme identity together:

```text
ThemeMode = light | dark
Theme unique(projectId, mode)
```

The first job is therefore conceptual, not UI.

## 6.3 Questions DS-182 must answer

1. Is `Sepia` conceptually another mode alongside Light and Dark?
2. Does VulcanForgeUI need a separate Theme identity containing multiple modes?
3. Do users need multiple named theme families or only additional appearances?
4. Does every appearance require the same semantic role set?
5. How should Accessibility compare appearances?
6. How should exports name and serialize them?
7. What is the minimum UI that remains clear on mobile and desktop?
8. What happens to existing Light/Dark projects during migration?

Do not answer these implicitly through a schema shape.

## 6.4 Preferred product bias

Unless research demonstrates otherwise, prefer the **simplest model that supports additional intentional appearances**.

Avoid adding:

- nested theme families;
- inheritance graphs;
- theme composition;
- arbitrary cascading overrides;
- enterprise brand packs;

unless a concrete product need appears.

## 6.5 DS-182 iteration plan

### DS-182-00 — Theme concept audit

Document the current Theme domain, downstream consumers and the exact limitations exposed by Light/Dark-only assumptions.

Include Accessibility, preview, Documentation, Exports, AI Instructions, project cards and seeds.

### DS-182-01 — Appearance model decision

Compare at least the plausible minimal models and choose one deliberately.

The output must include:

- user mental model;
- domain types;
- persistence implications;
- migration plan;
- UI switching/creation model;
- downstream serialization rules.

No Prisma migration before this decision is accepted.

### DS-182-02 — Domain and persistence migration

Implement only the chosen model and preserve existing projects.

Add characterization/migration tests before introducing creation UI.

### DS-182-03 — Create appearance/theme UI

Add the smallest clear creation flow.

Potential options, depending on DS-182-01:

- create from an existing appearance;
- create from defaults;
- choose a name/key;
- choose base semantic mappings.

Do not combine create, rename, duplicate and delete unless the domain foundation makes each operation trivial and independently testable.

### DS-182-04 — Rename / duplicate / delete as separate slices

Add lifecycle operations incrementally, each with explicit dependency and safety rules.

### DS-182-05 — Accessibility and downstream consumers

Qualify all supported appearances across:

- Theme preview;
- contrast matrix;
- Accessibility Center;
- Documentation;
- Exports;
- AI Instructions.

### DS-182-06 — Theme UX final QA

Validate that extensibility did not make the page harder to understand for users who only need Light and Dark.

This is a key acceptance criterion.

---

# 7. DS-183/184 — Components Workspace V2 expansion

DS-181 intentionally establishes the workspace before the most expensive domain changes. If DS-181 validates the direction, continue with smaller expansion phases rather than reopening the entire editor in one PR.

Potential follow-up work can include:

- arbitrary component creation if DS-181-09 approves it;
- richer component templates;
- controlled composition / child-slot relationships;
- more expressive preview states;
- selected anatomy-part styling;
- component relationships;
- stronger structured AI contract output.

The guiding rule remains:

> visual authoring must enrich the structured Design System source, not become a disconnected drawing surface.

A freeform canvas that cannot produce stable semantic contracts would move VulcanForgeUI away from its differentiator rather than toward it.

Number the concrete follow-up series only after DS-181 discovery has fixed the product model. Do not reserve implementation architecture prematurely.

---

# 8. DS-185 — SEO & Social Reach

## 8.1 Product objective

Make the completed public product ready to be discovered, indexed, understood and shared before launch.

This phase happens after the major public information architecture is stable, especially Learn.

## 8.2 SEO is not only metadata

The phase must cover four layers:

### Technical crawlability

- robots policy;
- sitemap(s);
- canonical URLs;
- locale alternates / `hreflang` strategy;
- index/noindex rules for public vs authenticated/auth utility routes;
- status codes and redirect correctness.

### Page semantics

- unique localized titles and descriptions;
- heading hierarchy;
- semantic landmarks;
- internal linking;
- descriptive anchors;
- structured data where genuinely applicable.

### Social sharing

- Open Graph metadata;
- social card strategy;
- localized or universal share images as appropriate;
- correct titles/descriptions/images for Landing, Examples, Learn and other indexable entry points.

### Search usefulness and performance

- content intent;
- Learn topic architecture;
- duplicate/thin content avoidance;
- Core Web Vitals / loading behavior;
- image sizing and delivery;
- font behavior;
- bundle/client-JS review on public routes.

## 8.3 DS-185 iteration plan

### DS-185-00 — SEO inventory and indexation policy

Create a route-by-route table defining:

- indexable?;
- canonical target;
- locale strategy;
- search intent;
- social-share importance;
- structured-data applicability.

### DS-185-01 — Metadata architecture

Centralize reusable localized metadata patterns without forcing every page into identical copy.

### DS-185-02 — Sitemap, robots, canonical and alternates

Implement technical discovery/indexation rules and test them.

### DS-185-03 — Social sharing

Implement Open Graph / social metadata and the approved share-card visual system.

### DS-185-04 — Learn internal linking and semantic audit

Use the final Learn structure to create meaningful topic relationships and pathways toward Examples/product understanding.

Do not keyword-stuff or create artificial pages.

### DS-185-05 — Structured data

Add only schema types that accurately describe the public content. Validate generated JSON-LD.

### DS-185-06 — Public performance pass

Audit public routes for rendering, image/font loading, excessive client JS and Core Web Vitals risks.

### DS-185-07 — Final SEO QA

Validate representative EN/FR URLs as crawlers and social consumers would see them.

This phase should use current search-engine and Next.js guidance at implementation time rather than relying on this roadmap as a frozen SEO checklist.

---

# 9. DS-190 — Release readiness and production qualification

This phase begins only when the preceding product-completion work is accepted.

## 9.1 Infrastructure and environment

Qualify:

- production hosting;
- managed PostgreSQL;
- migrations;
- secrets;
- Auth.js host/cookie/session behavior;
- production email delivery;
- domain / HTTPS;
- rate limiting;
- backup and restore approach.

## 9.2 Operational visibility

Define the minimum production observability required to support real users:

- application errors;
- server errors;
- auth/email failures;
- relevant structured logs;
- error-reporting ownership;
- basic availability awareness.

Do not build enterprise observability without need.

## 9.3 Legal and trust publication

Complete and validate the publication values and policies required by the actual launch scope.

## 9.4 Product analytics / feedback

Decide explicitly what minimum analytics or feedback loop is justified before launch. Prefer privacy-conscious, decision-oriented measurement over collecting data without a product question.

## 9.5 Full release journey

Run a final production-like journey covering at minimum:

```text
Public discovery
  → Learn / Examples
  → Signup
  → Email verification
  → Project creation
  → Brand
  → Tokens
  → Themes
  → Components
  → Accessibility
  → Documentation
  → Exports
  → AI Instructions
  → Settings / account flows
```

Include mobile and desktop qualification and realistic EN/FR usage.

---

# 10. Iteration protocol for every phase

The following protocol is the default for DS-180 onward.

## Step 1 — State the problem

Every slice starts with a short statement of:

- user problem;
- current limitation;
- desired outcome;
- deliberate non-goals.

## Step 2 — Inspect current behavior

Before implementation, inspect:

- domain types;
- persistence;
- server boundaries;
- feature consumers;
- tests;
- responsive/i18n impact;
- generated consumers if relevant.

Do not assume that a visible UI limitation is only a UI limitation.

## Step 3 — Record unresolved product questions

If the answer materially changes architecture, resolve it before implementation.

Typical examples:

- Theme vs Mode;
- component identity vs component type;
- Learn chapter vs marketing page;
- automatic behavior vs explicit user action.

## Step 4 — Implement the smallest coherent slice

Prefer one focused branch and one focused PR.

Avoid:

- broad renames unrelated to the feature;
- opportunistic architecture cleanup;
- multiple persistence migrations in one UI slice;
- hidden product decisions inside utility functions.

## Step 5 — Automated quality

The repository quality command remains the normal preflight:

```bash
npm run quality
```

Focused tests should be added for the changed behavior before relying on the full suite.

## Step 6 — Manual QA

Every visible PR body should contain the exact manual QA journey required before merge.

For interaction-heavy responsive work, include physical-device checks where appropriate.

## Step 7 — Close the loop in documentation

When a phase resolves an open decision in this roadmap, update the relevant section so future work does not restart the same debate.

Documentation should record **why** a choice was made, not only the final implementation.

---

# 11. Quality gates by change type

## Documentation/content-only Learn slice

Minimum concerns:

- conceptual accuracy;
- no unsupported product claims;
- EN/FR parity where implementation is localized;
- semantic headings/navigation;
- responsive reading QA;
- links validated.

## UI-only / layout-preserving behavior slice

Minimum concerns:

- existing domain behavior unchanged;
- keyboard accessibility;
- mobile/desktop layout;
- save/focus/selection behavior if editing surfaces move;
- no UI primitive regression.

## Domain/persistence slice

Minimum concerns:

- migration/backward compatibility;
- authorization boundary;
- canonical source consumers;
- invalid/malformed persisted data behavior;
- downstream revalidation;
- explicit tests before UI wiring.

## Export/AI/documentation-impacting slice

Minimum concerns:

- deterministic output;
- no consumer-specific reconstruction of canonical project data;
- deprecated/missing references handled consistently;
- EN/FR behavior where locale affects generated content;
- truthful AI semantics.

---

# 12. Explicitly deferred work

The following topics are not rejected, but they are not reasons to derail the immediate roadmap unless new evidence changes priority:

- payment/subscription implementation;
- broad real-time collaboration;
- enterprise role/permission expansion;
- theme inheritance graphs;
- full freeform graphical design tooling;
- arbitrary component composition before the component identity model is settled;
- large analytics infrastructure;
- production deployment before product-completion qualification.

If one of these becomes urgent because of concrete user research, update this roadmap and state what changed.

---

# 13. Current recommended order

The working order after PR #161 is:

```text
DS-180  Learn & Product Education
   ↓
DS-181  Components Workspace V2 discovery + safe foundations
   ↓
DS-182  Targeted Theme extensibility
   ↓
DS-183/184  Components Workspace V2 expansion
   ↓
DS-185  SEO & Social Reach
   ↓
DS-190  Release readiness / production qualification
```

This order is intentionally not based only on implementation difficulty.

- **Learn first** because it improves understanding, onboarding, positioning and future SEO while clarifying the concepts Components V2 must visualize.
- **Components discovery second** because it is strategically differentiating and needs thoughtful product architecture before expensive implementation.
- **Themes after discovery** because the additional-appearance need is valid but does not yet justify a complex model.
- **Components expansion afterward** because the long-term workspace should build on validated UX/domain decisions.
- **SEO before launch** because final public content architecture should exist before the technical SEO closeout.
- **Production last** because deployment is not the definition of product completion.

---

# 14. Immediate next action

Start **DS-180-00 — Learning architecture and curriculum**.

The output should be another focused product document, not application code.

It should answer:

1. Who is Learn for?
2. What knowledge can we assume?
3. What should a complete beginner understand after the curriculum?
4. What is the minimum set of chapters?
5. In what order should concepts be taught?
6. What single example can connect Tokens → Themes → Components → Accessibility → Delivery?
7. How should VulcanForgeUI appear in the teaching without turning Learn into marketing copy?
8. What belongs in Learn vs Examples vs contextual product help?
9. What content needs visual/interactive demonstrations?
10. What should be intentionally deferred from Learn V1?

Only after DS-180-00 is reviewed should DS-180-01 create the public Learn shell.

---

## Continuity note

This roadmap is deliberately deeper than a feature checklist. Future conversations and implementation sessions should begin by identifying the current roadmap slice and reading its product question, non-goals and exit criteria before proposing code.

When uncertainty appears, the preferred response is not to widen the current PR. Create or update the next small slice instead.
