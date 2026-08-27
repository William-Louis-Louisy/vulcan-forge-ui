# DS-180-06 — Accessibility chapter

## Status

- **Phase:** DS-180 — Learn & Product Education.
- **Slice:** DS-180-06.
- **Purpose:** publish the fifth Learn chapter without changing Accessibility Center domain behavior.
- **Route:** `/learn/accessibility` with locale-prefixed EN/FR variants.
- **Primary product question:** how do we teach accessibility as a Design System property while explaining exactly what VulcanForgeUI can and cannot automate today?
- **Next slice:** DS-180-07 — Documentation, exports and AI-ready systems.

This document preserves the product audit, teaching decisions and implementation boundaries behind the Accessibility chapter. It is not an accessibility-conformance statement for VulcanForgeUI itself.

---

## 1. Chapter objective

The chapter must leave a learner able to explain five ideas:

1. accessibility should be influenced by reusable Design System decisions before final QA;
2. contrast belongs to a foreground/background relationship, not to a color in isolation;
3. focus-visible and interaction states belong in component contracts, but documented intent is not proof of runtime behavior;
4. automated accessibility checks are useful, repeatable signals but cannot determine complete accessibility;
5. the VulcanForgeUI score is an internal prioritization model, not a WCAG-compliance percentage.

The chapter deliberately does not become a complete WCAG course. Its job is to teach the accessibility concepts needed to understand the current product model and to use the Accessibility Center responsibly.

---

## 2. Accepted curriculum contract

The canonical DS-180 roadmap defines this slice as teaching:

- accessibility as a system property rather than a final checklist;
- contrast relationships;
- focus-visible and component states;
- automated checks vs manual validation;
- what the VulcanForgeUI score/report does and does not prove.

The chapter must never imply automated certification.

Publication state after this slice:

```text
01 Design Systems              Published
02 Design Tokens               Published
03 Themes                      Published
04 Components                  Published
05 Accessibility               Published
06 Documentation & Delivery    Up next
07 AI-ready Design Systems     Planned
```

No `/learn/documentation-and-delivery` placeholder route is created in this slice.

---

## 3. Current Accessibility Center audit

The current product source of truth was inspected before writing the lesson.

### 3.1 Report inputs

`createAccessibilityCenterReport()` currently consumes:

- the Color Token Set;
- project Themes;
- project default and supported locales;
- all Token Sets;
- Component Contracts.

The public lesson therefore describes the Accessibility Center as an audit of **structured project data**, not as an audit of a running downstream application.

### 3.2 Current issue severities

Issues are classified as:

```text
warning
critical
```

These severities feed the indicative score.

### 3.3 Current report status bands

The current implementation derives report status directly from score:

```text
90–100  → healthy
60–89   → needsAttention
0–59    → critical
```

These are VulcanForgeUI product states. They are not WCAG conformance levels.

### 3.4 Current score formula

The score implementation is deliberately simple and transparent:

```text
base score: 100
critical issue: −25
warning: −10
minimum displayed score: 0
```

Formula:

```text
100 − (critical issues × 25) − (warnings × 10)
```

Example used by the lesson:

```text
1 critical + 1 warning
100 − 25 − 10 = 65
status: needsAttention
```

This model is a prioritization heuristic. It is not a weighted map of WCAG success criteria and does not express a percentage of conformance.

---

## 4. Contrast behavior audited from the current product

### 4.1 Theme contrast pairs

The product currently evaluates these configured Theme-role relationships when their foreground roles are present:

```text
content / background
content / surface
muted / background
muted / surface
accent / background
accent / surface
info / background
info / surface
success / background
success / surface
warning / background
warning / surface
danger / background
danger / surface
```

The current Theme contrast engine resolves token references before evaluating the resulting foreground/background colors.

### 4.2 Current target used by Theme pairs

`getThemeContrastPairs()` currently calls `evaluateContrast()` with:

```ts
textSize: 'normal';
```

for every configured pair.

This matters pedagogically.

The underlying contrast utility supports:

```text
normal text target: 4.5:1
large text target: 3:1
```

but the Accessibility Center does **not** infer actual font size or rendered context. All current Theme pair checks use the normal-text target.

### 4.3 Current product status bands for a Theme pair

For the current `normal` mode:

```text
ratio >= 4.5       → pass
3.0 <= ratio < 4.5 → warning
ratio < 3.0        → fail
```

The `warning` band is a VulcanForgeUI prioritization state. It must not be presented as a WCAG conformance threshold.

A WCAG normal-text failure remains a failure below 4.5:1 even when VulcanForgeUI labels the intermediate product state `warning`.

### 4.4 Current Demo example

The lesson reuses the actual Demo Theme values.

Current Light mapping:

```text
background
→ color.primitive.neutral.50
→ #F7F3EB

muted
→ color.primitive.neutral.700
→ #3A4454

contrast
→ 8.89:1
```

This passes the current normal-text target comfortably.

The lesson then introduces an intentionally wrong cross-theme mapping:

```text
background
→ #F7F3EB

muted
→ color.primitive.neutral.400
→ #A0B1CA

contrast
→ 1.97:1
```

`color.primitive.neutral.400` is the real current Dark Theme muted value. The wrong mapping is not claimed to exist in the product; it is a teaching counterexample showing how a single system decision can propagate a contrast failure to many consumers.

### 4.5 Important implementation note: luminance breakpoint

The current contrast utility linearizes sRGB channels using the older `0.03928` breakpoint.

Current WCAG 2.2 material uses `0.04045`. W3C explicitly notes that the value changed from `0.03928` and that this has **no practical effect** on calculations in the context of the guidelines.

This Learn slice does not modify the contrast domain implementation because its contract is educational content, not an Accessibility engine refactor. We also avoid claiming exact WCAG 2.2 calculation-engine certification.

This finding should remain visible for a future focused accessibility-domain standards audit if that work is scheduled.

---

## 5. Current automated rule coverage

The lesson must describe only checks that the current code actually performs.

### 5.1 Theme / contrast signals

Current signals include:

- missing foreground value;
- missing background value;
- contrast warning;
- contrast failure;
- missing Themes;
- invalid Color Token Set;
- color-token resolution errors used by contrast evaluation.

### 5.2 Token signals

Expanded rules currently include:

- invalid non-color Token Sets;
- unresolved token references;
- missing descriptions for `ready` tokens in supported project locales.

The lesson therefore says “selected documentation gaps”, not “all token documentation quality”.

### 5.3 Component Contract signals

Current checks include:

- invalid Component Contract data;
- missing localized values in structured contract fields that contain localized content;
- interactive Component Contracts with an empty accessibility-rule collection;
- missing `focusVisible` state for current interactive types;
- unresolved Component token bindings;
- Component token type mismatches.

Current interactive types used by these checks are:

```text
button
textField
dialog
```

### 5.4 Focus-visible severity boundary

Current automated severity is intentionally asymmetric:

```text
Button    missing focusVisible → critical
TextField missing focusVisible → critical
Dialog    missing focusVisible → warning
```

The Learn chapter states this as **current product behavior**, not as a universal accessibility severity model.

### 5.5 What the current automated rules do not prove

The Accessibility Center does not execute a downstream application and therefore cannot establish, among other things:

- real DOM/native semantics;
- actual accessible names and relationships at runtime;
- keyboard focus order;
- focus trapping behavior in a real dialog;
- whether the rendered focus indicator is visually perceivable in every context;
- whether focused content is obscured by sticky/overlay UI;
- screen-reader experience;
- magnification behavior;
- voice-input behavior;
- zoom/reflow behavior;
- meaningful alternative text in context;
- quality of user-facing error recovery;
- the overall usability of the interface for disabled users.

This is intentionally framed as examples, not an exhaustive WCAG checklist.

---

## 6. Focus teaching model

Chapter 04 established that Components carry states and accessibility expectations.

Chapter 05 extends that mental model:

```text
Component contract
    ↓
focusVisible state exists
    ↓
structured audit can detect absence
    ↓
runtime implementation renders a focus indicator
    ↓
human validation checks actual visibility/order/context
```

The distinction between **documented intent** and **runtime evidence** is central.

A `focusVisible` state in structured data is valuable because it prevents the state from becoming invisible to the Design System model. It is not proof that a consuming React/native implementation rendered the state correctly.

---

## 7. External research baseline

The chapter was checked against current W3C/WAI material.

### 7.1 WCAG 2.2 — Contrast Minimum

Reference:

- https://www.w3.org/TR/WCAG22/
- https://www.w3.org/WAI/WCAG22/Techniques/general/G18

Relevant conceptual baseline:

- normal text uses a 4.5:1 Level AA minimum;
- qualifying large text uses 3:1.

The lesson does not claim that the current VulcanForgeUI Theme matrix can determine which rendered text qualifies as large. It explicitly says the product currently evaluates its Theme pairs as normal text.

### 7.2 WCAG 2.2 — Focus Visible

Reference:

- https://www.w3.org/WAI/WCAG22/Understanding/focus-visible

Relevant conceptual baseline:

- keyboard-operable interfaces need a mode where the keyboard focus indicator is visible;
- a visible focus cue is essential for sighted keyboard users.

The lesson also acknowledges that runtime focus behavior includes more than merely documenting a `focusVisible` state.

### 7.3 WCAG 2.2 — Non-text Contrast and focus appearance context

Reference:

- https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast
- https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html

These resources support the broader explanation that component/state visibility can involve non-text contrast requirements and that rendered focus appearance is contextual.

The lesson does **not** claim that VulcanForgeUI currently automates these complete checks.

### 7.4 W3C — automated evaluation limitations

Reference:

- https://www.w3.org/WAI/test-evaluate/tools/selecting/
- https://www.w3.org/WAI/test-evaluate/

W3C explicitly states that evaluation tools cannot check all accessibility aspects automatically, human judgement is required, and tools cannot determine accessibility on their own.

This is the central external principle behind the chapter’s automation/manual-validation section.

---

## 8. Teaching sequence

The chapter follows this order:

```text
one wrong Theme mapping
        ↓
accessibility as a system property
        ↓
contrast relationships
        ↓
focus-visible and Component states
        ↓
automation vs human evaluation
        ↓
VulcanForgeUI score
        ↓
current Accessibility Center behavior
        ↓
Demo dependency story
        ↓
misconception
        ↓
checkpoint
        ↓
Documentation & Delivery
```

This order intentionally starts with a visible failure rather than a standards definition.

---

## 9. Visual teaching decisions

### 9.1 Contrast failure must be visible without DevTools

The opening comparison renders the same semantic `muted` role on the same Light background with two real Demo token values:

- correct Light mapping: `#3A4454`;
- intentionally wrong Dark-muted mapping: `#A0B1CA`.

The learner should be able to perceive the problem before reading the ratio.

### 9.2 Focus visual is illustrative, not an interactive fake control

The focus comparison uses non-interactive visual elements styled like the Demo action rather than introducing fake buttons that can receive keyboard focus without functionality.

This is important on an accessibility education page: the teaching illustration itself should not create unnecessary keyboard stops.

### 9.3 Automated and manual validation are equal columns

The visual structure does not place manual validation as a footnote beneath automation. Both are shown as parallel responsibilities.

This reinforces that human testing is part of the process, not merely an exception for cases where automation fails.

### 9.4 Score disclaimer receives high visual emphasis

The statement that `100/100` does not prove accessibility is displayed as a strong warning immediately after the score model.

This is deliberate product-risk mitigation.

---

## 10. Product boundaries stated in the lesson

The chapter explicitly states that the current Accessibility Center:

- audits structured Design System project data;
- resolves configured Theme color relationships;
- evaluates current Theme pairs under a normal-text contrast assumption;
- reports selected Token/Component structural signals;
- derives warning/critical issues and an indicative score;
- can save report snapshots.

It also explicitly states that it does **not**:

- execute downstream apps;
- crawl arbitrary rendered UI;
- run a screen reader;
- verify complete keyboard behavior;
- prove focus appearance in the rendered product;
- certify WCAG conformance;
- replace a comprehensive manual audit.

---

## 11. i18n contract

The new scoped namespace is:

```text
LearnAccessibilityPage
```

It lives in:

```text
src/messages/learn-accessibility-messages.ts
```

The scoped messages are merged in `src/i18n/request.ts` and included in the `next-intl` AppConfig type augmentation.

Focused tests verify:

- complete EN/FR key parity;
- canonical Demo values used by the lesson;
- current contrast product bands;
- exact score formula;
- explicit automation/manual boundary;
- explicit “not WCAG certification” wording;
- next-chapter continuity.

A separate DS-180 final qualification pass remains responsible for the deeper editorial review of all French Learn translations.

---

## 12. Curriculum publication contract

After the actual `/learn/accessibility` page exists:

```text
accessibility.status = published
documentationDelivery.status = next
```

`getLearnChapterHref()` therefore exposes:

```text
/learn/accessibility
```

while still returning `null` for:

```text
/learn/documentation-and-delivery
/learn/ai-ready-design-systems
```

No fake future route is introduced.

---

## 13. Automated QA contract

Before manual QA, the branch must pass the existing repository Quality workflow:

- dependency install;
- Prisma generation;
- migration deployment;
- auth database integration tests;
- ESLint;
- TypeScript;
- Prettier;
- UI audit;
- full Vitest suite;
- production Next.js build.

Focused tests introduced/updated by this slice cover:

- chapter message parity and product truth;
- curriculum publication state;
- current Learn navigation links and unavailable future chapter behavior.

---

## 14. Manual QA contract

### Desktop

Verify:

- `/en/learn` and `/fr/learn` show Chapter 05 published;
- Chapter 06 is Up next and not clickable;
- `/en/learn/accessibility` and `/fr/learn/accessibility` render correctly;
- Chapter 05 is marked current in the compact curriculum navigation;
- the opening contrast difference is visually obvious before reading ratios;
- `8.89:1` and `1.97:1` match the displayed examples;
- contrast product bands are legible and clearly distinguish internal warning from WCAG target language;
- focus example visibly differentiates absent/present focus cue;
- automated and manual validation columns have comparable visual weight;
- score formula and internal status bands are understandable;
- the `100/100` disclaimer cannot reasonably be missed;
- no text claims certification or complete conformance;
- long token paths and explanatory copy do not overflow.

### Mobile

Verify:

- no horizontal page overflow;
- opening contrast cards stack clearly;
- system-property chain reflows vertically;
- contrast rows remain readable;
- focus examples stack without losing the visible outline;
- score metrics reflow without truncating meaning;
- compact curriculum navigation remains usable below the lesson;
- long English and French sentences do not break layout.

### Keyboard / semantics

Verify:

- heading hierarchy remains coherent;
- the static focus examples do not introduce fake keyboard stops;
- actual links in the Learn curriculum remain keyboard reachable;
- `aria-current="page"` is present for Chapter 05;
- Chapter 06 remains non-interactive until published.

### Locale switching

Verify locale changes preserve:

```text
/learn/accessibility
```

and do not fall back to `/learn` or another chapter.

---

## 15. Non-goals

DS-180-06 does not:

- change score weights;
- change issue severity rules;
- change Theme contrast-pair definitions;
- change the legacy luminance breakpoint in the contrast engine;
- add runtime website crawling;
- add axe-core or another external accessibility scanner;
- add browser automation;
- add screen-reader automation;
- introduce accessibility certification;
- implement complete WCAG-EM evaluation;
- add contextual Learn links inside the authenticated Accessibility Center;
- implement Chapter 06 content;
- perform the final Learn-wide French editorial rewrite.

These boundaries keep the iteration focused and reviewable.

---

## 16. Findings preserved for later product work

The chapter audit surfaced several facts worth retaining beyond Learn:

1. Theme contrast checks currently assume normal text for every configured pair.
2. The contrast utility supports large-text mode, but the Theme audit does not infer or store usage context.
3. The current contrast utility still uses the legacy `0.03928` sRGB breakpoint; W3C says the modern `0.04045` change has no practical effect, but a standards-focused domain audit should eventually normalize this implementation detail.
4. Structured Component checks can detect missing `focusVisible` state but cannot validate rendered focus appearance/order.
5. The score is intentionally simple; any future expansion of automated rule coverage changes score behavior because each new issue can introduce penalties.
6. Therefore future Accessibility Center work must treat score evolution as a product-contract decision, not merely “adding more checks”.

None of these findings are silently solved in the Learn PR.

---

## 17. Handoff to DS-180-07

After Accessibility, the learner understands that a structured Design System contains:

- shared decisions;
- Tokens;
- Themes;
- Component contracts;
- machine-readable accessibility signals and explicit limits.

DS-180-07 can therefore focus on **consumers of that canonical source** rather than re-explaining its structure.

The next chapter should teach:

```text
canonical project source
        ↓
Markdown documentation
CSS variables
Tailwind v4
TypeScript theme output
React Native theme output
AI Instructions
```

The chapter must preserve the existing AI boundary:

> generated instructions can guide a downstream assistant; VulcanForgeUI does not control, synchronize or enforce behavior inside that external assistant.
