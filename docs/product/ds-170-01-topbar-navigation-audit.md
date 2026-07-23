# DS-170-01 — Topbar and navigation audit

## Objective

Remove the remaining false affordances from the application topbar and align account, project and workspace navigation with their actual product scope.

## Implemented behavior

### Contextual Export

The topbar Export action now appears only when a project is registered in the editor shell. It navigates directly to that project's Exports workspace.

Outside project routes, no inactive Export button is rendered.

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

### Settings and locale

Settings has been removed from the sidebar and added to the user menu.

The Settings route remains unchanged and dedicated. On small screens, where the topbar locale control is hidden, the FR/EN control is also available inside the user menu.

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

The standard Quality workflow must also pass.

## Manual QA checklist

Review desktop, tablet and mobile in FR and EN.

### Topbar

- workspace identity looks static and does not react to hover or keyboard focus;
- Export is absent on Dashboard, Projects and Settings;
- Export appears inside a project and opens that project's Exports page;
- no horizontal topbar overflow occurs on narrow screens;
- the desktop locale control remains visible from `sm` upward;
- the mobile locale control is available in the user menu.

### Project switcher

- current project is clearly identified;
- all available projects appear in expected update order;
- switching from Themes opens Themes in the target project;
- switching from Documentation opens Documentation in the target project;
- switching from a nested Components route opens the target Components root;
- switching from Tokens preserves color, spacing, radius, typography or motion;
- the Projects index action works;
- outside click closes the dropdown;
- Escape closes the dropdown and restores trigger focus;
- long project names and slugs truncate without overflow.

### User menu

- Settings opens the dedicated Settings page;
- Settings no longer appears in the sidebar;
- locale switching still preserves the current route;
- Logout remains unchanged;
- outside click and Escape close the menu;
- focus rings are visible.

## Definition of done

DS-170-01 is complete when:

- the standard Quality workflow passes;
- responsive FR/EN QA passes;
- Export behavior passes;
- project switching passes across representative sections;
- user-menu Settings and mobile locale behavior pass;
- keyboard and dismissal behavior pass.
