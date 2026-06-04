# DS-150 — Critical Path QA Report

## Metadata

| Field      | Value                                                |
| ---------- | ---------------------------------------------------- |
| Epic       | EPIC-16 — QA, accessibilité et stabilisation         |
| Ticket     | DS-150 — Tester le parcours critique de bout en bout |
| Sub-ticket | DS-150-00 — Formaliser le rapport QA structuré       |
| Status     | In progress                                          |
| Scope      | MVP stabilization before UI refactor                 |
| QA type    | Manual critical path QA                              |
| Product    | VulcanForgeUI                                        |

---

## Executive summary

The critical path is technically traversable, but it is not yet product-validable.

Several flows work at a technical level, but the experience exposes major inconsistencies between user-edited data, generated outputs, accessibility reports, themes, and previews.

The main issue is not only visual design. The deeper MVP risk is that some screens still feel driven by seed data, placeholders, incomplete source data, or non-editable models. This weakens the perceived value of the product and makes several core features difficult to evaluate properly.

Before starting the deep UI refactor, the MVP needs a stabilization pass focused on:

- data consistency;
- critical path continuity;
- save behavior;
- theme and accessibility reliability;
- export reliability;
- clearer product intent on confusing pages.

---

## Critical path tested

The tested journey was:

1. Go to `/fr`.
2. Create an account.
3. Create a bilingual design system project.
4. Edit a primitive color token.
5. See the preview update.
6. Check accessibility contrasts.
7. Generate a Tailwind export.
8. Generate French documentation.
9. Generate English AI instructions.
10. Review the components registry.

---

## QA findings by step

### 1. Go to `/fr`

#### Result

Locale switching works correctly.

#### Issue

When the user was signed in with dark mode as preference, the theme was applied correctly. After logout, the theme preference appeared to persist, but switching locale caused the interface to fall back to light mode.

#### Classification

Bug UX / theme persistence.

#### Impact

The public and unauthenticated experience is inconsistent with the user’s last selected theme. This creates a visible regression when switching between `/fr` and `/en`.

#### Follow-up ticket

`DS-150-01 — Corriger le thème public après changement de locale`

---

### 2. Create an account

#### Result

Account creation works.

#### Issues

The signup form is missing expected UX safeguards:

- no password confirmation field;
- no show/hide password toggle;
- user is not automatically signed in after successful account creation.

#### Classification

UX improvement / auth friction.

#### Impact

The signup flow is functional but not frictionless enough for a SaaS MVP. Requiring a manual login after signup weakens the onboarding flow.

#### Follow-up ticket

`DS-150-02 — Améliorer le signup`

---

### 3. Create a bilingual project

#### Result

Project creation works.

#### Issue

The summary step cannot be reviewed. The user is directly redirected to the dashboard.

#### Classification

Critical path bug.

#### Impact

The user cannot verify the project configuration before creation, even though the flow suggests a summary or review step.

#### Follow-up ticket

`DS-150-03 — Rendre le récapitulatif projet réellement visible`

---

### 4. Edit a primitive color token

#### Result

Color token edition works.

#### Issues

Saving causes a reload and resets the scroll position. This issue is not limited to color token editing. It affects save flows globally.

The token editor also exposes broader MVP limitations:

- tokens cannot be renamed;
- tokens cannot be created;
- only color tokens are editable;
- spacing, radius, typography and motion tokens are not editable.

#### Classification

Mixed:

- save-context bug;
- functional MVP limitation;
- future feature scope.

#### Impact

The save behavior interrupts editing. The token limitations also prevent testers from fully evaluating the value of the design-system editor.

#### Follow-up tickets

- `DS-150-04 — Préserver le contexte utilisateur après sauvegarde`
- `DS-150-10 — Clarifier les limites actuelles de l’édition des tokens`
- `DS-150-11 — Renommer un token avec migration des références`
- `DS-150-12 — Créer un token`
- `DS-150-13 — Étendre l’édition aux spacing/radius/typography/motion`

---

### 5. See the preview update

#### Result

The theme preview page works technically.

#### Issues

The preview lacks variety and does not let testers fully evaluate the impact of token changes.

The sections “Thème light” and “Thème dark” are confusing because the displayed values do not appear to be user-defined.

The UI still displays the obsolete message:

> Le calcul du ratio de contraste sera ajouté dans DS-090.

This message should no longer appear now that the contrast engine exists.

The “Tokens couleur sémantiques” section is not clearly explained.

#### Classification

Product UX issue / stale placeholder / data consistency issue.

#### Impact

The user cannot understand which data is seed data, computed data, theme data, or editable data. This directly affects trust in the editor and in the generated exports.

#### Follow-up tickets

- `DS-150-05 — Supprimer les placeholders obsolètes DS-090`
- `DS-150-06 — Fiabiliser Theme Editor et les données light/dark`
- `DS-150-14 — Enrichir la preview Theme Editor`

---

### 6. Check accessibility contrasts

#### Result

The Accessibility Center page is visible.

#### Issue

The page appears to display the same data regardless of the design system or token values.

The current implementation does not make it clear:

- which color pairs are evaluated;
- where the foreground and background values come from;
- which token paths are used;
- what ratio is calculated;
- why a result passes, warns or fails.

#### Classification

Critical product reliability issue.

#### Impact

The Accessibility Center is not currently credible from a user standpoint. Even if a contrast engine exists in the domain, the UI does not convincingly reflect the user’s actual project data.

#### Follow-up ticket

`DS-150-07 — Rendre l’Accessibility Center dynamique et traçable`

---

### 7. Generate a Tailwind export

#### Result

Tailwind export generation works technically.

#### Issue

The exported theme data appears incorrect because theme values were never explicitly defined by the user.

Example output:

```css
:root {
  /* theme · Light */
  --color-muted: #3a4454;
  --color-accent: #ff8731;
  --color-content: #111827;
  --color-surface: #ffffff;
  --color-background: #f7f3eb;
}

[data-theme='dark'] {
  /* theme · Dark */
  --color-muted: #a0b1ca;
  --color-accent: #ff8731;
  --color-content: #e2e7ef;
  --color-surface: #1e1e1e;
  --color-background: #070707;
}
```

#### Classification

Export consistency issue.

#### Impact

The export engine is technically functional, but the exported data is not product-validable if it comes from unverified or non-editable theme data.

#### Follow-up tickets

- `DS-150-06 — Fiabiliser Theme Editor et les données light/dark`
- `DS-150-15 — Corriger les exports dépendants des thèmes`

---

### 8. Generate French documentation

#### Result

Documentation generation works.

#### Issue

Some generated content appears incomplete or truncated because the source data is incomplete, too limited, or not properly editable yet.

#### Classification

Data completeness issue.

#### Impact

The documentation generator works, but it reflects the current limitations of editable project data.

#### Follow-up ticket

`DS-150-16 — Qualifier les données tronquées dans Documentation / AI Instructions`

---

### 9. Generate English AI instructions

#### Result

AI instructions generation works.

#### Issue

As with documentation, generated content can feel incomplete or truncated because the source model lacks enough reliable project data.

#### Classification

Data completeness issue.

#### Impact

The AI instructions generator works technically, but its perceived value depends on the quality and completeness of editable design-system data.

#### Follow-up ticket

`DS-150-16 — Qualifier les données tronquées dans Documentation / AI Instructions`

---

### 10. Review the components registry

#### Result

The Components Registry page is accessible.

#### Issues

The page is not understood by testers. Its purpose is unclear.

It should probably not only describe component contracts, but also help users visualize how components behave with the currently defined tokens:

- colors;
- spacing;
- radius;
- typography;
- motion.

This could evolve toward a “Component Foundations” experience, useful for design coherence, documentation, and possibly future Figma-oriented workflows.

#### Classification

Product UX issue / future product opportunity.

#### Impact

The current page does not clearly communicate its value. It risks being perceived as useless even though it could become a central part of the product.

#### Follow-up tickets

- `DS-150-08 — Clarifier le rôle du registre de composants`
- `DS-150-09 — Transformer le registre en base Component Foundations`

---

## DS-150 stabilization backlog

### P0 — Blocking MVP validation

| ID        | Title                                               | Type               | Status      |
| --------- | --------------------------------------------------- | ------------------ | ----------- |
| DS-150-00 | Formaliser le rapport QA structuré                  | QA                 | In progress |
| DS-150-03 | Rendre le récapitulatif projet réellement visible   | Bug                | Todo        |
| DS-150-04 | Préserver le contexte utilisateur après sauvegarde  | UX bug             | Todo        |
| DS-150-05 | Supprimer les placeholders obsolètes DS-090         | Content bug        | Todo        |
| DS-150-06 | Fiabiliser Theme Editor et les données light/dark   | Product bug        | Todo        |
| DS-150-07 | Rendre l’Accessibility Center dynamique et traçable | Product bug        | Todo        |
| DS-150-15 | Corriger les exports dépendants des thèmes          | Export consistency | Todo        |

---

### P1 — Strong improvements before a serious demo

| ID        | Title                                                           | Type         | Status |
| --------- | --------------------------------------------------------------- | ------------ | ------ |
| DS-150-01 | Corriger le thème public après changement de locale             | UX bug       | Todo   |
| DS-150-02 | Améliorer le signup                                             | Auth UX      | Todo   |
| DS-150-08 | Clarifier le rôle du registre de composants                     | Product UX   | Todo   |
| DS-150-09 | Transformer le registre en base Component Foundations           | Feature / UX | Todo   |
| DS-150-14 | Enrichir la preview Theme Editor                                | Preview UX   | Todo   |
| DS-150-16 | Qualifier les données tronquées Documentation / AI Instructions | Data QA      | Todo   |

---

### P2 — Functional expansion / MVP+

| ID        | Title                                                   | Type    | Status |
| --------- | ------------------------------------------------------- | ------- | ------ |
| DS-150-10 | Clarifier les limites actuelles de l’édition des tokens | UX copy | Todo   |
| DS-150-11 | Renommer un token avec migration des références         | Feature | Todo   |
| DS-150-12 | Créer un token                                          | Feature | Todo   |
| DS-150-13 | Étendre l’édition aux spacing/radius/typography/motion  | Feature | Todo   |

---

## Detailed follow-up tickets

### DS-150-01 — Corriger le thème public après changement de locale

#### Priority

P1

#### Problem

After logout, switching locale causes the public UI to fall back to light mode even if the user previously selected dark mode.

#### Acceptance criteria

- Theme preference remains applied across `/fr` and `/en` public routes.
- Locale switching does not force light mode.
- `system`, `light`, and `dark` remain supported.
- The browser can preserve the latest theme preference outside authenticated pages.
- The database remains the source of truth for authenticated users.

---

### DS-150-02 — Améliorer le signup

#### Priority

P1

#### Problem

Signup works but lacks expected SaaS onboarding UX.

#### Acceptance criteria

- Add password confirmation.
- Validate password confirmation with Zod.
- Add show/hide password toggle.
- Add show/hide confirmation password toggle if confirmation field is present.
- Sign in the user automatically after successful account creation, or provide a seamless transition to the authenticated app.
- Avoid unnecessary manual login after account creation.

---

### DS-150-03 — Rendre le récapitulatif projet réellement visible

#### Priority

P0

#### Problem

The project creation flow redirects to the dashboard without allowing the user to review the summary.

#### Acceptance criteria

- The wizard displays a real summary step before project creation.
- The user can go back and edit previous choices.
- Project creation only happens after explicit final confirmation.
- The redirect after creation is coherent.
- The expected flow is covered by tests.

---

### DS-150-04 — Préserver le contexte utilisateur après sauvegarde

#### Priority

P0

#### Problem

Save actions reset the page or scroll position across multiple screens.

#### Acceptance criteria

- Saving does not reset the user to the top of the page.
- Long forms preserve visual context.
- Tables preserve scroll, filters and active tabs where relevant.
- A shared strategy is defined for Server Action save flows.
- The behavior is checked on Tokens, Themes, Documentation, AI Instructions, Export Center and Settings.

---

### DS-150-05 — Supprimer les placeholders obsolètes DS-090

#### Priority

P0

#### Problem

Theme Editor still displays stale DS-090 placeholder copy for contrast ratios.

#### Acceptance criteria

- No visible UI contains “Le calcul du ratio de contraste sera ajouté dans DS-090.”
- Contrast areas either show real ratios or explicit missing-data states.
- UI copy explains where compared colors come from.
- English and French messages remain structurally aligned.

---

### DS-150-06 — Fiabiliser Theme Editor et les données light/dark

#### Priority

P0

#### Problem

Light and dark theme data appears seeded or disconnected from user-defined values.

#### Decision required

Choose one of the following:

1. Make light/dark themes editable.
2. Generate light/dark themes from user-edited tokens.
3. Hide theme sections until they are truly user-controlled.

#### Recommendation

Make theme values traceable and either editable or synchronized from real user token data.

#### Acceptance criteria

- Light/dark themes no longer appear as hardcoded seed data.
- The user understands the difference between primitive tokens, semantic tokens and theme values.
- Tailwind exports match values visible in Theme Editor.
- Each contrast pair identifies the token paths and values used.
- Preview updates from real theme/token values.

---

### DS-150-07 — Rendre l’Accessibility Center dynamique et traçable

#### Priority

P0

#### Problem

The Accessibility Center appears to show the same data regardless of design system or token values.

#### Acceptance criteria

- Evaluated pairs are built from the real project token/theme data.
- Displayed foreground/background values match resolved project values.
- Each ratio shows foreground token, background token, resolved values, ratio and status.
- Missing data is explicitly shown.
- Results change when related tokens change.
- Seed data is not presented as project-specific results.

---

### DS-150-08 — Clarifier le rôle du registre de composants

#### Priority

P1

#### Problem

The Components Registry page is not understood.

#### Acceptance criteria

- Add a clear introduction explaining the page purpose.
- Explain that component contracts feed Documentation, AI Instructions and Accessibility.
- Distinguish component contract, authorized usage, accessibility, variants, states and visual preview.
- The user can understand why the page exists before the UI refactor.

---

### DS-150-09 — Transformer le registre en base Component Foundations

#### Priority

P1 / MVP+ depending on effort

#### Problem

The registry does not yet show how components react to project tokens.

#### Acceptance criteria

- Components can be previewed using project color tokens.
- Components can progressively use spacing, radius, typography and motion tokens.
- User can see token impact on Button, Card, Alert, Dialog and TextField.
- The page becomes useful for visual coherence checks.
- The model stays compatible with future Figma or visual documentation workflows.

---

### DS-150-10 — Clarifier les limites actuelles de l’édition des tokens

#### Priority

P2

#### Problem

The user does not understand why token creation, rename and non-color editing are unavailable.

#### Acceptance criteria

- The UI clearly explains what is editable in the MVP.
- Non-editable token types do not feel broken.
- Future token capabilities are clearly identified.
- The UI does not confuse missing scope with bugs.

---

### DS-150-11 — Renommer un token avec migration des références

#### Priority

P2 / MVP+

#### Problem

Tokens cannot be renamed.

#### Acceptance criteria

- User can rename a token.
- References using the old path are migrated to the new path.
- Name collisions are prevented.
- A warning is shown when the token is referenced.
- Tests cover reference migration.

---

### DS-150-12 — Créer un token

#### Priority

P2 / MVP+

#### Problem

Tokens cannot be created.

#### Acceptance criteria

- User can create a primitive token.
- User can create a semantic alias token.
- Path is validated.
- Type is validated.
- Duplicates are prevented.
- Previews and exports update accordingly.

---

### DS-150-13 — Étendre l’édition aux spacing/radius/typography/motion

#### Priority

P2 / MVP+

#### Problem

Only color tokens are editable.

#### Acceptance criteria

- Spacing tokens are editable.
- Radius tokens are editable.
- Typography tokens are editable.
- Motion tokens are editable.
- Each token type has adapted validation.
- Previews progressively use these token families.

---

### DS-150-14 — Enrichir la preview Theme Editor

#### Priority

P1

#### Problem

The preview lacks variety and does not properly demonstrate token impact.

#### Acceptance criteria

- Add several preview components: Button, Card, Alert, Input, Badge and Dialog-like block.
- Show multiple states: default, hover-like, disabled, error and success.
- Support light and dark preview.
- Preview uses real token/theme values.
- Preview helps validate design-system coherence.

---

### DS-150-15 — Corriger les exports dépendants des thèmes

#### Priority

P0

#### Problem

Tailwind exports work technically but include theme values that users never explicitly defined.

#### Acceptance criteria

- Tailwind export reflects real theme values.
- If theme data is missing, the export indicates it or excludes unreliable blocks.
- Exported data matches Theme Editor values.
- Export diagnostics report missing or fallback theme data.

---

### DS-150-16 — Qualifier les données tronquées Documentation / AI Instructions

#### Priority

P1

#### Problem

Documentation and AI Instructions work, but generated output can be incomplete because source data is incomplete or not editable enough.

#### Acceptance criteria

- Identify precisely which data is truncated or incomplete.
- Distinguish missing data, fallback data, seed data and parsing limitations.
- Display missing data in diagnostics where relevant.
- Avoid giving a false impression of completeness.

---

## Branching strategy

DS-150 is treated as a stabilization parent ticket.

The current branch is dedicated to the QA report only:

```bash
feature/ds-150-critical-path-qa
```

After this report is merged, each significant fix should be implemented in a dedicated branch:

```bash
feature/ds-150-03-project-summary-step
feature/ds-150-04-preserve-save-context
feature/ds-150-05-remove-contrast-placeholders
feature/ds-150-06-theme-data-consistency
feature/ds-150-07-dynamic-accessibility-center
feature/ds-150-15-export-theme-consistency
```

This avoids creating one oversized stabilization PR.

---

## Recommended implementation order

1. `DS-150-00 — Formaliser le rapport QA structuré`
2. `DS-150-03 — Rendre le récapitulatif projet réellement visible`
3. `DS-150-05 — Supprimer les placeholders obsolètes DS-090`
4. `DS-150-06 — Fiabiliser Theme Editor et les données light/dark`
5. `DS-150-07 — Rendre l’Accessibility Center dynamique et traçable`
6. `DS-150-15 — Corriger les exports dépendants des thèmes`
7. `DS-150-04 — Préserver le contexte utilisateur après sauvegarde`
8. `DS-150-01 — Corriger le thème public après changement de locale`
9. `DS-150-02 — Améliorer le signup`
10. `DS-150-08 — Clarifier le rôle du registre de composants`
11. `DS-150-16 — Qualifier les données tronquées Documentation / AI Instructions`
12. `DS-150-09 — Transformer le registre en base Component Foundations`
13. `DS-150-14 — Enrichir la preview Theme Editor`
14. `DS-150-10 — Clarifier les limites actuelles de l’édition des tokens`
15. `DS-150-11 — Renommer un token avec migration des références`
16. `DS-150-12 — Créer un token`
17. `DS-150-13 — Étendre l’édition aux spacing/radius/typography/motion`

---

## Exit criteria for DS-150 parent ticket

DS-150 can be considered complete when:

- the critical path has been documented;
- P0 stabilization issues are either fixed or explicitly deferred with rationale;
- Theme Editor, Accessibility Center and Export Center use coherent project data;
- save actions do not create unacceptable UX regressions;
- documentation and AI generators disclose missing or incomplete source data clearly;
- the team has a clear list of what belongs to MVP stabilization versus UI refactor.
