# DS-170-01 — Topbar and navigation audit

## Objective

Remove the remaining false affordances from the application topbar and align account, project, mobile and workspace navigation with their actual product scope.

## Implemented behavior

### Export navigation

The redundant topbar Export action has been removed. Exports remains available in the project navigation on desktop and in the mobile application menu.

This avoids duplicating an existing destination with a visually privileged action that has no distinct workflow.

### Project switcher

The project breadcrumb control is now a real dropdown rather than a link styled as a selector.

It:

- lists every project in the authenticated user's first workspace;
- identifies the current project;
- links back to the Projects index;
- preserves the current top-level editor section when changing project;
- preserves supported Tokens `set` values;
- collapses nested routes to their safe section root;
- closes on outside pointer interaction;
- closes on Escape and restores focus to its trigger.

### Workspace identity

The workspace item is intentionally neutralized. It remains visible as context on medium and larger screens, but no longer has button semantics, caret, hover state or dropdown affordance.

A real workspace switcher is deferred until multiple-workspace behavior is designed and implemented.

### Desktop account navigation

Settings has been removed from the desktop sidebar and added to the desktop user menu.

The Settings route remains unchanged and dedicated. The desktop user menu remains focused on account identity, Settings and sign out.

### Mobile application menu

The account-only user menu is no longer displayed on mobile. A burger menu now consolidates the navigation that disappears with the desktop sidebar.

It contains:

- Dashboard and Projects;
- the enabled sections of the current project;
- the disabled Overview and Brand entries with their existing coming-soon treatment;
- Settings;
- the FR/EN locale control;
- sign out.

The menu closes after navigation, on outside pointer interaction and on Escape with focus restoration.

### App shell data

The shell now loads the real workspace name and a lightweight project option list. It no longer displays the authenticated user's name as a substitute for the workspace identity.

## Product boundary

- no Settings page redesign;
- no Themes or Select work;
- no Overview or Brand implementation;
- no multi-workspace switching;
- no Prisma schema or migration change;
- no project business-data mutation.

## Automated coverage

Focused utility tests cover:

- preservation of a normal editor section;
- collapse of nested routes;
- supported token-set preservation;
- unsupported token-set fallback;
- root-route behavior;
- generated target project hrefs.

The standard Quality workflow must also pass. Temporary diagnostic workflows are not part of the final branch diff.

## Validation status

- implementation: complete;
- initial desktop, tablet, project-switcher and account-menu QA: passed;
- automated Quality workflow after the mobile-menu refinement: passed;
- focused mobile burger-menu QA: pending;
- final keyboard dismissal smoke test: pending.

## Manual QA checklist

The broad DS-170-01 review has passed. The final focused review only needs to cover the refinements below in FR and EN.

### Topbar

- no Export action remains in the topbar;
- Exports remains reachable from project navigation;
- workspace identity remains static;
- desktop locale and user controls remain visible from `sm` upward;
- the burger menu replaces the avatar control below `sm`;
- no horizontal overflow occurs on narrow screens.

### Mobile application menu

- Dashboard and Projects are reachable;
- current-project sections match the desktop sidebar;
- the active application and project destinations remain identifiable;
- disabled Overview and Brand entries remain non-interactive;
- Settings opens the dedicated page;
- FR/EN switching preserves the current route;
- sign out remains functional;
- navigation closes the menu;
- outside click closes the menu;
- Escape closes the menu and restores trigger focus;
- long French labels remain readable without horizontal overflow.

### Desktop regression

- the project switcher behavior remains unchanged;
- switching from Themes opens Themes in the target project;
- switching from Documentation opens Documentation in the target project;
- switching from a nested Components route opens the target Components root;
- switching from Tokens preserves color, spacing, radius, typography or motion;
- Settings remains available from the desktop user menu;
- locale switching and sign out remain unchanged.

## Definition of done

DS-170-01 is complete when:

- the standard Quality workflow passes after the refinement;
- the focused mobile burger-menu review passes;
- Exports remains reachable without the redundant topbar action;
- project switching remains stable across representative sections;
- Settings, locale and sign out work from their responsive navigation surfaces;
- keyboard and dismissal behavior pass.
