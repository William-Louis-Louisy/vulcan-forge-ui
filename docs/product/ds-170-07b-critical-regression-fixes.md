# DS-170-07B — Critical regression fixes

## Objective

Resolve the known functional and rendering regressions that would invalidate the final DS-170 user-journey QA.

## Scope

- serialize structured component anatomy correctly in generated Documentation;
- isolate Light and Dark theme-editor state when switching tabs;
- replace the Rust 500 primitive with the approved danger color `#c02121`;
- add focused regression coverage for Documentation and Themes.

Project deletion is excluded and remains the dedicated DS-170-07C task.

## Documentation anatomy

Documentation now uses the shared `getComponentAnatomyPartKey` helper already consumed by AI Instructions. Structured anatomy objects are rendered through their stable keys rather than implicit object stringification.

English and French regression tests generate Documentation from structured anatomy entries, assert `root, label, icon` and explicitly reject `[object Object]`.

## Theme tab isolation

The active theme panel is keyed by its theme identifier. Switching between Light and Dark therefore remounts the theme-owned editor subtree instead of reusing local selection state initialized for the previously active theme.

The responsive-workspace test renders both modes through the same stateful editor component. Without the panel key, switching to Dark reproduces the stale Light-value leak; with the correction, each mode displays its own content.

## Danger primitive

`--vf-color-rust-500` now uses `#c02121`. Existing semantic danger roles continue to consume this primitive, so no second hardcoded danger color is introduced.

## Cross-platform character-count validation

Local validation on a French Windows runtime exposed a locale-sensitive assertion in the Documentation character-count test. The implementation intentionally formats the number with the runtime locale, so the test now derives its expected grouping through `Intl.NumberFormat()` instead of hardcoding the English comma separator.

This keeps validation stable across Windows and Linux locale configurations without changing the rendered product behavior.

## Product boundary

This task does not introduce a Prisma migration, persistence change, export-format change or project-deletion workflow.

## Automated validation

The focused correction run passed:

- formatting of the touched source and test files;
- Prisma client generation;
- focused Documentation and Themes regression tests;
- lint;
- strict TypeScript typecheck.

The standard pull-request Quality workflow passed on the final branch head in run #761, covering formatting, the UI audit, the complete test suite and the production build.

## Manual QA checklist

### Documentation

- generate English and French Documentation with Components enabled;
- verify anatomy contains component-part keys;
- verify rendered, copied and downloaded Markdown contain no `[object Object]`.

### Themes

- configure visibly different Light and Dark references;
- switch from Light to Dark and verify every row uses Dark references and resolved values;
- return to Light and verify its mappings remain correct;
- save a Dark mapping, reload and repeat the tab switch;
- repeat with pointer and keyboard navigation.

### Visual token

- verify danger text, borders and destructive states use the updated Rust primitive in light and dark appearance;
- verify no unrelated semantic color changed.

## Definition of done

DS-170-07B is complete when:

- the standard Quality workflow passes on the final branch head;
- the three manual QA groups pass;
- no temporary correction workflow remains in the final diff;
- the product owner approves the correction pass.
