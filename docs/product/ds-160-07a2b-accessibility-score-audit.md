# DS-160-07-A2b — Accessibility score explanation audit

## Objective

Make the automated accessibility score understandable without changing its formula or implying that it represents WCAG compliance.

DS-160-07-A2 expanded the number of token, component and theme issues included in the report. Projects can consequently reach the score floor more quickly even when their contrast results have not changed.

## Current formula

The score currently uses fixed issue penalties:

```txt
100 - (critical issues × 25) - (warnings × 10)
```

The displayed score cannot be lower than zero.

This means that:

- four critical issues are enough to display `0/100`;
- additional issues can produce a negative raw value while the visible score remains zero;
- the score is a prioritization signal, not a percentage of successful checks;
- `0/100` does not mean that the design system is `0%` WCAG compliant.

## UI clarification

Add an information control beside the indicative-score label in the validation summary.

The control must:

- open on click or keyboard activation;
- expose its expanded state and controlled panel;
- close from its dedicated close action, Escape or an outside pointer action;
- return focus to its trigger after keyboard dismissal;
- show the fixed formula;
- show the current critical and warning counts;
- show each penalty, the total penalty and displayed score;
- expose the negative raw result when the visible score has been floored;
- repeat that the score is not a WCAG compliance percentage or certification.

## Domain clarification

Centralize the base score and penalty values in a dedicated accessibility-score module. The report generator and explanatory UI must consume the same breakdown so the displayed explanation cannot drift from the calculation.

## Non-goals

- no score-formula redesign;
- no weighting by rule family or affected item count;
- no manual checklist;
- no WCAG certification claim;
- no persistence-schema change;
- no report-history comparison.

## Acceptance targets

- a `0/100` score can be explained from the visible issue counts;
- the formula and current deductions are available in FR and EN;
- mouse, touch and keyboard users can open the explanation;
- Escape dismissal restores focus to the trigger;
- the score generator and UI use the same constants and breakdown;
- the existing report score and status thresholds remain unchanged;
- unit and component tests cover normal and floored scores;
- `npm run format` and `npm run quality` pass before merge.
