# DS-181-01 — Components Workspace V2 interaction model

## Status

Product / interaction-design slice for DS-181 — Components Workspace V2.

This iteration defines the target interaction model before implementation work begins.
It does not modify Prisma, `ComponentContract`, the authenticated Components UI,
preview rendering, persistence, generated documentation, Accessibility or AI
Instructions.

It builds on:

- `ds-181-00-components-product-model-audit.md`;
- `ds-181-00-component-identity-product-intent.md`;
- the current authenticated Components workspace and its existing draft/save
  behavior.

The current five seeded Components remain reference fixtures for concrete examples.
They are not the target registry limit.

---

## 1. Product objective

The Components workspace should let a Design System author understand and edit one
Component contract without forcing them to mentally reconstruct the relationship
between a long form, a detached preview and downstream machine-readable data.

The target interaction model is:

```text
Component navigation
        ↓
selected Component
        ↓
primary visual authoring surface
        ↓
contextual selection
        ↓
Inspector
        ↓
canonical ComponentContract draft
        ↓
validation / explicit save
```

The workspace is not a vector-drawing application.

Its job is to make Component-system intent visible while keeping the structured
contract authoritative.

---

## 2. Core interaction principle: separate three kinds of state

DS-181-01 establishes a strict separation between three concepts.

### 2.1 Selected Component

Exactly one Component contract is the current authoring subject.

Today this is effectively selected by finite `type`. The target interaction model
must not depend on that limitation because arbitrary Component identities are an
accepted DS-181 requirement.

Conceptually:

```text
selectedComponentId
```

must eventually be a stable Component identity independent from template or preview
renderer type.

### 2.2 Authoring selection

The author may focus one structured part of the current contract for editing.

Conceptual selection kinds are:

```text
component
anatomyPart
variantDefinition
sizeDefinition
stateDefinition
tokenBinding
accessibilityRule
forbiddenPattern
```

This is transient workspace UI state. It is not persisted in `ComponentContract`.

The default selection after opening a Component is:

```text
{ kind: component }
```

### 2.3 Preview configuration

The canvas also needs to know which representative instance is currently shown.

Conceptually:

```text
previewConfiguration
├─ variant
├─ size
└─ state
```

This is also transient UI state and is not contract data by itself.

A preview such as:

```text
Button / primary / lg / loading
```

must not automatically mean that the `loading` state definition is selected for
editing.

### Established rule

**Changing the represented instance does not implicitly change the authoring
selection.**

The reverse relationship may be one-way:

- selecting a variant definition for editing may update the represented instance to
  that variant;
- selecting a size definition may update the represented instance to that size;
- selecting a state definition may update the represented instance to that state;
- changing only the preview controls does not pull the Inspector away from the
  entity the author was editing.

This avoids surprising Inspector jumps while the author compares visual outcomes.

---

## 3. Canvas modes are different views of the same contract

The central surface should not try to display every Component concept at once.

DS-181-01 defines three conceptual modes that can be introduced incrementally:

```text
Instance
Anatomy
Matrix
```

They all operate on the same canonical draft and preview configuration.

### 3.1 Instance mode — primary/default

Instance mode is the default authoring surface.

It should show one representative Component instance with compact controls for:

- variant;
- size;
- state.

It should prioritize understanding the current result rather than rendering the
full Cartesian product of all axes.

This is intentionally different from today's always-visible variants × sizes table.
The current matrix remains useful, but it is too dense to be the permanent center of
a visual authoring workspace.

### 3.2 Anatomy mode — introduced by DS-181 visual-anatomy work

Anatomy mode makes structured parts visible and selectable.

The current domain stores flat anatomy parts, not geometry, hierarchy or layout.
Therefore the first anatomy representation must not imply information that does not
exist.

It may use:

- callouts associated with a known preview renderer;
- a layered schematic;
- a selectable part list visually attached to the Component preview.

It must remain useful when exact visual anchoring is impossible.

### 3.3 Matrix mode — introduced by the variants/sizes/states slice

Matrix mode is a controlled comparison browser.

Its purpose is to answer:

- which variant/size combinations are represented;
- which state is currently applied;
- which cell is being inspected;
- which definition is being edited.

The matrix should be a deliberate mode rather than permanent canvas chrome.

---

## 4. Target desktop composition

At wide desktop widths the target responsibility model is:

```text
┌──────────────────┬──────────────────────────────┬──────────────────────┐
│ Components       │ Canvas                       │ Inspector            │
│ navigation       │                              │                      │
│                  │ selected Component instance  │ selected entity      │
│ search           │ axes / modes                 │ properties           │
│ groups           │ anatomy / matrix when active │ guidance / rules     │
│ create           │                              │ tokens / diagnostics │
└──────────────────┴──────────────────────────────┴──────────────────────┘
```

The existing responsive three-area implementation is an asset, but responsibilities
change:

```text
Current
Registry | long structured editor | visual + AI output

V2
Navigation | primary authoring canvas | contextual Inspector
```

### Wide desktop

At `xl`-class widths:

- navigation remains persistent on the left;
- canvas receives the largest flexible region;
- Inspector remains persistent on the right;
- only the region that needs to scroll should scroll;
- save status remains visible without requiring the author to reach the bottom of a
  long form.

Exact pixel widths remain implementation details, but the design should bias toward:

```text
Navigation  compact and dense
Canvas      largest flexible region
Inspector   stable readable property width
```

The Inspector must not grow into another 48rem article column.

---

## 5. Medium desktop / tablet landscape

At widths where three persistent columns make the canvas too narrow:

```text
Navigation | Canvas
                 ↓
             Inspector drawer
```

The left Component navigation may remain persistent while the Inspector becomes a
right-side drawer/sheet.

Rules:

- opening the Inspector must not reset canvas mode or preview configuration;
- closing it must not discard draft edits;
- selecting another canvas entity while the Inspector is open updates the same
  Inspector rather than stacking drawers;
- keyboard focus must move predictably into and out of the Inspector;
- the canvas must remain visible enough to compare changes when viewport width
  allows it.

---

## 6. Mobile interaction model

The current three-tab mobile workspace is functional but should not become the final
V2 mental model merely by renaming tabs.

The preferred small-screen flow is selection-driven:

```text
Component
   ↓
Canvas / Preview
   ↓
Inspect selected entity
   ↓
Back to Canvas
```

### Mobile component switching

The active Component is shown in the workspace header.

A dedicated control opens the Component list as a full-width panel/sheet containing:

- search;
- category grouping;
- Component status;
- create action.

Closing the list returns to the exact previous canvas state.

### Mobile Inspector

The Inspector becomes a full-height or near-full-height focused view.

It must provide a clear back action returning to the canvas while preserving:

- draft state;
- authoring selection;
- preview configuration;
- active locale;
- canvas mode.

The user must never be forced to save merely to move between Canvas and Inspector.

### Mobile save action

Save status/action must remain persistently reachable.

A compact sticky workspace action region is preferable to placing Save at the end of
Inspector content.

---

## 7. Component navigation must scale beyond five fixtures

The navigation model must be designed for a Design System containing dozens or
potentially hundreds of Components.

The current five fixtures are insufficient as a density test.

### Navigation responsibilities

The left region owns:

- Component search/filter;
- Component selection;
- category/group context;
- lifecycle status at a glance;
- create Component;
- empty state;
- optionally a restrained issue/completeness signal later.

It does not own Component property editing.

### Density rule

A navigation row should primarily communicate:

```text
Component name
selection
small lifecycle / problem signal
```

Large textual status badges on every row should be avoided if they materially reduce
scan density. Any compact status representation must still expose an accessible text
label.

### Future identity rule

Navigation must ultimately target a stable Component identity, not preview renderer
strategy and not the current finite enum.

The current URL form:

```text
?component=<type>
```

is a compatibility detail, not the target product identity model.

DS-181-01 does not choose the future URL shape. The later Component-identity slice
must do so together with stable identifiers and rename semantics.

---

## 8. Component-level selection

When the whole Component is selected, the Inspector exposes contract-level concerns.

Primary properties:

- display name;
- lifecycle status;
- localized purpose.

Secondary but first-class concerns:

- usage guidance;
- content guidance;
- accessibility rules;
- forbidden patterns;
- Component-level token bindings and diagnostics where relevant.

Delete belongs to Component-level actions and should not be a canvas interaction.

The Inspector should use progressive disclosure, but accessibility and guidance must
not be relegated to an obscure generic "Advanced" section.

---

## 9. Anatomy selection

Selecting an anatomy part changes the Inspector context to that part.

The Inspector should expose the existing canonical fields:

```text
key
localized label
requirement
```

with requirement:

```text
required
optional
derived
```

### No invented hierarchy

The current model does not express parent/child relationships.

DS-181-01 therefore forbids the first V2 implementation from presenting anatomy as a
persisted tree unless a later domain slice explicitly adds hierarchy.

A renderer-specific visual anchor may exist without changing the canonical anatomy
shape.

### Selection persistence

Switching preview variant, size or state should preserve the selected anatomy part
when that part remains meaningful for the current renderer.

If a renderer cannot visually anchor the selected part, the Inspector selection is
still valid and the schematic/list representation remains available.

---

## 10. Variant, size and state definitions

Variants, sizes and states are definitions in the contract, while the canvas uses
one value from each axis to represent an instance.

These concepts must stay distinct.

### Canvas controls

Instance-mode controls change preview configuration.

For example:

```text
Variant  Primary
Size     Large
State    Loading
```

These controls answer:

> What am I looking at?

They do not answer:

> Which definition am I editing?

### Editing an axis definition

An explicit edit affordance selects the corresponding definition and opens its
Inspector properties:

```text
key
localized label
localized description
```

When a definition is selected for editing, the canvas may synchronize its preview to
that definition so feedback is immediate.

### Stable transient identity

Editing a key must not cause focus/selection to disappear on every keystroke.

The current draft already has transient `draftId` values for variants, sizes, states
and token bindings. V2 should continue using stable client-side draft identities for
selection rather than raw editable keys.

If anatomy/accessibility collections need equivalent selection stability, the
behavior-preserving decomposition slice may add transient draft IDs without changing
persisted schema.

---

## 11. Token-binding interaction

Token bindings belong primarily in the Inspector because they are structured visual
semantics rather than canvas objects.

A binding selection should expose:

- semantic role/key;
- expected token type;
- token path;
- resolved value where available;
- localized description;
- missing/deprecated/type-mismatch diagnostics.

### Recognized vs custom bindings

The Inspector must distinguish:

```text
known preview role
        vs
custom structured binding
```

A custom binding that the current renderer does not understand must not silently look
as though it changed the preview.

The canvas should communicate when a valid stored binding has no current visual
renderer effect.

### Theme boundary

This interaction model does not introduce Theme-role resolution.

Current Component bindings still resolve directly against Token Sets until a later
explicit product/domain decision changes that architecture.

---

## 12. Locale authoring

Locale editing remains a workspace authoring context rather than duplicating English
and French fields everywhere at the same time.

The Inspector should expose a compact active-locale control when the selected entity
contains localized fields.

Switching authoring locale must preserve:

- selected Component;
- authoring selection;
- canvas mode;
- preview configuration;
- unsaved draft state.

Missing translations should be surfaced as diagnostics/indicators rather than by
forcing both language versions to occupy permanent side-by-side form space.

Technical identifiers such as keys and token paths remain locale-independent.

---

## 13. Save model

DS-181-01 keeps **explicit whole-contract save** as the target for the first Workspace
V2 implementation.

The canonical flow remains:

```text
one local Component draft
        ↓
contract validation
        ↓
explicit Save
        ↓
server authorization + schema validation
        ↓
persist complete ComponentContract
```

No autosave is introduced by this slice.

### Global workspace placement

Because edits will be distributed across Canvas and Inspector, Save can no longer be
conceptually owned by the bottom of one long editor column.

The V2 frame should expose workspace-level save status/action in a persistent area.

Preferred behavior:

- desktop: persistent workspace/header action;
- mobile: compact sticky action region;
- same statuses as today: saved, unsaved, saving, error;
- Save disabled when nothing changed or the canonical draft is invalid.

### Save preserves authoring context

A successful save must preserve:

- current Component;
- canvas mode;
- authoring selection where still valid;
- preview configuration;
- scroll/focus context as reasonably possible.

The current save-context utility restores scroll after refresh. It is not an unsaved
navigation guard.

---

## 14. Invalid draft and preview behavior

The existing editor updates the live preview only after a complete draft successfully
parses as `ComponentContract`.

V2 should make that behavior explicit instead of allowing the canvas to appear
mysteriously stale.

### Established rule

When the current draft becomes invalid:

```text
Inspector shows contextual validation
        +
workspace shows invalid save status
        +
Canvas keeps the last valid preview
```

The Canvas should display a restrained notice equivalent to:

> Preview is showing the last valid contract state.

It should not disappear and should not render an invalid pseudo-contract.

Once validation succeeds again, the preview resumes from the current draft.

---

## 15. Unsaved Component switching

The current save-status infrastructure detects dirty state, but the current
Components workspace does not provide a dedicated unsaved-navigation confirmation
flow when choosing another Component.

That becomes unsafe once navigation is a persistent high-frequency part of the V2
workspace.

### Required V2 behavior

If the current Component has unsaved changes and the author attempts to select another
Component, the product must not silently discard the draft.

Offer three explicit outcomes:

```text
Save and switch
Discard and switch
Cancel
```

Rules:

- `Save and switch` proceeds only after successful validation/save;
- invalid drafts cannot use `Save and switch` until corrected;
- `Discard and switch` requires explicit confirmation;
- `Cancel` leaves every workspace state unchanged.

The same protection principle should be considered for leaving the Components route,
project switching and browser unload during the implementation slices.

DS-181-01 specifies the product behavior; it does not implement a new global router
guard.

---

## 16. Create Component interaction contract

The final V2 create flow must not expose templates as the list of allowed Component
identities.

Conceptually:

```text
New Component
        ↓
identity
name / key / category as defined by later domain work
        ↓
starting point
Empty contract / template / existing Component when supported
        ↓
created Component opens in workspace
```

The exact dialog/sheet design is deferred until arbitrary Component identity is
implemented.

During the early V2 frame, the existing finite seed creation flow may remain for
compatibility.

The workspace architecture must not make that temporary limitation harder to remove.

---

## 17. Preview strategy must not control whether a Component can exist

Arbitrary Component identity means not every future Component will necessarily have a
bespoke visual renderer.

The workspace must therefore degrade gracefully.

A Component without a specialized renderer should still support structured authoring
through:

- identity;
- purpose/guidance;
- anatomy schematic/list;
- variants;
- sizes;
- states;
- token bindings;
- accessibility;
- forbidden patterns;
- AI/documentation consumers.

The canvas may show a generic structured representation when a specialized instance
preview is unavailable.

**No preview renderer** must never mean **invalid Component**.

This rule is required to keep Component identity, starting template and preview
strategy genuinely separate.

---

## 18. Inspector information architecture

The Inspector is contextual first, concern-based second.

### Component selected

Suggested grouping:

```text
Overview
Guidance
Accessibility
Forbidden patterns
Visual tokens
Diagnostics
```

### Anatomy part selected

```text
Part
- key
- localized label
- requirement

Related visual semantics
- only when real associations exist
```

### Variant / size / state selected

```text
Definition
- key
- localized label
- localized description

Preview context
- current represented value
```

### Token binding selected

```text
Binding
- role/key
- type
- path
- description
- resolved value
- diagnostics
```

### Collection editing

Adding/removing/reordering definitions remains possible through explicit collection
controls.

The Inspector must not require opening a modal for every simple property edit.

Large semantic text sections may use expandable regions without becoming disconnected
from the selected Component draft.

---

## 19. Workspace header

The V2 workspace needs a stable local header because component identity, canvas state
and save state should remain visible while the Inspector changes context.

Responsibilities:

- current Component name;
- lifecycle status;
- compact category/template/renderer metadata only when useful;
- canvas mode switcher;
- workspace save status/action;
- mobile Component-switch action;
- secondary Component actions through a restrained menu.

The header should not repeat every Inspector field.

Delete belongs in secondary Component actions rather than a permanently dominant
button.

---

## 20. Empty and unsupported states

### No Components

The workspace should present one clear creation path rather than an empty three-pane
shell.

Future wording/flow should distinguish:

```text
Start from template
Create custom Component
```

when the open identity model exists.

### Filter returns no Components

Keep search context visible and provide a clear reset path.

### Malformed stored contract

Continue surfacing project-level warnings and do not fabricate editable canonical
state from malformed JSON.

### Specialized renderer unavailable

Show the generic structured representation described earlier; do not block semantic
contract editing.

### Missing token references

Keep the Component editable and show diagnostics near the relevant binding/canvas
result.

---

## 21. Keyboard and accessibility rules

Workspace V2 must be fully operable without pointer-only interactions.

Minimum rules:

- Component navigation uses normal keyboard-focusable navigation controls;
- canvas modes and preview axes have visible labels and focus states;
- anatomy parts are keyboard-selectable when visual selection is introduced;
- selecting something does not steal focus unpredictably into the Inspector;
- opening a modal/sheet moves and restores focus correctly;
- `Escape` may close an Inspector sheet or menu but must never discard draft edits;
- status, requirement and problem signals do not rely on color alone;
- canvas selection has a non-color indicator;
- Inspector headings/regions expose a coherent semantic hierarchy;
- mobile back navigation remains explicit and screen-reader understandable.

A future `Cmd/Ctrl + S` shortcut is compatible with the explicit-save model but is not
required by DS-181-01.

---

## 22. Interaction behavior on Component change

After a successful Component switch:

```text
selected Component  → new Component
selection           → component
canvas mode         → Instance
preview variant     → deterministic first/default value
preview size        → deterministic first/default value
preview state       → base state
active locale       → preserved workspace preference
Inspector           → Component-level context
```

A later implementation may preserve per-Component canvas context in memory, but this
is an enhancement rather than the initial rule.

Deterministic reset is preferable to leaking another Component's variant/state
selection into the newly selected contract.

---

## 23. Interaction behavior when contract collections change

If the currently selected entity is removed:

- selection falls back to the nearest meaningful parent context;
- for anatomy/variant/size/state/token binding, fallback is the whole Component unless
  a neighboring definition is intentionally selected by the removal control;
- preview configuration falls back deterministically if its selected variant/size/
  state no longer exists;
- draft remains dirty and requires explicit save.

Renaming editable keys should preserve selection through stable transient draft
identity rather than treating the renamed item as a different object.

---

## 24. Relationship to AI preview and generated outputs

The current right-hand Preview area combines visual foundations output and a rich AI
contract preview.

Workspace V2 should not keep the AI textual preview permanently competing with the
primary visual canvas for space.

The structured AI preview remains valuable as a verification/debugging surface, but
it should move to progressive disclosure such as:

- an Output / Contract view;
- a secondary workspace mode;
- a dedicated expandable panel.

DS-181-01 does not remove it and does not reduce its data coverage.

The canonical structured contract remains what powers downstream AI and documentation
surfaces.

---

## 25. Product rules established by DS-181-01

The following are accepted interaction requirements for implementation planning:

1. **Component identity, authoring selection and preview configuration are separate
   workspace states.**
2. **The default center surface shows one representative instance, not a permanent
   full variants × sizes matrix.**
3. **Canvas is a view/editor over `ComponentContract`, never an independent persisted
   drawing model.**
4. **Anatomy may become visual/selectable without pretending the current flat model is
   a hierarchy.**
5. **Preview-axis changes do not automatically change Inspector selection.**
6. **Inspector content is driven primarily by the selected contract entity.**
7. **Explicit whole-contract save remains the first V2 save model.**
8. **Save status/action becomes workspace-level and persistently reachable.**
9. **Invalid drafts keep the last valid canvas result and expose that fact visibly.**
10. **Switching Component with unsaved changes requires an explicit save/discard/cancel
    decision.**
11. **The mobile flow is Canvas-first with Component list and Inspector as focused
    secondary views, not three compressed desktop columns.**
12. **The navigation architecture must scale to many arbitrary Component identities.**
13. **A Component does not require a specialized preview renderer to be valid or
    editable.**
14. **Templates accelerate creation but never define which Component identities are
    allowed.**
15. **AI/text contract output remains available but no longer needs permanent primary
    canvas real estate.**
16. **Current direct Component → Token Set binding behavior remains truthful until a
    later Theme integration decision.**

---

## 26. Implementation-state model for the next engineering slices

The eventual client workspace should be capable of expressing state equivalent to:

```text
ComponentWorkspaceState
├─ selectedComponentIdentity
├─ authoringSelection
│  ├─ component
│  ├─ anatomyPart
│  ├─ variantDefinition
│  ├─ sizeDefinition
│  ├─ stateDefinition
│  ├─ tokenBinding
│  ├─ accessibilityRule
│  └─ forbiddenPattern
├─ previewConfiguration
│  ├─ variant
│  ├─ size
│  └─ state
├─ canvasMode
│  ├─ instance
│  ├─ anatomy
│  └─ matrix
├─ activeLocale
└─ canonicalDraft / validation / save status
```

This is a conceptual interaction contract, not a required TypeScript type name or one
monolithic React state object.

Implementation should separate concerns where appropriate while preserving these
semantics.

---

## 27. What DS-181-02 should prepare

Before the new frame is built, the next engineering/design slice should make the
current editor state portable into the interaction model without changing product
behavior.

At minimum, it should evaluate:

- extracting the canonical draft/validation/save behavior from the long editor layout;
- exposing contract mutations to contextual Inspector sections;
- keeping preview updates driven by the last valid draft;
- introducing stable transient IDs where collection selection needs them;
- making save status/action renderable outside the old editor bottom bar;
- avoiding additional coupling to finite Component `type` because arbitrary identity
  work follows inside DS-181.

The merged DS-181-00 product-intent clarification supersedes the old roadmap reading
that arbitrary Component identity is merely an optional post-V2 concern.

A focused identity/domain slice still belongs after the interaction model and before
Components V2 is considered complete.

---

## 28. Non-goals

DS-181-01 does not:

- change Prisma;
- remove the finite enum yet;
- implement arbitrary Component creation;
- define the final template catalogue;
- implement a new preview renderer architecture;
- add anatomy hierarchy;
- add Component composition;
- add freeform canvas geometry;
- add drag-and-drop layout authoring;
- normalize state semantics;
- connect Component bindings to Theme roles;
- implement autosave;
- implement router-level unsaved-change protection;
- change Documentation or AI output formats;
- redesign Accessibility automation;
- implement the Workspace V2 frame.

---

## 29. Exit criteria

DS-181-01 is complete when implementation can proceed without reopening the following
product questions:

1. what the three workspace regions are responsible for;
2. what is selected versus what is merely being previewed;
3. what the default canvas shows;
4. how anatomy can become visual without inventing hierarchy;
5. how variants/sizes/states drive an instance without hijacking Inspector context;
6. how contextual Inspector sections map to contract data;
7. where save status/action lives conceptually;
8. what happens to the canvas while a draft is invalid;
9. what happens when switching Component with unsaved changes;
10. how mobile Component switching and inspection work;
11. how the workspace remains compatible with many arbitrary Component identities;
12. what happens when no specialized preview renderer exists.

This slice requires documentation review only. No visible application QA is required.
Repository Quality should remain green.

---

## Handoff

After DS-181-01 is accepted, engineering should not immediately rewrite the page in
one PR.

The preferred sequence is:

```text
DS-181-02
behavior-preserving editor/workspace state decomposition
        ↓
focused Component-identity/domain slice
stable arbitrary identities + template/renderer separation
        ↓
Workspace V2 frame
Navigation | Canvas | Inspector
        ↓
visual anatomy authoring
        ↓
variants / sizes / states matrix mode
        ↓
token-binding Inspector
        ↓
accessibility / guidance integration
        ↓
AI / generated-output enrichment audit
        ↓
template-library expansion
```

The exact numbering of the post-DS-181-02 domain and implementation slices may be
normalized in the roadmap after this interaction model is accepted.

The sequencing rule is more important than the number:

> first preserve and expose the canonical editing state, then remove the fixed
> Component-identity limitation, then build richer visual authoring on top of that
> stable model.
