# DS-160-07-A — Accessibility Center alignment audit

## Objective

Align the Accessibility Center with the validated project-editor mockup while preserving the existing automated contrast report, persistence flow, localized routes, and access control.

## Visual source of truth

The Accessibility artboard shows a dense project workspace with:

- a compact page header and validation action;
- a validation score summary;
- an issues list/table;
- a persistent issue-detail rail;
- an explicit automated-audit disclaimer;
- a manual checklist area;
- responsive behavior without page-level horizontal overflow.

The 1440px implementation review also exposed a structural layout regression: the issue-detail rail was taller than a short issue table, so the following contrast table started only after the rail height and left a large empty block in the main column.

## Current implementation

The current page provides:

- a computed accessibility score and status;
- automated issues derived from token resolution and theme contrast;
- persisted report history through the save-report action;
- localized issue labels and recommendations;
- selectable issues and a dedicated detail rail;
- accessible color swatches beside HEX values;
- key contrast-pair details;
- loading and error routes.

## DS-160-07-A1b layout correction

The corrected workspace uses one responsive layout contract:

- compact layouts render issues, selected issue detail, then key contrast pairs;
- desktop renders a main column containing issues followed immediately by key contrast pairs;
- the selected issue detail occupies an independent sticky rail;
- the detail rail height no longer controls the vertical position of the contrast table;
- the validation summary is compacted so the report workspace receives visual priority;
- the loading skeleton mirrors the same composition.

The implementation deliberately avoids fixed page heights, negative margins, and absolute positioning for report content.

## Product-model boundary

The current domain model does not contain persisted manual-checklist results. DS-160-07-A must not invent manual validation data or claim a complete WCAG audit.

The manual-checklist block shown in the mockup therefore remains a later product-model enhancement. This ticket keeps the existing assisted-check disclaimer prominent and aligns only the data that genuinely exists.

## Follow-up roadmap

- DS-160-07-A2: expand automated accessibility rules across Tokens, Components and Themes;
- DS-160-07-A3: add a persisted manual accessibility checklist;
- DS-160-07-A4: add report history, comparison and score evolution.

## Non-goals

- no manual-checklist persistence;
- no external-site audit;
- no new accessibility rules;
- no score-formula changes;
- no report-schema changes;
- no claim of WCAG certification.

## Acceptance targets

- desktop: issues and key contrast pairs remain contiguous in the main column;
- desktop: the issue detail remains visible in a sticky rail without creating a blank block;
- tablet: the issue detail remains readable and the report stacks cleanly;
- mobile: the order remains issues, detail, contrast pairs without horizontal overflow;
- the first issue is selected by default when issues exist;
- selecting an issue updates the detail region and visible selected state;
- empty issue state remains explicit;
- report save success and error feedback remain accessible;
- loading and error states match the final page frame;
- `npm run format` and `npm run quality` pass before merge.
