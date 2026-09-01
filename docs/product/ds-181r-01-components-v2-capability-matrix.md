# DS-181R-01 — Components V2 capability matrix

## Status

Product/domain preparation for the reset Components V2 direction defined in `ds-181r-00-components-v2-product-reset.md`.

This document converts the research corpus and clarified product expectations into an implementation-oriented capability model.

It is **not** a Tailwind Plus component catalogue and does not reproduce Tailwind Plus source/designs. The private corpus is used only as an aggregate benchmark of recurring component structure and behavior.

---

## 1. Reading the matrix

Symbols:

```text
●  first-class capability for this template family
◐  supported in a constrained/template-specific form
—  not normally meaningful; do not expose by default
```

A capability being supported does not mean every control is always visible. Template profiles should drive progressive disclosure.

The product should prefer:

```text
simple common control
        ↓
expand for finer control when needed
```

Examples:

- one Radius control by default, with “unlink corners” for asymmetric values;
- one Padding control by default, with per-axis/per-side expansion;
- Token selector first, explicit value as a deliberate alternative.

---

## 2. Cross-cutting contract capabilities

These concerns apply to every first-class Component regardless of visual template:

| Capability | Requirement |
| --- | --- |
| Stable Component identity | Required |
| Display name | Required |
| Category | Required/derived by creation model |
| Template identity | Required for template-backed Components |
| Lifecycle status | Required (`draft`, `ready`, `deprecated`) |
| Localized Purpose | Preserve |
| Localized Usage Guidelines | Preserve |
| Localized Content Guidelines | Preserve |
| Anatomy semantics | Preserve/evolve without losing downstream meaning |
| Variants | Preserve, with visual overrides when applicable |
| Sizes | Preserve, with visual overrides when applicable |
| States | Preserve, with visual overrides when applicable |
| Accessibility contract | Preserve as first-class authored data |
| Forbidden Patterns | Preserve as first-class authored data |
| Token relationships | Preserve and integrate with first-class visual properties |
| Explicit validation/save | Preserve initially |
| Documentation consumption | Preserve/update through migration |
| Accessibility analysis consumption | Preserve/update through migration |
| AI Instructions / Component AI output | Preserve/update through migration |

---

## 3. Visual capability groups

### Dimensions

```text
width
minWidth
maxWidth
height
minHeight
maxHeight
```

### Spacing

```text
padding
paddingX
paddingY
paddingTop
paddingRight
paddingBottom
paddingLeft
gap
```

### Border

```text
borderWidth
borderTopWidth
borderRightWidth
borderBottomWidth
borderLeftWidth
borderStyle
borderColor
```

### Radius

```text
radius
radiusTopLeft
radiusTopRight
radiusBottomRight
radiusBottomLeft
```

### Surface

```text
background
foreground
elevation
```

### Typography

Potential typed controls:

```text
typography token
fontFamily
fontSize
fontWeight
lineHeight
letterSpacing
textAlign
```

The final UI should expose only template/slot-relevant controls.

### Layout

Curated structured controls:

```text
direction
alignment
justification
wrap
gap
```

General arbitrary nesting is outside the current scope.

### Overflow

Curated values where necessary:

```text
visible
clip
auto
```

### State/interaction styling

Visual overrides may be attached to declared States such as:

```text
hover
focusVisible
active
disabled
loading
invalid
```

Do not infer semantic behavior from arbitrary string matching in the final model. State behavior/meaning should become explicit enough for the renderer to act deterministically.

---

## 4. Template capability matrix

| Template | Dimensions | Spacing | Border / radius | Surface | Typography | Layout | Slots / structure | Interactive/state styling | Special concern |
| --- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | --- |
| Button | ◐ | ● | ● | ● | ● | ● | ◐ | ● | icon/loading positions |
| TextField | ● | ● | ● | ● | ● | ● | ● | ● | adornments, help/error |
| Textarea | ● | ● | ● | ● | ● | ◐ | ● | ● | resize/height/aux actions |
| Checkbox | ◐ | ◐ | ● | ● | ● | ● | ● | ● | checked/indeterminate/disabled |
| RadioGroup | ● | ● | ● | ● | ● | ● | ● | ● | option collection/selection |
| Select | ● | ● | ● | ● | ● | ● | ● | ● | trigger/list/options |
| Combobox | ● | ● | ● | ● | ● | ● | ● | ● | query/list/options/focus |
| Switch | ◐ | ◐ | ● | ● | ● | ● | ● | ● | checked/disabled |
| Badge | ◐ | ● | ● | ● | ● | ● | ● | ◐ | dot/icon/remove action |
| Avatar | ● | ◐ | ● | ● | ◐ | ◐ | ● | ◐ | image/fallback/status |
| Divider | ● | ● | ◐ | ● | ● | ● | ● | ◐ | label/icon/action variants |
| Card | ● | ● | ● | ● | ● | ● | ● | ◐ | header/content/footer |
| Alert | ● | ● | ● | ● | ● | ● | ● | ● | tone/icon/actions/dismiss |
| Dialog | ● | ● | ● | ● | ● | ● | ● | ● | backdrop/panel/focus/scroll |
| Drawer | ● | ● | ● | ● | ● | ● | ● | ● | side/width/backdrop/sticky footer |
| Tabs | ● | ● | ● | ● | ● | ● | ● | ● | tab list/tab/panel/selection |
| Dropdown | ● | ● | ● | ● | ● | ● | ● | ● | trigger/menu/item/focus |

---

## 5. Template structural profiles

The following shapes are **VulcanForgeUI product abstractions**, not copies of benchmark implementations.

### Button

```text
Button
├─ LeadingIcon?       optional
├─ Label              required
├─ TrailingIcon?      optional
└─ LoadingIndicator?  conditional/state-driven
```

Primary capability emphasis:

- padding/gap;
- radius, including independent corners;
- border;
- surface/foreground;
- typography;
- height/min-height;
- width mode (`auto`, `fill`, explicit where useful);
- icon size/position constraints;
- Variant/Size/State overrides.

Avoid turning Button into a generic Flex container editor.

### TextField

```text
TextField
├─ Label?               optional
├─ Field                 required
│  ├─ LeadingAdornment?  optional
│  ├─ Input              required
│  └─ TrailingAdornment? optional
├─ HelpText?             optional
└─ ErrorText?            state/optional
```

Primary capability emphasis:

- width/min/max width;
- field height;
- padding;
- border/radius;
- surface/typography;
- adornment spacing;
- focus/disabled/invalid styling;
- label/help/error typography and spacing.

“Input Groups” from the research corpus inform these adornment/auxiliary-slot capabilities; they are not automatically a separate first-wave Component category.

### Textarea

```text
Textarea
├─ Label?       optional
├─ Field        required
├─ HelpText?    optional
└─ Actions?     optional/template-specific
```

Primary differences from TextField:

- height/min/max height matters more;
- resize/overflow behavior may become template-specific;
- multiline typography/line-height is important.

### Checkbox

```text
Checkbox
├─ Control      required
├─ Label?       optional
└─ Description? optional
```

Template owns correct checked/indeterminate/disabled semantics.

Authoring focuses on:

- control size;
- control border/radius/surface;
- gap/alignment;
- label/description typography;
- state overrides.

### RadioGroup

```text
RadioGroup
├─ Legend?      optional
└─ Options[]    required
   ├─ Control
   ├─ Label
   └─ Description?
```

This is a structured control with a repeated option collection, not arbitrary Component composition.

Candidate profile options may include simple list vs card-like option treatment, but the domain should avoid proliferating renderer-specific boolean flags when a Variant can express the distinction.

### Select

```text
Select
├─ Label?       optional
├─ Trigger      required
├─ Options[]    required
├─ HelpText?    optional
└─ ErrorText?   optional/state-driven
```

Behavioral semantics remain renderer/template responsibility.

### Combobox

```text
Combobox
├─ Label?       optional
├─ Input/Trigger
├─ Options[]
└─ Empty/Status? optional
```

This belongs in a later implementation wave because keyboard, focus, query and list semantics are more involved than a visual-only template.

### Switch

```text
Switch
├─ Control
├─ Label?       optional
└─ Description? optional
```

Primary capabilities:

- control dimensions;
- track/thumb surfaces;
- transition role later;
- checked/unchecked/disabled states;
- content alignment.

### Badge

```text
Badge
├─ Dot/Icon?       optional
├─ Label           required
└─ RemoveAction?   optional
```

Primary capabilities:

- compact padding;
- radius/pill treatment;
- border/surface/foreground;
- typography;
- gap.

### Avatar

```text
Avatar
├─ Image/Fallback  required
└─ StatusIndicator? optional
```

Primary capabilities:

- size;
- circle vs rounded shape;
- status indicator position/size;
- fallback surface/typography.

Avatar groups are outside the current primitive template definition; they are composition/pattern research.

### Divider

```text
Divider
├─ Line             required
└─ Content?         optional
   ├─ Label
   ├─ Icon
   └─ Action
```

Only one optional content mode needs to be active at a time unless a later design proves otherwise.

### Card

```text
Card
├─ Header?   optional
├─ Content   required
└─ Footer?   optional
```

Primary capabilities:

- width/min/max width;
- padding per slot;
- gap/dividers between slots;
- border/radius;
- surface/elevation;
- overflow;
- Header/Footer presence;
- slot-specific surface/padding where relevant.

This is the main vertical slice for proving structure/slot authoring.

### Alert

```text
Alert
├─ Icon?      optional
├─ Title?     optional
├─ Content    required
├─ Actions?   optional
└─ Dismiss?   optional
```

Primary capabilities:

- tone/Variant;
- accent border vs full border through normal border controls/Variants;
- padding/radius;
- surface/foreground;
- icon/title/content spacing;
- actions/dismiss presence;
- relevant states.

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

Primary capabilities:

- width/min/max width;
- max-height/overflow;
- panel padding/radius/surface/elevation;
- backdrop surface/opacity role;
- vertical alignment/placement in a curated form;
- Header/Footer presence;
- focus and keyboard semantics owned by renderer.

### Drawer

```text
Drawer
├─ Backdrop
└─ Panel
   ├─ Header?      optional
   ├─ Content      required
   ├─ Footer?      optional
   └─ CloseAction? optional
```

Primary capabilities:

- side (`left`/`right`, with other placements only if justified);
- width/max-width;
- full-height panel;
- overflow;
- sticky Footer option;
- backdrop;
- transition role later.

### Tabs

```text
Tabs
├─ TabList
│  └─ Tab[]
└─ Panel
```

Primary capabilities:

- orientation;
- tab gap/padding;
- indicator/border treatment;
- active/inactive states;
- optional icon/badge support;
- panel spacing;
- renderer-owned keyboard semantics.

Responsive replacement of Tabs with a Select is a pattern decision and is not a first-class generic authoring requirement in the initial model.

### Dropdown

```text
Dropdown
├─ Trigger
└─ Menu
   ├─ Header?   optional
   ├─ Item[]    required
   └─ Divider?  supported between groups
```

Primary capabilities:

- menu width/min/max width;
- padding/gap;
- border/radius/surface/elevation;
- item spacing/typography;
- active/disabled states;
- renderer-owned focus/keyboard behavior.

---

## 6. Capability scope by implementation wave

### Wave A — existing five

#### Button

Must prove:

- token-aware values;
- explicit-value escape hatch;
- width mode;
- padding control;
- independent radius;
- borders;
- surface/typography;
- Variant/Size/State overrides.

#### TextField

Must additionally prove:

- max-width;
- adornment-safe structure;
- focus/invalid/disabled styling;
- slot/semantic relationship without arbitrary composition.

#### Card

Must prove:

- Header/Footer optional slots;
- per-slot spacing/surface where justified;
- root width/max-width;
- border/radius/elevation/overflow.

#### Alert

Must prove:

- optional Icon/Actions/Dismiss areas;
- tone as a Variant rather than hard-coded key-name heuristics;
- accent-border capability.

#### Dialog

Must prove:

- width/max-width;
- max-height/overflow;
- backdrop vs panel separation;
- Header/Footer/CloseAction structure;
- renderer-owned focus semantics.

### Wave B

Add common form/element templates only after Wave A demonstrates that the capability system generalizes without a large amount of template-specific editor code.

### Wave C

Add behaviorally richer primitives only after keyboard/focus semantics can be qualified reliably.

---

## 7. Values: suggested type families

The exact TypeScript/Zod schema belongs to the domain implementation slice, but controls should converge on a small set of typed value families.

### Length

For dimensions, spacing, border width and radius.

Conceptual sources:

```text
Token reference
Explicit CSS-safe length
Named sizing mode where appropriate (auto/fill)
```

Do not accept arbitrary CSS expressions by default.

### Color

```text
Color Token reference
Explicit validated color value as escape hatch
```

### Typography

```text
Typography Token reference
Optional typed sub-property overrides
```

### Elevation

Prefer an Elevation/Shadow token or curated preset/value model rather than arbitrary shadow strings.

### Enumerations

Use typed options for:

```text
border style
alignment
justification
direction
wrap
overflow
placement
```

---

## 8. Override model constraints

The override system must stay understandable.

### Layering

Conceptually:

```text
template defaults
      ↓
Component base properties
      ↓
Variant override
      ↓
Size override
      ↓
State override
```

The exact order may change during DS-181R-01, but one deterministic order must be documented and tested.

### Sparse overrides

Each layer stores only differences.

Example:

```text
state.hover
{
  background: ...
}
```

not a complete duplicate of every Button property.

### UI inheritance signal

A property editor must distinguish:

```text
Inherited
Overridden
Token-linked
Explicit local value
```

### Reset behavior

Every overrideable property needs an obvious “reset to inherited” action.

---

## 9. Current areas that must not be accidentally demoted

Fine visual controls do not replace semantic Design System documentation.

The following remain first-class:

### Guidance

```text
Purpose
Usage Guidelines
Content Guidelines
Forbidden Patterns
```

### Accessibility

```text
Authored accessibility rules
Severity
Localization
```

### Lifecycle

```text
Draft
Ready
Deprecated
```

### Anatomy

Must remain meaningful to Documentation/AI/Accessibility even if the template supplies structural slots.

### AI / machine-readable output

The AI contract preview may move visually, but its data must remain complete and derivable from the canonical Component model.

---

## 10. Deliberate exclusions from this matrix

The following research families should not expand the current V2 domain:

```text
Sign-in forms
Form layouts
Navbars
Pagination
Sidebars
Vertical navigation
Tables
Stacked lists
Grid lists
Feeds
Calendars
Description lists
Stats
Empty states
Page headings
Section headings
Card headings
Application shells
Home/detail/settings pages
```

They remain useful to validate that the primitive/template catalogue is credible, but they are compositions/patterns rather than first-wave first-class Component templates.

---

## 11. Development gate

Before implementing a new capability, answer:

1. Which accepted template(s) require it?
2. Is it already expressible through an existing capability?
3. Does adding it make the normal editor harder for templates that do not need it?
4. Can it use typed values and Tokens cleanly?
5. How does it behave in Variants/Sizes/States?
6. Does it need to be slot-specific or root-level?
7. Can the preview render it deterministically?
8. Does it create a migration/downstream compatibility obligation?

If those questions do not have clear answers, do not add the capability opportunistically.

---

## 12. Open decisions intentionally left for DS-181R-01

The next domain/persistence slice must close these implementation details before UI work depends on them:

- exact Prisma model after removing `type` as Component identity;
- exact stable Component key/slug rules and rename behavior;
- exact schema-version strategy for stored JSON contracts;
- exact `DesignValue<T>` Zod/TypeScript representation;
- safe validation format for explicit length/color values;
- exact override precedence;
- relationship between legacy known `tokenBindings` and first-class property Token references;
- preservation location for custom/unrecognized Token bindings;
- exact relationship between template slots and semantic Anatomy to avoid duplicate manual maintenance;
- renderer registry interface;
- migration behavior for all existing five contract seeds and user-edited contracts;
- rollback/compatibility strategy while the new integration branch is in development.

No visible page redesign should begin by guessing these details.
