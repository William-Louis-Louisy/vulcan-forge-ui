# DS-181R-05 — Card customization

## Goal

Promote Card as the third Wave A template using the V2 visual-authoring contract already product-qualified on Button and TextField, while introducing the first structured-template preview without creating an arbitrary composition system.

## Scope

Card reuses the existing compact V2 visual inspector and the same sparse visual persistence contract:

- Template defaults → Base → Variant → Size → State resolution;
- Fill, Dimensions, Spacing and Radius as the core visual groups;
- progressive Stroke / Border and Typography groups;
- Token-first values with controlled explicit values;
- immediate V2 preview updates;
- authenticated `{ visual, overrides }` persistence;
- legacy Visual Tokens hidden once Card is V2-owned.

Card does not gain a Focus ring group in this slice because the registered Card capability profile declares `focusRing: none` and the current Card seed has no focus state.

## Structured Card preview

Card is the first structured Wave A template. Its registered slot profile remains:

```text
Card
├─ Header?   optional
├─ Content   required
└─ Footer?   optional
```

The V2 foundations preview now consumes `contractV2.slots` instead of rendering a fixed legacy Card shape. Header and Footer render only when their slot configuration is enabled; Content remains the required structural region.

The slot configuration is therefore part of the preview contract, but this slice does not introduce a second independent slot-editing save surface. Slot enable/disable authoring and slot-specific visual styling remain a focused follow-up so structural editing can share one coherent V2 draft/save boundary rather than duplicate persistence logic.

## Token selector polish

Color token options now carry their resolved color value as an optional swatch. Semantic aliases are resolved through the design-token dictionary before the selector is built, so both primitive and semantic color tokens can show the actual resulting color.

The shared `Select` component already supports swatches in the selected value and in dropdown options. The Components surfaces now pass that metadata through in both the legacy Visual Tokens block and the V2 visual inspector. Non-color token types keep the existing text-only presentation.

Swatch metadata is omitted entirely when no resolved color exists, rather than being projected as `undefined`; this preserves the repository's `exactOptionalPropertyTypes` contract while keeping non-color options unchanged.

Regression coverage verifies resolved primitive and semantic swatch values, the legacy Visual Tokens selector, and the V2 color-token selector. This keeps the visual hint additive: token paths remain the authored value and swatches never replace token identity.

## Preview ownership

Card now follows the normalized V2 preview path used by Button and TextField. The legacy no-token-bindings notice is suppressed for Card because empty legacy bindings no longer mean that its visual preview is unconfigured.

The Card renderer preserves lightweight fallback visuals only when the resolved V2 contract does not author the corresponding property. V2-authored surface, dimensions, spacing, radius, border and typography take precedence.

## Compatibility

The existing Button-named compatibility files remain in place for this slice. The second-template gate has already passed, so a later mechanical rename is now safe in principle, but R05 keeps that cleanup separate from Card product behavior.

Button and TextField behavior must remain unchanged.

## Out of scope

- Card slot enable/disable authoring UI;
- slot-specific Header / Content / Footer visual styling;
- Layout and Overflow authoring controls;
- effects / elevation / shadow authoring;
- Alert or Dialog customization;
- freeform CSS, arbitrary nested children or general composition;
- broad renaming of Button-era compatibility files.

## Acceptance gate

R05 is accepted only if the real Components page confirms that:

1. Card exposes the same coherent V2 visual inspector as Button and TextField;
2. the legacy Visual Tokens editor no longer competes with Card V2 authoring;
3. Base, Variant and Size visual changes resolve live and persist correctly;
4. the Card preview is rendered from the V2 resolver and respects the stored Header / Content / Footer slot configuration;
5. color token selectors show resolved swatches in both legacy and V2 Components authoring surfaces, while non-color token selectors remain text-only;
6. Button and TextField remain regression-free.
