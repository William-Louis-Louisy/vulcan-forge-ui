# DS-181R-03B — Border-radius correctness

## Status

Corrective slice after the accepted DS-181R-03A manual QA. Automated regression coverage is green after the integration correction; manual QA remains required before 03B can be accepted.

## Problem

The first Button V2 authoring pass allowed a uniform radius and per-corner radius values to coexist without a deterministic cross-layer shorthand/longhand contract.

The first 03B correction fixed that pure resolution problem, but real-page QA exposed a second issue: the legacy **Visual Tokens** editor still exposed and live-projected its `radius` role while the dedicated Button V2 editor also owned radius. That created two authoring surfaces for the same V2 capability.

## Resolution contract

Radius resolution follows the canonical Component V2 layer order:

`template defaults → base → variant → size → state`

Within that sequence:

- a layer that authors only a corner overrides only that inherited corner;
- a layer that authors the uniform `radius` behaves as a shorthand and clears previously inherited corner-specific values;
- corner values authored in the same layer as a uniform `radius` override that shorthand for their own corners;
- reset removes only the authored property and restores inherited behavior.

Examples:

- template `radius=8px` + base `topLeft=16px` → `16px 8px 8px 8px`;
- previous mixed corners + variant `radius=4px` → all corners become `4px`;
- variant `radius=4px` + variant `bottomRight=12px` → `4px 4px 12px 4px`.

## Live ownership contract

For the Wave A Button V2 editor:

- legacy V1 → V2 migration may still seed `visual.radius.radius` from a stored `tokenBindings.radius` value;
- once the Button V2 contract is live, the dedicated Button V2 radius controls are the only live authoring source for radius;
- the legacy `radius` binding remains preserved as compatibility data and is not destructively removed from persisted legacy semantics;
- the legacy **Visual Tokens** editor no longer displays or offers the official `radius` role for Button;
- subsequent legacy token-binding edits must not rewrite authored Button V2 radius or corner values.

This boundary is intentionally limited to Button radius. Surface/effects ownership remains DS-181R-03C.

## Preview contract

The preview uses one unambiguous CSS `border-radius` declaration:

- uniform-only radius emits the normal one-value shorthand, for example `8px`;
- when any corner is authored, the resolved four corners are emitted as one four-value shorthand in CSS order: `top-left top-right bottom-right bottom-left`;
- corners without a specific value fall back to the resolved uniform value, or `0` when no uniform value exists;
- Token and explicit radius values follow identical rules;
- the renderer never mixes `borderRadius` with per-corner React style longhands.

Examples:

- `radius=8px`, `topLeft=18px`, `bottomRight=32px` → `border-radius: 18px 8px 32px 8px`;
- `topLeft=4px`, `topRight=8px`, `bottomRight=16px`, `bottomLeft=32px` → `border-radius: 4px 8px 16px 32px`.

## Regression coverage

The slice covers:

- higher-layer uniform shorthand replacing inherited corners;
- corner-only inheritance;
- sparse reset behavior;
- mixed uniform/asymmetric projection;
- four-corner projection;
- Button V2 radius surviving subsequent legacy radius-binding changes;
- the legacy Visual Tokens editor hiding/excluding the Button `radius` role while preserving the stored binding.

## Scope

Included:

- deterministic uniform/per-corner resolution across V2 layers;
- deterministic CSS projection;
- Button V2 radius live-ownership boundary;
- focused integration and regression tests.

Excluded:

- Surface/effects ownership;
- Background/Foreground ownership;
- general editor UI redesign;
- other component templates.
