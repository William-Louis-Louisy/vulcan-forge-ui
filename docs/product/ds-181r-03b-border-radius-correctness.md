# DS-181R-03B — Border-radius correctness

## Status

Corrective slice after the accepted DS-181R-03A manual QA. Automated regression coverage must be green after each integration correction; manual QA remains required before 03B can be accepted.

## Problem

The first Button V2 authoring pass allowed a uniform radius and per-corner radius values to coexist without a deterministic cross-layer shorthand/longhand contract.

The first 03B correction fixed that pure resolution problem, but real-page QA exposed a second issue: the legacy **Visual Tokens** editor still exposed and live-projected its `radius` role while the dedicated Button V2 editor also owned radius. That created two authoring surfaces for the same V2 capability.

A later real-page QA exposed two additional authoring/preview edge cases:

- selecting a new uniform `Radius` did not remove corner overrides already authored in the same layer, so users had to reset all four corners manually before the uniform value became visible;
- composing `radius.full = 9999px` with smaller asymmetric corners triggered CSS overlapping-radius normalization, proportionally shrinking the other corners until they appeared square.

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

## Authoring intent contract

The dedicated Button visual editor treats writing an explicit uniform `Radius` as a reset-to-uniform intent for the currently edited layer:

- setting `Radius` removes `topLeft`, `topRight`, `bottomRight`, and `bottomLeft` authored in that same layer before storing the new uniform value;
- this applies identically to Base, Variant, Size, and State scopes;
- corners in other layers are not mutated;
- after a uniform value is authored, users may add corner-specific values again to intentionally create an asymmetric shape.

This guarantees that choosing a new uniform radius immediately produces four uniform corners without requiring four manual resets first.

## Live ownership contract

For the Wave A Button V2 editor:

- legacy V1 → V2 migration may still seed `visual.radius.radius` from a stored `tokenBindings.radius` value;
- once the Button V2 contract is live, the dedicated Button V2 radius controls are the only live authoring source for radius;
- the legacy `radius` binding remains preserved as compatibility data and is not destructively removed from persisted legacy semantics;
- the legacy **Visual Tokens** editor no longer displays or offers the official `radius` role for Button;
- subsequent legacy token-binding edits must not rewrite authored Button V2 radius or corner values.

This boundary is intentionally limited to Button radius.

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

### `radius.full` in asymmetric composition

`radius.full` resolves to `9999px`. That value remains unchanged when it is the only resolved radius, preserving normal pill/full behavior.

When a full radius participates in a mixed four-corner composition, the preview normalizes the resolved `9999px` value to `50%` before emitting the shorthand. This avoids the browser's proportional scaling of all overlapping radii, which otherwise makes intentionally smaller corners appear to lose their rounding.

Example:

- `radius=radius.full`, `topLeft=18px`, `bottomRight=32px` → `border-radius: 18px 50% 32px 50%`.

The stored Token remains `9999px`; this normalization belongs only to composed CSS preview projection and also applies when an alias resolves to the same full value.

## Regression coverage

The slice covers:

- higher-layer uniform shorthand replacing inherited corners;
- corner-only inheritance;
- sparse reset behavior;
- authoring a uniform radius clearing same-layer corner overrides;
- preserving corner overrides authored in other layers;
- mixed uniform/asymmetric projection;
- four-corner projection;
- uniform-only `radius.full` remaining `9999px`;
- asymmetric compositions normalizing resolved `radius.full` fallback values;
- Button V2 radius surviving subsequent legacy radius-binding changes;
- the legacy Visual Tokens editor hiding/excluding the Button `radius` role while preserving the stored binding.

## Scope

Included:

- deterministic uniform/per-corner resolution across V2 layers;
- deterministic same-layer authoring intent;
- deterministic CSS projection including `radius.full` compositions;
- Button V2 radius live-ownership boundary;
- focused integration and regression tests.

Excluded:

- Surface/effects ownership;
- Background/Foreground ownership;
- general editor UI redesign;
- other component templates.
