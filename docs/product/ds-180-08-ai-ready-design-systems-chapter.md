# DS-180-08 — AI-ready Design Systems chapter

## Status

- **Parent initiative:** DS-180 — Learn & Product Education.
- **Curriculum position:** Chapter 07 of 07.
- **Public route:** `/learn/ai-ready-design-systems`.
- **Languages:** EN / FR.
- **Scope:** public Learn content, curriculum publication state, localized messages, tests and continuity documentation.
- **Non-goal:** change the AI Instructions generator, add an AI runtime, connect an external assistant, or introduce orchestration.

---

## 1. Purpose

Chapter 07 closes the Learn V1 mental model by explaining why structured Design System knowledge is useful as context for AI-assisted development.

The chapter must not reposition AI as the reason to build a Design System.

Required narrative order:

```text
Useful system knowledge for people
        ↓
Explicit structured project data
        ↓
Generated machine-readable context
        ↓
AI assistant as another consumer
```

The intended learner transformation is:

```text
"AI-ready means the product has AI features"
        ↓
"AI-ready means relevant system knowledge is explicit enough to hand to an AI tool"
        ↓
"Generated context can guide an assistant but cannot control or guarantee it"
```

---

## 2. Product audit baseline

Chapter content is grounded in the current repository implementation rather than generic AI-product claims.

### 2.1 Current generator

`src/domain/ai-instructions/ai-instructions.ts` generates localized Markdown AI Instructions from structured project data.

Current input model includes:

- project metadata;
- Brand profile;
- design tokens;
- Component contracts;
- output locale;
- fallback locale;
- strictness;
- selected sections.

Current generated file name follows:

```text
<project>-ai-instructions-<locale>.md
```

### 2.2 Current strictness levels

The persisted profile supports exactly:

```text
balanced
strict
veryStrict
```

Their current semantic intent is:

- `balanced` — prefer documented decisions while allowing careful implementation choices when the model is incomplete;
- `strict` — do not invent tokens, Components, variants or accessibility behavior and request clarification where required;
- `veryStrict` — use only explicit model data and report missing Design System information instead of filling gaps.

Important product boundary:

> Strictness changes generated text. It does not configure permissions, capabilities or enforcement in an external AI system.

### 2.3 Current selectable sections

The profile supports exactly four selectable generated sections:

```text
tokenRules
componentRules
accessibilityRules
forbiddenPatterns
```

Brand/voice guidance and anti-hallucination rules are generated outside this selectable four-section list.

### 2.4 Current anti-hallucination guidance

The generator currently includes guidance covering concepts such as:

- use only project tokens / known model data;
- avoid hard-coded design values when a token exists;
- do not invent Component APIs, variants, states, slots or accessibility behavior;
- report missing information instead of guessing;
- respect the requested locale.

Learn may explain these as generated guardrails, but must not call them enforcement.

### 2.5 Localization behavior

AI Instructions can be generated in a supported project locale.

When localized content is missing:

- fallback content may be used;
- the generator records missing-translation diagnostics.

This mirrors the broader canonical-source / generated-consumer model taught in Chapter 06.

### 2.6 Current authenticated workspace

`AiInstructionsGeneratorClient` currently lets the user:

- choose the instruction locale;
- choose strictness;
- choose the four optional sections;
- inspect source-data quality diagnostics;
- inspect missing translations;
- preview the generated Markdown;
- copy generated content;
- download generated content;
- save AI Instruction profile preferences.

The Export Center also exposes AI Instructions as an export format.

### 2.7 What the current workflow does not do

Current AI Instructions does **not**:

- execute an external assistant;
- send prompts to a model provider;
- modify a downstream repository;
- synchronize a copied instruction file after project changes;
- monitor an assistant's behavior;
- enforce compliance with the instructions;
- guarantee generated-code correctness;
- guarantee accessibility, security or product fidelity.

These are core teaching boundaries, not footnotes.

---

## 3. Canonical demonstration

The accepted curriculum requires a weak-context vs structured-context comparison.

Use the same request in both cases:

```text
Make a primary button that matches the app.
```

### Weak context

Only the request is available.

The assistant may need to infer:

- which visual value is approved;
- whether a Button contract exists;
- which variant to use;
- which interaction states matter;
- what the team forbids;
- what to do when project information is missing.

### Structured context

Reuse established Demo concepts:

```text
token: color.semantic.action.primary
component: Button · variant: primary
state: focusVisible
forbidden: Button ≠ navigation link
missing information: report it instead of guessing
```

The demonstration intentionally does **not** claim that supplying these lines guarantees a correct output.

The teaching point is narrower:

> Explicit context reduces the number of Design System decisions an assistant must reconstruct from assumptions.

---

## 4. Pedagogical structure

The chapter uses the following order.

### 4.1 Start with missing context

Show why a seemingly simple prompt is underspecified for an assistant that does not already know the project.

Avoid positioning prompt engineering as the solution.

### 4.2 Structure before AI

Show the dependency:

```text
human-readable system knowledge
        ↓
structured system data
        ↓
generated context
        ↓
AI-assisted consumer
```

This preserves the curriculum principle that AI readiness is a consequence of good system structure.

### 4.3 Explain what context can contain

Teach five useful categories:

1. Brand and voice;
2. Token rules;
3. Component rules;
4. Accessibility rules;
5. Forbidden patterns.

Then introduce anti-hallucination guidance as an additional generated guardrail.

### 4.4 Explain strictness accurately

Teach all three current profile values.

Immediately follow with the enforcement boundary.

### 4.5 Bridge into VulcanForgeUI

Explain the real current controls:

- locale;
- strictness;
- selected sections;
- diagnostics;
- preview/copy/download.

Reinforce the Chapter 06 snapshot model.

### 4.6 Make the product boundary prominent

Explicitly teach:

- no assistant execution;
- no live synchronization;
- no monitoring/control;
- no correctness guarantee.

### 4.7 Close the Demo thread

Connect:

```text
Token
  ↓
Component contract
  ↓
Accessibility expectation
  ↓
Usage guidance
  ↓
AI Instructions consumer
```

This is a conceptual relationship, not a claim that the current generator executes a linear runtime pipeline through every product surface.

### 4.8 Final misconception

Required statement:

> AI-ready does not mean AI-controlled.

### 4.9 Final checkpoint

Chapter 07 is also the curriculum-wide checkpoint.

The learner should be able to explain:

- why AI readiness follows from structure;
- what useful project context contains;
- why strictness is guidance rather than enforcement;
- why the generated file is a snapshot;
- why human review remains required.

---

## 5. Curriculum state after this PR

All seven accepted Learn V1 chapters become published:

```text
01 Design Systems                published
02 Design Tokens                 published
03 Themes                        published
04 Components                    published
05 Accessibility                 published
06 Documentation & Delivery      published
07 AI-ready Design Systems       published
```

No chapter remains `next` or `planned` in the accepted V1 curriculum.

This means the **content path is complete**, but DS-180 must not yet be considered fully qualified.

---

## 6. Required post-chapter qualification

User QA identified material quality issues in French copy during the incremental chapter rollout.

Therefore, after Chapter 07 is merged, a dedicated Learn-wide French editorial and typography pass is mandatory before DS-180 can be closed.

That pass must cover at least:

### Language quality

- literal English-to-French constructions;
- unnatural sentence rhythm;
- incorrect or inconsistent technical vocabulary;
- unnecessary anglicisms;
- inconsistent capitalization of product concepts;
- translation consistency across all seven chapters and the hub.

### French typography

- French guillemets `« … »` with narrow no-break spaces;
- non-breaking spacing before punctuation where appropriate (`:`, `;`, `?`, `!`);
- list punctuation;
- numbers and units;
- quotation-mark consistency;
- prevention of stranded punctuation / guillemets at line breaks;
- typographically safe treatment of inline technical terms;
- heading wrapping quality across responsive widths.

### Important rule

This qualification is **not** a mechanical search/replace pass.

The final French version should read as native editorial French while preserving technical truth and the accepted Learn pedagogy.

---

## 7. Non-goals

DS-180-08 does not include:

- changes to `generateAiInstructions`;
- new strictness levels;
- new AI Instructions sections;
- model-provider integrations;
- OpenAI / Anthropic / Gemini API integration;
- agent orchestration;
- GitHub/Codex synchronization;
- automated prompt execution;
- AI result evaluation;
- changes to export logging;
- contextual authenticated Learn links;
- the final Learn-wide French rewrite itself.

---

## 8. Automated coverage

The PR should verify:

- EN/FR message-key parity;
- current strictness vocabulary;
- current section vocabulary;
- explicit no-execution / no-sync / no-monitoring / no-guarantee boundaries;
- French narrow no-break spacing inside guillemets used by the chapter;
- French checkpoint does not regress into semicolon chaining;
- all seven curriculum entries are published;
- final chapter href is real;
- curriculum navigation links all seven chapters;
- final chapter receives `aria-current="page"`.

---

## 9. Manual QA

### Routes

```text
/en/learn
/fr/learn
/en/learn/ai-ready-design-systems
/fr/learn/ai-ready-design-systems
```

### Content

Verify that:

- weak vs structured context is understandable without prior AI expertise;
- the chapter does not imply that a longer prompt alone is AI readiness;
- AI is framed as another consumer of structured system data;
- Brand, Tokens, Components, Accessibility and forbidden patterns have distinct roles;
- anti-hallucination rules are described as guidance;
- strictness levels match the current product;
- strictness is not presented as permission control;
- profile locale / sections / diagnostics / delivery match the authenticated workspace;
- AI Instructions is clearly a generated snapshot;
- no wording implies live synchronization;
- no wording implies that VulcanForgeUI executes or monitors an external assistant;
- no wording implies guaranteed compliance;
- final Demo sequence feels like a conclusion to the previous six chapters;
- all seven curriculum chapters are linked;
- Chapter 07 is current;
- there is no obsolete `Up next` state.

### Responsive / typography

Verify that:

- comparison cards remain readable on mobile;
- long token and context strings do not create page-level overflow;
- strictness cards collapse cleanly;
- the five-step Demo sequence remains understandable when stacked;
- French guillemets do not strand at line starts/ends;
- long French headings wrap naturally;
- keyboard focus remains visible on all real links/controls.

---

## 10. Exit criteria

DS-180-08 is complete when:

- `/learn/ai-ready-design-systems` exists in EN and FR;
- Chapter 07 is published in the curriculum;
- every accepted Learn V1 route is real and linked;
- AI Instructions product behavior is represented accurately;
- guidance/enforcement boundaries are prominent;
- EN/FR parity tests pass;
- Quality CI is green through production build;
- manual QA is accepted.

After merge, the next action is **not** DS-181 immediately.

The required next action is the Learn-wide French editorial and typography qualification described in section 6. Only after that pass should DS-180 be considered ready to close and the product roadmap continue to DS-181.
