# DS-170-08A — Token editor reliability and typography consistency

## Status

Implementation complete on `feature/ds-170-08a-token-editor-reliability`. Automated Quality and manual product QA remain required before the draft pull request can be marked ready.

## Objective

Resolve the token-authoring defects found during the final DS-170 product journey before the large refactor:

- tokens can be deleted safely without trapping new projects behind seeded Theme or Component references;
- typography tokens edit and preview reliably;
- saving a token does not unexpectedly switch the inspector to another token;
- composite token values remain structurally useful in generated exports;
- application typography uses semantic CSS/Tailwind font roles instead of arbitrary family expressions.

## Product decisions

### Composite typography values

A typography token represents a style object rather than one isolated scalar. The supported properties are:

- `fontFamily`;
- `fontSize`;
- `fontWeight`;
- `lineHeight`;
- `letterSpacing`.

The domain schema now normalizes two legacy storage shapes when reading existing projects:

1. JSON strings written by the previous typography editor are parsed into real objects;
2. legacy atomic seed paths such as `typography.fontWeight.semibold` are converted into a one-property composite object based on their path.

Any subsequent save of that token set persists normalized object values because token-set writes validate and serialize the parsed domain representation. Newly created projects now start with `typography.body.base` as a real composite body style using `Inter Tight, system-ui, sans-serif` instead of three atomic typography seed tokens.

### Typography preview and exports

The token preview consumes the normalized object directly, so the sample can apply the authored family, size, weight, line height and letter spacing.

Families bundled by the application are mapped to their loaded `next/font` variables in preview:

- Inter and Inter Tight → `--font-inter-tight`;
- Fraunces → `--font-fraunces`;
- JetBrains Mono → `--font-jetbrains-mono`.

Arbitrary font stacks remain ordinary CSS font stacks. VulcanForge UI does not implicitly download an external font merely because its family name was authored; if the font is unavailable in the browser, the authored fallback stack applies.

CSS-variable export flattens composite typography properties into stable custom properties such as:

```css
--typography-body-base-font-family: Inter Tight, system-ui, sans-serif;
--typography-body-base-font-size: 1rem;
--typography-body-base-font-weight: 400;
```

Tailwind v4 and TypeScript theme exports inherit that flattened representation from the shared CSS-variable export pipeline. AI Instructions and Markdown documentation use the shared deterministic token-value serializer, so composite typography values are emitted as structured JSON rather than `[object Object]`.

### Safe deletion

The inspector exposes a right-aligned destructive token action with an explicit responsive confirmation dialog. On mobile the shared dialog is presented as a bottom sheet; from the `sm` breakpoint it becomes the centered desktop modal used by the rest of the product.

Token-to-token integrity remains strict: deletion is blocked when another token aliases or references the target token. The blocking token dependencies are surfaced in the confirmation dialog and must be resolved first.

Theme mappings and ComponentContract bindings are non-blocking because those product surfaces already have explicit preview fallbacks. When the target token is not referenced by another token, deletion runs atomically and:

- removes the token from its TokenSet;
- removes exact Theme mappings that reference it;
- removes matching ComponentContract token bindings.

The Theme and Component records themselves are never deleted. Their previews subsequently use the existing fallback/default rendering paths instead of keeping broken references or duplicating persisted fallback values.

An authored token set is allowed to become empty; the editor already has a valid empty-state authoring flow.

### Stable inspector selection

Selection is now resolved against the complete active token set before filtered search results. Saving a value or description that causes the current token to stop matching the search therefore keeps the inspector on the token the user was editing.

After deletion, selection moves deterministically to a remaining token or to the empty state.

### Semantic application fonts

The application font roles are:

- `font-sans` → Inter Tight;
- `font-display` → Fraunces;
- `font-mono` → JetBrains Mono.

Public/auth/legal surfaces now use `font-display` instead of arbitrary `font-[family-name:...]` expressions, and the base body uses the semantic `--font-sans` role.

Hard-coded font stacks in generated/testing documents or HTML email markup are intentional external-format exceptions because those surfaces cannot rely on the application Tailwind runtime or its CSS variables.

## Automated coverage

Focused regression coverage verifies:

- composite typography schema parsing;
- backward normalization of JSON-string and atomic typography values;
- typography form hydration and serialization;
- bundled-font resolution in the typography preview;
- preservation of arbitrary CSS font stacks;
- empty token-set validity;
- token deletion and dependency discovery;
- Theme reference detachment while preserving sibling mappings;
- ComponentContract binding detachment while preserving the contract;
- selected-token stability across filtering and deletion;
- flattened typography CSS variables;
- structured composite typography output in AI Instructions.

The repository Quality workflow remains the final merge gate for lint, strict TypeScript, formatting, UI audit, tests and production build.

## Manual QA checklist

- [ ] Open an existing project created before DS-170-08A and verify the seeded typography tokens populate the appropriate editor fields instead of showing empty inputs.
- [ ] Create a new composite typography token, save it, reselect it and verify every authored field persists.
- [ ] Verify Inter/Inter Tight, Fraunces and JetBrains Mono visibly affect the typography preview, and that an unavailable arbitrary family falls back cleanly without an automatic network font request.
- [ ] Edit spacing, radius, motion, typography values and token descriptions while a search is active; confirm saving never jumps to a different token solely because the edited token no longer matches the search.
- [ ] Verify the token delete action is right-aligned with the other inspector actions.
- [ ] On desktop, verify token deletion opens a centered confirmation modal; on mobile, verify the same flow is presented as a bottom sheet with its action row and safe-area spacing intact.
- [ ] Delete an unreferenced token and verify the nearest remaining token stays selected.
- [ ] Delete the final token in a set and verify the editor reaches a valid empty state and still allows creating a new token.
- [ ] Delete a token referenced only by a Theme and verify deletion succeeds, the Theme mapping is removed and its preview uses the existing fallback state.
- [ ] Delete a token referenced only by a ComponentContract and verify deletion succeeds, the binding is removed and the component preview uses its existing default/fallback rendering.
- [ ] Attempt to delete a token referenced by another token and verify deletion remains blocked with the blocking token dependency listed in the modal.
- [ ] Generate AI Instructions and verify composite typography values are structured JSON and never `[object Object]`.
- [ ] Generate Markdown documentation and verify the same composite token value is serialized structurally.
- [ ] Verify public Home, Pricing, Login/Signup and Terms/Privacy retain their intended Fraunces display typography in light/dark and responsive layouts.
- [ ] Verify technical/code text still uses JetBrains Mono and ordinary UI text still uses Inter Tight.

## Deferred

- automatic external font loading/provider integration is deliberately excluded;
- automatic deletion of Theme or Component records is deliberately excluded; only their exact token references are detached;
- arbitrary migration that tries to merge unknown legacy atomic typography tokens into invented full styles is deliberately excluded;
- the full DS-170-08 journey remains the final end-to-end verification after this reliability slice.
