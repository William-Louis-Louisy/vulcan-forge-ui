# DS-181-00 — Components product-model audit

## Status

Discovery / product-model documentation slice for the beginning of DS-181 — Components Workspace V2.

This iteration does not change application behavior. It does not modify Prisma, `ComponentContract`, the authenticated Components UI, preview rendering, persistence, generated documentation, Accessibility or AI Instructions.

Its purpose is to establish the current product truth before DS-181-01 defines a new workspace interaction model.

## Objective

DS-181 aims to evolve Components from a structured contract form toward a more visual authoring workspace while preserving the structured semantics that make the feature useful beyond the editor.

Before choosing a canvas, inspector or selection model, this audit answers five questions:

1. What information does a Component contract actually store today?
2. Which parts are primarily human-authored product semantics, visual configuration, machine-readable contract data or lifecycle metadata?
3. Which current consumers depend on each part of the contract?
4. Which information is already visible in the live preview, and which remains invisible despite being structured?
5. What must DS-181-01 decide before any layout or persistence change is justified?

The target is not to clone a design tool. The target remains:

> make component-system intent visible, editable and machine-readable in the same workspace.

---

## 1. Current persistence boundary

Prisma currently defines exactly five first-class Component types:

```text
button
textField
card
alert
dialog
```

A stored Component has this database shape:

```text
ComponentContract
├─ id
├─ projectId
├─ type        ← finite Prisma enum
├─ name        ← duplicated searchable/display column
├─ contract    ← canonical structured JSON payload
├─ createdAt
└─ updatedAt
```

Persistence enforces:

```text
@@unique([projectId, type])
```

A project can therefore contain at most one persisted contract for each predefined type.

### Consequence

The current product does **not** support arbitrary first-class identities such as:

```text
SearchBar
ProductCard
NavigationItem
```

Creation selects one missing predefined type and initializes it from the corresponding MVP seed. Updating a contract cannot change its persisted type.

This confirms the roadmap distinction:

```text
Components Workspace V2
        ≠
Open arbitrary Component model
```

DS-181 can improve authoring of the current finite contracts without a Prisma migration. Arbitrary component identity remains a separate later domain decision.

### Name duplication

`name` exists both as a top-level Prisma field and inside the JSON contract. The normal update action writes both values together, so the supported editing path keeps them synchronized.

This duplication should be treated as a persistence constraint during Workspace V2. DS-181-01 does not need to solve it, but later data-model work should avoid introducing a second independent naming authority.

---

## 2. Canonical ComponentContract shape

The domain schema currently stores:

```text
ComponentContract
├─ type
├─ name
├─ purpose                 localized
├─ usageGuidelines?        localized
├─ contentGuidelines?      localized
├─ status
├─ anatomy[]
├─ variants[]
├─ sizes[]
├─ states[]
├─ tokenBindings[]
├─ accessibility[]
└─ forbiddenPatterns[]     localized
```

Lifecycle status is:

```text
draft
ready
deprecated
```

### Anatomy

Each structured anatomy part contains:

```text
key
label        localized
requirement  required | optional | derived
```

The schema still accepts legacy string anatomy values and normalizes them to a required part with an English label. This is a compatibility path, not a second desired authoring model.

### Variant, size and state axes

Variants, sizes and states share this structure:

```text
key
label          localized
description?   localized
```

Their keys currently carry more runtime meaning than the schema itself expresses. The schema requires only a non-empty string; preview behavior recognizes conventions such as `primary`, `danger`, `focus`, `disabled`, `loading`, `sm` and `lg` heuristically.

### Token bindings

A binding stores:

```text
key
tokenType
tokenPath
description?   localized
```

The path points directly into project Token Sets. Current Component bindings do not resolve through Theme role mappings.

### Accessibility rules

An accessibility rule stores:

```text
key
description   localized
severity      info | warning | critical
```

These are structured authored expectations. Their free-form descriptions are not executable accessibility tests.

---

## 3. Current authoring model

The editor maintains one complete client-side draft for the selected contract and rebuilds the canonical schema from that draft before saving.

Current section order is:

```text
Metadata
↓
Localized content
↓
Anatomy
↓
Variants / sizes / states
↓
Accessibility
↓
Forbidden patterns
↓
Visual tokens
↓
Sticky save action
```

### Current save contract

The save model is whole-contract and explicit:

```text
full local draft
    ↓
full schema validation
    ↓
JSON payload
    ↓
server action
    ↓
full stored contract update
```

The editor also tracks a deterministic draft fingerprint for saved / unsaved state and refreshes the route after a successful save.

The live preview is updated from the draft only when the complete draft currently passes schema validation.

### DS-181 constraint

Early Workspace V2 work must preserve these guarantees unless a later slice explicitly replaces them:

- one canonical draft;
- explicit validation;
- reliable dirty-state detection;
- existing save context behavior;
- current server authorization;
- full contract schema validation before persistence;
- preview never receiving an invalid canonical contract.

DS-181-02 is the appropriate place to decompose implementation boundaries while preserving this behavior.

---

## 4. Current workspace is already three-panel

The authenticated Components page already composes three responsibilities:

```text
Registry | Editor | Preview
```

At extra-large desktop widths the frame is approximately:

```text
16rem | editor up to 48rem | preview ≥ 24rem
```

At large widths the Registry stays alongside the content while Editor and Preview stack in the second column. Below large widths, the page becomes a three-tab workspace:

```text
Registry | Editor | Preview
```

with Editor selected initially.

### Product implication

The roadmap's candidate model:

```text
Component navigation | Canvas / Preview | Inspector
```

must not be interpreted as “build a three-column layout”. That structural foundation largely exists already.

The actual DS-181 problem is a **responsibility inversion**:

```text
Current
Navigation | long structured form | visual / AI outputs

Candidate V2
Navigation | primary visual authoring surface | focused contextual inspector
```

DS-181-01 must therefore define selection, editing and information hierarchy before DS-181-03 changes the frame.

---

## 5. Current registry and identity model

The registry derives presentation metadata from the persisted type:

| Type | Derived category | Platforms |
| --- | --- | --- |
| `button` | action | web, mobile |
| `textField` | input | web, mobile |
| `card` | layout | web, mobile |
| `alert` | feedback | web, mobile |
| `dialog` | overlay | web, mobile |

Category and platform are **not** editable ComponentContract fields today.

The left navigation currently provides:

- category grouping;
- text filtering;
- creation from remaining seed types;
- component name;
- lifecycle status;
- selected state through `aria-current`;
- selection encoded by `?component=<type>`.

Selection is therefore type-based rather than arbitrary component-ID-based from a product-navigation perspective.

This is sufficient for the finite registry and should remain so during the first Workspace V2 slices unless the open component model is deliberately brought forward later.

---

## 6. Field-to-consumer audit

The table below distinguishes what the product **stores** from what it actually **uses today**.

Legend:

```text
● direct consumer
◐ partial / derived / heuristic consumer
— not currently consumed in that surface
```

| Contract field | Current editor | Visual preview | Component AI preview | Markdown docs | Global AI Instructions | Accessibility automation | Registry completeness |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| `type` | ◐ immutable identity | ● renderer choice | ◐ source identity | ◐ source identity | ◐ source identity | ● rule scope | ◐ derived category |
| `name` | ● | ● visible sample text | ● heading | ● heading | ● heading | ● issue metadata | ● navigation |
| `status` | ● | — | ◐ component wrapper data | ● | ● | — | ● navigation |
| `purpose` | ● | — | ● | ● | ● | ● localization | ● |
| `usageGuidelines` | ● | — | ● | — | — | — | — |
| `contentGuidelines` | ● | — | ● | — | — | — | — |
| `anatomy.key` | ● | — | ● | ● | ● | ◐ source identity | ● |
| `anatomy.label` | ● | — | — | — | — | ● localization | — |
| `anatomy.requirement` | ● | — | — | — | — | — | — |
| `variants.key` | ● | ● heuristic visual axis | ● | ● | ● | ◐ localization container | ● |
| `variants.label` | ● | ◐ tooltip/label resolution | — | — | — | ● localization | — |
| `variants.description` | ● | — | — | — | — | — | — |
| `sizes.key` | ● | ● heuristic visual axis | ● | — | — | ◐ localization container | — |
| `sizes.label` | ● | ◐ tooltip/label resolution | — | — | — | ● localization | — |
| `sizes.description` | ● | — | — | — | — | — | — |
| `states.key` | ● | ● heuristic state behavior | ● | ● | ● | ● `focusVisible` semantics | ● |
| `states.label` | ● | ● state selector label | — | — | — | ● localization | — |
| `states.description` | ● | — | — | — | — | — | — |
| `tokenBindings.key` | ● | ● known visual roles / Alert tones | ● | — | — | ● issue metadata | — |
| `tokenBindings.tokenType` | ● | ● resolution guard | ◐ indirectly | — | — | ● mismatch checks | — |
| `tokenBindings.tokenPath` | ● | ● resolved value | ● | — | — | ● missing binding checks | — |
| `tokenBindings.description` | ● | — | — | — | — | — | — |
| `accessibility` | ● | — | ● | ● | ● dedicated section | ● presence rule | ● |
| `forbiddenPatterns` | ● | — | ● | ● | ● dedicated section | — | ● |

### Important conclusion

The Component contract is already richer than its visual representation.

The strongest examples are:

- anatomy is structured but currently invisible in the visual preview;
- localized descriptions are extensively authorable but many are not surfaced downstream;
- usage/content guidance exists and is used by the local Component AI preview, but not by generated Markdown or the global AI component-rules section;
- sizes materially affect the visual preview and are localization-audited, but are absent from current Markdown component output, global AI component rules and registry completeness;
- token bindings materially affect preview and accessibility diagnostics, but are absent from current Markdown component output and global AI component rules.

DS-181 must not infer that a field is unimportant merely because today's preview does not render it.

---

## 7. What the current visual preview actually understands

The visual preview is not a generic renderer of arbitrary Component semantics.

It directly uses:

- Component type to choose one of five hard-coded preview renderers;
- `name` as visible sample content in some renderers;
- variants as a matrix axis;
- sizes as a matrix axis;
- states through a state selector;
- resolved token bindings;
- semantic project color tokens for selected action/status fallbacks.

### Key-based heuristics

Current behavior interprets strings conventionally.

Examples:

```text
state contains "disabled" → disabled treatment
state contains "focus"    → focus treatment
state contains "error" or "invalid" → error treatment
state contains "loading"  → loading treatment
state contains "hover"    → hover treatment
state contains "active"   → active treatment
```

Size keys similarly map heuristically:

```text
xs / sm / small / compact → small
lg / xl / large          → large
anything else            → medium
```

Alert tone is inferred from variant-key words such as `danger`, `success` and `warning`. Interactive Card behavior is inferred from words such as `interactive`, `action` or `clickable`.

### Product consequence

A free-form key accepted by the schema does not automatically have visual meaning.

For example, adding a state named:

```text
busyWaiting
```

is structurally legal, but today's preview will not infer that it should look or behave like `loading`.

DS-181-01 must therefore choose between two honest directions:

1. keep the preview intentionally representative and convention-based; or
2. later enrich the domain with explicit semantic metadata that a renderer can understand.

It must not create an illusion that arbitrary strings already define arbitrary visual behavior.

---

## 8. Token-binding boundary

Component bindings currently resolve directly against the project's Token Sets:

```text
Component binding
      ↓
tokenPath
      ↓
Token dictionary
      ↓
resolved token value
```

They do not currently resolve through Theme roles.

The preview recognizes these standard visual binding roles:

```text
background → color
foreground → color
border     → color
radius     → radius
padding    → spacing
paddingX   → spacing
paddingY   → spacing
duration   → motion
motion     → motion
```

It also recognizes Alert binding keys matching:

```text
info
success
warning
danger
```

The editor can store a custom binding key, but custom keys that are not recognized by the preview can remain visually inert while still existing as structured contract data.

### V2 implication

The inspector must distinguish clearly between:

- a binding that drives a known preview role;
- a custom structured binding that the current renderer does not understand.

A canvas must not silently imply that every custom binding affects the rendered sample.

The Theme-role / Component-binding architectural boundary remains deliberately unresolved for later product design; DS-181-00 does not change it.

---

## 9. Downstream semantic value

### 9.1 Component AI contract preview

The preview shown directly inside the Components workspace is currently the richest textual consumer of a selected contract. It uses:

- purpose;
- usage guidance;
- content guidance;
- anatomy keys;
- variant keys;
- size keys;
- state keys;
- token binding key → path relationships;
- accessibility descriptions and severity;
- forbidden patterns.

It also explicitly reports missing source categories.

This is strong evidence that fields which are not visual can still be high-value Component-system data.

### 9.2 Generated Markdown documentation

Current Markdown output includes per Component:

- name;
- status;
- localized purpose;
- anatomy keys;
- variant keys;
- state keys;
- localized accessibility rules and severity;
- localized forbidden patterns.

It currently omits:

- usage guidance;
- content guidance;
- sizes;
- token bindings;
- localized anatomy/variant/size/state labels and descriptions.

This is a consumer-coverage gap, not evidence that those fields should be removed from the model.

### 9.3 Global AI Instructions

The global `componentRules` section currently includes:

- name;
- status;
- localized purpose;
- anatomy keys;
- variant keys;
- state keys.

Accessibility rules and forbidden patterns are emitted in their own optional AI Instructions sections.

The global generator currently does not include Component sizes, Component token bindings, usage guidance, content guidance or collection descriptions in its component rules.

Again, the local Component AI preview is currently richer than this generated global consumer.

### 9.4 Accessibility automation

Accessibility automation consumes Component contracts to detect, among other things:

- malformed contracts;
- missing localization for purpose, anatomy labels, variant labels, size labels and state labels;
- missing accessibility rules on selected interactive types;
- missing `focusVisible` state on `button`, `textField` and `dialog`;
- unresolved Component token bindings;
- Component/token type mismatches.

Custom accessibility-rule text itself is not executed as an automated WCAG test. The structured rules remain authored requirements that downstream humans/tools can consume.

---

## 10. Current completeness heuristic is not the canonical contract

The registry completeness score currently checks six field groups:

```text
purpose
anatomy
variants
states
accessibility
forbiddenPatterns
```

It does not currently score:

```text
usageGuidelines
contentGuidelines
sizes
tokenBindings
```

It also emits warnings for:

- missing localized purpose;
- missing accessible-name rule on selected interactive types;
- missing selected “critical” states.

### Semantic drift discovered by this audit

There are currently two different state heuristics:

**Registry completeness** expects:

```text
Button    → disabled, focus, hover
TextField → focus, disabled, error
Dialog    → open, focus, dismissed
```

while **Accessibility automation** explicitly expects a normalized:

```text
focusVisible
```

for `button`, `textField` and `dialog`.

The MVP seeds also use a mixture of keys such as:

```text
focus
focusVisible
invalid
closed
loading
```

Therefore “critical state completeness” and “accessibility focus state” are not currently driven by one canonical semantic state vocabulary.

DS-181-00 records this as domain/product drift. It does **not** opportunistically change the heuristics because doing so could alter existing product scores and warnings.

A later focused slice should decide whether state semantics remain convention-based or gain explicit normalized meaning.

---

## 11. Current seed reality

The finite MVP registry provides different amounts of visual configuration across the five seeded contracts.

### Button

```text
variants     primary, secondary
sizes        sm, md, lg
states       focusVisible, disabled, loading
token roles  background, foreground, radius, paddingX
```

It also contains two critical accessibility rules and a navigation-link forbidden pattern.

### TextField

```text
variant      default
sizes        sm, md, lg
states       focus, focusVisible, invalid, disabled
token roles  none
```

### Card

```text
variants     default, interactive
sizes        sm, md, lg
states       none
token roles  none
```

### Alert

```text
variants     info, success, warning, danger
sizes        sm, md, lg
states       none
token roles  info, success, warning, danger
```

### Dialog

```text
variants     default, danger
sizes        sm, md, lg
states       open, closed, focusVisible
token roles  none
```

The optional `usageGuidelines` and `contentGuidelines` fields are supported by the schema/editor but are not populated by these current MVP seeds.

### Consequence for V2 design

The future workspace must work well with contracts whose axes and visual bindings have very different densities. It must not be designed only around the relatively rich Button example.

---

## 12. Human-facing vs machine-oriented information

The distinction is not binary. Several fields serve both people and machines.

### Immediately understandable / high-frequency human concepts

Likely primary concepts:

```text
name
status
anatomy
variants
sizes
states
```

These map naturally to selecting a Component and understanding what forms it can take.

### Human-authored semantic guidance

Important but less suited to permanent canvas chrome:

```text
purpose
usageGuidelines
contentGuidelines
accessibility rules
forbidden patterns
```

These should remain easy to discover and edit, but they describe intent/behavior rather than geometry.

### Technical bindings / implementation contract

```text
token binding key
token type
token path
custom binding role
```

These are meaningful to Design System authors and downstream tooling, but are more appropriate to focused inspector controls than to the canvas itself.

### Machine-oriented identifiers

Stable keys for anatomy, variants, sizes, states and accessibility rules are necessary for structured downstream consumption even when users primarily think in localized labels.

V2 should avoid forcing users to stare at raw identifiers continuously, but must not hide or auto-rewrite them in ways that make the machine contract unpredictable.

---

## 13. Proposed responsibility map for DS-181-01 to validate

This is a discovery output, not final UI approval.

### Component navigation

Primary responsibilities should probably remain:

- component selection;
- grouping/filtering;
- lifecycle status at a glance;
- create/delete at the component level;
- potentially a restrained completeness/problem indicator if it proves useful.

The registry should not become a second inspector.

### Canvas / visual authoring surface

Strong candidates for first-class visible representation:

- rendered Component instance;
- variant selection;
- size selection;
- state selection;
- resolved visual token effects;
- anatomy, because it is a core structured concept currently missing from the visual representation.

The canvas should show **relationships and outcomes**, not become the canonical persistence model itself.

### Inspector

Strong candidates for contextual editing:

- selected Component metadata (`name`, `status`);
- selected anatomy part (`key`, localized label, requirement);
- selected variant / size / state (`key`, localized label, description);
- selected token binding (`role/key`, expected type, token path, description);
- semantic guidance sections;
- accessibility rule editing;
- forbidden patterns.

A selected canvas object/axis should determine which inspector controls are immediately relevant.

### Progressive disclosure

Good candidates for secondary disclosure rather than permanent primary controls:

- alternate-locale copy;
- descriptions for every variant/size/state;
- usage/content guidance;
- full accessibility-rule detail;
- forbidden-pattern detail;
- custom token role configuration;
- raw token path/type diagnostics;
- missing localization and completeness diagnostics.

“Progressive disclosure” must not mean burying accessibility or semantics in an obscure advanced modal. These areas remain core contract data; they simply do not all need to occupy the primary canvas simultaneously.

---

## 14. Anatomy is the clearest V2 opportunity

The Learn Components chapter deliberately taught anatomy as information that a screenshot cannot express reliably.

Current product reality creates a useful tension:

```text
Anatomy is structured and editable
        ↓
but
        ↓
Anatomy is absent from the visual preview
```

This makes anatomy a strong candidate for the first genuinely visual authoring improvement after the workspace interaction model is agreed.

However, the current domain does **not** store:

- geometry;
- coordinates;
- parent/child hierarchy;
- slot nesting;
- layout constraints;
- freeform canvas positions.

Therefore “visual anatomy authoring” should initially mean making the existing anatomy contract visible and selectable around a representative Component preview, not pretending the current data can reconstruct a Figma node tree.

A hierarchy/composition model would require a later explicit domain decision.

---

## 15. Product gaps and constraints to carry forward

### A. Fixed Component identity

The enum + `[projectId, type]` uniqueness is the current boundary. Do not let a redesigned create button imply arbitrary Component creation before the domain supports it.

### B. Visual semantics are heuristic

Variant/state/size key strings drive preview behavior through conventions, not explicit semantic metadata.

### C. Anatomy is structurally rich but visually absent

This is a major mismatch between the current mental model and authoring experience.

### D. Authored descriptions have uneven downstream value today

Localized labels/descriptions are editable, but several downstream consumers use only stable keys.

### E. Usage/content guidance is under-consumed

These fields exist and are authorable, but current seeds leave them blank and current Markdown/global AI component rules omit them.

### F. Sizes are more important than current completeness/generation suggests

Sizes drive visual output and localization checks, yet are omitted by current completeness, Markdown component output and global AI component rules.

### G. Token bindings are visually/systemically important but unevenly surfaced

They drive preview and Accessibility diagnostics, but current generated component documentation/global AI component rules do not include them.

### H. Custom accessibility rules are requirements, not executable tests

The UI must preserve this distinction when making accessibility more visual.

### I. State semantics are not canonicalized

Completeness, Accessibility and preview each interpret keys differently.

### J. Lifecycle status is metadata, not a current consumer gate

A `deprecated` valid Component is still part of the registry/canonical source and can appear in generated consumers. Status communicates lifecycle intent; it does not currently remove a contract from downstream generation.

### K. Component visual tokens bypass Themes

Current token bindings resolve directly from Token Sets. Workspace V2 must not visually imply a Theme-role dependency that does not exist.

### L. Existing three-panel responsive foundation should be reused where possible

The largest V2 value is changing responsibility and interaction, not gratuitously replacing a qualified responsive shell.

---

## 16. Decisions established by DS-181-00

The following decisions are sufficiently supported by current product behavior to carry into DS-181-01:

1. **No Prisma migration is required to begin Workspace V2.** The first workspace evolution can operate on the existing five contract types.
2. **The canonical source remains `ComponentContract`.** A canvas is a view/editor over that structure, not an independent saved representation.
3. **The existing whole-contract save semantics are a protected behavior for the early V2 slices.**
4. **The existing responsive three-panel foundation is an asset, not disposable scaffolding.**
5. **Anatomy should be treated as a leading visual-authoring candidate because it is core structured data currently absent from preview.**
6. **The inspector should edit canonical semantic properties; it should not become a second full-page form permanently showing every field.**
7. **Current key-based preview heuristics must be visible as a limitation in interaction design.** Do not promise arbitrary visual semantics without domain support.
8. **Open arbitrary Component identities remain outside the initial Workspace V2 slices.**
9. **Theme-role binding remains outside DS-181-00.** Existing direct Token Set resolution is preserved.
10. **Accessibility, Documentation and AI consumers constrain what can safely be removed or renamed.** Visual simplification must not erase structured contract meaning.

---

## 17. Questions intentionally deferred to DS-181-01

DS-181-01 must make explicit product/interaction decisions for:

### Selection model

What can be selected?

```text
Component
anatomy part
variant
size
state
token-bound visual role
```

Can only one kind of entity be selected at a time? Which selection survives switching preview instances?

### Canvas purpose

Is the center surface primarily:

- an instance preview;
- an anatomy visualizer;
- a variant/state matrix;
- or a mode-switchable combination of these?

Trying to display all three simultaneously may recreate the current density problem in a different shape.

### Inspector responsibility

Should the inspector be organized by:

- selected entity;
- concern tabs such as Content / Visual / Accessibility;
- or a hybrid model?

### Variant / size / state navigation

Does changing an axis merely change the represented instance, or does it also select the axis definition for editing?

These are related but different actions and should not be conflated accidentally.

### Anatomy representation

How can required / optional / derived parts be visible without implying stored layout hierarchy that does not exist?

### Locale editing

Should locale remain a workspace-global editing context, or become local to text-heavy inspector sections?

### Save model

How should explicit save, unsaved navigation protection and validation feedback work when edits are distributed across navigation/canvas/inspector?

The default assumption remains preserving the existing whole-contract explicit save until evidence supports changing it.

### Mobile

The existing tab model is functional, but a selection-driven inspector may need a different small-screen flow such as:

```text
Component → Preview → Inspect selection → Back to preview
```

DS-181-01 must define this deliberately rather than shrinking the desktop canvas.

---

## 18. Non-goals

DS-181-00 does not:

- change `ComponentContract`;
- change Prisma;
- change the five Component types;
- introduce arbitrary Component identities;
- add composition/children/slot hierarchy;
- add canvas geometry or persistence;
- change current token-binding semantics;
- connect Component bindings to Theme roles;
- change registry completeness scoring;
- normalize state semantics;
- change Accessibility rules;
- expand Markdown output;
- expand global AI Instructions output;
- redesign or refactor the Components UI;
- change save behavior;
- implement DS-181-01 interaction decisions.

---

## 19. Exit criteria

DS-181-00 is complete when we can answer, without inspecting code again:

1. what a Component contract stores;
2. what the current editor allows users to change;
3. what the current visual preview actually understands;
4. which fields are reused by Documentation, AI and Accessibility;
5. which current fields are under-consumed rather than unnecessary;
6. why the existing three-panel workspace is a foundation rather than the final V2 interaction model;
7. which domain constraints make a fully freeform canvas dishonest today;
8. what product decisions DS-181-01 must resolve before implementation.

No visible application QA is required because this slice is documentation-only. Repository Quality should still pass to ensure the branch remains integration-safe.

---

## Handoff to DS-181-01

The next focused iteration is:

**DS-181-01 — Workspace interaction model**

It should produce an implementation-ready interaction specification for desktop and mobile, grounded in this audit.

The central question is no longer:

> Should Components have three areas?

The product already does.

The useful question is:

> When a user is authoring one Component contract, what should they see, select and edit in the visual surface, and what should move into a contextual inspector without weakening the structured contract?

DS-181-01 should answer that question before DS-181-02 decomposes the current editor or DS-181-03 changes the workspace frame.