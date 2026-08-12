# DS-170-08B3 — Journey coherence & accessibility polish

## Scope

This slice closes the remaining external user-journey feedback that should be resolved before DS-170 final qualification.

### Project creation coherence

- `Custom` visual direction explicitly means starting without a predefined visual preset.
- The copy points users toward the Brand profile for refinement after project creation.
- Successful project creation lands on Brand instead of Tokens.
- Existing Dashboard and project-switcher navigation continue to use Overview as the normal project entry point.

### Accessibility navigation and issue review

- The project navigation no longer displays a static warning icon for Accessibility.
- A future warning indicator must be backed by actual project-health data rather than static navigation configuration.
- Accessibility issues keep their existing order until the user chooses a client-side sort.
- Users can sort by Severity, Scope or Rule without persisting that preference.

### Static navigation polish

- Static workspace context is non-selectable and keeps the default cursor.
- The public brand lockup is non-selectable without disabling pointer events, so links that wrap it remain interactive.

### Email verification reminder

- The reminder no longer participates in AppShell layout flow.
- It is rendered as a fixed floating card so page and workspace geometry remain stable.
- Unverified accounts expose a compact envelope status control in the topbar.
- The floating reminder can be dismissed with an explicit close action.
- The topbar control remains available while the account is unverified and can restore the reminder.
- Dismissal is intentionally UI state rather than a server-side verification preference; the verification requirement itself is unchanged.

## Deferred

- A data-driven Accessibility health indicator remains deferred until the AppShell has a reliable project-health source.
- A dedicated marketing Examples page and arbitrary custom Theme CRUD remain outside DS-170-08B3.

## Qualification focus

Manual QA should verify project creation in EN/FR, Brand landing, Accessibility navigation and sorting, desktop/mobile responsiveness, keyboard access, and the floating email verification reminder dismissal/restoration flow.
