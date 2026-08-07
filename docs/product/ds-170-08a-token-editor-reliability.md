# DS-170-08A — Token editor reliability and typography consistency

## Status

Implementation complete on `feature/ds-170-08a-token-editor-reliability`. Automated Quality and manual product QA remain required before the draft pull request can be marked ready.

## Objective

Resolve the token-authoring defects found during the final DS-170 product journey before the large refactor:

- tokens can be deleted safely;
- typography tokens edit and preview reliably;
- saving a token does not unexpectedly switch the inspector to another token;
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

Any subsequent save of that token set persists normalized object values because token-set writes validate and serialize the parsed domain representation. Newly created projects now start with `typography.body.base` as a real composite body style instead of three atomic typography seed tokens.

### Typography preview and exports

The token preview consumes the normalized object directly, so the sample can apply the actual family, size, weight, line height and letter spacing.

CSS-variable export flattens composite typography properties into stable custom properties such as:

```css
--typography-body-base-font-family: Inter;
--typography-body-base-font-size: 1rem;
--typography-body-base-font-weight: 600;
```

Tailwind v4 and TypeScript theme exports inherit that flattened representation from the shared CSS-variable export pipeline.

### Safe deletion

The inspector exposes a destructive token action with an explicit confirmation step.

Deletion is blocked when the target is still referenced by:

- another token alias/reference;
- a Theme token mapping;
- a ComponentContract token binding.

The UI surfaces the dependencies that must be removed first instead of silently cascading or leaving broken references.

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
- empty token-set validity;
- token deletion and dependency discovery;
- selected-token stability across filtering and deletion;
- flattened typography CSS variables.

The repository Quality workflow remains the final merge gate for lint, strict TypeScript, formatting, UI audit, tests and production build.

## Manual QA checklist

- [ ] Open an existing project created before DS-170-08A and verify the seeded typography tokens populate the appropriate editor fields instead of showing empty inputs.
- [ ] Create a new composite typography token, save it, reselect it and verify every authored field persists.
- [ ] Verify the typography preview reflects font family, size, weight, line height and letter spacing after saving.
- [ ] Edit spacing, radius, motion, typography values and token descriptions while a search is active; confirm saving never jumps to a different token solely because the edited token no longer matches the search.
- [ ] Delete an unreferenced token and verify the nearest remaining token stays selected.
- [ ] Delete the final token in a set and verify the editor reaches a valid empty state and still allows creating a new token.
- [ ] Attempt to delete a referenced primitive color token and verify deletion is blocked with its token/theme/component dependencies listed.
- [ ] Remove those dependencies, retry deletion and verify it succeeds.
- [ ] Verify public Home, Pricing, Login/Signup and Terms/Privacy retain their intended Fraunces display typography in light/dark and responsive layouts.
- [ ] Verify technical/code text still uses JetBrains Mono and ordinary UI text still uses Inter Tight.

## Deferred

- automatic cascade deletion of token dependencies is deliberately excluded;
- arbitrary migration that tries to merge unknown legacy atomic typography tokens into invented full styles is deliberately excluded;
- the full DS-170-08 journey remains the final end-to-end verification after this reliability slice.
