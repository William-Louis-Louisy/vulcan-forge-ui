# DS-160-06-A — Themes editor frame and responsive audit

## Status

Approved for implementation after DS-160-05 (Components) was merged.

The effective DS-160 sequence is now:

1. DS-160-01 — UI foundations
2. DS-160-02 — authenticated app shell
3. DS-160-03 — dashboard, projects and project shell alignment
4. DS-160-04 — Tokens editor alignment
5. DS-160-05 — Components editor alignment
6. DS-160-06 — Themes editor alignment
7. DS-160-07 — Accessibility, Documentation, Exports and AI Instructions alignment
8. DS-160-08 — final responsive, i18n and visual QA

## Source of truth

The validated Themes mockup uses a project-editor workspace rather than a marketing-page layout.

Desktop structure:

```text
Project topbar
└── Project navigation
    ├── Themes editor
    │   ├── compact page header
    │   ├── Light / Dark tabs
    │   ├── semantic mappings
    │   └── contrast matrix
    └── live preview rail (~380 px)
        ├── preview controls
        ├── component samples
        └── sample paragraph
```

Visible mockup rules:

- compact page title, approximately 26 px rather than a marketing `text-4xl` heading;
- one editor column and one fixed preview rail;
- theme selection is presented as tabs with a visual swatch and default-state indicator;
- semantic mappings use dense rows with token path, alias and resolved value;
- contrast information is presented as a matrix rather than large repeated cards;
- the preview rail uses the selected theme and remains visible beside the editor on desktop;
- mobile prioritizes editing, with preview available as a secondary view instead of forcing both columns into the viewport.

## Current implementation audit

The existing page preserves the required data flows, but its presentation does not match the project-editor mockup:

- `max-w-7xl` centered marketing container;
- large eyebrow and `text-4xl` heading;
- preview displayed as a full-width card above the editor;
- Light and Dark themes rendered simultaneously as large `rounded-3xl` cards;
- semantic token aliases rendered in a second large standalone card;
- page-level natural scrolling without an editor/preview workspace boundary;
- loading and error states still use the previous oversized surface pattern;
- no mobile control to switch explicitly between editor and preview.

The following behavior must be preserved throughout DS-160-06:

- authenticated project access control;
- FR/EN routes and labels;
- theme token reference editing and persistence;
- semantic color alias editing and persistence;
- resolved color values;
- contrast evaluation;
- Light/Dark preview switching;
- saved/unsaved scroll context behavior;
- existing domain utilities and server actions.

## DS-160-06-A scope

This ticket establishes the workspace frame only.

### Desktop

- editor and preview coexist;
- editor consumes the flexible column;
- preview uses a stable rail between 20 and 24 rem depending on viewport;
- editor and preview receive independent scrolling at the large desktop breakpoint;
- no global horizontal overflow.

### Tablet

- editor remains the primary panel;
- preview remains reachable without compressing form controls below usable widths;
- the layout may switch to the same panel selector used on mobile until enough width is available for two columns.

### Mobile

- editor is selected by default;
- a sticky, keyboard-accessible selector switches between Editor and Preview;
- only one panel is visible at a time;
- long token paths and generated text wrap or scroll inside their own containers;
- dialogs and controls remain inside the viewport.

### Page chrome

- replace the oversized marketing header with a compact project-editor header;
- keep the title, project context and description readable without consuming excessive vertical space;
- align loading and error states with the final workspace boundaries.

## Non-goals

Deferred to the next DS-160-06 tickets:

- redesigning the live preview contents (DS-160-06-B);
- rebuilding the Light/Dark mapping editor into the final dense table (DS-160-06-C);
- rebuilding semantic colors and contrast presentation (DS-160-06-D);
- final empty/loading/error copy, full i18n review and viewport QA (DS-160-06-E).

## Acceptance criteria

- the page no longer uses a centered marketing-page frame;
- the preview is a dedicated rail on desktop;
- mobile users can switch explicitly between editor and preview;
- the editor is the default mobile panel;
- the existing edit/save flows remain mounted and usable;
- loading and error states use the same responsive workspace footprint;
- no page-level horizontal overflow at 390, 768, 1024 and 1440 px;
- `npm run format` and `npm run quality` pass before merge.
