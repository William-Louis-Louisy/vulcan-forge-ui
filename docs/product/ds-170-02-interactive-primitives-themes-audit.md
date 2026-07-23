# DS-170-02 — Interactive primitives and Themes audit

## Objective

Introduce reusable interaction contracts for segmented choices and dropdown selection, then use them to resolve the responsive and visual inconsistencies in the Themes workspace.

## Shared primitives

### SegmentedControl

`SegmentedControl` centralizes the compact two-or-more-option control used for mutually exclusive choices.

It supports two semantic modes:

- `selection`: a labelled group of buttons using `aria-pressed`;
- `tabs`: a tablist using `role="tab"`, `aria-selected` and optional controlled panel identifiers.

Both modes support:

- Arrow Left/Right and Arrow Up/Down navigation;
- Home and End navigation;
- automatic activation and focus movement;
- disabled options;
- one shared visual density, border, radius, active state and focus treatment.

The Themes Light/Dark control now uses this primitive.

### Select

`Select` replaces the native Themes token-reference dropdown with an application-owned combobox/listbox contract.

It supports:

- external labels through the trigger `id`;
- `role="combobox"`, `aria-expanded`, `aria-controls` and `aria-activedescendant`;
- Arrow Up/Down navigation;
- Home and End navigation;
- Enter and Space activation;
- incremental typeahead;
- Escape dismissal and focus restoration through the shared dismissible-popover behavior;
- outside-pointer dismissal;
- optional descriptions;
- optional visual swatches;
- disabled options and a disabled control state;
- native form submission through a hidden named input.

Swatches are supplementary. The option label and textual value remain the accessible source of truth.

## Preview rail header

The preview rail header uses an explicit two-column, two-row grid:

- the eyebrow and title occupy the first cell;
- Light/Dark remains aligned at the top right;
- the description spans both columns on the second row.

This lets the description use the complete rail width instead of being constrained to the narrow space beside the segmented control.

## Themes role mapping

The role-mapping rows now use three explicit responsive compositions.

### Mobile

Each mapping is a vertical card:

1. theme role;
2. token selector;
3. resolved value;
4. state and Save action.

Long references wrap instead of forcing horizontal overflow.

### Tablet and normal desktop workspace widths

Rows use a stable two-column, two-row grid:

- role and selector on the first row;
- resolved value and actions on the second row.

The two-column composition remains active through normal desktop viewport sizes. The editor is only one region of the full application shell, so viewport width alone can otherwise trigger a four-column table while the actual editor panel is still narrow.

### Very wide desktop

The compact four-zone layout is enabled from `2xl` only:

- role;
- token selector;
- resolved value;
- state and Save action.

The action zone has an explicit minimum width and non-wrapping state text. This prevents the saved state and button from overlapping the resolved-value column.

## Swatch hierarchy

Color swatches remain where they provide distinct information:

- in the custom Select trigger;
- in each Select option;
- beside the resolved value.

The Theme role swatch was removed because it duplicated the currently resolved value without adding a separate meaning.

## Color-option presentation

Every Themes token option displays:

- its color swatch;
- its token path;
- its resolved hexadecimal value.

The selected value uses the same structure in the combobox trigger, so users do not need to reopen the menu to confirm the selected color.

## Native-select migration boundary

The repository still contains native selects in Components, Tokens and project-creation flows. They are not bulk-replaced in this PR.

Each migration must preserve the specific form, validation and keyboard contract of its feature. The shared Select is intentionally capable of text-only options, but adoption remains incremental rather than a visual search-and-replace.

The remaining inventory is reassessed during the relevant product step and finalized in DS-170-07.

## Automated coverage

Focused tests cover:

- selection semantics for SegmentedControl;
- tab semantics and keyboard activation for SegmentedControl;
- labelled Select rendering;
- swatch and description rendering;
- hidden form-value synchronization;
- keyboard selection and focus restoration;
- disabled Select behavior;
- Themes mapping state and resolved-color updates after selection;
- no-options behavior;
- the two-row preview-header contract;
- the delayed four-column mapping breakpoint;
- removal of the redundant Theme role swatch.

## Validation status

- implementation: complete;
- initial responsive FR/EN review: passed except for the targeted issues below;
- custom Select pointer and keyboard smoke test: passed;
- segmented-control pointer and keyboard smoke test: passed;
- mapping persistence: passed;
- standard Quality workflow on the corrected head: passed;
- targeted visual recheck: pending.

## Targeted manual QA checklist

Review the corrected Themes workspace in FR and EN at the width that previously reproduced the overlap, then at representative mobile, tablet and wide-desktop widths.

### Preview header

- Light/Dark stays at the top right;
- the description occupies the complete second row;
- long FR and EN descriptions do not collide with the segmented control;
- the header does not create horizontal overflow.

### Mapping rows

- no content overlap occurs at normal desktop widths;
- the two-column layout remains active at the previously failing width;
- the four-zone layout appears only on a genuinely wide viewport;
- saved or unsaved status does not overlap the resolved value;
- Save remains reachable and stable;
- long token paths remain readable;
- Theme roles no longer display a redundant swatch.

### Regression smoke test

- the current token path, value and swatch remain visible in the Select trigger;
- option swatches match their displayed values;
- pointer and keyboard selection still update the reference and resolved value;
- saving a mapping still persists after reload;
- Light/Dark still updates the preview.

## Definition of done

DS-170-02 is complete when:

- the standard Quality workflow passes on the final branch head;
- the targeted preview-header and mapping-width recheck passes;
- the validated Select and SegmentedControl interactions remain unchanged;
- mapping persistence remains unchanged;
- no temporary workflow remains in the final diff.
