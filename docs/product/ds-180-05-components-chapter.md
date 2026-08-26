# DS-180-05 — Components chapter

## Status

Implementation slice for Chapter 04 of the accepted Learn curriculum.

This iteration publishes only the Components chapter. It does not redesign the authenticated Components workspace, change the `ComponentContract` domain or persistence model, introduce arbitrary component identities, add freeform authoring or implement the future Components Workspace V2.

## Learning objective

By the end of the chapter, a learner should be able to explain:

1. why a rendered component instance is not the same thing as a reusable component contract;
2. what anatomy contributes beyond a screenshot or implementation tree;
3. the difference between variants, sizes and states;
4. why purpose, usage guidance, content guidance, accessibility and forbidden patterns belong in a component model;
5. how token bindings connect a component contract to shared design decisions;
6. which parts of this model VulcanForgeUI currently implements explicitly;
7. where the current product model remains intentionally narrower than the broader Components vision.

## Pedagogical sequence

The chapter follows this progression:

```text
visible component instance
        ↓
missing rules behind the screenshot
        ↓
component contract
        ↓
anatomy
        ↓
variants / sizes / states
        ↓
purpose / content / accessibility / forbidden patterns
        ↓
token bindings
        ↓
structured downstream consumers
        ↓
current VulcanForgeUI boundary
        ↓
Accessibility
```

The learner first encounters the information a screenshot cannot provide. Terminology is introduced only after that gap is visible.

## Recurring Demo project

The previous chapters established the following chain:

```text
Design System
    ↓
shared decisions
    ↓
Design Tokens
    ↓
stable token identities and references
    ↓
Themes
    ↓
appearance-specific role mappings
```

Chapter 04 adds a reusable component contract to that story.

The current VulcanForgeUI Demo Button is used as the concrete example because it already contains enough structured information to demonstrate the difference between a component and one rendered instance.

A representative instance is expressed as:

```text
Button / primary / md / loading
```

That instance is only one selection from a broader contract.

## Product facts audited for this chapter

### Component contract domain

The current `componentContractSchema` stores:

- `type`;
- `name`;
- localized `purpose`;
- optional localized `usageGuidelines`;
- optional localized `contentGuidelines`;
- lifecycle `status`;
- structured `anatomy`;
- `variants`;
- `sizes`;
- `states`;
- `tokenBindings`;
- structured `accessibility` rules;
- localized `forbiddenPatterns`.

Current lifecycle states are:

```text
draft
ready
deprecated
```

### Anatomy

An anatomy part contains:

- a stable key;
- a localized label;
- a requirement.

Current requirements are:

```text
required
optional
derived
```

The current Demo Button seed defines:

```text
root   → required
label  → required
icon   → required
```

Important teaching boundary:

**The fact that `icon` is currently required is a VulcanForgeUI seed decision, not a universal Design System rule.**

The Learn chapter therefore presents it as current product data rather than prescribing it as general component architecture.

### Variants, sizes and states

The current Demo Button seed defines:

```text
Variants
- primary
- secondary

Sizes
- sm
- md
- lg

States
- focusVisible
- disabled
- loading
```

The chapter keeps these as separate axes.

For example:

```text
loading
```

is taught as a state rather than another Button variant.

This distinction matters because combining every axis into a flat list of component names would make the model harder to understand and maintain.

### Purpose and behavioral rules

The current Demo Button purpose is:

```text
Triggers an important user action.
```

The current seed also contains two critical accessibility rules:

```text
accessible-name
keyboard-activation
```

and one forbidden pattern:

```text
Do not use a button as a navigation link.
```

These are useful examples because they show that a Component contract is not only a styling object.

### Token bindings

The current Button seed contains these bindings:

```text
background
  → color.semantic.action.primary
  → #FF8731

foreground
  → color.primitive.neutral.950
  → #070707

radius
  → radius.md
  → 0.5rem

paddingX
  → spacing.4
  → 1rem
```

A binding stores:

- a binding key;
- an expected token type;
- a direct token path;
- optional localized description.

The resolver looks up the referenced token inside the project's Token Sets and resolves token-to-token references when necessary.

### Critical current Theme / Component boundary

The audit identified an important architectural fact that this chapter must not hide:

**Current Component token bindings do not reference Theme roles.**

Today the flow is:

```text
Component token binding
        ↓
direct tokenPath
        ↓
Token Set dictionary
        ↓
resolved token value
```

It is **not** currently:

```text
Component
   ↓
Theme role
   ↓
active Theme mapping
   ↓
Token Set
```

Chapter 03 used the conceptual statement that Components can consume stable appearance intent while Themes supply appearance-specific decisions. That remains a useful Design System separation of responsibilities, but VulcanForgeUI does not yet implement one unified Theme-role-to-Component binding graph.

This distinction is recorded deliberately because it may become relevant during DS-181 Components Workspace V2 discovery and the later Theme extensibility work.

DS-180-05 does not solve it.

### Current component identities and persistence

Prisma currently defines exactly five first-class component types:

```text
button
textField
card
alert
dialog
```

Persistence enforces:

```text
@@unique([projectId, type])
```

Therefore a project can currently have at most one ComponentContract for each predefined type.

The authenticated Components page can create a missing contract only from the predefined seed types that do not yet exist in the project.

Consequences:

- `SearchBar` is not currently a first-class arbitrary component identity;
- `ProductCard` is not currently a separate arbitrary identity;
- component identity is still coupled to the fixed enum;
- arbitrary creation requires domain and persistence work, not only a new UI control.

The Learn chapter states this boundary explicitly.

### Current Components workspace

The authenticated workspace currently contains:

- a component registry/navigation area;
- a structured editor;
- localized content authoring;
- anatomy authoring;
- variants/sizes/states authoring;
- accessibility rules;
- forbidden patterns;
- visual token bindings;
- a visual component preview;
- an AI contract preview.

The editor is intentionally form-oriented today.

The chapter must not describe this as a freeform Figma-like authoring canvas because that product direction belongs to later Components Workspace V2 discovery.

### Registry completeness

The current registry computes a completeness heuristic from:

- purpose;
- anatomy;
- variants;
- states;
- accessibility;
- forbidden patterns.

It can additionally warn about missing purpose, accessible-name rules and selected critical states.

This heuristic is useful product feedback, but the Learn chapter does not present it as a universal measure of component quality.

## Structured downstream consumers

A major reason to teach Component contracts as structured data is that VulcanForgeUI already reuses them outside the editor.

### Visual preview

The current preview consumes:

- variants;
- sizes;
- states;
- resolved token bindings.

It can also surface missing bindings or invalid Token Set data.

### Markdown documentation

Generated Markdown documentation currently includes, per component:

- status;
- purpose;
- anatomy;
- variants;
- states;
- accessibility rules;
- forbidden patterns.

### AI instructions

The AI-instructions generator consumes Component contracts and explicitly instructs downstream assistants to:

- use only documented Components;
- use only documented variants;
- respect documented accessibility rules;
- respect forbidden patterns;
- not invent component APIs, variants, states, slots or accessibility behavior.

This is an important demonstration of why structured Component meaning matters beyond human-facing documentation.

### Accessibility Center

The Accessibility Center accepts ComponentContract sources alongside Token Set and Theme data.

Component contracts therefore contribute to automated issue discovery rather than living as isolated prose.

Chapter 05 will explain the limits of those automated checks.

## External terminology and behavior baseline

The general component-teaching structure was checked against established current Design System and accessibility guidance.

### Carbon Design System

Current Carbon component documentation commonly separates concepts such as:

- anatomy;
- variants;
- states;
- interactions / behavior.

This supports teaching these as distinct dimensions instead of collapsing them into one visual specification.

Carbon is used only as an external terminology and documentation-pattern reference. VulcanForgeUI does not claim Carbon compatibility.

### W3C WAI-ARIA Authoring Practices

The current WAI-ARIA Authoring Practices Button Pattern reinforces the behavioral examples already present in the VulcanForgeUI Button seed:

- a button performs an action rather than navigation;
- a focused button can be activated with `Space` or `Enter`;
- a button needs an accessible name.

The Learn chapter uses these concepts to explain why accessibility and semantics belong inside the component contract.

Important boundary:

VulcanForgeUI is not described as automatically guaranteeing WAI-ARIA or WCAG conformance. Full implementation behavior still requires manual validation in the delivered product.

## Chapter UI

The chapter adds:

- a screenshot-like Button example followed by the questions the screenshot cannot answer;
- a contract-versus-instance comparison;
- a Button anatomy illustration;
- a variant / size / state comparison using the current Demo seed;
- a selected-instance example;
- purpose, guidance, accessibility and forbidden-pattern cards;
- a token-binding table using current Demo Button bindings;
- an explicit Theme-role / Component-binding architecture boundary callout;
- an accessibility section grounded in the current Button seed;
- a structured-source / downstream-consumer section;
- a current-product boundary section;
- the recurring Demo dependency sequence;
- a misconception callout;
- a learning checkpoint;
- the existing compact curriculum navigation with Chapter 04 current.

The visual explanations must remain understandable without relying on color alone.

## Curriculum publication state

After DS-180-05:

```text
01 Design Systems              published
02 Design Tokens               published
03 Themes                      published
04 Components                  published
05 Accessibility              next
06 Documentation & Delivery    planned
07 AI-ready Design Systems     planned
```

Chapter 05 remains non-interactive until it is actually implemented.

## Localization

The complete chapter is available in English and French.

Technical identifiers such as:

```text
button
textField
focusVisible
color.semantic.action.primary
radius.md
```

remain unchanged across locales when they refer to actual model values or token paths.

Explanatory prose and labels are localized.

EN/FR structural parity is covered by a focused test.

## Non-goals

DS-180-05 does not:

- modify `ComponentContract` persistence;
- add a new Prisma migration;
- replace the fixed `ComponentContractType` enum;
- create arbitrary component identities;
- add SearchBar or ProductCard as new component types;
- add component composition or child-slot relationships;
- add a freeform component canvas;
- redesign the authenticated Components workspace;
- implement Components Workspace V2;
- change token-binding resolution;
- connect Component bindings to Theme roles;
- change generated documentation or AI instruction formats;
- redesign the Accessibility Center;
- publish Chapter 05 Accessibility.

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
- Chapters 01 through 04 are published;
- Accessibility is the only `next` chapter;
- no fake Accessibility href exists;
- EN/FR Components chapter structures match;
- the Demo Button variant / size / state axes match current seed behavior;
- the documented Button token bindings match current product values;
- the five predefined component types remain explicit;
- the direct Token Set binding boundary remains explicit.

## Manual QA

Review:

```text
/en/learn
/fr/learn
/en/learn/components
/fr/learn/components
```

Validate:

1. Chapter 04 is clickable from the Learn hub and marked current on its page.
2. Chapter 05 Accessibility is labelled Up next / Prochainement but remains non-interactive.
3. The opening visual immediately communicates that a screenshot does not define the whole component contract.
4. The contract-versus-instance distinction is understandable to a learner unfamiliar with component-system terminology.
5. Anatomy clearly presents `root`, `label` and `icon` as current Demo seed data, not universal rules.
6. Variant, size and state are visually and conceptually distinct.
7. `loading` is taught as a state rather than another Button variant.
8. The Button token-binding table remains readable on narrow mobile widths.
9. Long token paths wrap without horizontal page overflow.
10. The direct Token Set binding boundary is explicit and does not imply current Theme-role consumption.
11. The accessibility section distinguishes behavior from visual styling.
12. The structured-source section accurately connects Component data to preview, documentation, AI instructions and accessibility analysis.
13. The product boundary clearly states the five predefined types and does not imply arbitrary component creation.
14. Nothing suggests that the future freeform / Figma-like Workspace V2 already exists.
15. Locale switching preserves `/learn/components`.
16. Keyboard focus and curriculum navigation remain usable.
17. There is no horizontal overflow at mobile, tablet or desktop widths.

## Handoff to DS-180-06

Once DS-180-05 is merged and manually qualified, the next small iteration is:

**DS-180-06 — Chapter 05: Accessibility**

That chapter should widen the lens from the component-level rules introduced here to accessibility as a Design System property.

It should cover at minimum:

- contrast relationships;
- focus and keyboard behavior;
- semantics;
- states and status communication;
- automated checks versus manual validation;
- what the current VulcanForgeUI Accessibility Center actually inspects;
- what its score/report cannot prove;
- why the product must not claim accessibility certification.

The Component binding / Theme-role distinction discovered in DS-180-05 should remain recorded as future DS-181 / Theme-extensibility product-design input rather than being opportunistically solved inside Learn.
