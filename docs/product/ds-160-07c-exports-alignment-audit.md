# DS-160-07-C — Exports page alignment audit

## Objective

Align the existing Export Center with the validated MVP mockup while preserving all six generators, saved Documentation and AI Instruction preferences, copy/download behavior, diagnostics and export logging.

## Mockup contract

The validated Exports screen uses a two-surface workspace:

- a scrollable export catalog on the left;
- a full-height code preview rail on the right;
- six compact format cards arranged in a two-column grid;
- a visible ready/review status per output;
- filename, approximate file size, platform and locale metadata;
- Preview, Copy and Download actions on each format;
- a recent export log below the catalog;
- a preview toolbar with filename and direct actions;
- a compact footer describing the selected output.

The code preview is a workspace rail, not a nested card. The catalog remains dense and operational rather than using large marketing-style panels.

## Current implementation gaps

- the page uses a centered max-width layout instead of the full project workspace;
- export formats are radio rows inside a large settings card;
- Copy and Download are global actions disconnected from individual formats;
- diagnostics and history appear before the preview as large rounded cards;
- the preview is a nested card rather than an independent rail;
- format status, file size, platforms and locale are not visible in the catalog;
- loading and error states do not follow the target workspace structure.

## Implementation direction

### Desktop

- use a full-height workspace below the project topbar;
- flexible catalog column with independent vertical scrolling;
- `30rem` preview rail at `xl`, increasing to `34rem` at `2xl`;
- separate both surfaces with a vertical border;
- keep the preview toolbar and output metadata attached to the rail;
- allow code to scroll independently in both axes.

### Compact layouts

- stack catalog before preview;
- preserve every format action;
- keep format cards in one column when width is constrained;
- allow code to scroll inside its own surface without creating page overflow;
- keep export history readable without relying on a wide table.

## Product boundary

- no generator-domain rewrite;
- no new export format;
- no ZIP or multi-file bundle implementation;
- no server-side file storage;
- no export-history schema change;
- no change to saved Documentation or AI Instruction profile behavior;
- no fake historical file size data.

Unavailable mockup capabilities must not be presented as functional. Localized Documentation and AI exports continue to use their saved profile locale rather than pretending to generate both languages simultaneously.

## Diagnostics and legacy compatibility

The existing diagnostics remain available in a compact expandable panel tied to the selected output. Deprecated tokens remain excluded by default and can be included through a compact legacy-compatibility switch in the page header.

## Visual QA refinements

The first visual review added the following consistency requirements:

- icon-only download actions use a compact `36px` control with an explicit `20px` icon size, matching adjacent secondary actions;
- the preview rail body uses the sunken code surface while its header and footer use the elevated primary surface, with stronger separators;
- the code preview applies lightweight format-aware syntax colors without adding a large highlighting dependency;
- CSS custom-property names and Markdown/TypeScript identifiers use the product accent, while values use the success color;
- desktop page headers do not repeat the project name already present in the project breadcrumb; the compact layout retains it for context;
- file-extension badges receive subtle type colors: plum for CSS, blue for TypeScript and green for Markdown.

The Documentation workspace follows the same responsive project-name rule so adjacent secondary pages keep a consistent header hierarchy.

## Acceptance targets

- page follows the mockup's catalog + preview-rail structure;
- all six generators still use the same existing domain functions;
- selecting a format updates the preview rail;
- each format exposes direct Preview, Copy and Download actions;
- successful and failed copy/download attempts continue to be logged;
- selected-output diagnostics remain complete and localized;
- recent export logs remain visible and responsive;
- file sizes and character counts are derived from current generated content;
- locale-neutral and localized outputs are clearly distinguished;
- code highlighting remains readable and preserves the exact generated source;
- header, code body and metadata footer remain visually distinct;
- loading and error states use the same workspace direction;
- FR and EN remain complete;
- targeted tests and `npm run quality` pass before merge.
