# DS-170-08B1 — Token reference integrity & project palette

## Context

The external user-journey review reported that a dashboard Project Card could display the wrong colors after token paths were renamed.

The audit identified two separate causes:

1. token rename only migrated references inside the currently edited TokenSet;
2. Project Card swatches were inferred from a hard-coded list of conventional token paths instead of stable theme roles.

This slice fixes both causes before the final DS-170 qualification journey.

## Decision 1 — Rename is project-wide

A token path is a project-level reference target. Renaming it must therefore preserve every supported project reference in the same mutation.

The rename flow now loads all TokenSets, Themes and ComponentContracts for the authorized project, validates every TokenSet, computes the migration, then persists the affected records in one Prisma transaction.

The migration covers:

- the renamed token itself;
- token `value` references, including exact references nested in composite values;
- token `reference` fields;
- Theme JSON references;
- `ComponentContract.tokenBindings[].tokenPath` values.

A destination path is rejected when it is already used by any TokenSet in the project, not only the currently edited set.

Malformed TokenSets stop the rename instead of allowing a partial project migration.

The mutation revalidates the dashboard and every project surface whose derived data can depend on token references.

## Decision 2 — Project Card palette comes from theme roles

Project Card colors must describe the current project palette rather than the presence of particular seed token names.

The dashboard query now loads project Themes together with the color TokenSet. The card resolves the preferred Theme in this order:

1. Light Theme when present;
2. otherwise the first available Theme.

The four swatches use stable Theme roles in this order:

1. `background`;
2. `surface`;
3. `accent`;
4. `content`.

Each role may contain a direct hexadecimal color or a token reference. References are resolved recursively through the project's color tokens.

When a role cannot be resolved, the card uses other resolved project colors before falling back to the static dashboard palette. This keeps legacy or incomplete projects renderable without making token naming conventions part of the card contract.

## Deliberate exclusions

- No attempt is made to guess or automatically repair references that were already broken before this slice. Without a reliable old-path/new-path history, such a repair could point to the wrong token.
- This slice does not implement the Tokens editor ergonomics from the external review. The supplied TokenPreviewPanel, TokenInspectorPanel and SemanticColorTokenAliasEditor excerpts remain requirements for DS-170-08B2.
- This slice does not add custom Themes; that remains a post-refactor product feature.

## Automated coverage

The regression suite covers:

- local token rename and reference migration;
- references in other TokenSets;
- nested composite token references;
- Theme reference migration;
- ComponentContract binding migration;
- project-wide duplicate path rejection;
- Theme-role based Project Card palettes;
- Light Theme preference;
- palette stability when token paths and Theme references are renamed together;
- fallback to resolved project colors and finally static swatches.

## Manual QA

1. Open an existing project and note its four dashboard swatches.
2. Rename a color token referenced by a Theme and return to the dashboard.
3. Confirm that the Project Card colors are unchanged.
4. Confirm that the Theme still resolves the renamed token.
5. Rename a token bound to a Component and confirm that the Component binding now uses the new path.
6. Rename a primitive token referenced by another token and confirm that the alias still resolves.
7. Attempt to rename a token to a path already used in another TokenSet and confirm that the operation is rejected without partial changes.
