# DS-181R-04 — TextField customization

## Goal

Use TextField as the first generalization check for the Button V2 property-inspector pattern accepted in DS-181R-03. R04 must reuse the existing visual contract, sparse override semantics, save boundary, compact controls and preview resolver rather than create a parallel authoring system.

## TextField contract already present

The registered TextField seed exposes one `default` variant, `sm` / `md` / `lg` sizes and the states `focus`, `focusVisible`, `invalid` and `disabled`. Its template capabilities allow dimensions, spacing, border, radius, surface and typography; layout remains constrained and overflow unsupported.

## Reused inspector contract

TextField uses the same live V2 inspector as Button:

- Naming remains first and non-collapsible;
- Variants & states precedes visual authoring;
- Tokens visuels is the sole live visual-authoring surface;
- Base / Variant / Size / State use sparse overrides;
- Fill, Dimensions, Spacing and Radius are core groups;
- Stroke / Border and Typography stay progressive optional groups;
- uniform radius and independent corners share the accepted R03 semantics;
- token options keep semantic → primitive → remaining deterministic ordering;
- compact `xs` source, token and explicit-value controls stay aligned;
- reset means delete the current-layer override and inherit.

The existing Button-named implementation file remains temporarily as the compatibility boundary for this slice; R04 proves reuse with a second template before any file/API rename that would create broad mechanical churn.

## Preview

TextField is promoted from the legacy token-binding preview to the normalized V2 resolver. Template defaults are resolved first, then Base → Variant → Size → State. The TextField renderer preserves familiar fallback visuals only when the resolved V2 contract does not author that property. `invalid`, focus and disabled remain visible as fallback state affordances, while authored V2 values win for background, foreground and border color.

## Persistence

The visual save payload remains exactly `{ visual, overrides }`. The existing authenticated persistence boundary now accepts both `button` and `textField` registered template keys and rejects the remaining templates until their own Wave A slices are product-qualified.

## Ownership

For TextField, the generic legacy Visual Tokens editor is hidden once the V2 inspector is active. Existing stored legacy bindings remain data for compatibility/migration, but they do not compete with the live TextField V2 preview.

## Out of scope

- effects / elevation / shadow authoring;
- slot-specific styling for label / hint / error subparts;
- Card, Alert or Dialog customization;
- freeform CSS or arbitrary children;
- broad renaming of Button-era compatibility files before the second-template product gate passes.

## Acceptance gate

R04 is accepted only if the real Components page confirms that TextField feels like the same authoring system as Button, while its `default` variant, three sizes and focus / focusVisible / invalid / disabled states preview and persist correctly. Button behavior must remain unchanged.
