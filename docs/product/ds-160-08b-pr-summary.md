# DS-160-08-B PR summary

## Objective

Close the DS-160 UI alignment phase with consistent route states, localized empty copy and a documented Components workspace exception.

## Implementation

- add the shared `WorkspaceState` primitive;
- make `EmptyState` and `ComponentRegistryState` reuse the shared state hierarchy;
- align project and Settings error boundaries;
- align loading-state semantics and visual skeletons;
- rebuild the Tokens skeleton around the real list + inspector layout;
- align Tokens invalid and empty states;
- replace the remaining hardcoded Tokens empty-workspace copy with FR/EN messages;
- document the Components registry/editor/preview contract as an intentional exception;
- add focused state tests and manual QA checklists.

## Product boundary

- no route changes;
- no persistence or Prisma changes;
- no business-logic rewrite;
- no generator output change;
- no new product feature.
