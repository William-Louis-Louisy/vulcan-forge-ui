# DS-181R-03 — Corrective decomposition after rejected QA

## Status

The first DS-181R-03 Button customization implementation is **not product-qualified**.

Manual QA identified structural problems that are larger than presentation polish:

- technical design-system terminology was translated in ways that made the editor harder to reason about;
- Border and Surface ownership was duplicated in the editor;
- Background / Foreground duplicated capabilities already exposed by the existing Visual Tokens section;
- Elevation / shadow was grouped under Surface without a clear product ownership model;
- per-corner border-radius behavior did not match the authored values reliably.

The parent PR remains draft until all corrective slices are completed and manually re-qualified.

## Correction strategy

Do not repair all concerns in one implementation pass. DS-181R-03 is split into independently reviewable slices.

### DS-181R-03A — Editor taxonomy cleanup

Scope only:

- keep canonical technical vocabulary in English across locales while localizing explanatory copy and actions;
- expose a single Border group;
- remove Surface from the Button V2 editor for now;
- keep Background / Foreground under the existing Visual Tokens ownership;
- defer Elevation / shadow instead of presenting it under an unclear Surface abstraction;
- do not change the V2 domain model, persistence contract, override semantics or radius behavior.

Acceptance:

- exactly one Border section is rendered by the Button V2 editor;
- no Surface section is rendered;
- no Background, Foreground or Elevation authoring control is rendered by this editor;
- technical group/property labels are stable across EN/FR;
- existing V2 data remains preserved even when a temporarily hidden capability already exists in stored records.

### DS-181R-03B — Border-radius correctness

Scope only after 03A is accepted:

- define unambiguous precedence between uniform radius and per-corner values;
- make inherited/template/base/override values observable and deterministic;
- ensure each corner renders exactly the authored resolved value;
- add focused unit tests for uniform + asymmetric combinations and reset/inheritance;
- no Surface/effects work.

### DS-181R-03C — Visual ownership: tokens vs effects

Scope only after 03B is accepted:

- decide whether Background / Foreground remain exclusively Visual Tokens concerns or move to a consolidated V2 appearance surface;
- define Effects as a distinct capability if elevation/shadow is retained;
- eliminate dual sources of truth before exposing controls;
- add migration/compatibility tests for any ownership change.

## Guardrail

A green CI is necessary but is not sufficient for product qualification. Each corrective slice must have a narrow manual acceptance target before the next slice starts.
