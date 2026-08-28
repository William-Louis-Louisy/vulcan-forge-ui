# DS-181 — Components Workspace V2 branch strategy

## Goal

Keep `main` as the stable Components product while Workspace V2 is developed and qualified.

## Integration branch

All Workspace V2 implementation work is integrated on:

```text
refactor/components-workspace-v2
```

Focused DS-181 branches are created from the current integration head and their pull requests target `refactor/components-workspace-v2`, not `main`.

```text
main
  └─ refactor/components-workspace-v2
       ├─ agent/ds-181-02-...
       ├─ agent/ds-181-03-...
       └─ agent/ds-181-XX-...
```

`main` keeps the current qualified Components page throughout the refactor.

## Quality checks

The integration branch enables the repository `Quality` workflow for pull requests targeting `refactor/components-workspace-v2`.

Every focused Workspace V2 PR must pass the normal migration, auth integration, lint, typecheck, formatting, UI audit, tests and build checks before it is merged into the integration branch.

## Main synchronization

Unrelated stable work may continue on `main`. Bring `main` into the integration branch at intentional checkpoints and always before final Workspace V2 qualification.

Stable fixes continue to be developed and released from `main`; they are then synchronized into the integration branch when appropriate.

## Final release

The integration branch is not merged incrementally into `main`.

When Workspace V2 is complete, qualify the full integrated experience on desktop, medium widths and mobile, including keyboard/focus behavior, save and unsaved-change flows, validation, preview behavior, compatibility with existing projects and relevant downstream Accessibility/Documentation/AI behavior.

Only after that qualification open one final release PR:

```text
refactor/components-workspace-v2 -> main
```

After the final PR is merged and accepted, the dedicated integration branch can be removed and normal Components work returns to focused branches based on `main`.
