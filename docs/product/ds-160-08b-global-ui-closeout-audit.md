# DS-160-08-B — Global UI closeout

## Objective

Close DS-160 with a focused pass over loading, error and empty states, visible localization gaps and the remaining project-workspace contract decisions.

This pass preserves all existing routes, persistence, editor behavior and generator output.

## Scope

- project workspace loading states;
- project workspace error states;
- settings loading and error states;
- shared empty-state presentation;
- visible FR/EN gaps found during the pass;
- Components workspace contract decision;
- final responsive and keyboard regression checklist;
- standard Quality workflow.

## Shared state contract

`WorkspaceState` is the shared primitive for non-content states that need a title, description and optional recovery action.

It supports:

- default, warning and danger tones;
- start or center alignment;
- three controlled maximum widths;
- heading levels 1 to 3;
- an optional eyebrow and icon;
- solid or dashed borders;
- native HTML attributes such as `role="alert"`.

`EmptyState` and `ComponentRegistryState` now reuse this primitive instead of maintaining unrelated typography, spacing and radius rules.

## Error-state alignment

The following boundaries now use the same danger-state hierarchy and retry action:

- Tokens;
- Themes;
- Components;
- Accessibility;
- Documentation;
- Exports;
- AI Instructions;
- Settings.

The route boundary still owns placement, while `WorkspaceState` owns the card hierarchy. Every error boundary exposes `role="alert"`, an explicit heading and the existing localized retry label.

Documentation, Exports and AI Instructions no longer duplicate the same failure message in multiple workspace columns.

## Loading-state alignment

All touched loading routes follow the same accessibility rule:

1. one localized, screen-reader-only `role="status"` message;
2. visual skeletons marked `aria-hidden="true"`;
3. skeleton geometry that approximates the resolved workspace;
4. semantic surfaces, borders and compact radii from the application UI system.

The Tokens loading route was rebuilt because its previous centered cards no longer represented the two-surface editor and inspector layout.

Documentation, Exports and AI Instructions no longer display the word “Loading” as a visual eyebrow. Their visual placeholders now represent the real page header hierarchy.

## Empty-state alignment

- the shared `EmptyState` uses the same compact radius, spacing and hierarchy as other workspace states;
- Components empty and error states reuse the shared primitive through `ComponentRegistryState`;
- Tokens invalid data, empty search results and projects with no token sets use the same state hierarchy;
- token-set absence copy now comes from `TokensEditorPage.states.emptyTitle` and `emptyDescription` instead of hardcoded English.

## Localization finding fixed

The Tokens workspace contained a visible English-only fallback:

- `No token sets found.`
- `This project does not contain token sets yet.`

The UI now reads the existing FR/EN message keys through `next-intl`. No schema or message-shape change was required.

## Components workspace decision

Components keeps its dedicated registry/editor/preview contract.

It should not receive a conventional project page header because:

- the left registry is the primary workspace identity and navigation surface;
- the editor title belongs to the selected component rather than the route;
- the preview is a persistent third work surface on wide screens;
- compact layouts already expose explicit Registry, Editor and Preview tabs;
- introducing another route header would reduce vertical space and duplicate context.

This is now an intentional documented exception, not an unfinished header migration.

## Product boundary

- no route changes;
- no Prisma or persistence changes;
- no editor or generator business-logic rewrite;
- no generated-file changes;
- no new product feature;
- no claim that automated checks replace visual review.

## Automated validation

The standard Quality workflow must pass:

- Prisma Client generation;
- ESLint;
- TypeScript;
- Prettier check;
- Vitest;
- production build.

Focused coverage includes the shared workspace-state hierarchy, tones, heading levels, width rules, action slot and compact empty-state presentation.

## Manual QA checklist

Review FR and EN at desktop, tablet and mobile widths.

### Loading states

- skeletons do not create global horizontal overflow;
- Tokens resembles the list + inspector workspace;
- Themes and Components preserve their compact panel navigation footprint;
- Accessibility preserves the issue rail footprint on wide screens;
- Documentation and AI preserve configuration + preview columns;
- Exports preserves catalog + code-preview columns;
- Settings uses compact cards rather than legacy oversized radii.

### Error states

- each route presents one clear failure card;
- retry buttons remain keyboard reachable and visible;
- long French descriptions do not overflow;
- the error card remains centered without hiding project navigation;
- screen readers receive an alert through the state root.

### Empty states

- no-token-set and empty-token-set states use localized copy;
- invalid token data uses the danger tone;
- Themes, Accessibility and Components empty states retain their actions and descriptions;
- compact radii and spacing remain consistent.

### Keyboard regression

- Tab reaches every retry action;
- Enter and Space activate retry buttons;
- existing Tokens, Themes and Components navigation still behaves as before;
- no skeleton placeholder becomes focusable.

### Critical-path regression

- open and edit a token;
- switch and edit a theme;
- select and edit a component contract;
- inspect an accessibility issue and save a report;
- generate, copy and download Documentation;
- preview, copy and download an Export;
- update and save AI Instructions preferences;
- open Settings and confirm the normal content is unchanged.

## Definition of done

DS-160 can close when:

- the standard Quality workflow passes;
- responsive FR/EN visual QA passes;
- loading, error and empty states pass the manual review;
- the keyboard and critical-path smoke tests pass;
- no visible hardcoded English remains in the reviewed P0 workspace states.
