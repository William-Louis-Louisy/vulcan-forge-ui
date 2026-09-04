# DS-181R-03 — Button customization vertical slice

## Status

Implementation record for the first end-to-end visual authoring slice on `refactor/components-v2-customization`.

This slice deliberately proves the Components V2 authoring model on **Button only**. TextField, Card, Alert and Dialog remain on the existing semantic editor and preview path until the Button workflow is qualified manually.

---

## 1. Goal

DS-181R-01 established the V2 domain and migration contract. DS-181R-02 established template identity, capabilities, defaults and renderer authority.

DS-181R-03 makes that architecture user-editable for one template:

```text
Button Component
  ↓
base visual values
  ↓
variant override
  ↓
size override
  ↓
state override
  ↓
resolved preview
```

The slice is successful only if authoring a Button becomes materially more direct than editing generic visual token bindings alone.

---

## 2. Button-only visual editor

A dedicated visual customization panel is rendered when:

```text
templateKey === "button"
```

The panel does not replace the semantic contract editor. Purpose, usage guidance, Anatomy, Variants, Sizes, States, Accessibility, Forbidden Patterns and legacy/custom Token bindings remain editable through the existing semantic workflow.

The visual editor exposes direct controls for:

- dimensions: width, minimum width, height, minimum height;
- spacing: horizontal padding, vertical padding, gap;
- radius: uniform and four independent corners;
- border: width, style and color;
- surface: background, foreground and elevation;
- typography: typography Token or controlled explicit typography fields.

Layout and overflow stay in the V2 domain but are intentionally not exposed for Button in this proof slice because the Button capability profile marks layout as constrained and overflow as unsupported.

---

## 3. DesignValue authoring

Visual properties use the DS-181R-01 controlled DesignValue model rather than arbitrary CSS.

Depending on the property, the editor offers:

- inherit / template default;
- a compatible design Token;
- a controlled explicit value;
- `auto` / `fill` for supported dimension properties.

Explicit lengths continue to use the canonical length validator. Explicit colors remain limited to canonical hexadecimal values or `transparent`. Arbitrary CSS expressions are not introduced by this editor.

Token selectors are filtered by property family:

- spacing Tokens for dimensions, spacing and border width;
- radius Tokens for radius;
- color Tokens for border/surface colors;
- typography Tokens for typography.

---

## 4. Sparse override model

The editor can target four authoring layers:

```text
Base
Variant
Size
State
```

For non-base layers the user selects an existing semantic axis key.

Overrides remain sparse. Setting one property writes only that property into the selected override. Resetting it removes the property; when an override group or override entry becomes empty it is removed instead of materializing inherited values.

Resolution order remains the canonical DS-181R-01 order:

```text
template defaults
→ base
→ variant
→ size
→ state
```

The later layer wins only for the properties it actually defines.

---

## 5. Immediate preview

Button now has a V2-aware preview matrix.

For every Variant × Size cell, and for the currently selected State, the preview resolves canonical visual properties through `resolveComponentVisualProperties()` and converts them to controlled React CSS properties.

Supported V2 preview concerns include:

- width / height constraints;
- spacing;
- border;
- uniform and asymmetric radius;
- surface colors;
- elevation presets;
- typography;
- supported layout values.

Token-backed values are resolved through the existing design-token dictionary and reference resolution path.

The other Wave A templates continue to use the previous preview implementation in this slice.

---

## 6. Legacy visual-binding bridge

The current semantic editor still exposes the earlier visual Token bindings because removing that surface in the same slice would unnecessarily widen migration risk.

When those Token bindings change in the live editor, recognized legacy roles are migrated into the V2 preview for the compatible visual groups. Ordinary semantic edits do **not** rewrite the V2 visual state.

This bridge is temporary compatibility infrastructure, not the target authoring model.

---

## 7. Persistence and V1 → V2 promotion

Existing legacy Component records remain lazily readable as V1.

The first successful Button visual customization save promotes that individual Component record to:

```text
contractVersion = 2
```

The saved canonical contract includes the latest semantic data, slots, visual base values and sparse overrides.

The visual save action loads and normalizes the latest stored contract before applying `visual` and `overrides`, so a visual save does not replace semantic content with a stale client snapshot.

---

## 8. Semantic-save compatibility after promotion

Once a Button record is V2, the existing semantic save action changes behavior internally while keeping its UI contract unchanged.

It now:

1. identifies the Component by stable `componentKey`;
2. loads the latest stored record;
3. normalizes the current V2 contract;
4. replaces only legacy semantic fields from the semantic editor payload;
5. preserves V2-only `visual`, `slots` and `overrides` exactly.

This prevents a later Purpose/Anatomy/Variant/etc. edit from erasing Button visual customization.

V1 records that have not been promoted continue to use the legacy persistence path.

---

## 9. Non-regression contract

Automated coverage for this slice must prove:

- base visual values can be authored directly;
- Variant, Size and State overrides stay independent and sparse;
- reset removes an override and restores inheritance;
- resolution precedence remains template → base → variant → size → state;
- Token-backed values resolve into preview styles;
- controlled explicit values resolve into preview styles;
- asymmetric radius is visible immediately in the Button preview;
- semantic saves preserve V2 visual, slots and override state;
- renderer authority remains `templateKey`;
- TextField, Card, Alert and Dialog do not acquire Button-specific authoring behavior.

---

## 10. Manual qualification gate

DS-181R-03 requires manual product QA because its primary purpose is authoring UX, not only domain correctness.

Before generalizing the pattern, verify that a user can understand and successfully perform:

- Base customization;
- Token-backed customization;
- explicit values;
- asymmetric radius;
- Variant/Size/State overrides;
- reset-to-inherited;
- save + reload persistence;
- semantic editing after a V2 visual save without visual data loss.

If this flow is not materially clearer and safer than the previous generic binding workflow, stop and revise the Button experience before moving to another template.

---

## 11. Non-goals

This slice does not:

- generalize the visual editor to other Component templates;
- introduce arbitrary CSS;
- add freeform children or Component composition;
- add responsive breakpoint authoring;
- remove the legacy semantic editor;
- remove legacy Token bindings;
- introduce Wave B/C templates;
- use, merge or cherry-pick the rejected `refactor/components-workspace-v2` branch.

---

## 12. Handoff

After CI and manual QA are both green, use the Button result to decide the next small slice.

The preferred direction is **not** to immediately copy the editor to every template. First extract only the property-control primitives and override UX that proved useful in Button, then apply them to the next template whose capability profile materially differs enough to validate the abstraction.
