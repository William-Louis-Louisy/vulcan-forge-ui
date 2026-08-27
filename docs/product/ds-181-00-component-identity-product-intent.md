# DS-181-00 — Component identity product-intent clarification

## Status

Accepted product-intent clarification for DS-181 — Components Workspace V2.

This document does not change application behavior. It records the intended Components product boundary so the current five seeded Component types are not mistaken for the target scope of Workspace V2.

It supersedes any interpretation of the DS-181-00 audit that treats arbitrary Component identities as outside DS-181 as a whole.

## Product intent

The current seeded Components:

```text
button
textField
card
alert
dialog
```

were designed as examples demonstrating what users can model with VulcanForgeUI. They were never intended to define the exhaustive set of Components that a project may contain.

The target product must allow a team to represent the complete Component inventory of the UI product on which it works, including product-specific identities such as:

```text
SearchBar
ProductCard
ProfileCard
CheckoutSummary
PlaylistRow
NavigationItem
```

VulcanForgeUI should therefore distinguish three concepts that are partially conflated today:

```text
Component identity
        ≠
starting template
        ≠
preview strategy / renderer
```

A Component identity belongs to the user's Design System. VulcanForgeUI should not require every valid Component name to exist in a hard-coded application enum.

## Accepted direction

### 1. Arbitrary Component identities are a DS-181 objective

Components Workspace V2 is not complete if users remain permanently restricted to one `button`, one `textField`, one `card`, one `alert` and one `dialog` per project.

The current enum and `[projectId, type]` uniqueness constraint remain the present implementation boundary, but they are not the target product model.

DS-181 should include a focused domain/persistence slice that separates Component identity from the finite renderer/template type once the interaction model has clarified what the canvas needs to represent.

### 2. The five current Components remain reference fixtures

The existing five seeds remain valuable during early Workspace V2 work because together they exercise different kinds of Component behavior:

```text
Button    → action, variants, states, token bindings
TextField → input, labels, validation/error state
Card      → structural/container behavior
Alert     → semantic variants/status colors
Dialog    → overlay and focus-management behavior
```

They should be used to design and validate the workspace interaction model, not presented as the complete authoring catalogue.

### 3. Templates are accelerators, not permissions

VulcanForgeUI should offer a library of starting templates so users are not forced to model every common UI primitive from an empty contract.

Representative template families may eventually include:

```text
Actions
- Button
- Icon Button
- Link
- Split Button

Inputs
- Text Field
- Text Area
- Checkbox
- Radio
- Switch
- Select
- Search Field

Navigation
- Tabs
- Breadcrumb
- Pagination

Feedback
- Alert
- Badge
- Toast
- Progress

Overlays
- Dialog
- Drawer
- Popover
- Tooltip

Layout / content
- Card
- Accordion
- Table
```

The exact catalogue is not fixed by DS-181-00. The important rule is:

> a template helps initialize a Component contract; it does not define whether that Component identity is allowed to exist.

The product must also support a custom Component path.

A future creation flow could therefore express concepts such as:

```text
+ New Component

Name: ProductCard
Category: Layout
Start from:
○ Empty contract
○ Card template
○ Existing Component
```

This is a product direction, not an approved DS-181-01 UI.

## Identity versus preview strategy

The current implementation uses Component `type` both as identity and as a switch for one of five hard-coded preview renderers.

Workspace V2 should eventually separate these responsibilities.

A conceptual target is:

```text
Component
├─ id
├─ key / slug
├─ name
├─ category
├─ status
├─ purpose / guidance
├─ anatomy
├─ variants
├─ sizes
├─ states
├─ token bindings
├─ accessibility
├─ forbidden patterns
└─ preview strategy
```

with preview strategy represented independently, for example:

```text
button
textField
card
alert
dialog
generic / custom
```

This would allow a Component such as `SearchBar` or `ProductCard` to exist as a first-class contract without requiring `searchBar` or `productCard` to become hard-coded application enum values merely to establish identity.

The exact future schema remains intentionally undecided in DS-181-00.

## Why the domain migration should follow DS-181-01

Arbitrary identity belongs to DS-181, but changing persistence before the interaction model is defined would be premature.

The future visual authoring model could interpret anatomy at several levels of richness:

```text
A. flat structured parts

root
media
body
actions
```

or:

```text
B. hierarchy

root
├─ media
├─ body
│  ├─ title
│  └─ price
└─ actions
```

or, in a later composition model:

```text
C. Component composition

Card
├─ Image
├─ Text
├─ Badge
└─ Button
```

Those possibilities imply different domain structures. DS-181-01 should first decide what the initial canvas and inspector honestly represent.

The accepted sequence is therefore:

```text
DS-181-00
Current-model audit + product-intent clarification
        ↓
DS-181-01
Workspace interaction model
selection / canvas / inspector / anatomy / axes / mobile
        ↓
Focused DS-181 domain slice
separate arbitrary Component identity from template / renderer assumptions
        ↓
Workspace implementation slices
        ↓
Template-library expansion
        ↓
Later composition work when justified
```

The sequencing means "do not migrate yet", not "keep five Components as the V2 product limit".

## Boundaries still deferred

This clarification does not yet decide:

- the exact Prisma replacement for the current enum and unique constraint;
- whether category becomes persisted metadata;
- the final template catalogue;
- whether templates are versioned;
- whether users can create/share custom templates;
- whether an arbitrary Component uses a generic preview, a selected preview archetype or no visual renderer initially;
- Component composition / child relationships;
- anatomy hierarchy;
- canvas geometry;
- source-code import or synchronization;
- Theme-role integration.

Those questions must be solved in focused slices rather than bundled into one migration.

## Decision carried into DS-181-01

DS-181-01 must design the workspace with this product target in mind:

> The five current Components are reference examples and starting templates. The workspace architecture must not bake the assumption that a Design System can contain only those five identities.

The interaction model may use the current five fixtures for concrete prototypes, but navigation, selection, canvas and inspector decisions should remain compatible with a future project containing dozens of arbitrary Component contracts.
