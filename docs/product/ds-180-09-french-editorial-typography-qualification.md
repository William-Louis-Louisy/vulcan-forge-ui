# DS-180-09 — French editorial and typography qualification

## Status

- **Type:** Learn V1 editorial / localization / typography qualification.
- **Parent roadmap:** DS-180 Learn & Product Education.
- **Scope:** `/fr/learn` hub + Chapters 01–07 only.
- **Product behavior changes:** none.
- **Purpose:** qualify the complete French Learn experience before DS-180 can close and before DS-181 begins.

## Required review dimensions

1. Natural French rather than literal English calques.
2. Consistent Design System terminology across all eight public Learn surfaces.
3. Deliberate handling of technical English terms when keeping the industry term is clearer than inventing a translation.
4. French punctuation and spacing rules, including narrow no-break spaces inside `« … »` and non-breaking spacing before relevant high punctuation.
5. List punctuation: commas for continuous enumerations unless a semicolon is genuinely required by sentence structure.
6. Numbers and units kept together where they appear in prose examples.
7. Line-break safety for quoted phrases and other typographic groups that must not strand punctuation on a line.
8. Removal of stale incremental-publication copy now that all seven chapters are published.
9. Audit of user-visible strings defined directly in Learn page code, not only strings owned by message modules.

## Terminology contract for Learn FR

- **Design System**: keep the established industry term and capitalize consistently when referring to the concept/artifact.
- **design token / token**: keep `token` in product/domain vocabulary; avoid awkward literal alternatives.
- **Component / composant**: use `composant` in ordinary explanatory prose; preserve exact product labels or code/domain identifiers when they are intentionally named `Component`/`Components`.
- **Theme / thème**: use `thème` in ordinary prose; preserve exact product workspace labels only where the UI name itself is discussed.
- **focus / focus visible**: prefer `focus` only where it names the established UI/technical concept; otherwise explain as `indicateur de focus` or `état de focus`.
- **fallback**: prefer `langue de repli` / `contenu de repli` in explanatory French instead of `fallback`.
- **strictness**: prefer `niveau de contrainte` / `niveau d’exigence` in explanatory French; preserve exact enum values `balanced`, `strict`, `veryStrict` where product truth requires them.
- **forbidden patterns**: prefer `usages interdits`, `pratiques interdites` or `règles d’interdiction` depending on context, not the raw English expression.
- **source of truth**: prefer `source de référence` or `source canonique` rather than the literal calque `source de vérité`.
- **workflow**: prefer `parcours`, `enchaînement` or `flux` in explanatory prose.
- **machine-readable**: prefer `structuré et exploitable par une machine` where `lisible par les machines` sounds unnatural.

## Typography contract

- French guillemets use `« … »` with U+202F narrow no-break spaces.
- Before `:`, `;`, `?`, and `!`, use a non-breaking French spacing strategy in user-visible prose so punctuation cannot strand at the beginning of a line.
- Do not add a space before `.`, `,`, or an ellipsis.
- Keep numbers with short units where possible (`10 px`, `4,5:1` when localized prose uses a decimal comma; preserve code/data literals when exact product values are intentionally displayed).
- Avoid hard-coded presentational line breaks in translation strings; use typographically meaningful non-breaking spaces instead.

## Implementation

The qualification is applied as a final scoped Learn-message layer instead of rewriting every historical chapter module in place.

```text
existing Learn chapter messages
        ↓
DS-180-09 editorial overrides
        ↓
final audit addenda
        ↓
French-only typography normalization
        ↓
final Learn messages served by next-intl
```

This keeps the chapter history readable while making the final qualified copy explicit and testable in one place.

### Editorial override layers

`src/messages/learn-qualification-messages.ts` contains the main wording changes introduced during qualification. It is merged after the hub and seven chapter modules, so unchanged source copy continues to come from the chapter that owns it.

`src/messages/learn-qualification-followup-messages.ts` contains the small set of final corrections discovered during the cross-source audit after the main pass. Keeping those corrections as a last merge layer makes the late findings explicit instead of silently rewriting the historical chapter modules.

The English side is intentionally minimal and only removes stale incremental-publication states now that all seven chapters exist.

### Hard-coded public copy

The audit also covers user-visible text defined directly in Learn page code. Chapter 07 previously exposed profile labels such as `AI Instructions profile`, `locale` and `strictness` directly from JSX; those labels now resolve from locale-aware values so the French route no longer leaks English explanatory copy while exact enum values remain unchanged.

### Typography normalization

`src/messages/learn-french-typography.ts` recursively normalizes the final French Learn tree. It is deliberately scoped to Learn instead of modifying every application message.

It currently protects:

- French guillemet spacing;
- high punctuation spacing before `:`, `;`, `?`, `!`;
- short `px` and `ms` units when written in prose.

Compact code syntax and ratios are not rewritten merely because they contain punctuation.

### Regression strategy

Tests reconstruct the same final Learn FR message tree used by the request configuration, then assert the qualified result rather than checking only isolated source modules.

The regression suite covers:

- curriculum completion language and statuses;
- targeted recurring English calques;
- French guillemets and high punctuation;
- number/unit grouping;
- checkpoint punctuation;
- localized pedagogical contrast ratios;
- the important AI-guidance boundary (`demandent`, not `imposent`).

## Exit criteria

- Hub + seven chapters reviewed end to end in French.
- No obvious literal-English calques remain in Learn explanatory copy.
- Terminology follows the contract above.
- French guillemets and high punctuation do not create typographically invalid line breaks.
- Stale `publication progressive` wording is removed now that Learn V1 is fully published.
- EN keys/content remain semantically unchanged except where tests or shared metadata must reflect curriculum completion.
- Quality CI is fully green.
- Manual QA covers desktop and mobile widths on all eight French Learn routes.

## Closure rule

DS-180 must not be considered complete until this qualification is merged and manually accepted. Only then may the roadmap proceed to DS-181.
