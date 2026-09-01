# DS-181R-02 — Template registry and renderer foundation

## Status

Implementation record for the second Components V2 slice on `refactor/components-v2-customization`.

This slice deliberately does **not** redesign the Components page. It establishes the typed template boundary required by the later Button/Card/Dialog vertical slices.

---

## 1. Why this slice exists

DS-181R-01 separated first-class Component identity from template identity in persistence and the canonical V2 contract.

DS-181R-02 makes that distinction operational:

```text
Component identity
  marketingCta
        ↓
templateKey
  button
        ↓
template definition
  capabilities + defaults + slots + rendererKey
        ↓
renderer family
  Button preview
```

A renderer must never be chosen because the Component key/name happens to look like a known primitive.

The legacy `ComponentContractType` field remains compatibility metadata during Wave A, but it is no longer trusted as the renderer authority at the registry/preview boundary.

---

## 2. Typed Wave A registry

The registry currently contains exactly the five migration/proof templates:

```text
Button
TextField
Card
Alert
Dialog
```

Each `ComponentTemplateDefinition` declares:

- stable template `key`;
- display name;
- default category;
- temporary legacy compatibility type;
- renderer key;
- visual capability profile;
- fixed slot profile;
- canonical V2 default contract.

The registry is intentionally Wave A only. Wave B/C templates must be added later through the same definition model rather than through one-off editor branches.

---

## 3. Capability profiles

Each template declares support for the existing V2 visual capability groups using:

```text
full
constrained
none
```

Groups:

```text
dimensions
spacing
border
radius
surface
typography
layout
overflow
```

This profile is deliberately coarse at DS-181R-02. DS-181R-03 may refine property-level authoring metadata when the Button vertical slice proves which controls the UI actually needs.

The important invariant is already established: the future editor asks the template which capability groups are meaningful instead of exposing one universal CSS-like inspector.

---

## 4. Defaults

Wave A defaults are derived from the accepted legacy MVP seeds through the deterministic DS-181R-01 migration function.

This preserves:

- semantic guidance;
- Anatomy;
- Variants/Sizes/States;
- Accessibility rules;
- Forbidden Patterns;
- legacy/custom Token bindings;
- migrated V2 visual references;
- migrated fixed-slot configuration.

`createComponentContractFromTemplate()` clones these canonical defaults while replacing only first-class identity fields (and optional category/status overrides).

Therefore multiple Components may safely start from the same template:

```text
primaryCta     → button
checkoutAction → button
marketingCta   → button
```

without sharing Component identity.

---

## 5. Renderer boundary

The existing visual preview is intentionally retained in this slice.

The change is architectural rather than visual:

- `ComponentFoundationsPreviewClient` resolves the registered template from `component.templateKey`;
- the compatibility renderer type passed to the existing matrix is derived from the template definition;
- the persisted legacy `type` is ignored for renderer selection when a registered template exists;
- Alert-specific preview warnings are also keyed from the registered template.

This allows an arbitrary Component identity using `templateKey: "button"` to render through the Button renderer even if compatibility metadata is inconsistent.

A later slice may extract the current renderer implementations into their own registry without changing this contract.

---

## 6. Registry normalization boundary

`createComponentRegistryItems()` now normalizes stored records through `resolveStoredComponentTemplateContract()`.

That adapter:

1. normalizes V1/V2 stored contracts through the DS-181R-01 version boundary;
2. requires a registered template;
3. resolves the template slot profile;
4. validates the resolved slots;
5. returns the canonical V2 contract plus its template definition.

The visible registry continues receiving a legacy semantic adapter for the current editor, but template identity is now the source of the compatibility renderer/type projection.

---

## 7. Migration helpers

The template foundation exposes focused helpers for later slices:

- `getComponentTemplateDefinition()`;
- `requireComponentTemplateDefinition()`;
- `getComponentTemplateRendererKey()`;
- `createComponentContractFromTemplate()`;
- `migrateLegacyComponentToRegisteredTemplate()`;
- `resolveStoredComponentTemplateContract()`.

These helpers prevent creation, preview and future editor code from each rebuilding their own interpretation of template defaults and compatibility behavior.

---

## 8. Tests / non-regression contract

Coverage proves that:

- all five Wave A templates are registered;
- every template default is a valid V2 contract;
- capability profiles distinguish full/constrained/unsupported concerns;
- two different Component identities can use the same Button template;
- custom legacy Token bindings survive registered-template migration;
- stored V1 records normalize through the template boundary;
- template slots are resolved deterministically;
- unknown templates fail at the registry boundary;
- Components registry compatibility type is derived from the template rather than blindly trusting persisted legacy metadata;
- the existing visual preview routes an arbitrary identity through its template renderer.

---

## 9. Non-goals preserved

DS-181R-02 does not:

- redesign the Components workspace;
- add a Canvas;
- implement Component composition;
- add Wave B/C templates;
- add visual authoring controls;
- add responsive breakpoint authoring;
- replace semantic contract editing;
- remove the Wave A legacy adapter prematurely.

The rejected `refactor/components-workspace-v2` implementation branch remains unused.

---

## 10. Next slice

After DS-181R-02 is qualified and merged into the integration branch, proceed to:

```text
DS-181R-03 — Button customization vertical slice
```

That slice must prove the full authoring model on one Component before generalizing:

- direct visual-property controls;
- Token vs explicit values;
- dimensions and spacing;
- asymmetric radius;
- border/surface/typography;
- sparse Variant/Size/State overrides;
- reset-to-inherited;
- immediate preview feedback;
- unchanged semantic contract authoring.

If the Button flow is not materially better than `main`, stop before scaling the pattern.
