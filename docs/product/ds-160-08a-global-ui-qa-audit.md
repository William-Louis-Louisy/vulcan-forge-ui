# DS-160-08-A — Global UI QA: project workspace headers

## Objective

Start the DS-160-08 final responsive, bilingual and visual QA phase with one focused cross-page contract: project workspace headers.

Exports is the approved visual reference. This substep turns its hierarchy into a reusable application primitive without changing editor or generator business logic.

## Scope

- shared project workspace header primitive;
- title, description, status, contextual actions and secondary navigation slots;
- compact-only project context;
- adoption across project workspaces that expose a page header;
- visible focus treatment for custom controls reviewed during the cross-page pass;
- removal of visible or persisted hardcoded English found in the touched flow;
- automated quality validation.

## Shared header contract

`ProjectWorkspaceHeader` owns the stable hierarchy:

1. optional eyebrow;
2. page title with optional status metadata;
3. concise page description;
4. project name on compact layouts only;
5. contextual actions aligned opposite the title block when space allows;
6. optional footer for tabs or secondary navigation.

Two surface variants are supported:

- `embedded`: used inside an existing padded control or catalog surface;
- `bar`: owns the workspace border, background and responsive horizontal padding.

The component deliberately does not encode page-specific actions, status colors or navigation behavior.

## Adoption matrix

| Workspace | Header use | Context retained |
| --- | --- | --- |
| Tokens | bar + toolbar + token-set tabs | warning summary and search/create actions |
| Themes | bar + theme count + theme tabs | responsive editor/preview navigation |
| Accessibility | bar + save action | validation content and issue-detail rail |
| Documentation | embedded in configuration column | eyebrow and compact project name |
| Exports | embedded in catalog | availability status and legacy switch |
| AI Instructions | embedded in configuration column | eyebrow and compact project name |

Components keeps its dedicated registry/editor/preview navigation in this substep. Its three-panel shell does not expose the same page-header contract and should not be forced into the abstraction without a separate layout decision.

## Cross-page QA findings fixed

### Project context

The project name is no longer repeated in desktop page titles when the project breadcrumb already provides that context. It remains visible below the description on compact layouts.

### Keyboard focus

Several custom controls used visually hidden native inputs while applying focus styles to a sibling element. The focus indication is now applied through the containing label with `focus-within`:

- Documentation locale segments and section switches;
- AI Instructions locale segments, strictness cards and section switches;
- Exports legacy compatibility switch.

Native input semantics and keyboard activation remain unchanged.

### i18n

Export copy and download failures recorded in the recent-export log now use the current interface locale instead of hardcoded English.

Themes and Accessibility receive dedicated localized workspace titles so their desktop headers no longer need to repeat the project name.

## Product boundary

- no route changes;
- no persistence or Prisma changes;
- no generator-domain changes;
- no token, theme, component, accessibility, documentation, export or AI data-flow rewrite;
- no new product feature;
- no claim that automated checks prove visual correctness.

## Automated validation

The PR must pass the standard Quality workflow:

- Prisma Client generation;
- ESLint;
- TypeScript;
- Prettier check;
- Vitest;
- production build.

Targeted coverage includes the shared header hierarchy, compact project context, bar surface, footer slot, Themes workspace integration and localized export failure copy.

## Manual QA checklist

Review both FR and EN at desktop, tablet and mobile widths.

### Header hierarchy

- page title size and weight remain consistent;
- descriptions use the same muted hierarchy;
- project names are absent from desktop content headers and present on compact layouts;
- status badges stay adjacent to titles;
- contextual actions align correctly without shrinking the title block;
- tabs remain visually attached to their header.

### Responsive behavior

- long French labels do not overlap actions;
- actions wrap below the title block when required;
- no global horizontal overflow;
- mobile editor/preview navigation remains usable;
- control and preview scroll regions remain unchanged.

### Keyboard smoke test

- tab through Documentation locale and section controls;
- tab through AI Instructions locale, strictness and section controls;
- tab to the Exports legacy switch;
- verify a visible focus indicator before activation;
- verify Space activates radios and checkboxes;
- verify Themes tabs still support arrows, Home and End;
- verify Documentation preview tabs remain keyboard reachable.

### Regression smoke test

- edit a token and confirm the existing editor flow remains intact;
- switch a theme and confirm editor/preview behavior;
- inspect an accessibility issue and save a report;
- generate, copy and download Documentation;
- preview, copy and download an Export;
- change AI strictness/sections, save preferences, copy and download instructions.

## Remaining DS-160-08 work

After this focused PR is visually approved, the final closeout pass should review:

- cross-page loading, error and empty-state consistency;
- any remaining hardcoded visible strings;
- full keyboard traversal of the critical path;
- final desktop/tablet/mobile and FR/EN visual sweep;
- whether the Components shell needs a distinct documented header/navigation contract;
- final `npm run quality` before closing DS-160.
