# DS-170-07C — Secure project deletion

## Objective

Allow a workspace owner to permanently delete one design-system project without exposing the operation to other workspace members or leaving related project data behind.

## Product decisions

- project deletion lives in a dedicated project Settings page;
- every workspace member can open Project Settings and confirm the project identity;
- only the workspace owner sees the destructive deletion workflow;
- the server action independently enforces ownership and never relies on the client-side visibility check;
- deletion requires the current project name to be entered exactly;
- successful deletion returns the user to the dashboard with an explicit confirmation notice.

## Security and data integrity

The server action resolves the authenticated user and queries the project through all of the following constraints:

- stable project identifier;
- current project slug;
- workspace ownership by the authenticated user.

A missing or unauthorized project returns the same non-disclosing error. The action reloads the current project name before comparing the confirmation value, then deletes by the authorized project identifier.

No Prisma migration is required. Existing `onDelete: Cascade` relations remove the project-owned locale settings, brand profile, token sets, themes, component contracts, accessibility reports, documentation profile, AI instruction profile and export logs.

## Navigation and feedback

Project Settings is available from the project navigation and remains the active destination when switching projects. After deletion, the dashboard is revalidated and displays a localized success notice.

## Automated coverage

Focused tests cover:

- unauthenticated rejection;
- workspace-owner authorization in the project lookup;
- rejection of non-owner or missing projects;
- exact project-name confirmation;
- deletion, dashboard revalidation and localized redirect;
- English/French message-shape parity;
- preservation of the Settings destination in the project switcher.

The standard Quality workflow remains the final automated gate and includes Prisma generation, lint, strict TypeScript checking, formatting, UI audit, the complete test suite and production build.

## Manual QA checklist

### Workspace owner

- open a project and navigate to Project Settings;
- confirm the displayed project name and slug;
- open the danger-zone confirmation;
- verify deletion remains disabled until the exact project name is entered;
- cancel once and confirm the input is reset;
- submit the exact project name;
- verify redirection to the dashboard, the localized success notice and disappearance of the deleted project;
- verify another project remains intact and usable.

### Non-owner workspace member

- open Project Settings;
- verify the project identity remains visible;
- verify the deletion form is absent and the owner-only permission notice is shown;
- attempt a direct server-action submission and confirm it is rejected.

### Responsive and accessible interaction

- repeat the confirmation flow on mobile;
- complete the flow using keyboard navigation only;
- verify focus visibility, labels, error association, pending state and destructive contrast in light and dark appearance.

### Project save status

- modify Brand, a generic token value, a primitive color, a semantic alias, a token description, a token name, a typography token and a component contract;
- verify the topbar reports unsaved changes immediately for every controlled draft;
- submit a valid change and verify the transition from saving to saved;
- trigger a validation error and verify the error state;
- edit the failed draft and verify the stale server error clears while the draft returns to unsaved;
- verify unchanged forms cannot be submitted and do not keep the project in an unsaved state;
- switch between token inspector entries and projects and verify removed editors no longer influence the aggregate status.

## Definition of done

DS-170-07C is complete when:

- the standard Quality workflow passes on the final branch head;
- the owner and non-owner manual QA paths pass;
- the deleted project disappears after redirect and related data is removed through database cascades;
- the product owner approves the destructive workflow.

## Pre-QA follow-up

Before product-owner QA, the project Overview now exposes a Settings action with a gear icon immediately before Open documentation. The Rust 500 primitive uses `#ff3131`, and the existing lint warnings from the UI-audit success output and unused overview imports have been removed.

The project save-status lifecycle was also audited across Brand, Tokens and Component contracts. A shared action-backed tracker now distinguishes the last persisted fingerprint from the current draft, reports validation failures, ignores stale server errors after further edits, and prevents unchanged submissions from falsely changing the aggregate status.

The final Quality workflow must pass on this follow-up head before manual QA approval.
