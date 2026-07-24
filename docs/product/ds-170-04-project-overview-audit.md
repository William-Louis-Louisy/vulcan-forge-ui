# DS-170-04 — Project Overview audit

## Objective

Replace the project-root redirect with a real Overview workspace that summarizes the current design-system model, exposes actionable product signals and gives users a reliable starting point before entering a dedicated editor.

## Product boundary

The Overview is a read-only synthesis surface.

It:

- derives its state from existing project, token, theme, component, accessibility and export data;
- does not introduce a new health, activity or recommendation table;
- does not persist computed scores or recommendations;
- does not invent historical events when no audit-log record exists;
- does not change generator, editor or persistence behavior;
- leaves Brand disabled until DS-170-05;
- keeps the existing accessibility score explicitly indicative rather than presenting it as WCAG certification.

No Prisma schema or migration change is required.

## Project-root behavior

`/[locale]/app/projects/[projectSlug]` now renders the Overview instead of redirecting to Tokens.

The Overview navigation item is enabled in the shared project navigation configuration, so the same destination is available from:

- the persistent desktop project sidebar;
- the compact application menu;
- project switching when the current top-level section is Overview.

The Tokens destination remains unchanged and continues to use `set=color` as its default editor context.

## Data access

`getProjectOverviewPageData` performs a workspace-member-scoped project query.

It loads only the existing data required to build the Overview:

- project metadata and supported locales;
- token sets and their update timestamps;
- themes and their update timestamps;
- component contracts and their update timestamps;
- the latest persisted accessibility report;
- export logs;
- Documentation and AI Instructions profile update timestamps.

The route keeps the existing authenticated and localized access contract. A missing or unauthorized project resolves through the normal not-found path.

## Aggregation engine

`createProjectOverviewViewModel` is independent of React and owns the synthesis rules.

### Tokens

The engine:

- validates persisted entries with the domain token schema;
- counts total, valid and invalid entries;
- counts ready, draft and deprecated entries;
- calculates coverage for color, spacing, radius, typography and motion;
- detects missing descriptions for every locale supported by the project;
- never allows malformed token-set data to produce a negative valid count.

### Themes and accessibility

The engine reuses `createAccessibilityCenterReport` rather than introducing a second validation implementation.

It exposes:

- the current indicative score and status;
- critical and warning issue counts;
- configured light and dark modes;
- total, passing, warning, failing and missing contrast pairs.

The Overview does not use an older persisted report as the current score. The live project model remains the source of truth; the persisted report is used only as a real recent-activity signal.

### Components

Persisted component contracts are parsed with the domain schema.

The Overview distinguishes:

- valid and invalid contracts;
- ready, draft and deprecated contracts;
- the current registry items displayed in the summary.

### Exports

The product supports six export formats. Availability is kept separate from actual generation history.

The Overview calculates:

- the number of available product formats;
- formats with at least one successful export log;
- formats that have never been generated successfully;
- formats whose last successful export predates the newest relevant project content update;
- recent real export logs.

A displayed generated or stale state therefore comes from persisted export logs rather than mockup values.

### Recent activity

Recent activity is derived from timestamps already present in the model:

- token-set updates;
- theme updates;
- component-contract updates;
- saved accessibility reports;
- export logs.

Items are sorted newest first and capped for the Overview. No event text claims a granular mutation that cannot be proven by the available data.

### Recommended actions

Recommendations are deterministic links to real product destinations.

They are prioritized in this order:

1. critical validation issues;
2. invalid token data;
3. failing, warning or incomplete contrast pairs;
4. missing localized token descriptions;
5. missing themes;
6. missing or draft component contracts;
7. stale exports;
8. export formats not generated yet.

Only the four highest-priority actions are displayed. Every action navigates to the relevant editor or review surface.

## Responsive workspace

### Wide desktop

From `xl`, the Overview uses a two-region workspace:

- a scrollable synthesis column;
- the existing Themes preview rail on the right.

The preview is generated from the current color token set and project themes. No second preview implementation is introduced.

### Desktop and tablet

The synthesis column contains:

- project identity and metadata;
- the indicative health summary;
- four principal metrics;
- recommended next actions;
- Tokens, Themes, Components and Exports summaries;
- recent activity.

Detailed summary cards use responsive grids without forcing the wide preview rail into a narrow workspace.

### Mobile

The preview rail is removed from the compact composition. The route keeps:

- project context;
- score and principal metrics;
- prioritized actions;
- stacked product summaries;
- recent activity.

This follows the validated mobile information hierarchy rather than compressing the desktop rail.

## Internationalization

All new visible copy is available in English and French through the scoped `ProjectOverviewPage` messages.

The next-intl application message type includes the new scoped messages, preserving typed keys and typed interpolation values.

Locale-aware relative dates use `Intl.RelativeTimeFormat`; older entries fall back to localized date and time formatting.

## Route states

The route includes dedicated localized states:

- a loading skeleton that mirrors the Overview and wide preview composition;
- a recoverable semantic error state using `WorkspaceState`;
- empty product-area states for projects without Tokens, Themes, Components, Exports or recent activity;
- partial states for projects containing malformed or incomplete domain data.

## Automated coverage

Focused aggregation tests cover:

- synthesis of a populated project from existing seed data;
- invalid token entries and locale-specific description gaps;
- malformed token-set data without negative counts;
- stale export detection after newer content changes;
- recommendation ordering and the four-action limit;
- newest-first recent-activity ordering.

The standard Quality workflow must pass on the final branch head:

- lint;
- TypeScript strict typecheck;
- formatting;
- tests;
- production build.

Temporary diagnostic workflow changes are not part of the final branch state.

## Manual QA checklist

Review the project root in FR and EN with representative populated, incomplete and newly created projects.

### Navigation

- opening a project lands on Overview rather than Tokens;
- Overview is enabled and identifiable in desktop navigation;
- Overview is enabled and identifiable in the compact application menu;
- project switching from Overview opens Overview in the target project;
- Tokens still opens with the expected color set;
- Brand remains disabled with its existing coming-soon treatment.

### Data integrity

- token totals match the Tokens editor;
- missing localized descriptions match real token content;
- theme and contrast counts match the Accessibility and Themes workspaces;
- component statuses match the Components registry;
- generated exports correspond to real successful logs;
- a format modified after its last successful export is marked stale;
- no mockup-only metric or activity appears.

### Recommended actions

- every displayed action describes a real current gap;
- actions are ordered by impact;
- no more than four actions are displayed;
- each action opens the correct localized destination;
- a healthy complete project uses the no-immediate-action state.

### Responsive layout

- desktop exposes the independent preview rail from `xl`;
- the synthesis column and preview rail scroll without overlap;
- tablet keeps a readable single-column synthesis layout;
- mobile follows the score, metrics and actions hierarchy;
- no horizontal overflow occurs;
- long project names, descriptions and localized labels remain contained.

### Themes and appearance

- the preview reflects current project themes and tokens;
- Light and Dark switching remains functional in the preview rail;
- empty theme data uses the existing preview empty state;
- selected, warning, success and danger states remain clear in light and dark application appearance.

### Keyboard and accessibility smoke test

- Tab reaches every Overview action and destination link;
- focus remains visible;
- links use link semantics and navigate with Enter;
- loading status is exposed once to assistive technology;
- error recovery is keyboard reachable;
- the score disclaimer remains visible and does not claim automated certification.

## Validation status

- implementation: complete;
- scoped aggregation tests: implemented;
- lint: passed on the implementation workflow;
- typecheck: passed on the implementation workflow;
- formatting: passed on the implementation workflow;
- tests: passed on the implementation workflow;
- production build: passed on the implementation workflow;
- final standard Quality workflow: pending after documentation closeout;
- responsive FR/EN visual review: pending;
- navigation, recommendation and data-integrity smoke tests: pending;
- keyboard and light/dark appearance review: pending.

## Definition of done

DS-170-04 is complete when:

- the project root renders Overview;
- Overview navigation is enabled on desktop and compact layouts;
- the standard Quality workflow passes on the final branch head;
- populated, incomplete and empty project states pass in FR and EN;
- responsive desktop, tablet and mobile review passes;
- recommendations and activity remain grounded in real project data;
- keyboard and light/dark smoke tests pass;
- the product owner completes the final manual QA;
- no temporary diagnostic workflow or file remains in the final diff.
