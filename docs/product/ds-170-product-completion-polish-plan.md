# DS-170 — Product completion and polish plan

## Objective

Finish the product surface after DS-160, then run one complete user journey before the large architectural refactor.

This phase combines functional gaps, missing product pages and visual debt discovered during the global application review. The sequence deliberately fixes false affordances and shared primitives before adding Overview, Brand and the public-surface polish.

## Product principles

- visible controls must have a real behavior;
- shared interaction patterns must use shared primitives;
- project navigation stays focused on project work;
- desktop account preferences belong to the user menu and a dedicated Settings page;
- compact navigation is consolidated in one application menu rather than fragmented across unavailable sidebars and account-only controls;
- responsive behavior is designed explicitly rather than obtained by compressing desktop layouts;
- FR and EN remain first-class throughout the phase;
- the large refactor starts only after a complete critical-path review.

## DS-170-01 — Topbar and navigation

### Scope

- remove the redundant topbar Export action because Exports already belongs to project navigation;
- replace the project breadcrumb link with a project switcher;
- preserve the current top-level editor section when switching projects;
- preserve the selected token-set family when switching from Tokens;
- expose the full project list from the authenticated workspace;
- remove Settings from the desktop sidebar;
- add Settings to the desktop user menu;
- replace the user menu with a burger menu whenever the desktop sidebar is hidden;
- expose application and current-project navigation in the compact menu;
- expose Settings, locale switching and sign out in the compact menu;
- close dropdowns on outside pointer interaction and Escape;
- keep focus restoration on the trigger after Escape;
- neutralize the workspace selector until multi-workspace switching is implemented.

### Workspace decision

The workspace identity remains visible in the topbar but is rendered as static context. It must not use a caret, hover treatment or button semantics while no workspace switch exists.

### Project switcher behavior

- current project is identified in the dropdown;
- other projects navigate to the equivalent top-level section;
- nested Components and Accessibility routes fall back to their section root;
- Tokens preserves a supported `set` query and otherwise falls back to `color`;
- the dropdown includes an explicit link back to the Dashboard project collection.

### Responsive navigation decision

Wide layouts from `lg` upward keep the locale control, desktop user menu and persistent sidebar. Layouts below `lg` use one burger menu because the sidebar is unavailable.

The compact menu contains:

- Dashboard;
- the current project's enabled editor sections;
- Settings;
- the FR/EN locale control;
- sign out.

This keeps primary navigation available on both mobile and tablet instead of exposing an account-only menu while the sidebar is hidden.

The functional architecture and interaction model are validated. The current visual design of the burger menu is intentionally provisional and may receive a separate styling pass after the desired hierarchy, layout and motion direction have been clarified. That future exploration does not reopen DS-170-01 unless it changes navigation behavior.

## DS-170-02 — Interactive primitives and Themes fixes

### Scope

- build a shared accessible segmented control;
- align Themes Light/Dark with Documentation Rendered/Source;
- build a shared custom Select primitive;
- migrate the Themes role-mapping select first;
- redesign the mapping rows for desktop, tablet and mobile;
- keep status and Save actions stable at every breakpoint;
- progressively replace remaining native selects where the custom control is appropriate.

### Select swatches

Select options should display a swatch whenever the option represents a color or another value with a meaningful visual preview. The swatch is supplementary: the textual label and value remain the accessible source of truth.

The primitive must also support options without swatches so it remains reusable for locales, statuses, token types and other non-color choices.

## DS-170-03 — Settings alignment

### Scope

- keep a dedicated Settings route;
- align page hierarchy, surfaces, radii, typography and spacing with the application shell;
- separate Profile and Preferences clearly;
- preserve the existing locale and theme persistence behavior;
- use compact accessible selection controls;
- keep the locale shortcut in the compact burger menu because the topbar locale control is hidden below `lg`;
- verify loading, error, success and unsaved states.

The desktop user menu and compact application menu are navigation and shortcut surfaces, not replacements for the Settings form.

## DS-170-04 — Project Overview

### Scope

- implement the project landing page instead of redirecting directly to Tokens;
- summarize project health, coverage and recent activity;
- surface token, theme, component, accessibility and export signals;
- provide prioritized next actions;
- reuse existing project data before introducing new persistence;
- enable the Overview navigation item;
- make generic Dashboard project entries open Overview;
- make the Dashboard the canonical project collection;
- remove the standalone `/app/projects` page and its primary-navigation entry;
- route project-switcher and creation-flow return links back to `/app`.

### Backlog — Dashboard project management

The Dashboard remains the single project-management surface as the workspace grows. A dedicated follow-up should add:

- a user-controlled Cards/Table view switch;
- search across project identity and descriptive metadata;
- filters for relevant project attributes;
- explicit sort controls, including recent activity;
- one shared filtered and sorted project collection for both views;
- URL-backed view, search, filter and sort state where it improves reload, history and sharing behavior.

A second Projects page must not be reintroduced for these capabilities.

## DS-170-05 — Brand profile

### Scope

- implement the Brand workspace from the validated mockup;
- review and extend the `BrandProfile` domain model;
- support localized tagline, short description, personality, audience and tone-of-voice content;
- model terminology and editorial rules where required;
- feed Brand data into Documentation and AI Instructions;
- add Prisma migration, validation, actions and focused tests;
- enable the Brand navigation item.

This phase is intentionally isolated because it changes persistence and generator inputs.

## DS-170-06 — Public surfaces

### Scope

- replace the placeholder `VF` public mark with the approved logo and wordmark treatment;
- align the public navbar with the validated mockup;
- review desktop and mobile navigation;
- align buttons, fields, typography and spacing;
- review landing, pricing, login, signup and footer surfaces;
- verify FR/EN content density and responsive behavior;
- keep the public visual identity related to, but less dense than, the Project Editor.

## DS-170-07 — Visual debt audit

### Scope

- identify remaining legacy palette values and hardcoded colors;
- identify legacy font families, weights and sizes;
- identify inconsistent radii and spacing;
- identify native selects and false interactive affordances;
- verify light and dark themes;
- verify all visible strings are localized;
- maintain an explicit allowlist for intentional exceptions;
- add focused regression tests where an issue can recur automatically.

The deferred burger-menu visual exploration should be reassessed during this audit or earlier when a concrete target direction is available.

## DS-170-08 — Final user journey

Run the complete product journey after all DS-170 implementation work:

1. sign up and sign in;
2. create a project;
3. complete Brand;
4. author and edit Tokens;
5. map and preview Themes;
6. edit Component contracts;
7. review Accessibility and save a report;
8. generate, copy and download Documentation;
9. preview, copy and download Exports;
10. configure and save AI Instructions;
11. update Settings;
12. switch projects while preserving context;
13. repeat critical interactions on mobile and with keyboard navigation.

Any functional defect discovered during this journey is resolved before the large refactor begins.

## Delivery strategy

- one focused branch and pull request per numbered step;
- draft PRs until automated validation and manual QA are complete;
- no opportunistic schema changes outside DS-170-05;
- no visual-only control without a defined action;
- preserve existing business behavior unless the step explicitly changes it;
- squash merge after approval.

## Phase definition of done

DS-170 is complete when:

- all eight steps are merged;
- Overview and Brand are operational;
- topbar, project switcher and compact navigation are functional and accessible;
- Themes mapping is responsive and uses the shared Select;
- Settings and public surfaces match the product visual system;
- no unapproved legacy palette, typography or native Select debt remains;
- the full FR/EN responsive user journey passes;
- the repository is ready for the planned large refactor.
