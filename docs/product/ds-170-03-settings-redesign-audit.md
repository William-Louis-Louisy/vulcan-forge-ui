# DS-170-03 — Settings page redesign audit

## Objective

Align the dedicated Settings page with the density, hierarchy and interaction language of the authenticated application while preserving the existing persistence behavior.

## Product boundary

Settings remains a dedicated authenticated route. The desktop user menu and compact burger menu remain navigation and shortcut surfaces rather than replacements for the complete preferences form.

The compact burger menu continues to expose the FR/EN shortcut below `lg`, where the topbar locale switcher and persistent sidebar are unavailable.

This step does not introduce profile editing, password management, workspace settings or a danger zone. The profile surface displays the account data already available from the authenticated user record.

## Page hierarchy

The page now follows the authenticated application structure:

- a compact full-width page header with eyebrow, title and description;
- responsive content padding matching the application shell;
- medium-density surfaces using the shared border, radius and shadow language;
- a bounded content width rather than an isolated oversized settings sheet;
- a Profile surface separated from the Preferences form.

The previous `text-4xl`, `rounded-3xl` and large vertical-gap treatment has been removed.

## Profile surface

The Profile panel presents only persisted account identity:

- display name, with the existing unknown-name fallback;
- email address;
- no false edit affordance.

The panel is stacked above Preferences on compact widths and becomes a narrower left column on wide layouts.

## Preferences surface

Language and Appearance remain native radio groups so form submission, browser semantics and keyboard behavior stay reliable.

Each option now uses an application-owned visual treatment:

- compact card density;
- explicit selected state;
- visible focus treatment on the complete card;
- textual label and description;
- supplementary locale or appearance preview;
- disabled treatment while a save is pending.

The preview does not replace the accessible label. Radio inputs remain the semantic source of truth.

## Existing behavior preserved

- selecting an appearance still previews it immediately through `applyThemePreference`;
- locale and appearance remain persisted by `updateUserSettingsAction`;
- a saved locale change still redirects to the equivalent localized Settings route;
- a saved appearance change still refreshes the application state;
- unsaved state detection still compares the current selection with the last saved settings;
- the save-context restoration contract remains unchanged.

## Feedback states

- saved and unsaved status are presented in the form footer;
- Save remains disabled when there is no change or while submission is pending;
- success and error feedback use bordered semantic notices;
- the loading skeleton mirrors the page header and Profile/Preferences composition;
- the existing error state continues to use the shared `WorkspaceState` recovery pattern.

## Automated coverage

Focused tests cover:

- labelled Language and Appearance groups;
- initial persisted radio selection;
- disabled Save action in the saved state;
- immediate appearance preview after selection;
- transition to the unsaved state;
- native keyboard activation and focus retention for locale options.

## Validation status

- implementation: complete;
- focused Settings tests: passed;
- lint: passed;
- typecheck: passed;
- formatting: passed;
- production build: passed;
- standard Quality workflow: passed on the implementation head;
- responsive FR/EN visual review: pending;
- keyboard and persistence smoke test: pending.

## Manual QA checklist

Review `/app/settings` in FR and EN on representative mobile, tablet and desktop widths.

### Hierarchy and responsive layout

- header density matches Dashboard and authenticated application pages;
- Profile and Preferences are clearly separated;
- Profile stacks above Preferences below the wide breakpoint;
- the two-column layout does not create horizontal overflow;
- long names and email addresses wrap without escaping their surface;
- no legacy `rounded-3xl` settings surfaces remain.

### Preference controls

- English and French options are fully clickable;
- System, Light and Dark options are fully clickable;
- selected states remain clear in both application themes;
- focus rings surround the complete option card;
- Tab reaches every radio option and the Save button;
- Arrow keys preserve native radio-group navigation;
- appearance changes preview immediately.

### Save behavior

- the initial state reads as saved and Save is disabled;
- changing either group exposes the unsaved state and enables Save;
- saving appearance persists after reload;
- saving language redirects to the equivalent localized Settings route;
- success feedback appears after saving;
- server errors remain readable and do not shift controls unpredictably.

### Loading and error

- the loading skeleton resembles the final page composition;
- the error recovery action remains keyboard reachable;
- compact and wide layouts do not overflow in either state.

## Definition of done

DS-170-03 is complete when:

- the standard Quality workflow passes on the final branch head;
- responsive FR/EN review passes;
- keyboard interaction passes;
- locale and appearance persistence pass;
- loading, error, success and unsaved states pass;
- no temporary workflow remains in the final diff.
