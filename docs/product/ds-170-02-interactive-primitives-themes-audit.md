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

The Themes Light/Dark control now uses this primitive and is positioned in the preview header using the same top-right hierarchy as Documentation Rendered/Source.

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

## Themes role mapping

The role-mapping rows now use three explicit responsive compositions.

### Mobile

Each mapping is a vertical card:

1. theme slot;
2. token selector;
3. resolved value;
4. state and Save action.

Long references wrap instead of forcing horizontal overflow.

### Tablet

Rows use a stable two-column, two-row grid:

- slot and selector on the first row;
- resolved value and actions on the second row.

This avoids compressing the desktop table into unreadable intermediate widths.

### Desktop

Rows use the compact four-zone layout:

- slot;
- token selector;
- resolved value;
- state and Save action.

The action zone remains stable while the selector receives the flexible width.

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
- no-options behavior.

## Validation status

- implementation: complete;
- standard Quality workflow: pending final head verification;
- responsive FR/EN Themes review: pending;
- custom Select pointer and keyboard smoke test: pending;
- segmented-control pointer and keyboard smoke test: pending.

## Manual QA checklist

Review the Themes workspace in FR and EN on representative mobile, tablet and desktop widths.

### Mapping rows

- no horizontal overflow occurs;
- mobile ordering remains slot, selector, resolved value, actions;
- tablet uses the expected two-by-two composition;
- desktop uses the compact four-zone composition;
- long token paths remain readable;
- state and Save actions do not jump when changing options.

### Custom Select

- the current token path, value and swatch are visible in the trigger;
- the dropdown is not clipped by the mapping surface;
- option swatches match their displayed values;
- pointer selection updates the reference, resolved value and unsaved state;
- Arrow Up/Down changes the active option;
- Home and End reach the first and last options;
- Enter and Space select;
- typing selects the matching option prefix;
- Escape closes and restores focus;
- outside click closes;
- disabled rows remain non-interactive when no color token exists.

### Segmented controls

- Themes Light/Dark and Documentation Rendered/Source use consistent density and active styling;
- the Themes control is aligned at the top right of its rail header;
- pointer activation works;
- Arrow keys, Home and End work;
- focus rings remain visible;
- the preview updates to the selected theme mode.

## Definition of done

DS-170-02 is complete when:

- the standard Quality workflow passes on the final branch head;
- the responsive FR/EN Themes review passes;
- the Select pointer and keyboard smoke test passes;
- the SegmentedControl pointer and keyboard smoke test passes;
- mapping persistence remains unchanged;
- no temporary workflow remains in the final diff.
