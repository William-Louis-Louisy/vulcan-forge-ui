# DS-160-07-A2 — Expanded automated accessibility rules audit

## Objective

Expand the Accessibility Center beyond theme contrast without inventing manual audit results. The report should evaluate accessibility-related data already persisted in Tokens, Components and Themes, then expose traceable issues that link back to the relevant editor.

## Current implementation

The current report reads:

- the color token set;
- theme mappings and resolved contrast pairs;
- token resolution errors;
- the latest persisted accessibility report.

It does not currently read:

- project supported locales;
- non-color token sets;
- component contracts;
- component states, accessibility rules or token bindings.

The domain already supports the data required for a first expanded automated pass:

- design tokens have an optional localized description;
- projects define a default locale and supported locales;
- component contracts contain localized purpose, anatomy, variants, sizes, states and accessibility rules;
- component contracts contain typed token bindings;
- component contracts expose explicit states that can represent focus-visible behavior.

## Proposed automated rules

### Tokens

1. **Missing localized token description**
   - scope: token documentation;
   - severity: warning;
   - applies to ready tokens;
   - one issue per token, listing all supported locales without a description.

2. **Unresolved token reference**
   - scope: token resolution;
   - severity: critical;
   - preserve the existing rule and extend resolution across every token set used by components.

### Components

3. **Invalid component contract**
   - scope: component contract;
   - severity: critical;
   - emitted when persisted contract JSON cannot be parsed by `componentContractSchema`.

4. **Missing localized component content**
   - scope: component contract;
   - severity: warning;
   - checks purpose and localized labels for anatomy, variants, sizes and states;
   - issues are grouped by component and field to avoid flooding the report.

5. **Missing accessibility rules**
   - scope: component contract;
   - severity: warning;
   - applies to interactive contracts (`button`, `textField`, `dialog`).

6. **Missing focus-visible state**
   - scope: component contract;
   - severity: critical for `button` and `textField`;
   - accepts an explicit normalized state key such as `focus-visible` or `focusVisible`;
   - does not infer focus support from visual styling that is not represented in the contract.

7. **Unresolved component token binding**
   - scope: component binding;
   - severity: critical;
   - emitted when a binding points to a token path that does not exist.

8. **Component token type mismatch**
   - scope: component binding;
   - severity: warning;
   - emitted when the binding declares a token type different from the referenced token.

## Traceability model

Expanded issues need enough context to drive the existing detail rail:

- token path;
- component ID, type and name;
- affected field or binding key;
- missing locales when applicable;
- contextual destination: Tokens, Components or Themes.

The issue table should keep one row per actionable problem. Missing translations should be grouped rather than creating one row per locale.

## Data-query changes

The Accessibility Center query should additionally load:

- project default locale and supported locales;
- every token set needed for documentation and binding validation;
- component contract IDs, types, names and contract JSON.

The current color token set remains the source for theme contrast calculations.

## Scoring boundary

DS-160-07-A2 keeps the existing severity-based score formula initially. The implementation must review issue grouping to prevent repeated localized-field failures from reducing the score disproportionately. A score-formula redesign is not part of this ticket unless the expanded rules demonstrate that the current formula becomes misleading.

## Non-goals

- no persisted manual checklist;
- no browser, DOM or external-site audit;
- no runtime keyboard simulation;
- no claim of WCAG certification;
- no report-history comparison;
- no automated mutation of token or component data.

## Delivery sequence

1. extend query data and report input types;
2. add token documentation rules and tests;
3. add component contract and localization rules and tests;
4. add component binding and focus-visible rules and tests;
5. extend issue labels, scopes, detail metadata and contextual links;
6. run responsive and FR/EN QA without reopening the validated A1b layout.

## Acceptance targets

- existing contrast results remain unchanged for the same input;
- malformed component JSON produces a traceable critical issue rather than crashing the page;
- missing token descriptions identify the affected token and missing locales;
- interactive component contracts without focus-visible coverage are detected;
- invalid component bindings identify the component, binding and token path;
- issue actions open the correct Tokens, Components or Themes editor;
- issue IDs remain stable for identical project data;
- FR and EN contain the same rule and scope structure;
- `npm run format` and `npm run quality` pass before merge.
