# DS-181R-03B — Border-radius correctness

## Status

Corrective slice after the accepted DS-181R-03A manual QA. This slice is intentionally limited to radius resolution and preview rendering.

## Problem

The first Button V2 authoring pass allowed a uniform radius and per-corner radius values to coexist without a deterministic cross-layer shorthand/longhand contract. The preview also emitted both CSS `borderRadius` and per-corner longhands at the same time, making the result dependent on style application order.

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

## Preview contract

The preview must never emit the ambiguous combination of CSS `borderRadius` plus corner longhands.

- if the resolved radius contains only a uniform value, emit `borderRadius`;
- if any resolved corner is authored, emit corner longhands only;
- corners without a specific value fall back to the resolved uniform value;
- Token and explicit radius values follow identical rules.

## Scope

Included:

- deterministic uniform/per-corner resolution across V2 layers;
- deterministic CSS projection;
- focused tests for shorthand reset, corner inheritance, reset and asymmetric preview cases.

Excluded:

- Surface/effects ownership;
- Background/Foreground ownership;
- general editor UI redesign;
- other component templates.
