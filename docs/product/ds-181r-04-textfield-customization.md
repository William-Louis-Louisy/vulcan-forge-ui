# DS-181R-04 — TextField customization

## Goal

Use TextField as the first generalization check for the Button V2 property-inspector pattern accepted in DS-181R-03. R04 must reuse the existing visual contract, sparse override semantics, save boundary, compact controls and preview resolver rather than create a parallel authoring system.

## TextField contract already present

The registered TextField seed exposes one `default` variant, `sm` / `md` / `lg` sizes and the canonical states `focusVisible`, `invalid` and `disabled`. Earlier stored TextField contracts that contain both `focus` and `focusVisible` are normalized when read: the duplicate `focus` state is removed and its state override is migrated to `focusVisible` when no `focusVisible` override already exists.

Its template capabilities allow dimensions, spacing, border, radius, surface and typography; layout remains constrained and overflow unsupported.

## Reused inspector contract

TextField uses the same live V2 inspector as Button:

- Naming remains first and non-collapsible;
- Variants & states precedes visual authoring;
- Tokens visuels is the sole live visual-authoring surface;
- Base / Variant / Size / State use sparse overrides;
- Fill, Dimensions, Spacing and Radius are core groups;
- Stroke / Border and Typography stay progressive optional groups;
- `focusVisible` exposes a dedicated Focus ring group rather than reusing Stroke / Border;
- Focus ring width, offset, style and color are authorable independently from the component border;
- uniform radius and independent corners share the accepted R03 semantics;
- token options keep semantic → primitive → remaining deterministic ordering;
- compact `xs` source, token and explicit-value controls stay aligned;
- reset means delete the current-layer override and inherit.

The existing Button-named implementation file remains temporarily as the compatibility boundary for this slice; R04 proves reuse with a second template before any file/API rename that would create broad mechanical churn.

## Focus treatment

`focusVisible` is the single canonical focus state for TextField. Button and TextField templates provide a dedicated authorable Focus ring with a `2px` width, `2px` offset, `solid` style and `color.semantic.action.primary` color.

The Focus ring is projected as CSS `outline` properties. This keeps the accessibility affordance independent from the component's ordinary border and avoids changing the component box model when focus becomes visible. Stroke / Border can still be authored independently on a focus state when the design explicitly calls for it.

The preview does not add a hardcoded Tailwind focus ring. Its visual focus treatment is resolved through Template defaults → Base → Variant → Size → State like every other V2 visual property. The TextField preview still locally neutralizes VulcanForgeUI's application-level `:focus-visible` outline so the specimen does not display a second, unrelated focus treatment; shared application input styling and global accessibility focus behavior remain unchanged.

## Preview

TextField is promoted from the legacy token-binding preview to the normalized V2 resolver. Template defaults are resolved first, then Base → Variant → Size → State. The TextField renderer preserves familiar fallback visuals only when the resolved V2 contract does not author that property. `invalid` and `disabled` remain visible as fallback state affordances, while `focusVisible` is resolved from the dedicated V2 Focus ring.

The CSS projection intentionally avoids mixing shorthand and longhand properties during live rerenders. Border widths are emitted only as `borderTopWidth` / `borderRightWidth` / `borderBottomWidth` / `borderLeftWidth`, and padding is emitted only as the four physical side properties after resolving uniform, axis and side-specific authoring precedence. This prevents React's shorthand/longhand style-update conflicts while preserving the V2 inheritance semantics. Regression tests cover both uniform-to-side transitions and side-specific precedence.

## Initial component selection

When the Components page is opened without an explicit `?component=...` selection, the initial component now follows the same category/display ordering as the visible registry navigation (`action` → `input` → `layout` → `feedback` → `overlay`). This keeps Button selected by default when it is the first visible registry entry instead of depending on raw persistence order.

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

R04 is accepted only if the real Components page confirms that TextField feels like the same authoring system as Button, while its `default` variant, three sizes and `focusVisible` / `invalid` / `disabled` states preview and persist correctly. Button behavior must remain unchanged. Opening the Components page without an explicit component selection must select Button, matching the first visible registry entry.
