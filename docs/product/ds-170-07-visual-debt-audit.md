# DS-170-07 — Visual debt and error-surface audit

## Objective

Close the remaining visual, interaction and error-state inconsistencies before the final product-journey QA pass.

## Validated scope

DS-170-07 includes:

- enforcement of the approved VulcanForge UI color, typography, radius and density foundations;
- shared field and dialog primitives;
- migration of visible native selects;
- normalization of legacy oversized surfaces;
- removal of false affordances;
- localized public and authenticated error surfaces;
- a repeatable UI guard integrated into the standard quality workflow;
- responsive and appearance-mode regression QA.

It does not introduce a Prisma migration, a new domain model, billing, new export formats or an authenticated-workspace redesign.

## Shared foundations

### Fields

`Input` and `Textarea` provide:

- small and standard densities where relevant;
- default and technical text modes;
- semantic focus, invalid, disabled and read-only states;
- class-name composition without replacing feature-owned labels, help text or error relationships.

### Select

The shared `Select` now supports:

- small and standard densities;
- default and technical text modes;
- invalid, required and described-by semantics;
- localized labels for functional choices;
- technical typography only for token paths and values.

Visible native selects were migrated in project creation, Tokens and Components workflows.

### Dialog

The shared `Dialog` uses the native modal dialog contract and provides:

- an inert background while open;
- Escape and backdrop dismissal;
- focus placement inside the dialog;
- focus restoration to the invoking control;
- semantic overlay styling;
- a bottom-sheet presentation on mobile;
- explicit viewport centering from the `sm` breakpoint rather than relying on user-agent dialog margins;
- medium and large responsive widths;
- a shared sticky action footer.

The action contract is explicit: Cancel is immediately to the left of the primary action and Create occupies the bottom-right position. Mobile actions use a two-column footer with safe-area padding; desktop actions remain right-aligned.

Token creation is presented through this modal foundation so the active token family cannot change while a creation task is in progress.

## Token creation

Color, spacing, radius, motion and typography creation forms retain their existing server actions and validation contracts.

The modal workflow now guarantees that:

- the creation type is captured from the active tab;
- token navigation and the inspector are unavailable behind the modal;
- Cancel, Escape and backdrop dismissal close the task;
- successful creation closes the dialog, selects the new token, activates its family and clears the search query;
- typography creation receives the wider desktop treatment required by its field density;
- mobile creation uses the validated bottom-sheet convention;
- desktop creation is centered horizontally and vertically;
- form actions remain visible at the bottom with Cancel left and Create right.

## New design-system wizard

The wizard retains the five-step workflow and its validation behavior.

The page now provides stable horizontal gutters on mobile and stable top and bottom breathing room, including additional space beneath the action row on steps that nearly fill the viewport. Future steps remain genuinely disabled, while the current and completed steps remain navigable.

The review step cannot submit as a side effect of the preceding Continue click. Continue and final Create use distinct keyed controls, `reviewConfirmed=true` is submitted only by an explicit click on the final Create action, and the server action is now assigned to the form rather than to the named submitter. This avoids the React `name` plus function-valued `formAction` conflict and lets the user inspect and revise the complete summary before creating the design system.

## Visual normalization

The pass includes:

- semantic overlay and contrast roles derived from the approved Stone foundation;
- replacement of generic black, white and neutral utility colors in application chrome;
- normalized card, notice, panel and form radii;
- removal of decorative shadows and oversized nesting where they were not part of an approved preview;
- alignment of the compact authenticated menu with the public burger trigger without changing its popover behavior;
- removal of stale Geist documentation and hardcoded preview copy.

Dynamic colors that represent user-authored token data remain valid product data rather than application chrome.

## Appearance initialization

The saved appearance preference is applied through a synchronous inline script in the document head before first paint. It resolves light, dark or system preference, updates the root class and datasets, and sets `color-scheme` before route content is painted. This prevents the application from deliberately painting the light theme before hydrating into dark mode.

Development-only route compilation may still introduce a transient blank frame in `next dev`; production-mode QA remains the reference for validating a persistent flash.

## Error-surface architecture

### Authentication required

Anonymous access to the authenticated application redirects to the localized Login route with `reason=authentication-required`.

Login displays a dedicated authentication-required notice. No permanent standalone 401 page is introduced.

### Public 404

Unknown public paths are captured by the public route group and forwarded through `notFound()`. The localized branded 404 includes:

- the public header and footer;
- a return-home action;
- Sign in for anonymous visitors or Dashboard for authenticated visitors.

### Authenticated 404

Unknown authenticated paths are captured below `/app` and forwarded through `notFound()`, preserving the application shell.

Missing or inaccessible private project resources continue to use the masked 404 behavior so the interface does not reveal whether another user's resource exists.

### Forbidden foundation

`ErrorState` provides a forbidden tone for contexts where a real 403 may later be exposed safely. DS-170-07 does not add a public business route solely to demonstrate this state.

### Recoverable 500

Localized route error boundaries provide:

- a real retry action connected to `reset()`;
- a safe navigation fallback;
- an optional diagnostic digest;
- no stack trace or sensitive implementation detail.

The global error boundary remains a minimal fallback for failures that prevent the localized layout from rendering.

## Automated UI audit

`npm run audit:ui` checks production source files and the README for:

- legacy Geist references;
- visible native selects;
- generic black, white and neutral utility colors;
- oversized radii outside documented exceptions;
- legacy hardcoded preview copy;
- presence of required field, dialog and error foundations;
- presence of required semantic overlay tokens;
- presence of unmatched-route catchalls for public and authenticated surfaces.

Every allowlisted exception includes a concrete product rationale. The audit is part of `npm run quality` and the standard GitHub Actions Quality workflow.

## Manual QA checklist

### Wizard

- verify mobile horizontal gutters at 390 px;
- verify top spacing above the return link at mobile and desktop widths;
- verify bottom spacing beneath the action row on all five steps;
- verify long steps remain scrollable without buttons touching the viewport edge;
- move from step four to review and verify that no navigation or creation occurs automatically;
- verify the complete review remains visible until the final Create action is explicitly activated;
- verify the browser console contains no `name` and `formAction` warning;
- verify light and dark appearances;
- verify unavailable future steps are disabled.

### Token creation dialogs

- open New token from Color, Spacing, Radius, Motion and Typography;
- verify the matching form opens and the background becomes inert;
- verify the first usable field receives focus;
- verify tab navigation remains trapped by the native modal contract;
- verify Escape, backdrop and Cancel close the dialog;
- verify focus returns to New token;
- verify a full-width bottom sheet with top-only rounded corners on mobile;
- verify a centered modal from the `sm` breakpoint;
- verify the sticky action footer displays Cancel left and Create right;
- verify mobile scrolling, safe-area spacing and the wider desktop Typography layout;
- create one token and verify dialog closure, family activation, selection and search reset;
- verify field and server errors remain visible and localized.

### Error surfaces

- anonymous `/fr/app` and `/en/app` redirect to localized Login with the authentication-required notice;
- `/fr/page-inexistante` and `/en/missing-page` render the branded public 404;
- authenticated `/fr/app/route-inexistante` renders the workspace 404 inside the App Shell;
- a missing project resource renders the masked workspace 404;
- public and authenticated 404 actions navigate correctly;
- recoverable 500 boundaries expose Retry and safe navigation actions;
- Retry calls `reset()` and can restore a one-time thrown component;
- the global fallback contains no sensitive error details;
- test FR/EN, light/dark, keyboard navigation, 390 px and desktop widths;
- verify appearance transitions in both development and production mode, treating production as the reference for flash-of-incorrect-theme regressions.

### Visual regression

- verify shared fields and selects across Settings, Tokens, Components and project creation;
- verify semantic colors and visible focus states;
- verify no unintended 2xl or 3xl card treatment remains;
- verify compact authenticated navigation still closes on Escape and outside interaction;
- verify Dashboard, Brand, Tokens, Themes, Components, Accessibility, Documentation, Exports and AI Instructions remain usable.

## Automated validation status

At corrected implementation handoff:

- lint: passing;
- strict typecheck: passing;
- formatting: passing;
- UI audit: passing;
- test suite: passing;
- production build: passing;
- final standard Quality workflow: passing, run #736;
- temporary diagnostic, correction and formatter workflows or scripts: absent from the final diff;
- product-owner QA: pending.

## Definition of done

DS-170-07 is complete when:

- shared fields, select and dialog foundations are in use where scoped;
- visible native selects are removed;
- token creation uses the mobile bottom-sheet and desktop modal contracts and cannot drift from the selected family;
- desktop dialogs are explicitly centered;
- dialog actions follow the validated Cancel-left/Create-right hierarchy;
- wizard horizontal and vertical spacing passes responsive QA;
- the review step waits for explicit final confirmation;
- the final submitter does not combine a custom name with a function-valued `formAction`;
- public and authenticated unmatched routes use the intended localized 404 surfaces;
- recoverable and global 500 fallbacks are safe and actionable;
- appearance preference is applied before first paint;
- the UI audit passes without undocumented exceptions;
- the standard Quality workflow passes on the final branch head;
- no temporary diagnostic, correction or formatter workflow remains;
- product-owner QA is approved.
