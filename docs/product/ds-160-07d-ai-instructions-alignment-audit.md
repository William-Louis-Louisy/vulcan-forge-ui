# DS-160-07-D — AI Instructions page alignment audit

## Objective

Align the existing AI Instructions generator with the validated MVP mockup while preserving localized generation, strictness, section selection, saved preferences, copy/download behavior and source-quality diagnostics.

## Mockup contract

The validated AI Instructions screen uses a two-surface editor workspace:

- a compact configuration column on the left;
- a dominant full-height rules preview on the right;
- locale selection;
- three explicit strictness levels;
- compact switches for included sections;
- an assisted-generation disclaimer;
- a toolbar exposing filename, strictness, locale and character count;
- direct copy and download actions;
- a dark, syntax-colored Markdown rules surface.

The preview is a workspace surface, not a nested card. Configuration remains dense and independently scrollable.

## Header reference

Exports is the approved reference for secondary workspace headers:

- concise page title and description;
- no repeated project name on desktop because the project breadcrumb already provides context;
- project name retained on compact layouts;
- contextual status and actions attached to the active workspace surface;
- compact 36px icon-only actions with explicit icon sizing.

## Implementation direction

### Desktop

- use a full-height workspace below the project topbar;
- configuration column: `20rem` at `xl`, `22rem` at `2xl`;
- preview column: flexible width and independent scrolling;
- separate both surfaces with a vertical border;
- keep the preview toolbar attached to the rules surface;
- render generated Markdown with lightweight semantic syntax colors.

### Compact layouts

- stack configuration before preview;
- retain project context below the page description;
- keep every control and action available;
- allow source code to scroll within its own surface without page-level horizontal overflow;
- keep native radio and checkbox semantics behind the styled controls.

## Functional boundary

- no AI instruction domain rewrite;
- no new generated section;
- no fake `project identity` or `few-shot samples` controls when the domain does not model them;
- anti-hallucination rules remain mandatory and cannot be disabled;
- no persistence schema change;
- no generation history;
- no server-side file storage;
- no runtime syntax-highlighting dependency.

## Diagnostics

Source quality and translation fallbacks remain available in a compact expandable diagnostics panel. The panel retains:

- source readiness status;
- critical, warning and informational counts;
- issue paths, labels and severity;
- missing translation paths and fallback locales.

Diagnostics inform the user but do not block generation.

## Acceptance targets

- page visually follows the mockup's configuration + rules-preview structure;
- Exports header hierarchy is respected;
- locale, strictness and section changes update the preview immediately;
- one supported locale is presented as a deliberate static project constraint;
- anti-hallucination rules remain visibly mandatory;
- preferences continue to persist through the existing action;
- copy and download use the exact generated content;
- generated source remains readable with semantic syntax colors;
- source quality and translation fallbacks remain complete and localized;
- loading and error states use the same workspace direction;
- compact layouts stack without horizontal page overflow;
- FR and EN remain complete;
- targeted tests and `npm run quality` pass before merge.
