# DS-180-00 — Learning architecture and curriculum

## Status

- **Type:** product design / curriculum architecture / documentation only.
- **Parent roadmap:** `docs/product/ds-180-product-completion-roadmap.md`.
- **Parent branch while PR #162 remains open:** `agent/product-completion-roadmap`.
- **Implementation scope:** no public route, no React component, no messages, no persistence, no dependency change.
- **Purpose:** define the pedagogical contract that DS-180-01+ must implement without reopening the same product questions.
- **Review state:** proposed curriculum architecture; implementation should not begin until this document is accepted.

---

## 1. Product problem

VulcanForgeUI already exposes concepts that are powerful but cognitively dense:

- Brand direction;
- primitive and semantic design tokens;
- token references / aliases;
- Themes and semantic roles;
- Component contracts;
- anatomy;
- variants, sizes and states;
- visual token bindings;
- accessibility checks;
- generated documentation;
- multiple code export formats;
- AI Instructions.

A user can learn where to click without understanding why those concepts exist. That creates a dangerous product failure mode: the interface can be technically usable while the value of the product remains unclear.

The goal of Learn is therefore not to document controls. The goal is to give users the mental model needed to make intentional Design System decisions.

The desired transformation is:

```text
I can use the interface
        ↓
I understand the concepts
        ↓
I understand how the concepts relate
        ↓
I can make better Design System decisions
        ↓
I understand why VulcanForgeUI structures the project this way
```

Learn should reduce conceptual friction before it reduces operational friction.

---

## 2. Core pedagogical decision

### Learn is education first

Every chapter should prioritize the general Design System concept before VulcanForgeUI's implementation of it.

Preferred sequence:

```text
Concept
  ↓
Problem it solves
  ↓
Concrete example
  ↓
Relationship to the wider system
  ↓
How VulcanForgeUI represents it
  ↓
What the learner can now do intentionally
```

Avoid the inverse sequence:

```text
Here is the VulcanForgeUI screen
  ↓
Here are its fields
  ↓
Here is what to click
```

The second sequence belongs to contextual help or a future task-oriented help center, not Learn.

### One curriculum for multiple crafts

Learn should not fork immediately into separate "Designer" and "Developer" courses.

Design Systems exist at the boundary between disciplines. Splitting the curriculum too early would reinforce the separation that the product is trying to reduce.

Instead:

- teach one shared mental model;
- use occasional **Designer lens** and **Developer lens** callouts when a concept has meaningfully different implications;
- keep code examples optional rather than prerequisite;
- keep visual examples meaningful without requiring Figma knowledge.

### Progressive complexity

A learner should never need a later chapter to understand a term used as a prerequisite in an earlier chapter.

If a chapter introduces a new term, it must either:

1. define it locally before use; or
2. link to a concept already taught.

This rule should drive both content and route order.

---

## 3. External terminology and research baseline

Learn should use established industry language where it helps interoperability, but VulcanForgeUI product truth remains authoritative for product-specific behavior.

### 3.1 Design Tokens Community Group

The Design Tokens Community Group glossary defines a design token as a named source of truth for a design decision and an alias as a token value that references another token. The DTCG format reached its first stable version in 2025.10.

The DTCG specification is useful as a terminology reference, but it is **not** on the W3C Standards Track. Learn must not imply that VulcanForgeUI is DTCG-conformant unless a separate implementation audit proves that.

References:

- https://www.designtokens.org/glossary/
- https://www.designtokens.org/tr/2025.10/format/
- https://www.designtokens.org/faq/

### 3.2 Practical Design System references

Established systems reinforce several useful teaching principles:

- USWDS presents design tokens as constrained design choices that improve consistency and communication;
- GOV.UK describes components as reusable parts of a user interface and combines components with styles, patterns and guidance;
- Atlassian describes its Design System as foundations, guidelines, tools and components rather than a component library alone;
- Atlassian also describes themes as collections of token values that can change the look or behavior of an experience.

These sources should inform explanations, not become templates that VulcanForgeUI copies mechanically.

References:

- https://designsystem.digital.gov/design-tokens/
- https://design-system.service.gov.uk/
- https://design-system.service.gov.uk/components/
- https://atlassian.design/get-started/about-atlassian-design-system
- https://atlassian.design/foundations/tokens/design-tokens/

### 3.3 Accessibility baseline

W3C guidance is explicit that automated evaluation can identify many problems but cannot determine accessibility by itself. Human judgment and, where appropriate, usability testing remain necessary.

This directly supports the existing VulcanForgeUI product boundary: Accessibility reports are useful automated system checks, not WCAG certification.

References:

- https://www.w3.org/WAI/test-evaluate/tools/selecting/
- https://www.w3.org/WAI/WCAG22/Understanding/conformance.html
- https://www.w3.org/WAI/WCAG22/Understanding/focus-visible

### 3.4 Research guardrail

External references may support:

- terminology;
- examples of industry practice;
- accessibility facts;
- comparison of mental models.

They must not silently redefine:

- current VulcanForgeUI persistence;
- supported token types;
- current Theme behavior;
- current Component contract fields;
- current Accessibility rules;
- generated export semantics;
- AI integration boundaries.

When external practice and current product capability differ, Learn should state the difference explicitly.

---

## 4. Target learners

### 4.1 Primary audience — digital product builders who are not Design System specialists

The primary audience is intentionally broader than one job title.

#### Profile A — front-end / full-stack / product developer

Typical starting point:

- comfortable building interfaces;
- understands CSS, components and application state;
- may already reuse constants or component libraries;
- has heard terms such as design token or Design System but may use them inconsistently;
- wants to understand why formal structure improves maintainability and AI-assisted implementation.

Likely friction:

- sees tokens as "CSS variables with extra steps";
- confuses a Design System with a UI library;
- understands component state technically but not necessarily as a documented product contract;
- may underestimate the importance of naming, semantics and accessibility guidance.

#### Profile B — UI / product designer

Typical starting point:

- comfortable with colors, spacing, typography, components and variants;
- may work with Figma libraries or local styles;
- may understand reusable UI visually without understanding how structured decisions flow into code or generated outputs;
- may not be familiar with token references, canonical data sources or AI instruction generation.

Likely friction:

- sees tokens as implementation detail;
- may treat visual consistency as sufficient without explicit semantics;
- may understand component variants visually but not their machine-readable contract value.

### 4.2 Secondary audience

Learn should remain useful to:

- design engineers;
- technical leads;
- product engineers;
- product managers participating in Design System decisions;
- developers or designers joining a team that already has a Design System.

These users may move faster through the curriculum but should not require separate content in V1.

### 4.3 Not the primary V1 audience

Learn V1 is not optimized for:

- complete beginners to digital interfaces;
- Design System specialists seeking advanced governance strategy;
- enterprise design-ops leaders looking for contribution workflows, multi-brand governance or organizational adoption playbooks;
- users seeking a Figma tutorial;
- users seeking framework-specific implementation training.

Those needs may justify later learning paths but should not inflate V1.

---

## 5. Assumed knowledge

The curriculum may assume that a learner can recognize common interface concepts such as:

- button;
- input;
- card;
- text;
- background;
- color;
- spacing;
- typography;
- mobile vs desktop interface.

The curriculum must **not** assume knowledge of:

- React;
- CSS syntax;
- Figma;
- JSON;
- token schemas;
- WCAG terminology;
- design token aliases;
- semantic token naming;
- Design System governance.

Code snippets are allowed, but the explanation must remain understandable if the learner skips the code.

A chapter should not require authentication or a pre-existing VulcanForgeUI project to make sense.

---

## 6. Curriculum-wide learning outcomes

After completing Learn V1, a learner should be able to explain the following in their own words.

| ID  | Learning outcome                                                  | Evidence of understanding                                                                                                                  |
| --- | ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| L01 | Explain what a Design System is and why teams create one.         | Can distinguish a shared system of decisions/guidance from a pile of reusable components.                                                  |
| L02 | Recognize design drift and repeated raw decisions.                | Can identify why repeated hard-coded colors, spacing or component behavior become expensive over time.                                     |
| L03 | Explain primitive tokens, semantic tokens and references/aliases. | Can tell the difference between naming a raw value and naming its intended purpose.                                                        |
| L04 | Explain the role of Themes.                                       | Can describe how semantic roles can resolve to different token values for different appearances.                                           |
| L05 | Explain what a Component contract represents.                     | Can distinguish the contract/intent of a Button from one rendered Button instance.                                                         |
| L06 | Distinguish anatomy, variants, sizes and states.                  | Can classify `icon`, `primary`, `md` and `disabled` correctly in a simple component example.                                               |
| L07 | Explain token bindings.                                           | Can describe why component styling should reference system decisions instead of repeating raw values.                                      |
| L08 | Explain why accessibility belongs throughout a Design System.     | Can describe at least contrast, focus and state semantics and knows automation is incomplete.                                              |
| L09 | Trace one decision through multiple consumers.                    | Can follow a color decision from token definition into Theme/Component usage and generated outputs.                                        |
| L10 | Explain canonical-source value.                                   | Can explain why Documentation, code exports and AI Instructions should derive from the same structured project.                            |
| L11 | Explain AI Instructions accurately.                               | Understands that generated context can guide an AI assistant but does not control or synchronize the assistant.                            |
| L12 | Navigate VulcanForgeUI with intent.                               | Understands what Brand, Tokens, Themes, Components, Accessibility, Documentation, Exports and AI Instructions are for before editing them. |

Learn should optimize for these outcomes, not for page views or vocabulary density.

---

## 7. Canonical mental model

Learn should teach the product as a connected system rather than as eight independent pages.

The canonical conceptual map is:

```text
Product / brand intent
        │
        ▼
Foundations and design decisions
        │
        ▼
Design Tokens
        │
        ├───────────────┐
        ▼               ▼
     Themes       Component contracts
        │               │
        └───────┬───────┘
                ▼
        Consistent UI decisions
                │
        ┌───────┴────────┐
        ▼                ▼
 Accessibility      Documentation
        │                │
        └───────┬────────┘
                ▼
        Generated consumers
        ├── CSS variables
        ├── Tailwind v4
        ├── TypeScript
        ├── React Native
        ├── Markdown
        └── AI Instructions
```

### Accessibility is cross-cutting

The diagram above is useful for orientation but must not imply that accessibility happens only after Components.

Accessibility concerns exist while defining:

- color relationships;
- Theme mappings;
- component states;
- focus behavior;
- guidance;
- generated implementation expectations.

The dedicated Accessibility chapter exists to consolidate those concepts, not to position accessibility as a final QA step.

### Brand is context, not a magic generator

VulcanForgeUI has a Brand workspace, but Learn must not imply that Brand automatically generates or governs every downstream token unless the product actually does so.

Teach Brand as project intent/context that helps humans make coherent system choices.

---

## 8. Canonical teaching example

### 8.1 Decision — reuse the existing public Demo project

The public `/examples` experience already established a coherent visual thread:

```text
color.brand.600 / #A94E2F
        ↓
Light accent role
        ↓
Button.primary background
        ↓
5.50:1 contrast with white
        ↓
generated outputs
```

Learn should reuse the same **Demo project** and the same recognizable primary-action color so public surfaces reinforce each other instead of inventing parallel fictional products.

### 8.2 Learn expands the example instead of copying Examples

`/examples` is intentionally product-led and compressed. Learn can expand the reasoning around the same decision.

The teaching narrative begins before the token exists:

```text
Stage 0 — Raw decision
#A94E2F is copied into several UI places.

Stage 1 — Named reusable decision
color.brand.600 = #A94E2F

Stage 2 — Semantic intent
A semantic token/reference represents the intended action role instead of only the pigment.

Stage 3 — Appearance
The Light Theme maps its accent role to an appropriate token reference.
The Dark Theme can use a different resolved value.

Stage 4 — Component contract
Button.primary defines anatomy, variants/states and a background token binding instead of hard-coding a color.

Stage 5 — Accessibility
Foreground/background contrast and focus/state expectations are evaluated as system relationships.

Stage 6 — Delivery
The same structured project can feed documentation, code outputs and AI Instructions.
```

### 8.3 Relationship graph, not false execution pipeline

Learn must be more precise than a marketing diagram.

Theme roles and Component token bindings may consume related semantic decisions without one necessarily executing "through" the other internally.

Therefore, explanatory visuals should prefer a relationship graph when teaching real product architecture:

```text
                 ┌── Theme role: accent
Design token ────┤
                 └── Component binding: background
                           │
                           ▼
                    system behavior
```

The linear Token → Theme → Component → Accessibility → Delivery strip remains useful as a beginner orientation device, but deeper content should clarify that the structured source is a network of references and consumers.

### 8.4 Secondary decisions in the same example

The primary color remains the narrative anchor, but later chapters may add controlled secondary decisions to the same Button:

- spacing;
- radius;
- typography;
- focus state;
- disabled state;
- optional icon anatomy.

Do not switch to unrelated cards, forms and dashboards just to demonstrate every feature.

### 8.5 Teaching example stability rule

Once DS-180-02 begins implementation, canonical values/names used across chapters should live in a shared content/data module rather than being copied into every page.

Changing the canonical example should then be a deliberate curriculum change with tests.

---

## 9. Learn V1 information architecture

### 9.1 Routes

The minimum coherent V1 is:

```text
/learn
/learn/design-systems
/learn/design-tokens
/learn/themes
/learn/components
/learn/accessibility
/learn/documentation-and-delivery
/learn/ai-ready-design-systems
```

This creates **one hub + seven chapters**.

Do not split primitive tokens, semantic tokens, aliases, variants, states, anatomy, contrast or focus into separate routes in V1. They are sub-concepts inside coherent chapters.

A later SEO audit may recommend additional durable routes, but route creation must still be justified pedagogically rather than by keyword volume.

### 9.2 Chapter order

The default linear path is:

```text
01  Design Systems
02  Design Tokens
03  Themes
04  Components
05  Accessibility
06  Documentation & Delivery
07  AI-ready Design Systems
```

The order is intentional.

- Design Systems provides the reason for everything that follows.
- Tokens introduce structured decisions before those decisions are consumed.
- Themes show one way tokens acquire contextual meaning.
- Components combine reusable structure, behavior and token bindings.
- Accessibility revisits earlier decisions as system relationships.
- Documentation & Delivery shows how structure becomes consumable output.
- AI-ready Design Systems is taught last so AI is framed as a consumer of good system structure, not the reason to create the structure.

### 9.3 Hub purpose

`/learn` is not Chapter 0.

It should:

- explain what the learner will gain;
- show the curriculum map;
- show approximate concept progression, not reading-time promises unless measured;
- expose chapter status if content ships incrementally;
- provide a clear recommended starting point;
- allow experienced users to jump directly to a topic;
- distinguish Learn from Examples.

---

# 10. Chapter contracts

Each chapter below is a content contract for later implementation slices.

## 10.1 Chapter 01 — What is a Design System?

### Learner question

> Why would a team need a Design System instead of simply reusing some components?

### Must teach

- repeated design decisions create inconsistency and maintenance cost;
- a Design System creates shared language and reusable decisions;
- foundations, tokens, components and guidance work together;
- a component library can be part of a Design System but is not the whole system;
- consistency is not only visual: behavior, accessibility, content and implementation guidance matter;
- a system exists to help products evolve coherently, not to freeze every design choice forever.

### Canonical demonstration

Show the Demo project's primary Button before systemization:

```text
Screen A: #A94E2F / 14px radius / 12px 16px padding
Screen B: #A34B31 / 12px radius / 10px 16px padding
Screen C: #A94E2F / 14px radius / no visible focus state
```

Then show the same decision becoming shared system knowledge.

### Must not teach yet

- detailed alias syntax;
- exact Theme role editing;
- Component contract field-by-field editing;
- export formats in depth;
- DTCG file format syntax.

### Product bridge

Explain where Brand, Tokens, Themes and Components fit in VulcanForgeUI, without telling the learner to configure them yet.

### Exit understanding

The learner can explain why "we have a Button component" and "we have a Design System" are different claims.

---

## 10.2 Chapter 02 — Design Tokens

### Learner question

> Why name design decisions instead of using the values directly?

### Must teach

- raw values are easy to create and hard to govern at scale;
- a token names a design decision;
- primitive tokens capture reusable base choices;
- semantic tokens capture intended meaning;
- references/aliases connect decisions without duplicating raw values;
- token names should communicate purpose rather than accidental appearance where semantics are intended;
- changing one referenced decision can propagate intentionally;
- token categories in the current product: color, spacing, radius, typography and motion;
- token status exists in VulcanForgeUI and helps express lifecycle intent, but lifecycle governance is not the main chapter topic.

### Primitive vs semantic teaching pattern

Use a two-column transformation:

```text
Primitive
color.brand.600
#A94E2F
"What value is available?"

Semantic
color.semantic.action.primary
→ reference to an appropriate color token
"What job should this decision perform?"
```

### Important nuance

Do not teach that every token must be semantic or that primitive tokens are "bad". They solve different problems.

### Alias terminology

Use **reference / alias** together on first introduction:

> A reference (often called an alias) lets one token point to another token.

Afterward, prefer the product term used in the UI, while recognizing "alias" as established DTCG vocabulary.

### Visual patterns

- raw values → token names;
- dependency arrow between referenced tokens;
- "change once / resolve in consumers" demonstration;
- primitive vs semantic compare card;
- token category strip.

### Product bridge

Link conceptually to the Tokens workspace and its primitive/semantic authoring flows.

Do not turn the chapter into a New Token form tutorial.

### Exit understanding

The learner can look at a raw color and explain when it should become a reusable primitive and when a semantic name is valuable.

---

## 10.3 Chapter 03 — Themes

### Learner question

> How can the same interface preserve meaning when its visual appearance changes?

### Must teach

- a Theme is a contextual collection/mapping of design decisions;
- semantic roles such as background, surface, content, muted and accent describe jobs rather than pigments;
- different appearances can resolve those roles differently;
- current VulcanForgeUI supports Light and Dark Theme records;
- current VulcanForgeUI also supports additional custom color roles inside those Themes;
- contrast relationships need to be reconsidered when mappings change;
- a Theme should not require every component to hard-code mode-specific values.

### Important product-truth boundary

Teach two truths at the same time:

1. Design Systems in general can support appearances beyond Light and Dark, including examples such as high-contrast or sepia experiences.
2. Current VulcanForgeUI Theme identity is still limited to Light and Dark; broader appearance authoring belongs to DS-182.

Do not present future Theme creation as already available.

### Canonical demonstration

Use the same Demo project:

```text
Role       Light mapping     Dark mapping
accent     brand.600         brand.400
content    dark neutral      light neutral
surface    light surface     dark surface
```

Then demonstrate that meaning (`accent`) stays stable while resolved values can change.

### Visual patterns

- role → Light value / Dark value comparison;
- split preview of the same interface under two mappings;
- contrast relationship callout;
- "meaning stays, value changes" diagram.

### Product bridge

Point to the Themes workspace as the place where role-to-token mappings are authored and previewed.

### Exit understanding

The learner can explain why a semantic role is more robust than changing every component color manually for dark mode.

---

## 10.4 Chapter 04 — Components

### Learner question

> What must a team agree on for a component to be more than a reusable rectangle on a canvas?

### Must teach

- a component is a reusable interface building block;
- a Component contract describes reusable intent, not one rendered instance;
- anatomy describes named parts;
- variants describe intentional alternative forms;
- sizes describe supported scale choices;
- states describe meaningful interaction/system conditions;
- accessibility expectations describe required behavior/constraints;
- usage and content guidance explain when/how to use the component;
- forbidden patterns encode known misuse;
- token bindings connect visual properties to Design System decisions;
- structured contracts improve Documentation and AI Instructions because meaning is explicit rather than inferred from pixels.

### Required distinctions

#### Anatomy vs variant

```text
Anatomy: what parts exist?
Variant: what intentional form does the component take?
```

#### Variant vs state

```text
Variant: Primary / Secondary / Ghost
State: Default / Hover / Focus visible / Disabled
```

A disabled Button is not a new Button variant merely because it looks different.

#### Contract vs instance

```text
Contract
Button supports Primary and Secondary,
requires a visible focus state,
and binds its background to a token.

Instance
This specific Submit Button is Primary, MD and enabled.
```

### Canonical demonstration

Expand the Demo project's Button:

```text
Button
├── Anatomy
│   ├── Root
│   ├── Label
│   └── Icon
├── Variants
│   ├── Primary
│   └── Secondary
├── Sizes
│   ├── SM
│   ├── MD
│   └── LG
├── States
│   ├── Default
│   ├── Focus visible
│   └── Disabled
└── Bindings
    ├── Background → color token
    ├── Radius → radius token
    └── Padding → spacing token
```

### Components V2 research hook

This chapter is an explicit input to DS-181.

During Learn QA, note concepts that are difficult to explain without a visual editor. Those difficulties should become evidence for Components Workspace V2, not reasons to inflate the Learn implementation.

### Product bridge

Point to Components as a structured contract authoring workspace. Do not describe it as Figma-like until DS-181 changes the product.

### Exit understanding

The learner can classify component information correctly and explain why structured component semantics are useful to both humans and machines.

---

## 10.5 Chapter 05 — Accessibility as a system property

### Learner question

> Why is accessibility not something we can simply check at the end?

### Must teach

- accessibility decisions exist in foundations, Themes and Components;
- text/background and UI color relationships can require contrast checks;
- interactive components need meaningful states and visible focus behavior;
- accessibility rules can identify system-wide risks earlier than page-by-page fixes;
- automated checks are valuable but incomplete;
- human judgment remains necessary;
- a passing automated report is not WCAG certification;
- the VulcanForgeUI Accessibility score reflects the rules VulcanForgeUI currently evaluates, not every accessibility requirement that exists.

### Canonical demonstration

Use the primary Button:

```text
Background: #A94E2F
Foreground: white
Contrast: 5.50:1 in the public demo
```

Then add the question automation cannot answer alone:

```text
Can a keyboard user always perceive focus?
Is the Button label understandable in context?
Is the disabled behavior appropriate?
Does the full user journey remain usable?
```

### Visual patterns

- pass/fail contrast pair;
- focus state comparison;
- "automated" vs "requires human evaluation" split;
- system map highlighting where accessibility enters earlier chapters.

### Product bridge

Explain the Accessibility Center as a consolidated view over checks generated from the structured project.

### Exit understanding

The learner knows what an automated Design System audit can help with and what it cannot prove.

---

## 10.6 Chapter 06 — Documentation & Delivery

### Learner question

> What is the practical payoff of structuring all of these decisions?

### Must teach

- the same source can serve multiple consumers;
- generated outputs reduce repeated manual transcription;
- deterministic output helps reduce drift;
- code formats are representations of the same system decisions, not independent sources of truth;
- generated Markdown turns structured data into human-readable documentation;
- current VulcanForgeUI delivery formats include CSS variables, Tailwind v4, TypeScript, React Native theme output and Markdown documentation;
- an export is a snapshot/consumer, not automatic synchronization with every downstream codebase.

### Canonical demonstration

Show the same primary decision represented several ways:

```text
Design System source
        │
        ├── tokens.css
        ├── theme.css / Tailwind v4
        ├── theme.ts
        ├── theme.native.ts
        └── Markdown documentation
```

The learner should recognize the same semantic decision across formats.

### Important boundary

Do not imply two-way synchronization or automatic updates in a consuming application.

### Product bridge

Show Documentation and Exports as consumers of the canonical project source.

### Exit understanding

The learner can explain why generated outputs are more reliable when they derive from structured source data rather than being maintained separately.

---

## 10.7 Chapter 07 — AI-ready Design Systems

### Learner question

> Why does structured Design System knowledge help AI-assisted development?

### Must teach

- AI assistants work better when relevant constraints and project semantics are explicit;
- token names communicate approved decisions;
- Component contracts communicate intended structure, variants, states and restrictions;
- accessibility expectations communicate important constraints;
- usage/forbidden-pattern guidance gives context beyond CSS values;
- VulcanForgeUI can generate AI Instructions from the same structured project source;
- AI Instructions are guidance/context, not enforcement;
- VulcanForgeUI does not control, monitor or automatically synchronize external AI assistants;
- generated AI context does not guarantee correct implementation.

### Required narrative order

Do not lead with "AI can build your UI".

Lead with:

```text
A well-structured Design System is valuable to humans.
        ↓
The same explicit structure is machine-readable.
        ↓
Therefore it can also provide useful context to AI tools.
```

AI readiness is a consequence of product structure, not a substitute for Design System discipline.

### Canonical demonstration

Compare two prompts/contexts conceptually:

```text
Weak context
"Make a primary button that matches the app."

Structured context
- approved primary action token
- supported Button variant
- radius and spacing bindings
- focus-visible expectation
- forbidden patterns / usage guidance
```

Do not claim the assistant will always comply.

### Product bridge

Connect to AI Instructions and to `/examples`' existing AI-development explanation.

### Exit understanding

The learner can explain why structured design data makes better AI context without mistaking context generation for AI orchestration.

---

## 11. Learn vs Examples vs contextual help

This boundary is critical because all three surfaces can otherwise duplicate each other.

### 11.1 Learn — concept first

Learn answers:

- What is this concept?
- Why does it exist?
- How does it connect to other concepts?
- What mental model should I keep?
- How does VulcanForgeUI represent it?

Content characteristics:

- durable;
- educational;
- indexable;
- readable without account/product state;
- not tied to precise button locations;
- uses the Demo project to teach concepts progressively.

### 11.2 Examples — product first

Examples answers:

- What does VulcanForgeUI actually connect end-to-end?
- What might a structured project look like?
- What outputs can the product produce?
- Why is the product useful?

Content characteristics:

- concise;
- visual;
- conversion/product-oriented;
- demonstrates a coherent workflow;
- not responsible for teaching every prerequisite.

### 11.3 Contextual help — task first

Contextual help answers:

- What does this field mean here?
- What value should I enter?
- Why is this control disabled?
- What happens if I change this?

Content characteristics:

- short;
- attached to the authenticated task;
- operational;
- allowed to link deeper into Learn;
- should not reproduce whole Learn chapters in popovers.

### 11.4 Future help center — not DS-180 V1

A future task-oriented documentation surface could answer:

- How do I create a token?
- How do I rename a token safely?
- How do I export Tailwind?
- How do I delete a project?

That is not a Learn responsibility and is explicitly deferred.

### 11.5 Routing rule for content decisions

When unsure where content belongs, ask:

```text
Is the user trying to understand a concept?
→ Learn

Is the user trying to understand the product's value/workflow?
→ Examples / public product surface

Is the user trying to complete a task in the current UI?
→ Contextual help

Is the user looking for step-by-step operational documentation?
→ Future help center
```

---

## 12. Visual teaching system

Learn should feel like a designed learning experience rather than a blog.

### 12.1 Reusable teaching patterns

DS-180-01+ should establish a small reusable set of pedagogical patterns.

#### A. Before / After

Use for:

- raw values vs tokens;
- scattered decisions vs shared source;
- inconsistent components vs contract-driven components.

#### B. Decision flow

Use for:

- token reference chains;
- source → consumer relationships;
- output generation.

#### C. Compare

Use for:

- primitive vs semantic;
- variant vs state;
- automated vs human accessibility evaluation;
- Light vs Dark mappings.

#### D. Layer map

Use for:

- Design System overview;
- Component anatomy;
- where accessibility concerns enter;
- canonical source consumers.

#### E. Live appearance toggle

A small Light/Dark teaching demo can be useful in Themes if it remains:

- keyboard accessible;
- comprehensible without interaction;
- deterministic;
- independent of authenticated data.

Do not build a general-purpose Theme editor inside Learn.

#### F. Knowledge checkpoint

At the end of a chapter, include a short non-blocking recap such as:

```text
You should now be able to explain:
- why this concept exists;
- how it connects to the Demo project;
- where it appears in VulcanForgeUI.
```

V1 does not need quizzes, scoring or persisted learning progress.

### 12.2 Interaction budget

Interactions should demonstrate concepts, not become miniature product clones.

Prefer:

- toggle;
- reveal;
- comparison;
- simple selectable state;

Avoid in V1:

- drag-and-drop editors;
- freeform canvas;
- fake form persistence;
- complex simulations of authenticated workspaces;
- interactions that require instructions longer than the concept they teach.

### 12.3 Motion

Motion may clarify transitions between decisions but must respect reduced-motion preferences and must never be required to understand the content.

---

## 13. Writing system

### 13.1 Tone

Learn should be:

- precise;
- approachable;
- practical;
- non-patronizing;
- concrete before abstract;
- confident without presenting opinions as standards.

Avoid:

- academic density for its own sake;
- marketing superlatives inside lessons;
- unexplained jargon;
- "magic" language around AI;
- implying there is one universal Design System architecture.

### 13.2 Definition pattern

Prefer:

> A semantic token names what a decision is for, so the value behind that meaning can change without changing every consumer.

over:

> Semantic tokens are abstraction-layer entities within a hierarchical token architecture.

Technical precision can follow the intuitive definition.

### 13.3 Examples before edge cases

Each chapter should establish the normal case before discussing exceptions.

For example:

1. teach Light/Dark role mapping;
2. then acknowledge that Design Systems can have other appearances;
3. then clearly state current product limits.

Do not begin with every possible Theme architecture.

### 13.4 No hidden marketing claims

Every VulcanForgeUI statement should be supportable by the current product.

Forbidden unless future product changes justify them:

- "syncs automatically with your codebase";
- "guarantees WCAG compliance";
- "creates any component visually";
- "controls your AI assistant";
- "keeps Figma and code synchronized";
- "supports unlimited custom Themes".

---

## 14. Terminology contract

The following vocabulary should remain stable across Learn unless a later domain decision updates it.

| Term                 | Curriculum meaning                                                                                                           | Usage rule                                                                                |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Design System        | Shared system of reusable design decisions, foundations, components and guidance used to build coherent product experiences. | Capitalize when referring to the concept/product artifact consistently within Learn copy. |
| Design token         | Named design decision with a value and related semantics/metadata.                                                           | Use `token` after first clear introduction.                                               |
| Primitive token      | Token representing a reusable base value/choice without a specific component use.                                            | Do not describe as inferior to semantic tokens.                                           |
| Semantic token       | Token named for intended meaning/use rather than only raw appearance.                                                        | Explain meaning-first naming.                                                             |
| Reference / alias    | A token value that points to another token.                                                                                  | Introduce both terms; use product wording thereafter.                                     |
| Theme                | Contextual mapping/collection of design decisions that produces an appearance.                                               | Distinguish general concept from current Light/Dark product limitation.                   |
| Role                 | Semantic Theme slot such as `accent`, `content` or `background`.                                                             | Do not call every semantic token a Theme role.                                            |
| Component            | Reusable UI building block.                                                                                                  | Distinguish from one rendered instance.                                                   |
| Component contract   | Structured description of a component's supported semantics and expectations.                                                | Product-specific term; explain before abbreviating.                                       |
| Anatomy              | Named parts that compose a component conceptually.                                                                           | Not the same as visual layers in every design tool.                                       |
| Variant              | Supported intentional form of a component.                                                                                   | Keep separate from state.                                                                 |
| State                | Condition a component can be in, such as disabled or focus-visible.                                                          | Keep separate from variant.                                                               |
| Token binding        | Link from a component visual role/property to a Design System token.                                                         | Explain as a semantic connection, not raw CSS.                                            |
| Accessibility report | Automated report generated from rules VulcanForgeUI can evaluate.                                                            | Never call it certification.                                                              |
| Canonical source     | Structured project data from which multiple consumers are derived.                                                           | Avoid claiming perfect external synchronization.                                          |
| AI Instructions      | Generated context/guidance derived from the structured project for use with AI-assisted development.                         | Never imply enforcement/control of external assistants.                                   |

### Terms intentionally not central in V1

Do not introduce these unless needed for a specific explanation:

- design ops;
- atomic design taxonomy;
- slot API;
- composition graph;
- design-token resolver internals;
- DTCG modifier syntax;
- Style Dictionary;
- multi-brand governance;
- contribution governance.

They increase cognitive load without helping the core V1 outcomes.

---

## 15. EN/FR content strategy

### 15.1 Parity rule

Learn is one curriculum with two localized expressions, not an English curriculum plus a partial French translation.

Every shipped chapter must have:

- the same conceptual sections;
- equivalent examples;
- equivalent warnings/product boundaries;
- equivalent navigation/checkpoints.

### 15.2 Terminology strategy

Some English terms are industry-standard in French-speaking teams.

For the first occurrence in French, prefer a pattern such as:

```text
jeton de design (design token)
```

or, when the English term is overwhelmingly used in practice:

```text
design token
```

followed by a French explanation.

Do not force literal translations that make professional terminology harder to recognize.

### 15.3 Shared technical identifiers

Token paths, code identifiers and component keys remain unchanged between languages.

Example:

```text
color.semantic.action.primary
```

The surrounding explanation is localized; the technical identifier is not.

### 15.4 Authoring workflow

For each chapter implementation:

1. approve the conceptual outline;
2. write the full English and French message structures in the same PR;
3. compare section/message parity programmatically where practical;
4. manually review terminology rather than trusting literal translation.

Do not ship entire English chapters with placeholder French content.

---

## 16. Accessibility of Learn itself

A curriculum about accessibility must model accessible behavior.

Minimum requirements for DS-180 implementation:

- semantic heading hierarchy;
- visible keyboard focus;
- no interaction that requires pointer-only input;
- diagrams with meaningful text equivalents;
- color never used as the only carrier of meaning;
- sufficient contrast using the application's validated semantic roles;
- reduced-motion support;
- responsive reflow without horizontal page overflow;
- code blocks scroll locally if necessary;
- interaction instructions available to assistive technology;
- chapter navigation identifies current location;
- previous/next navigation has descriptive labels.

Illustrative canvases should not become inaccessible black boxes. If an illustration communicates a relationship, the same relationship should exist in nearby text or accessible markup.

---

## 17. Relationship to SEO

Learn is designed to become a strong public information architecture, but DS-180 is **not** the final SEO phase.

DS-180 should still make good structural decisions now:

- one coherent intent per chapter;
- descriptive route names;
- stable heading structure;
- meaningful internal links;
- content with independent educational value;
- no thin routes created only for keywords;
- localized content parity.

DS-185 will later own:

- complete indexation policy;
- canonical strategy;
- `hreflang`/locale alternates;
- sitemap/robots;
- final metadata system;
- Open Graph/social cards;
- structured data;
- performance and Core Web Vitals qualification.

Do not block Learn on final SEO implementation, but do not create information architecture that SEO must later undo.

---

## 18. Product bridges

Learn should connect education to action without turning lessons into sales pages.

### 18.1 Within chapters

Use restrained bridges after the concept is understood:

```text
See this in VulcanForgeUI
→ Tokens
```

or:

```text
See the complete Demo project workflow
→ Examples
```

### 18.2 Auth-aware behavior

Later implementation may choose context-aware CTA destinations:

- authenticated user → relevant app workspace;
- unauthenticated user → Examples or signup depending on context.

The educational paragraph itself should never depend on auth state.

### 18.3 Contextual links back into Learn

DS-180-08 may add selected "Learn this concept" links in the application.

Eligibility rule:

A product surface deserves a Learn link when misunderstanding the concept can materially cause bad Design System decisions.

Good candidates:

- primitive vs semantic token help;
- Theme role explanation;
- Component variant vs state;
- automated Accessibility report limitations;
- AI Instructions boundary.

Not every input needs a Learn link.

---

## 19. Learn V1 deferrals

The following are explicitly out of scope for DS-180 V1.

### Content deferrals

- enterprise Design System governance;
- contribution models;
- versioning/release governance;
- multi-brand architecture;
- advanced token taxonomy design;
- arbitrary Theme architecture beyond current product truth;
- Design System team staffing/organizational change;
- framework-specific implementation tutorials;
- Figma setup/tutorials;
- Storybook integration tutorials;
- DTCG conformance tutorial;
- full WCAG training.

### Product deferrals

- persisted learning progress;
- accounts required to read Learn;
- completion badges;
- quizzes/exams;
- certificates;
- personalized learning tracks;
- AI tutor/chat inside Learn;
- comments/community discussion;
- CMS authoring system;
- search across Learn (unless later content volume makes it necessary);
- video course production.

### Interaction deferrals

- complex playgrounds;
- editable fake projects;
- mini Figma/component canvas;
- drag-and-drop exercises;
- interactive token graph editor.

These can be revisited only after the static/controlled curriculum proves useful.

---

## 20. Content dependency map

Each chapter depends on concepts taught earlier.

```text
Design Systems
   │
   ▼
Design Tokens
   │
   ├─────────────┐
   ▼             ▼
Themes       Components
   │             │
   └──────┬──────┘
          ▼
   Accessibility
          │
          ▼
Documentation & Delivery
          │
          ▼
AI-ready Design Systems
```

### Why Components follows Themes

The learner first understands that tokens can resolve differently by context, then sees how reusable component contracts consume structured decisions.

### Why Accessibility follows Components

Accessibility has already been mentioned earlier, but the dedicated chapter becomes richer after the learner understands both Theme contrast relationships and component states.

### Why AI is last

AI Instructions rely conceptually on everything before them. Teaching AI earlier would encourage learners to see Design System structure as prompt-engineering metadata instead of valuable product architecture.

---

## 21. Chapter template for implementation

Every DS-180 chapter should use a recognizable structure, adapted when necessary.

```text
1. Opening problem
   A concrete inconsistency/question.

2. Concept
   Plain-language definition.

3. Why it matters
   Consequence of not structuring the decision.

4. Demo project
   Continue the canonical example.

5. Relationship
   Show where the concept sits in the wider system.

6. VulcanForgeUI
   Explain the current product representation truthfully.

7. Boundary / misconception
   Clarify one likely misunderstanding.

8. Checkpoint
   What the learner should now be able to explain.

9. Continue
   Next chapter + optional Examples/product bridge.
```

Do not force the exact same visual layout on every chapter. Consistent pedagogy matters more than repetitive page composition.

---

## 22. Curriculum QA model

DS-180-09 will perform final qualification, but each chapter PR should already test four levels.

### Level A — factual/conceptual QA

Check:

- terminology matches this document;
- external claims are supportable;
- product capability claims match current `main`;
- no future roadmap feature is described as current behavior.

### Level B — pedagogical QA

Ask:

- does the learner understand why before how?
- is every new term defined?
- does the canonical example actually clarify the concept?
- could a developer and designer both follow the explanation?
- is a later chapter being required too early?

### Level C — UX/accessibility QA

Check:

- responsive reading;
- keyboard behavior;
- headings;
- diagrams;
- focus;
- motion;
- local code overflow;
- chapter navigation.

### Level D — product continuity QA

Check:

- Learn does not duplicate Examples unnecessarily;
- product bridges point to real routes/features;
- EN/FR structures are equivalent;
- chapter content still aligns with the canonical Demo project;
- future DS-181/182 limitations are not accidentally promised.

---

## 23. Metrics of success for the curriculum

Before production analytics exist, DS-180 needs qualitative acceptance criteria.

A successful Learn V1 should let a test user answer questions such as:

1. What is the difference between a Design System and a component library?
2. Why would you create a token instead of repeating `#A94E2F`?
3. What is the difference between a primitive and semantic token?
4. What does a Theme role do?
5. What is the difference between a Button variant and a Button state?
6. What is Component anatomy?
7. Why does visible focus belong in the component contract?
8. What does VulcanForgeUI's Accessibility report not prove?
9. Why can one canonical source produce multiple output formats?
10. What do AI Instructions provide, and what do they not control?

The goal is not memorization of labels. The user should be able to reason through a new Design System decision using the concepts.

Future analytics may measure chapter discovery/completion, but those metrics do not replace comprehension testing.

---

## 24. Decisions resolved by DS-180-00

This section answers the ten immediate questions from the parent roadmap.

### Q1. Who is Learn for?

Digital product builders — primarily developers and designers — who can work with interfaces but are not assumed to be Design System specialists.

### Q2. What knowledge can we assume?

Basic familiarity with common UI concepts only. No code, Figma, WCAG or token knowledge is required.

### Q3. What should a complete beginner understand after the curriculum?

The twelve curriculum-wide learning outcomes in section 6, especially the chain from shared decisions → tokens/themes/components → accessibility → generated consumers.

### Q4. What is the minimum set of chapters?

Seven chapters plus the Learn hub:

1. Design Systems;
2. Design Tokens;
3. Themes;
4. Components;
5. Accessibility;
6. Documentation & Delivery;
7. AI-ready Design Systems.

### Q5. In what order should concepts be taught?

Reason → structured decisions → contextual appearance → reusable components → cross-cutting accessibility → human/code delivery → AI consumption.

### Q6. What single example connects the curriculum?

The existing public **Demo project** and its primary Button decision, anchored by `#A94E2F` / `color.brand.600`, expanded progressively across chapters.

### Q7. How should VulcanForgeUI appear without turning Learn into marketing copy?

Only after the general concept is understood. Each chapter gets a restrained "How VulcanForgeUI represents this" bridge and no unsupported superlatives.

### Q8. What belongs in Learn vs Examples vs contextual help?

- Learn = concept-first;
- Examples = product/value-first;
- contextual help = task-first;
- future help center = step-by-step operation-first.

### Q9. What content needs visual/interactive demonstrations?

Prioritize:

- design drift before/after;
- primitive vs semantic tokens;
- token references;
- Light/Dark Theme mapping;
- component anatomy/variant/state distinctions;
- contrast/focus examples;
- canonical source → output fan-out;
- weak vs structured AI context.

Interactions should remain controlled and explanatory.

### Q10. What is intentionally deferred from Learn V1?

Advanced governance, framework tutorials, full WCAG training, Figma/tool tutorials, complex playgrounds, progress accounts, quizzes/certification, AI tutoring and future Theme/Component capabilities not yet shipped.

---

## 25. Contract for DS-180-01 — Learn shell and hub

DS-180-01 may now implement the public Learn foundation because DS-180-00 resolves the curriculum architecture.

### DS-180-01 must implement

- localized `/learn` route;
- public Learn entry in the appropriate navigation surface;
- curriculum overview using the seven-chapter order;
- Learn layout/navigation foundation that future chapters can reuse;
- responsive mobile/desktop reading/navigation structure;
- EN/FR baseline messages;
- a chapter status strategy that works while chapters are delivered incrementally;
- previous/next/chapter navigation primitives if they can be introduced without fake chapter content;
- development metadata baseline without claiming DS-185 SEO completion.

### DS-180-01 must not implement

- full lesson copy;
- Design Tokens lesson;
- complex teaching interactions;
- authenticated contextual links throughout the app;
- final sitemap/robots/structured data/social card system;
- learning progress persistence;
- product schema changes.

### DS-180-01 acceptance questions

1. Can a new visitor understand what Learn is for from the hub alone?
2. Can they see the seven-chapter progression without reading a wall of text?
3. Can an experienced visitor jump directly to a chapter topic?
4. Does the structure remain usable on mobile?
5. Is the curriculum navigable by keyboard?
6. Are unavailable/not-yet-authored chapters represented honestly rather than as broken pages?
7. Are EN and FR structurally equivalent?
8. Does Learn feel distinct from `/examples`?

---

## 26. Documentation continuity rules

### When a chapter reveals a conceptual problem

Do not silently rewrite the curriculum in component code.

Update this document if the change affects:

- target learners;
- chapter order;
- terminology;
- canonical example;
- Learn/Examples/help boundaries;
- product-truth claims.

### When DS-181 Components discovery begins

Use the Components chapter as research input. Record concepts learners found hard to understand and assess whether a more visual Components workspace could make those semantics self-evident.

### When DS-182 Theme extensibility begins

Update the Themes chapter contract after the product model changes. The current chapter must remain truthful to Light/Dark until the new capability is actually merged.

### When DS-185 SEO begins

Treat this curriculum information architecture as the content source of truth, but re-audit current search-engine guidance rather than assuming this document is an SEO specification.

---

## 27. Final DS-180-00 exit criteria

DS-180-00 is ready to close when product review agrees that:

- [x] target learners are defined;
- [x] assumed knowledge is defined;
- [x] curriculum-wide learning outcomes are explicit;
- [x] the canonical mental model is explicit;
- [x] the existing Demo project is chosen as the teaching thread;
- [x] the relationship between Learn and Examples is defined;
- [x] the relationship between Learn and contextual help is defined;
- [x] the minimum route/chapter structure is defined;
- [x] chapter order is justified;
- [x] each chapter has a learner question, must-teach scope and exit understanding;
- [x] reusable visual teaching patterns are defined;
- [x] terminology rules are defined;
- [x] EN/FR strategy is defined;
- [x] accessibility requirements for Learn are defined;
- [x] unsupported product claims are explicitly guarded;
- [x] V1 deferrals are explicit;
- [x] DS-180-01 has a bounded implementation contract.

The checkboxes above mean the document contains an answer. They do **not** mean the product owner has accepted every answer. The Draft PR remains the review mechanism.

---

## 28. Recommended next step after approval

Proceed with **DS-180-01 — Learn shell and hub** as a new focused implementation PR.

Do not start Chapter 01 content in the same PR unless the shell cannot be meaningfully validated without a very small representative content stub.

The small-iteration rule remains:

> one PR should make the next product question testable, not attempt to complete the entire Learn experience at once.
