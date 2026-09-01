# DS-181R-00 — Components V2 product reset

## Status

Canonical product reset for Components V2 after the rejected `refactor/components-workspace-v2` prototype.

This document **supersedes `ds-181-01-workspace-interaction-model.md` as the target product/UX direction**. The earlier audit remains useful as historical/current-state research, but the Canvas-first `Navigation | Canvas | Inspector` solution is no longer an accepted target.

The previous integration branch must be treated as an experimental prototype:

```text
refactor/components-workspace-v2
```

It must not be merged to `main`. Individual implementation ideas may be reused only when they support the product model defined here.

No product code is changed by this document.

---

## 1. Why DS-181 is being reset

The previous implementation optimized around an interaction architecture rather than the actual user outcome.

It successfully decomposed state and introduced contextual editing, but the resulting page regressed in the areas that matter most:

- the central Canvas consumed disproportionate screen space without providing equivalent authoring power;
- visual previews became harder to read rather than more useful;
- Anatomy and Variants / States remained fundamentally similar to their previous editing model while fitting the new layout worse;
- common edits required more navigation and more clicks;
- the workspace did not materially increase visual customization;
- arbitrary Component creation was repeatedly deferred;
- the final result was described as Figma-like without providing the design-control capabilities that comparison implied.

The implementation therefore failed the product objective even though its individual PRs were technically qualified.

### Process correction

Future Components work must be evaluated against user value, not only against local slice completion.

Every visible change must answer at least one of these questions positively:

1. Is an existing task at least as easy and clear as it is on `main`?
2. Can the author now express something useful that was impossible before?

A green CI run does not prove either condition.

---

## 2. Clarified product objective

The existing `main` Components page is functionally useful. Its primary weakness is not that it lacks a Canvas mental model. The desired evolution has two axes:

### 2.1 Preserve the current semantic contract experience

The future page must retain the capabilities that already make Components useful to the broader Design System:

- identity and lifecycle status;
- localized purpose;
- usage guidance;
- content guidance;
- Anatomy;
- Variants;
- Sizes;
- States;
- visual Token relationships;
- Accessibility contract;
- Forbidden Patterns;
- visual preview;
- Component AI contract preview;
- downstream Documentation / Accessibility / AI consumers;
- explicit validation and save behavior.

These are not legacy fields to hide or remove merely because the visual model becomes richer.

### 2.2 Add real component-design control

“Figma-like” means **the useful level of control a designer expects when configuring a reusable UI Component**, not a freeform vector editor and not a literal Figma clone.

Examples of desired authoring power include:

- `width`, `min-width`, `max-width`;
- height constraints where relevant;
- padding globally, per axis, or per side;
- gap where relevant;
- border width/style/color;
- independent corner radii such as `topLeft`, `topRight`, `bottomRight`, `bottomLeft`;
- surface/background/foreground styling;
- typography where the Component owns text styling;
- alignment and structured layout controls where meaningful;
- optional structural regions such as Card header/footer;
- state-specific and variant-specific visual overrides;
- immediate visual feedback.

The product should expose meaningful design-system properties, **not every CSS property**.

### Product sentence

> Components V2 lets a Design System author create template-backed Components and customize them deeply enough to represent real reusable UI components, while preserving the semantic contracts that power Accessibility, Documentation and AI guidance.

---

## 3. Scope boundary

### In scope for this Components V2 reset

- arbitrary first-class Component identity;
- creation from a curated template;
- fine visual customization through template capability profiles;
- fixed/template-defined structural slots;
- optional slots such as Card header/footer;
- visual property values that can use Design Tokens;
- Variants, Sizes and States with a base + targeted override model;
- existing Anatomy semantics;
- existing localized guidance;
- existing Accessibility contract;
- existing Forbidden Patterns;
- existing lifecycle semantics;
- live preview that reflects the editable visual model;
- preservation of downstream structured consumers;
- desktop/mobile UX that does not increase routine interaction cost without a clear benefit.

### Explicitly deferred

The following ideas remain valid possible future directions, but are **not part of the current V2 implementation scope**:

- composing a new Component from instances of existing Components;
- product-specific compositions such as `LoginForm`, `ProductCard`, `CheckoutSummary`;
- application shells, dashboards, settings pages and other large patterns;
- arbitrary nested layout trees;
- a general drag/drop page or interface builder;
- freeform x/y positioning;
- arbitrary deep instance overrides;
- a full responsive breakpoint authoring system;
- starting from a completely blank graphical Component unless a later product decision proves it necessary.

### Future composition rule already accepted

When Component composition is eventually introduced, an embedded Component instance may override only explicitly supported parameters such as:

```text
variant
size
width
content
other declared instance parameters
```

It must not freely override deep visual properties such as radius or typography and silently break the source Design System Component.

---

## 4. Non-regression baseline from `main`

The current persisted `ComponentContract` contains:

```text
type
name
purpose
usageGuidelines?
contentGuidelines?
status
anatomy[]
variants[]
sizes[]
states[]
tokenBindings[]
accessibility[]
forbiddenPatterns[]
```

The current finite type model is:

```text
button
textField
card
alert
dialog
```

Current functionality that V2 must preserve or deliberately replace with a better equivalent:

### Registry and lifecycle

- list Components;
- group Components by category;
- filter/search Components;
- select a Component;
- create a currently supported Component type;
- delete a Component;
- display/edit lifecycle status (`draft`, `ready`, `deprecated`);
- detect malformed stored contracts.

### Semantic authoring

- edit Component name;
- switch EN/FR authoring context;
- edit localized Purpose;
- edit localized Usage Guidelines;
- edit localized Content Guidelines;
- edit Anatomy key/label/requirement;
- add/remove Anatomy entries;
- add/remove/edit Variants;
- add/remove/edit Sizes;
- add/remove/edit States;
- edit Accessibility rules and severity;
- edit Forbidden Patterns;
- edit visual Token bindings, including custom binding keys.

### Validation and persistence

- one coherent local draft;
- deterministic dirty-state detection;
- full schema validation;
- explicit Save;
- Save disabled for an invalid draft;
- server authorization/validation before persistence;
- route refresh/save-context preservation after success;
- preview receives only a valid canonical contract.

### Outputs and downstream value

- visual Foundations preview;
- current variant/size/state preview behavior;
- Component AI contract preview;
- generated Documentation consumers;
- global AI Instructions consumers;
- Accessibility analysis consumers;
- localized-data diagnostics.

### Non-regression rule

A V2 flow is not accepted merely because the underlying data is still technically reachable.

If a common task takes materially more navigation, hides important context, or makes comparison with the preview harder without adding useful control, it is a UX regression.

---

## 5. Research corpus and legal/product boundary

A private Tailwind UI / Tailwind Plus `application/ui` corpus was supplied for product research.

The archive contains **380 JSX examples**, organized into **11 top-level families and 49 sub-families**.

Top-level distribution:

| Family | Examples |
| --- | ---: |
| Forms | 77 |
| Navigation | 55 |
| Elements | 49 |
| Lists | 47 |
| Layout | 38 |
| Headings | 29 |
| Overlays | 24 |
| Application shells | 23 |
| Data display | 20 |
| Feedback | 12 |
| Page examples | 6 |

For the current narrowed Components V2 scope, the useful benchmark subset contains **154 examples** across these families/sub-families:

- Buttons;
- Badges;
- Avatars;
- Dropdowns;
- Input Groups;
- Textareas;
- Checkboxes;
- Radio Groups;
- Select Menus;
- Comboboxes;
- Toggles;
- Dividers;
- Cards;
- Alerts;
- Modal Dialogs;
- Drawers;
- Tabs.

This corpus is a **capability and taxonomy benchmark only**.

Do not:

- copy Tailwind Plus implementation code into VulcanForgeUI templates;
- port exact commercial designs;
- redistribute their source;
- treat their class lists as our template definitions.

Use it to answer questions such as:

- which structural regions recur across real components?
- which visual capabilities recur enough to deserve first-class authoring controls?
- which concerns should be universal vs template-specific?

### Aggregate observations from the scoped corpus

Across the 154 scoped examples, the source material repeatedly uses:

| Concern | Examples containing it |
| --- | ---: |
| Padding | 132 |
| Radius | 147 |
| Surface/background | 146 |
| Typography/text styling | 134 |
| Flex layouts | 114 |
| Focus behavior/styling | 97 |
| Width constraints | 87 |
| Responsive variants | 80 |
| Shadow/elevation | 66 |
| Hover behavior/styling | 58 |
| Borders | 46 |
| Height constraints | 44 |
| Overflow behavior | 44 |
| Transitions | 37 |
| Grid layouts | 31 |
| Gap | 33 |
| Asymmetric radius usage | 14 |

These counts do not define the product automatically, but they validate that dimensions, spacing, border/radius, structured layout, states and responsive-aware constraints are real recurring needs rather than speculative additions.

---

## 6. Template taxonomy for the current scope

The current target deliberately stops before product-level compositions.

### 6.1 Primitive / control templates

Candidate template families:

```text
Button
TextField
Textarea
Checkbox
RadioGroup
Select
Combobox
Switch
Badge
Avatar
Divider
```

### 6.2 Structured Component templates

Candidate template families:

```text
Card
Alert
Dialog
Drawer
Tabs
Dropdown
```

This is a **target library**, not a requirement to implement every template in the first coding PR.

### Implementation waves

#### Wave A — prove the model with existing product fixtures

```text
Button
TextField
Card
Alert
Dialog
```

These are already persisted today and therefore provide the safest migration/compatibility path.

#### Wave B — expand common primitives

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

#### Wave C — add behaviorally richer templates

```text
Combobox
Drawer
Tabs
Dropdown
```

Wave C is deliberately later because keyboard/focus/overlay semantics are more involved and should not be hand-waved by a generic renderer.

---

## 7. Identity, template and renderer are separate concepts

This separation is mandatory.

```text
Component identity
      ≠
starting template
      ≠
preview/rendering strategy
```

A future stored record conceptually needs a stable identity such as:

```text
id
projectId
key / slug
name
templateKey
category
status
contract
```

The current `ComponentContractType` enum must not remain the identity authority.

A user may create a Component with their own identity while selecting a known starting template.

Example:

```text
Name: Marketing CTA
Key: marketingCta
Template: Button
```

`marketingCta` is the Component identity. `Button` only declares its starting capabilities and renderer family.

The persistence design must allow multiple Components derived from the same template if the product chooses to support that usage.

---

## 8. Visual capability model

The editor must expose **capabilities**, not an arbitrary CSS dictionary.

Each template declares which capability groups it supports.

### 8.1 Dimensions

Candidate properties:

```text
width
minWidth
maxWidth
height
minHeight
maxHeight
```

Width/height values should use constrained design-friendly inputs rather than raw arbitrary CSS strings where possible.

Useful width modes may include:

```text
auto
fill
fixed / explicit
```

with optional min/max constraints.

### 8.2 Spacing

Support meaningful granularity:

```text
padding
paddingX / paddingY
paddingTop
paddingRight
paddingBottom
paddingLeft
gap
```

The UI should make a simple uniform value easy while allowing per-side expansion when necessary.

### 8.3 Border

Candidate properties:

```text
borderWidth
borderTopWidth
borderRightWidth
borderBottomWidth
borderLeftWidth
borderStyle
borderColor
```

Per-side width is justified by patterns such as accent-border Alerts and shared-border controls.

### 8.4 Radius

The model must support both the common case and asymmetric design:

```text
radius
radiusTopLeft
radiusTopRight
radiusBottomRight
radiusBottomLeft
```

The UI should default to linked corners and allow unlinking them.

### 8.5 Surface / elevation

Candidate concerns:

```text
background
foreground
elevation / shadow
```

Do not attempt to expose arbitrary box-shadow syntax directly in the normal editor.

### 8.6 Typography

Where the Component owns text treatment, support a typography capability rather than scattering unrelated CSS fields.

The detailed implementation may use a typography token plus targeted overrides for:

```text
fontFamily
fontSize
fontWeight
lineHeight
letterSpacing
textAlign
```

A template should expose only what is meaningful for that Component/slot.

### 8.7 Structured layout

The product may expose structured layout concepts when they describe the Component itself:

```text
row / column
alignment
justification
wrap
gap
```

`Stack / Flex / Grid` remain useful design-system concepts, but **general arbitrary nested composition is deferred**.

The current V2 may therefore use layout capabilities inside a known template or slot without exposing a generic tree builder.

### 8.8 Overflow / scrolling

Relevant particularly to:

- Card;
- Dialog;
- Drawer;
- dropdown/list surfaces.

Expose only curated options such as visible/clip/auto where the template needs them.

### 8.9 Motion

Motion remains a first-class Design Token type today, but broad transition authoring is not a first-wave requirement.

Overlay/interactive templates may expose curated motion roles later. Do not block the data model from representing them, but do not inflate the first implementation with an animation editor.

---

## 9. Token-first values with a controlled escape hatch

Visual customization must integrate with the existing Token system instead of turning Components into isolated CSS islands.

Preferred conceptual value model:

```text
DesignValue<T>
├─ token reference
└─ explicit value
```

Examples:

```text
padding: { source: "token", path: "spacing.4" }
maxWidth: { source: "value", value: "32rem" }
radiusTopLeft: { source: "token", path: "radius.lg" }
```

### UX rule

- prefer and recommend compatible Tokens;
- allow an explicit value where a reusable token would be artificial or the user genuinely needs a one-off constraint;
- clearly show when a property is token-linked vs locally specified;
- never silently coerce an invalid Token type.

The exact persisted representation must be finalized in the domain slice before UI implementation.

### Existing custom token bindings

The current contract can store custom binding keys that do not correspond to a known visual role.

V2 must either preserve those bindings or migrate them to an explicit semantic/custom-binding area. Do not discard them merely because known visual properties gain first-class token references.

---

## 10. Template-defined structure and slots

The current scope does not need arbitrary Component composition to make structured Components substantially more useful.

A template may declare a finite set of structural slots.

### Card

```text
Card
├─ Header?     optional
├─ Content     required
└─ Footer?     optional
```

### Alert

```text
Alert
├─ Icon?       optional
├─ Title?      optional
├─ Content     required
├─ Actions?    optional
└─ Dismiss?    optional
```

### Dialog

```text
Dialog
├─ Backdrop
└─ Panel
   ├─ Header?      optional
   ├─ Content      required
   ├─ Footer?      optional
   └─ CloseAction? optional
```

### Drawer

```text
Drawer
├─ Backdrop
└─ Panel
   ├─ Header?      optional
   ├─ Content      required
   ├─ Footer?      optional / may be sticky
   └─ CloseAction? optional
```

### Slot rules

- templates define available slots;
- required/optional status is explicit;
- optional slots can be enabled/disabled;
- slots may expose their own limited capability profile;
- slots are **not** arbitrary embedded Components in this V2 scope;
- template structure must be serializable and deterministic;
- preview must render the actual slot configuration.

---

## 11. Relationship with Anatomy

Current Anatomy is semantic contract data:

```text
key
localized label
requirement: required | optional | derived
```

It must not simply be replaced by visual slots because the two concepts answer different questions:

- **slot/structure configuration** answers what the template currently renders and how structural regions are configured;
- **Anatomy** documents the semantic parts of the Component contract for humans and downstream consumers.

For template-backed Components, templates should seed sensible Anatomy entries that correspond to their known structural parts.

The implementation should avoid forcing authors to maintain obviously duplicated information manually. The domain slice must decide which Anatomy metadata is seeded/derived and which remains explicitly authored.

Do not preserve duplication merely for schema convenience.

---

## 12. Variants, Sizes and States: base + targeted overrides

The accepted model is:

```text
base properties
   +
variant overrides
   +
size overrides
   +
state overrides
```

A Component should not be completely redefined independently for every combination.

Example:

```text
Button base
  radius: radius.md
  paddingX: spacing.4
  paddingY: spacing.2

variant.primary
  background: color.action.primary
  foreground: color.onAction

size.large
  paddingX: spacing.5
  paddingY: spacing.3
  typography: typography.button.lg

state.hover
  background: color.action.primaryHover

state.focusVisible
  border / focus treatment: ...
```

### Rules

- base is the normal source of truth;
- an override stores only what changes;
- deleting an override restores inheritance from the lower layer;
- UI must make inheritance vs override visible;
- normal editing must not require navigating a Cartesian variant × size × state matrix;
- a comparison/matrix view may exist later as a secondary diagnostic, not as the primary editing model.

### Combination precedence

The exact deterministic precedence order must be defined and tested in the domain slice before implementation. It must not depend on object iteration order or UI state.

---

## 13. Accessibility has two layers

Components V2 must distinguish:

### Template interaction semantics

Behavior that should be correct by construction where possible:

- semantic element/role;
- keyboard behavior;
- focus handling;
- overlay focus management;
- disabled semantics;
- accessible naming hooks.

These are properties of the renderer/template implementation and should not become a free-form user responsibility.

### Authored Accessibility contract

The existing structured authoring remains first-class:

```text
rule key
description
severity
```

This communicates Design System requirements and feeds downstream project consumers.

Do not hide the authored contract merely because templates implement good defaults.

---

## 14. Responsive authoring decision

Responsive utility usage is common in the research corpus, but exposing arbitrary breakpoint overrides immediately would multiply the complexity of every property, Variant and State.

Therefore:

- the implementation must not assume that Components can never vary responsively;
- template renderers may have necessary safe responsive behavior;
- **general per-breakpoint visual-property authoring is deferred from the first V2 release**;
- add it only after the base customization model proves usable.

This is a deliberate scope decision, not a claim that responsive Components are unimportant.

---

## 15. Creation model

The primary V2 creation path is **start from a template**.

Conceptually:

```text
New Component
   ↓
Identity
   name
   key
   category
   ↓
Starting template
   Button
   TextField
   Card
   ...
   ↓
create canonical Component
   ↓
open editor with template defaults
```

The template supplies:

- default visual properties;
- capability profile;
- supported slots;
- default Anatomy;
- sensible Variants/Sizes/States where applicable;
- renderer strategy;
- accessibility-safe structural behavior.

### Blank Component

Starting completely blank is not required for the first implementation. It may be added later if real usage proves that templates are too restrictive.

### Composition

“Compose from existing Components” is also deferred from this V2 release, even though it remains a future product direction.

---

## 16. UX direction: evolve `main`, do not invent another tool first

The future UI should start from the strengths of `main` rather than force all authoring through a dominant Canvas.

### Desktop responsibility model

A credible default direction is:

```text
Components        Editor / configuration           Preview
──────────        ──────────────────────           ───────
registry          direct controls                  live result
search            compact sections                representative state
status            visual properties               optional contract view
                  structure
                  variants / sizes / states
                  guidance
                  accessibility
```

The preview is important, but it earns only the space necessary to evaluate changes.

It must not dominate the page unless the interaction actually requires that space.

### Editor information architecture

The exact visual treatment remains a design task, but responsibilities should be grouped approximately as:

```text
Design
Structure
Variants & States
Guidance
Accessibility
```

with lifecycle/identity always easily reachable.

This grouping does **not** imply five mandatory page-level tabs. Use the least navigation necessary.

### Design

Direct property controls such as:

- dimensions;
- spacing;
- border;
- radius;
- surface;
- typography;
- token linkage.

A common design edit should not require selecting a Canvas object and then opening a second-level Inspector merely to reach a property.

### Structure

For a structured template:

- slot enable/disable;
- slot-specific properties;
- Anatomy relationship;
- relevant layout configuration.

For a Button, this area should be small because its structure is simple.

### Variants & States

Use compact axis/value selection and reveal overrides for the selected definition.

Do not make the author traverse multiple views just to edit a Variant label or a hover background.

### Guidance

Keep:

- Purpose;
- Usage Guidelines;
- Content Guidelines;
- Forbidden Patterns.

Progressive disclosure is acceptable, but the information must remain easy to discover and edit.

### Accessibility

Keep the authored Accessibility contract as a dedicated first-class concern rather than burying it inside generic advanced settings.

### Preview / AI contract

The visual preview and machine-readable/AI representation are separate outputs.

A secondary Preview/Contract switch in the output area is preferable to permanently stacking a large visual preview and AI output if vertical space becomes noisy.

### Mobile

Preserve the ability to reach Registry, Editor and Preview without losing the draft.

Do not require saving simply to inspect the preview or move between semantic sections.

---

## 17. UX acceptance criteria

Before any redesigned Components page can replace `main`, manual QA must compare it directly against `main`.

### Required journeys

#### Existing semantic edit

Edit Purpose, an Anatomy item, a Variant description, an Accessibility rule and a Forbidden Pattern.

The V2 journey must be at least as understandable as `main` and must not introduce gratuitous navigation.

#### Button customization

Starting from a Button template, the author can visibly change at least:

- width behavior;
- padding;
- border;
- independent corner radius;
- relevant typography/surface properties;
- Variant/State overrides;
- Token linkage.

Preview feedback is immediate once the draft is valid.

#### Card structure

The author can enable/disable Header and Footer, customize their relevant spacing/surface properties, and see the actual structure in preview.

#### Dialog sizing

The author can set a meaningful width/max-width and relevant panel/backdrop/surface properties and observe them in preview.

#### Create Component

The author can create a first-class Component identity from a template without the old five-type uniqueness restriction acting as the identity model.

### Interaction-cost rule

For every high-frequency existing task, record the approximate interaction sequence on `main` and on V2.

A longer V2 sequence must have a clear compensating benefit. “Because the new architecture has an Inspector” is not a benefit.

---

## 18. Development strategy

The next implementation must not begin by redesigning the entire Components page.

### DS-181R-01 — Domain and persistence contract

No visual redesign.

Define and test:

- arbitrary Component identity;
- template identity separate from Component identity;
- database uniqueness/migration strategy;
- schema versioning/migration for the five current contracts;
- visual property value representation;
- template capability profile representation;
- slots/structure representation;
- base + Variant/Size/State override representation and precedence;
- preservation/migration of custom Token bindings;
- downstream compatibility strategy for Documentation, Accessibility and AI consumers.

Do not make a Prisma migration before the migration/rollback/compatibility behavior is fully specified and tested.

### DS-181R-02 — Template registry and renderer foundation

Still avoid a page rewrite.

Introduce:

- typed template definitions;
- capability profiles;
- defaults for the five existing templates;
- renderer boundary independent from Component identity;
- adapter/migration helpers;
- regression tests proving existing five Components can still be represented.

### DS-181R-03 — Button customization vertical slice

Prove the full authoring model with one simple high-value Component before generalizing.

Required proof:

- visual-property controls;
- token vs explicit values;
- asymmetric radius;
- dimensions/spacing;
- base + overrides;
- live preview;
- unchanged semantic contract editing.

If Button customization does not feel materially better than `main`, stop before scaling the pattern.

### DS-181R-04 — Card structure vertical slice

Prove template-defined optional slots and slot-specific properties with Header / Content / Footer.

### DS-181R-05 — Dialog sizing/overlay vertical slice

Prove width/max-width, overflow and structured overlay concerns without introducing a generic layout builder.

### DS-181R-06 — Components page UX consolidation

Only after the control model has been proven on real Components:

- finalize the page information architecture;
- reduce visual clutter;
- integrate Preview/Contract output ergonomically;
- qualify desktop/tablet/mobile interaction cost;
- preserve all semantic areas.

### DS-181R-07+ — Template library expansion

Expand the curated templates in small groups using the established capability model.

Do not add a template by special-casing a new one-off editor architecture. Add a capability only when multiple real templates justify it or the capability is essential to one strategically important template.

---

## 19. Branch and integration strategy

The rejected prototype branch remains frozen:

```text
refactor/components-workspace-v2
```

After this product-reset documentation is accepted on `main`, create a **new** integration branch from the accepted `main` head, for example:

```text
refactor/components-v2-customization
```

Implementation slices branch from that integration branch and target it with focused PRs.

Do not branch new implementation work from the rejected prototype.

Do not integrate the new V2 to `main` until:

- all non-regression journeys pass;
- customization is materially useful;
- creation is no longer constrained by the old identity enum;
- desktop/mobile QA passes;
- downstream Documentation/Accessibility/AI consumers remain coherent;
- the user explicitly accepts the final product experience.

---

## 20. Definition of success

Components V2 is not complete because a planned slice list is complete.

It is complete when all of the following are true:

1. `main` functionality is preserved or deliberately improved.
2. A user can create a first-class Component from a template.
3. A user can customize a Component materially more deeply than today.
4. Common design properties have immediate visual feedback.
5. Structured Components expose useful optional regions such as Card header/footer.
6. Variants/Sizes/States use understandable inheritance and targeted overrides.
7. Tokens remain central without making one-off constraints impossible.
8. Accessibility, Forbidden Patterns and guidance remain first-class.
9. The preview supports authoring instead of consuming space without purpose.
10. The user judges the resulting Components page to be clearly better than `main` before any integration PR is proposed.
