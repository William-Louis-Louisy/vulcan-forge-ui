# DS-170-03 — Settings page redesign audit

## Objective

Align the dedicated Settings page with the authenticated application, make personal information editable and provide a secure permanent account-deletion flow.

## Review correction

The first implementation preserved the page header correctly but constrained the content inside Profile and Preferences cards. That composition compressed the Appearance options and did not provide the account-management capabilities expected from Settings.

The revised implementation keeps the validated header and replaces the content area with wide horizontal settings sections. Each section uses an explanatory column and a full-width control column. Cards are no longer used as the page-level layout system.

## Product boundary

Settings remains a dedicated authenticated route. The desktop user menu and compact burger menu remain navigation and shortcut surfaces rather than replacements for the complete settings experience.

The compact burger menu continues to expose the FR/EN shortcut below `lg`, where the topbar locale switcher and persistent sidebar are unavailable.

Password replacement and workspace-level administration remain outside this step. Personal information editing and account deletion are now included because they are core account settings rather than workspace features.

## Page hierarchy

The page follows the authenticated application structure:

- a compact full-width page header with eyebrow, title and description;
- one bounded, wide content column;
- horizontal sections separated by subtle rules;
- an explanatory column and a control column from `xl` upward;
- stacked section content below `xl`, giving controls the complete available width;
- no page-level Profile or Preferences cards;
- consistent input, button, border and focus treatments.

## Personal information

The Personal information section allows the authenticated user to edit:

- display name;
- login email.

Name changes use the current authenticated session. An email change additionally requires the current password because it changes the login identity. After a successful email change, the account is signed out so the next session is created with the new identity.

The profile action:

- trims and validates the name;
- normalizes the email to lowercase;
- rejects an email already used by another user;
- verifies the current password before changing the email;
- revalidates the localized Settings route;
- preserves the existing save-context behavior.

## Language and appearance

Language and Appearance remain native radio groups so browser semantics, form submission and keyboard navigation stay reliable.

The revised layout gives these controls substantially more room:

- section labels stack above controls until `xl`;
- the complete wide control column is available on desktop;
- language options use two equal columns when space permits;
- appearance options use three equal columns only when their container is wide enough;
- options retain explicit selected, hover, focus and pending states;
- previews remain supplementary to the accessible labels.

Existing preference persistence is unchanged:

- appearance previews immediately through `applyThemePreference`;
- locale and appearance are saved by `updateUserSettingsAction`;
- saving a locale change opens the equivalent localized route;
- saving appearance refreshes the application state;
- saved and unsaved detection compares current values with the latest persisted values.

## Account deletion

The Delete account section initially exposes one destructive request action. Opening it reveals an explicit confirmation form.

Permanent deletion requires:

- the exact login email;
- the current password.

After verification, the authenticated `User` row is deleted and the session is signed out.

The existing Prisma relations already use database cascades:

- `UserPreference.userId` deletes with the user;
- `WorkspaceMember.userId` deletes with the user;
- workspaces owned through `Workspace.ownerId` delete with the owner;
- projects delete with their workspace;
- project locale settings, brand profile, token sets, themes, component contracts, accessibility reports, documentation profile, AI instruction profile and export logs delete with their project.

No new schema migration is required for the cascade contract.

## Feedback and route states

- profile and preference forms expose independent saved and unsaved states;
- Save remains disabled while unchanged or pending;
- validation and server failures use localized semantic notices;
- email changes explain the required password and resulting sign-out;
- account deletion explains that the action is immediate and irreversible;
- the loading skeleton mirrors the horizontal section composition;
- the existing error route continues to use `WorkspaceState` recovery.

## Automated coverage

Focused tests cover:

- labelled Language and Appearance groups;
- initial persisted preference selection;
- immediate appearance preview;
- preference unsaved-state activation;
- native locale keyboard activation;
- name update without password verification;
- required password for an email change;
- verified email update and sign-out;
- rejection of an email already used by another account;
- deletion rejection for a mismatched confirmation email;
- deletion rejection for an incorrect password;
- authenticated user deletion and sign-out after valid confirmation.

## Validation status

- revised implementation: complete;
- lint: passed;
- typecheck: passed;
- formatting: passed;
- focused and regression tests: passed;
- production build: passed;
- standard Quality workflow: passed on the cleaned implementation head;
- responsive FR/EN visual review: passed;
- profile and preference persistence smoke test: passed;
- destructive deletion smoke test with disposable test data: passed;
- final manual QA: passed and approved by the product owner.

## Manual QA validation

The product owner completed and approved the following QA coverage on `/app/settings` in FR and EN across representative mobile, tablet and desktop widths.

### Layout

- the validated page header remains unchanged;
- sections read as columns rather than page-level cards;
- labels stack above controls below `xl`;
- the Appearance options have enough width for normal line wrapping;
- no option label is compressed into narrow one-word lines;
- no horizontal overflow occurs;
- long names and email addresses remain contained.

### Personal information

- name and email fields are editable;
- name-only changes save without asking for a password;
- changing the email reveals clear password guidance;
- an incorrect password is rejected;
- a duplicate email is rejected;
- a valid email change signs the user out;
- signing in with the new email succeeds.

### Preferences

- English and French options are fully clickable;
- System, Light and Dark options are fully clickable;
- selected states remain clear in light and dark application themes;
- Tab reaches each group and Save action;
- Arrow keys preserve native radio-group behavior;
- appearance changes preview immediately;
- saved preferences persist after reload.

### Account deletion

Use a disposable account only.

- the destructive confirmation is hidden initially;
- Cancel closes the confirmation without deleting data;
- an incorrect email is rejected;
- an incorrect password is rejected;
- valid confirmation deletes the account and signs out;
- the deleted credentials can no longer authenticate;
- owned projects and their related records are no longer present.

### Loading and error

- the loading skeleton resembles the section layout;
- the error recovery action remains keyboard reachable;
- compact and wide layouts do not overflow.

## Definition of done

DS-170-03 is complete when:

- the standard Quality workflow passes on the final branch head;
- responsive FR/EN review passes;
- personal information editing passes;
- locale and appearance persistence pass;
- account deletion passes with disposable test data;
- loading, error, success and unsaved states pass;
- no temporary diagnostic workflow or file remains in the final diff.
