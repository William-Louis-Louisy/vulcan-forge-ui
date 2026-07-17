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

## Current implementation

The current page already provides:

- a computed accessibility score and status;
- automated issues derived from token resolution and theme contrast;
- persisted report history through the save-report action;
- localized issue labels and recommendations;
- key contrast-pair details;
- loading and error routes.

The current visual structure is a single long document composed of large rounded cards. Issues are displayed as independent cards, so there is no selected issue or dedicated detail rail.

## Product-model boundary

The current domain model does not contain persisted manual-checklist results. DS-160-07-A must not invent manual validation data or claim a complete WCAG audit.

The manual-checklist block shown in the mockup therefore remains a later product-model enhancement. This ticket keeps the existing assisted-check disclaimer prominent and aligns only the data that genuinely exists.

## Implementation scope

- replace the marketing-style page header with the compact project-editor hierarchy;
- introduce a controlled desktop workspace with a main report area and issue-detail rail;
- make automated issues selectable without changing report generation logic;
- compact the score, latest-report, issue and contrast surfaces;
- align loading and error states with the same controlled frame;
- preserve the report-save server action and save-context behavior;
- preserve FR/EN labels and visible focus states;
- keep mobile and tablet layouts free from page-level horizontal overflow.

## Non-goals

- no manual-checklist persistence;
- no external-site audit;
- no new accessibility rules;
- no score-formula changes;
- no report-schema changes;
- no claim of WCAG certification.

## Acceptance targets

- desktop: report content and issue detail coexist without a second page scrollbar;
- tablet: the issue detail remains readable and the report stacks cleanly;
- mobile: issues and details remain usable without horizontal overflow;
- the first issue is selected by default when issues exist;
- selecting an issue updates the detail region and visible selected state;
- empty issue state remains explicit;
- report save success and error feedback remain accessible;
- loading and error states match the final page frame;
- `npm run format` and `npm run quality` pass before merge.
