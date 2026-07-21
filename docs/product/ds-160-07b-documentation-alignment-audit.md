# DS-160-07-B — Documentation page alignment audit

## Objective

Align the existing Documentation generator with the validated MVP mockup while preserving the DS-150 generation, localization, preference persistence, copy and download behavior.

## Mockup contract

The validated Documentation screen uses a two-surface workspace:

- a compact configuration column on the left;
- a large documentation preview on the right;
- locale segmented controls;
- a stacked list of included sections;
- a compact format selector;
- primary generation action with copy and download shortcuts;
- a preview toolbar exposing the generated filename, character count and Rendered / Source tabs.

The preview is the dominant surface. Configuration remains dense and readable rather than being presented as a large marketing-style card.

## Current implementation gaps

- the page uses a centered max-width layout instead of the project workspace frame;
- the page title is separated from the generator rather than integrated into the left configuration column;
- controls use large rounded cards and native inputs without the compact mockup treatment;
- source quality and fallback information consume separate full-width cards above the preview;
- the preview is source-only and does not expose a Rendered / Source switch;
- filename and section metadata do not match the mockup toolbar hierarchy;
- loading and error surfaces are not aligned with the target workspace.

## Implementation direction

### Desktop

- use a full-height workspace below the project topbar;
- left configuration column: `20rem` at `xl`, with its own vertical scroll;
- right preview column: flexible width, independent vertical scroll;
- separate both surfaces with a vertical border;
- keep the preview toolbar sticky within the preview surface;
- make Rendered the initial preview mode while retaining Source.

### Compact layouts

- stack configuration before preview;
- preserve all actions and status information;
- avoid horizontal overflow;
- keep the preview toolbar usable on narrow widths;
- allow source content to scroll horizontally inside its own code surface.

## Product boundary

- no documentation generator domain rewrite;
- no new persisted format;
- no Markdown bundle implementation in this ticket;
- no AI-guidelines or changelog section implementation;
- no changes to saved profile schema;
- no export-history changes;
- no server-side download endpoint.

Unavailable mockup options must not be presented as functional controls. The aligned page exposes only the locale, sections and Markdown output supported by the current product.

## Quality and fallback information

Source-quality and missing-translation signals remain available but are compressed into the configuration surface:

- concise status summary near the locale selector;
- expandable details for source-quality issues and translation fallbacks;
- localized FR/EN labels;
- no loss of issue paths or severity information.

## Visual QA refinements

The first visual review identified four compact-column issues that are part of the alignment contract:

- a project with one supported locale uses a static full-width language status instead of an incomplete-looking segmented control;
- copy and download shortcuts use the same 44px action height as Generate and expose clearly legible 20px icons;
- action feedback is grouped with the action row and disappears when empty, preserving a regular vertical rhythm;
- saved documentation preferences use a compact vertical card with a full-width action instead of squeezing copy and button into competing columns.

## Acceptance targets

- page visually follows the mockup's two-surface editor layout;
- generation, copy, download and saved-profile behavior remain intact;
- Rendered and Source previews use the same generated Markdown;
- generated filename and character count are visible in the preview toolbar;
- locale and section controls are keyboard accessible;
- compact layouts stack without horizontal page overflow;
- loading and error states use the same workspace direction;
- FR and EN remain complete;
- targeted tests and `npm run quality` pass before merge.
