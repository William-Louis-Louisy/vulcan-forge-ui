# DS-160-07-A1c — Accessibility issue-detail rail audit

## Objective

Promote the Accessibility Center issue detail from a card-like sticky column inside the report content to a true page-level desktop rail, aligned with the structural treatment already used by the Themes workspace.

## Problem statement

The previous implementation used a nested responsive grid inside the page scroll container. Although the issue detail was sticky and visually separated, it remained:

- constrained by the report content padding;
- styled as a rounded card with a full border;
- aligned with the issues table instead of the top of the page workspace;
- part of the same page-level scroll context;
- visually different from the persistent Themes preview rail.

This did not fully match the validated Accessibility mockup, which presents issue detail as a dedicated third workspace region.

## Desktop layout contract

At the `xl` breakpoint:

- the page workspace fills the available project-editor height;
- the left column owns the page header and the scrollable report content;
- the issue detail occupies a fixed-width `23rem` right rail;
- the rail starts at the top of the page workspace below the shared project topbar;
- the rail uses `background-sunken` and a left separator border;
- the rail has independent vertical scrolling;
- the rail does not use card margins, rounded corners or a full surrounding border;
- changing the selected issue updates the rail without changing the left-column scroll position;
- the rail height does not affect the position of the contrast table.

## Compact layout contract

Below `xl`:

- the page remains a single scrollable column;
- the content order remains validation context, issues, selected issue detail, then contrast pairs;
- the selected detail retains the compact bordered-card treatment;
- no horizontal page overflow is introduced;
- issue selection updates the compact detail region.

The compact and desktop detail regions share the same issue data and action logic. Only their responsive presentation differs.

## Loading and empty states

- the loading route mirrors the full-height desktop rail and compact stacked detail;
- the desktop rail skeleton has its own background, separator and scroll region;
- when no issue exists, no empty desktop rail is reserved and the main workspace uses the available width;
- the localized empty issues state remains unchanged.

## Product boundary

This correction changes layout only. It does not change:

- automated accessibility rules;
- score calculation or score explanation;
- report persistence;
- issue selection semantics;
- issue recommendations or source links;
- the manual-checklist roadmap;
- report history.

## Acceptance targets

- desktop visually exposes a true full-height issue-detail rail comparable to the Themes preview rail;
- the page header belongs to the left workspace column rather than spanning behind the rail;
- the left report column and right detail rail scroll independently;
- the desktop detail rail has a left border and sunken background with no rounded card frame;
- compact layouts retain the order issues → detail → contrast pairs;
- the first issue remains selected by default;
- selecting another issue updates both responsive detail representations;
- loading and empty states respect the same layout contract;
- existing FR/EN content and functionality remain unchanged;
- `npm run format` and `npm run quality` pass before merge.
