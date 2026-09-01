# DS-181R — Components V2 development handoff

## Purpose

This is the canonical handoff for starting Components V2 implementation in a fresh conversation/context.

Read this file first, then:

1. `docs/product/ds-181r-00-components-v2-product-reset.md`
2. `docs/product/ds-181r-01-components-v2-capability-matrix.md`
3. `docs/product/ds-181-00-components-product-model-audit.md` for historical/current-consumer detail only

Do **not** use `docs/product/ds-181-01-workspace-interaction-model.md` as the current target UX. It is superseded by DS-181R.

---

## 1. Product truth to preserve

The user was already broadly satisfied with what the `main` Components page **did**.

The original problem was primarily:

- visual quality;
- UI/UX;
- insufficient fine-grained Component customization;
- inability to create arbitrary first-class Components from reusable starting templates.

Do not reinterpret the task as “replace the editor with a Canvas”.

### “Figma-like” means

Useful design control such as:

- width/min/max-width;
- detailed padding;
- border controls;
- asymmetric corner radius;
- surface/typography controls;
- structural options such as Card Header/Footer;
- Variants/Sizes/States that can override selected base visual properties;
- immediate preview feedback.

It does **not** mean:

- vector drawing;
- free x/y layout;
- an oversized empty Canvas;
- a general page builder.

---

## 2. Rejected prototype

The branch:

```text
refactor/components-workspace-v2
```

contains the earlier DS-181-02 through DS-181-08 implementation experiment.

It is **not a release candidate** and must not be merged to `main`.

The prototype's primary product failures were:

- Canvas consumed the majority of the page without providing matching authoring power;
- previews became visually worse;
- Anatomy / Variants & States were not redesigned deeply enough for the new frame;
- interaction count increased substantially;
- customization did not materially improve;
- arbitrary Component creation remained blocked;
- architecture completion was mistakenly treated as product completion.

Some internal state-management/test ideas may be reusable, but only after they prove useful to the reset product model.

Never branch new Components V2 implementation from this rejected integration branch.

---

## 3. Current `main` is the non-regression baseline

At the start of the reset documentation work, `main` was:

```text
f1b715dfd2a0f2865ef3c6078130719c4263a96b
```

with DS-181-00/01 documentation but **without** the rejected workspace implementation.

The current page uses approximately:

```text
Registry | Editor | Preview
```

and already supports:

- registry grouping/filtering/selection;
- create/delete for the finite current types;
- name/status;
- EN/FR semantic authoring;
- Purpose;
- Usage Guidelines;
- Content Guidelines;
- Anatomy;
- Variants;
- Sizes;
- States;
- Accessibility rules;
- Forbidden Patterns;
- visual Token bindings;
- live visual preview;
- Component AI contract preview;
- dirty/invalid/saving/saved state;
- explicit whole-contract Save;
- downstream Documentation/Accessibility/AI consumers.

The new product must preserve or deliberately improve all of this.

---

## 4. Decisions already closed

Do not reopen these without a concrete conflict discovered during implementation.

### 4.1 Current Components V2 scope

Build an excellent **individual Component customization system** first.

In scope:

- primitives/controls;
- structured Components;
- arbitrary Component identity;
- creation from templates;
- visual property capabilities;
- template-defined optional slots;
- Token-aware values;
- base + Variant/Size/State overrides;
- existing semantics/guidance/accessibility.

Deferred:

- composing a Component from existing Components;
- `LoginForm`, `ProductCard`, `CheckoutSummary`, etc.;
- dashboards/application shells/settings pages;
- general Stack/Flex/Grid composition tree;
- page builder;
- blank graphical authoring;
- general responsive breakpoint property editor.

### 4.2 Future nested Component overrides

When composition is eventually implemented, embedded Component instances may override only declared parameters such as:

```text
variant
size
width
content
```

They must not freely override deep visual properties and break the source Component definition.

### 4.3 Variant/state visual model

Accepted model:

```text
base properties + sparse targeted overrides
```

not complete independent copies for every variant/state combination.

### 4.4 Layout

Structured layout concepts are useful, but the current release does not need a generic arbitrary layout tree.

Known template/slot layouts may expose curated direction/alignment/justification/gap options.

### 4.5 Creation

Primary first release path:

```text
Create Component → identity → choose template → edit
```

`Component identity ≠ template ≠ renderer`.

Blank start and composition are deferred.

### 4.6 Tokens

Visual properties should be Token-first but allow a controlled explicit-value escape hatch.

Do not force every max-width or one-off constraint to exist as a reusable Token.

Do not discard legacy custom/unrecognized Token bindings during migration.

### 4.7 Accessibility

Keep both:

1. accessibility-safe behavior supplied by template/renderers where possible;
2. the authored Accessibility contract and severity as structured Design System guidance.

### 4.8 Existing semantic areas

Do not lose or bury:

- Purpose;
- Usage Guidelines;
- Content Guidelines;
- Anatomy;
- Accessibility;
- Forbidden Patterns;
- lifecycle status;
- AI/machine-readable output.

---

## 5. Research corpus summary

A private Tailwind UI / Tailwind Plus `application/ui` archive was used only as a product benchmark.

Verified archive size:

```text
380 JSX examples
11 top-level families
49 sub-families
```

The narrowed Components V2 research subset covers 154 examples from:

```text
Buttons
Badges
Avatars
Dropdowns
Input Groups
Textareas
Checkboxes
Radio Groups
Select Menus
Comboboxes
Toggles
Dividers
Cards
Alerts
Modal Dialogs
Drawers
Tabs
```

No Tailwind Plus source/design is to be copied or redistributed.

The research validates recurring need for:

- dimensions/width constraints;
- spacing;
- border/radius including asymmetric cases;
- surface/elevation;
- typography;
- focus/hover/disabled states;
- structured layout;
- optional structural regions;
- overflow/overlay sizing.

The complete capability decisions are recorded in `ds-181r-01-components-v2-capability-matrix.md`; the archive does not need to be available in the next conversation to begin development.

---

## 6. Target template library

### Wave A — migration/proof using existing fixtures

```text
Button
TextField
Card
Alert
Dialog
```

### Wave B — common primitives

```text
Textarea
Checkbox
RadioGroup
Select
Switch
Badge
Avatar
Divider
```

### Wave C — richer behavior

```text
Combobox
Drawer
Tabs
Dropdown
```

Do not implement all templates at once.

The capability architecture is successful only if adding later templates mostly configures existing capability groups rather than requiring a separate bespoke editor for every template.

---

## 7. UX direction for later visible slices

Do not start with a large Canvas rewrite.

The current preferred responsibility model remains closer to `main`:

```text
Components | Editor/configuration | Preview/output
```

The Editor should provide direct access to meaningful groups such as:

```text
Design
Structure
Variants & States
Guidance
Accessibility
```

but these labels do not mandate five page tabs. Prefer fewer actions and progressive disclosure.

### Critical UX rules

- preview receives only the space it needs to evaluate edits;
- common Design controls are directly reachable;
- do not require Canvas selection + Inspector navigation for routine property edits;
- Card Structure must genuinely manage Header/Content/Footer rather than merely restyle the old Anatomy cards;
- Variants/States must edit inheritance/overrides rather than only rename tags;
- AI Contract can become a secondary output view rather than permanent competing chrome;
- semantic contract editing must remain obvious;
- compare high-frequency task action count with `main` before acceptance.

Before any whole-page UX rewrite is implemented, validate the control model on real vertical slices first.

---

## 8. Branch strategy for implementation

### Prerequisite

Merge the DS-181R documentation PR into `main` first.

Then create a brand-new integration branch from the accepted `main` head:

```text
refactor/components-v2-customization
```

All Components V2 implementation slices should branch from and target this new integration branch.

Example:

```text
refactor/components-v2-customization
├─ agent/ds-181r-01-component-domain-v2
├─ agent/ds-181r-02-template-registry
├─ agent/ds-181r-03-button-customization
└─ ...
```

Keep `main` stable until the reset V2 is genuinely accepted as better.

Never merge automatically. The user explicitly controls merges.

---

## 9. First development slice: DS-181R-01

### Title

```text
DS-181R-01 — Define Component V2 domain and migration contract
```

### Goal

Create the domain/persistence foundation required for real customization and arbitrary first-class Component identity **without redesigning the page**.

### Must decide and implement/test

#### Identity

- stable arbitrary Component identity;
- key/slug rules;
- display name;
- category representation;
- template key separate from identity;
- removal of `ComponentContractType` as the uniqueness/identity authority;
- behavior when multiple Components use the same template.

#### Persistence

- Prisma migration design;
- replace current `@@unique([projectId, type])` limitation;
- preserve existing five persisted contracts;
- deterministic migration/backfill;
- rollback/compatibility plan suitable for integration-branch development.

#### Contract versioning

Introduce an explicit stored contract version or equivalent migration boundary so future property evolution does not rely on guessing JSON shape.

#### Design values

Define typed Zod/TypeScript representations for:

- Token references;
- explicit values;
- length-like values;
- color-like values;
- typography/elevation strategies where necessary.

Avoid arbitrary unvalidated CSS strings.

#### Visual properties

Define root visual-property representation for at least the capability families required by Wave A:

```text
dimensions
spacing
border
radius
surface
typography
layout/overflow where required
```

The schema should be sparse and extensible without becoming a generic CSS object.

#### Structure/slots

Define template-backed structural configuration sufficient for:

```text
Card Header? / Content / Footer?
Alert optional regions
Dialog Backdrop / Panel / Header? / Content / Footer? / CloseAction?
```

Do not implement generic Component composition.

#### Overrides

Define deterministic sparse overrides for:

```text
Variants
Sizes
States
```

Document/test precedence and inheritance/reset semantics.

#### Legacy semantic fields

Preserve/migrate:

- Purpose;
- Usage Guidelines;
- Content Guidelines;
- Anatomy;
- Accessibility;
- Forbidden Patterns;
- lifecycle status;
- custom Token bindings.

#### Downstream adapters

Audit/update domain adapters required by:

- Components registry;
- visual preview;
- Documentation;
- Accessibility;
- Component AI contract;
- global AI Instructions;
- exports if any Component consumer exists there.

Do not make downstream code reconstruct its own divergent Component interpretation.

### Non-goals

DS-181R-01 must not:

- redesign Components UI;
- introduce the rejected Canvas layout;
- implement Component composition;
- add all template families;
- add breakpoint editing;
- add drag/drop;
- change Theme semantics;
- opportunistically rewrite unrelated Design System domains.

### Required tests

At minimum:

- parse/migrate each of the five current Component seed shapes;
- preserve user-edited semantic fields;
- preserve custom Token bindings;
- support two arbitrary identities using the same template if the chosen domain allows it;
- reject duplicate identity key in one project;
- validate DesignValue token/value branches;
- validate slot configuration against template capability rules at the appropriate boundary;
- prove deterministic override resolution;
- prove reset-to-inherited behavior at the domain utility level;
- prove existing downstream consumers can receive compatible normalized Component data during migration.

### Stop condition

If DS-181R-01 cannot define this model cleanly without turning the contract into arbitrary CSS/JSON, stop and revise the domain before building UI.

---

## 10. Files to inspect first in a new conversation

Start from `main` after the reset docs PR is merged and inspect at least:

```text
prisma/schema.prisma
src/domain/design-system/component-contract.schema.ts
src/domain/design-system/*component* seed/template files
src/features/components/ComponentContractEditor.tsx
src/features/components/ComponentContractEditorSections.tsx
src/features/components/components-registry.utils.ts
src/features/components/components-registry.queries.ts
src/features/components/ComponentFoundationsPreview*
src/features/components/ComponentAiContractPreview*
src/features/components/component-token-bindings.utils.ts
src/features/components/update-component-contract.action.ts
Accessibility consumers of ComponentContract
Documentation / AI Instructions consumers of ComponentContract
```

Search consumers rather than assuming this list is exhaustive.

---

## 11. Working style / user expectations

- Work in small focused PRs.
- Do not develop directly on `main`.
- Do not merge without an explicit user request.
- Give exact checkout/pull commands before asking for manual QA.
- Strict TypeScript; do not use explicit `any`.
- Keep architecture explanations understandable and tied to user-visible value.
- Do not call a slice successful solely because CI is green.
- Visible work needs concrete manual QA.
- If a requirement is ambiguous, ask instead of silently choosing an interpretation.
- The final Components V2 integration must not be proposed until it is clearly better than `main` in the user's judgement.

---

## 12. Recommended opening instruction for the next conversation

The user can start the new conversation with:

> Continue VulcanForgeUI Components V2 from the canonical DS-181R handoff in the repository. Read `docs/product/ds-181r-components-v2-development-handoff.md`, `ds-181r-00-components-v2-product-reset.md`, and `ds-181r-01-components-v2-capability-matrix.md`. Verify the docs PR is merged and create the new `refactor/components-v2-customization` integration branch from `main`. Then start DS-181R-01 — Component V2 domain and migration contract. Do not use or merge the rejected `refactor/components-workspace-v2` implementation branch.

That instruction plus the repository documentation should be sufficient to resume without relying on this conversation history.
