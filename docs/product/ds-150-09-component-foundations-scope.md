# DS-150-09 — Component Foundations / Components Registry Refactor

## Status

In progress — scope definition.

## Context

The current Components Registry is technically functional but not product-clear enough.

It currently exposes component contracts, completeness, variants, states, accessibility rules and an editor. However, the final product direction is not only to list component contracts. The target is to evolve this page into a Component Foundations workspace aligned with the page 18 mockup.

This ticket also absorbs the intent of DS-150-08, because clarifying the role of the registry through temporary copy would be redundant if the page is being deeply refactored.

## Product goal

Transform the Components Registry into a workspace where users can:

- browse documented components;
- understand the contract of each component;
- edit component foundations safely;
- preview component behavior across variants, sizes and states;
- understand how component rules feed documentation and AI instructions;
- identify incomplete component foundations before export or documentation generation.

## Non-goals for DS-150-09

This refactor does not aim to:

- build a full Figma integration;
- generate production-ready component code;
- create a full visual design tool;
- implement a complete theme playground for every possible token;
- replace the future global UI refactor.

## Target information architecture

The future Components page should be structured around three main zones.

### 1. Component navigation

Purpose:

- browse components by category;
- show component status;
- show platform support;
- show completeness level;
- make it obvious which component is selected.

Expected capabilities:

- category grouping or filtering;
- selected component state;
- completeness indicator;
- empty and invalid states.

### 2. Component editor

Purpose:

- edit the selected component contract;
- preserve current persistence behavior;
- expose localized purpose;
- edit anatomy, variants, states, accessibility rules and forbidden patterns.

Expected capabilities:

- keep existing contract persistence;
- preserve save context;
- show validation errors;
- avoid local-only wording if persistence exists.

### 3. Component Foundations preview

Purpose:

- help the user understand how the component behaves with the current design-system foundations;
- provide a visual matrix inspired by the mockup;
- make the page feel useful beyond raw contract editing.

Expected capabilities:

- variant/state matrix;
- basic visual preview using available component contract data;
- clear fallback when visual data is incomplete;
- no fake precision when tokens or component data are missing.

### 4. AI Contract preview

Purpose:

- show how the selected component will be understood by AI instructions;
- make the contract reusable and understandable.

Expected capabilities:

- summarize allowed usage;
- list forbidden patterns;
- list accessibility constraints;
- signal missing data.

## Proposed sub-ticket split

### DS-150-09-01 — Refactor Components page layout

Goal: introduce the final page structure without changing persistence.

Scope:

- create the 3-zone layout;
- preserve the existing list/detail/editor behavior;
- keep current data model;
- improve responsive layout.

Acceptance criteria:

- page has a clear Component Foundations structure;
- selected component remains controlled by query param or equivalent;
- current editor still works;
- no regression on component contract saving.

---

### DS-150-09-02 — Improve component navigation

Goal: make browsing components clearer and closer to the mockup.

Scope:

- category sections or filters;
- status and platform badges;
- completeness indicator;
- selected state.

Acceptance criteria:

- users understand which component is selected;
- categories are explicit;
- incomplete components are visible.

---

### DS-150-09-03 — Align component editor with the target experience

Goal: make the editor feel like a foundation editor, not a raw contract form.

Scope:

- reorganize editor sections;
- clarify localized purpose;
- improve anatomy / variants / states / accessibility editing;
- keep existing persistence.

Acceptance criteria:

- editor is clearer without changing the schema unnecessarily;
- save behavior remains stable;
- validation remains visible.

---

### DS-150-09-04 — Add Visual Matrix

Goal: add a first visual component matrix based on available contract data.

Scope:

- display variants;
- display states;
- show basic component preview examples;
- use current theme foundations where possible;
- show incomplete-data notices when preview cannot be precise.

Acceptance criteria:

- visual matrix is present for selected component;
- matrix reacts to component variants/states;
- incomplete source data is explained, not hidden.

---

### DS-150-09-05 — Add AI Contract preview

Goal: expose how the selected component feeds AI Instructions.

Scope:

- summarize component purpose;
- list allowed variants and states;
- list accessibility rules;
- list forbidden patterns;
- surface missing source data.

Acceptance criteria:

- selected component has an AI-readable contract preview;
- missing data is visible;
- content is localized.

---

### DS-150-09-06 — Final polish, i18n and tests

Goal: stabilize the full refactor.

Scope:

- synchronize FR/EN messages;
- add or update tests;
- verify responsive behavior;
- run quality checks.

Acceptance criteria:

- no missing i18n keys;
- typecheck, tests and build pass;
- page is usable in FR and EN.

## Recommended implementation order

1. DS-150-09-01 — layout foundation
2. DS-150-09-02 — navigation
3. DS-150-09-03 — editor alignment
4. DS-150-09-04 — visual matrix
5. DS-150-09-05 — AI contract preview
6. DS-150-09-06 — polish / i18n / tests

## Decision

DS-150-08 will not be implemented as a separate temporary clarification ticket.

Its intent is absorbed into DS-150-09 because the target page must explain its role through structure, visual hierarchy and feature design rather than through temporary explanatory copy.
