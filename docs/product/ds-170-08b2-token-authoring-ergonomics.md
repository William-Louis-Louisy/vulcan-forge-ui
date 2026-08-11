# DS-170-08B2 — Token authoring ergonomics

## Context

The external user-journey review identified Tokens as the product surface with the highest concentration of friction. The review also supplied concrete code excerpts for `TokenPreviewPanel`, `TokenInspectorPanel` and `SemanticColorTokenAliasEditor`.

Those excerpts are treated as implementation requirements for this slice, not illustrative pseudocode. Where the current architecture requires an adaptation, this document records the reason and preserves the requested behavior.

DS-170-08B1 fixed project-wide token reference integrity first. This slice now focuses on making everyday token creation and editing faster, denser and easier to scan without changing the token domain model.

## Decision 1 — Token groups are collapsible

Token groups remain open by default, but every group header is now an interactive disclosure with a chevron, token count, `aria-expanded` and `aria-controls`.

Collapse state is local UI state. Collapsing a group does not change the selected token, persisted token data or URL selection state.

This keeps small projects immediately readable while allowing large token collections to reduce vertical density.

## Decision 2 — Preview and Inspector follow the supplied simplified structures

### TokenPreviewPanel

The preview keeps the supplied lightweight structure:

- Preview eyebrow on the left;
- current TokenSet label on the right;
- the visual token sample as the panel body.

The duplicate token path and the secondary metadata list for value/reference/resolved value were removed from Preview. Those details already belong to the selected token and editing surfaces, so keeping them in Preview added density without adding a new decision signal.

The typography preview behavior introduced in DS-170-08A is preserved.

### TokenInspectorPanel

The inspector keeps the supplied hierarchy:

1. compact Inspector eyebrow and token path;
2. value editor;
3. rename editor;
4. description editor;
5. delete control.

The redundant TokenSet subtitle was removed. Existing rename-selection, value-update and delete callbacks remain unchanged.

## Decision 3 — Inspector actions are small and live below their controls

Editor save actions now use the shared `Button` primitive with `size="sm"` and are positioned below their respective input/select controls.

This applies to:

- primitive color value;
- semantic color alias;
- generic spacing/radius/motion value;
- typography value;
- token rename;
- token descriptions.

Delete already followed this pattern and remains unchanged.

The semantic color alias layout directly follows the supplied review excerpt: Select first, then the small save action beneath it.

## Decision 4 — Secondary help moves out of the vertical form flow

A shared `ContextualHelp` primitive now presents secondary explanatory copy from an information icon adjacent to the relevant label area.

The review requested hover tooltips. The implementation deliberately extends that interaction to:

- pointer hover;
- keyboard focus;
- click/tap on touch devices;
- Escape to dismiss from keyboard.

This avoids making important help hover-only and keeps the same information available on mobile.

The migrated help includes:

- primitive color input-format guidance;
- semantic alias guidance;
- description/fallback language guidance.

`ColorPickerField` already owns its internal label and is a substantial shared interactive primitive. Rather than restructure that component solely for this slice, `PrimitiveColorTokenEditor` positions the contextual-help trigger on the same label row. The user-visible result remains help directly beside the value label while the color picker implementation stays isolated.

Error, validation, saved and unsaved messages remain inline because they describe current state rather than optional help.

## Decision 5 — New Token accelerates path entry, not duplication

The external review asked for New Token to be prefilled from the selected token. Follow-up product review clarified that the repetitive cost is entering token paths, not re-entering values or descriptions.

New Token therefore uses the selected token only as namespace context.

Examples:

- `color.primitive.neutral.500` → `color.primitive.neutral.`;
- `color.semantic.action.primary` → `color.semantic.action.`;
- `spacing.4` → `spacing.`;
- `typography.body.base` → `typography.body.`.

Only the parent path is copied. The path input receives initial focus so the next segment can be typed immediately.

For color tokens, the creation kind also follows the selected color token when it is clearly primitive or semantic.

The selected token's value and descriptions are intentionally not copied. Copying those fields would be a Duplicate Token operation, which is a different product action and is outside this slice.

Primitive color creation no longer invents `#000000` as the starting value. The value begins empty; submit stays disabled until a valid color exists, while the required-state error is not shown before the user interacts with the field.

## Decision 6 — Description importance follows token semantics

Descriptions remain editable for every token, but missing descriptions are not treated equally.

Primitive tokens primarily expose available values. Their path and value already carry most of their meaning, so an empty primitive description is valid and does not create an incomplete-state warning.

Semantic color tokens describe design intent and usage. Missing English descriptions therefore continue to surface as guidance in the list, editor summary and description fields.

In short: a primitive describes what exists; a semantic token describes why it is used.

This slice does not generate filler descriptions and does not make primitive descriptions mandatory.

## Decision 7 — Token editor microtype is normalized selectively

Within the Tokens authoring surfaces touched by this slice, arbitrary `text-[11px]` and `tracking-[0.18em]` usages are normalized to the existing `text-xs` and `tracking-[0.16em]` conventions where they represented editor inconsistency.

This is not a repository-wide search-and-replace. Intentional marketing/editorial typography outside the Tokens authoring workflow is unchanged.

## Automated coverage

The existing token selection/rename/deletion regression tests remain in place.

Additional utility coverage verifies contextual New Token path prefixes for:

- primitive colors;
- semantic colors;
- typography;
- simple TokenSet paths;
- missing/non-hierarchical selections.

The full Quality workflow remains the integration gate for lint, TypeScript, formatting, UI audit, tests and production build.

## Manual QA

1. Collapse and expand every visible token group with pointer and keyboard; confirm selection and URL state remain stable.
2. Confirm Preview shows the lightweight title/TokenSet/sample structure without duplicate token metadata.
3. Confirm Inspector keeps the compact path and Value → Rename → Description → Delete hierarchy.
4. Confirm value, alias, rename, typography and description save actions are small and placed below their controls.
5. Open primitive-color, semantic-alias and description contextual help by hover, keyboard focus and click/tap; confirm the information remains available on mobile.
6. Select `color.primitive.neutral.500`, open New Token and confirm the path starts at `color.primitive.neutral.`, the kind is Primitive, value/descriptions are not copied, and typing continues at the end of the path.
7. Repeat contextual creation from a semantic color, spacing, radius, motion and typography token.
8. Confirm an empty primitive description creates no missing-description badge/header/per-field warning and can still be saved.
9. Confirm an empty semantic color English description still produces the intended missing-description guidance.
10. Recheck token selection, rename, delete and typography preview behavior from DS-170-08A/08B1 on desktop and mobile.

## Deliberate exclusions

- Visual Direction clarification, post-create redirect, Accessibility navigation/issue sorting and static cursor polish remain DS-170-08B3.
- A dedicated Examples page remains a post-refactor public-surface feature.
- Arbitrary custom Themes remain a post-refactor design-system feature.
- Duplicate Token is not introduced; contextual New Token is intentionally limited to path-entry acceleration.
