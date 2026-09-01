# DS-181R-01 — Component V2 domain and migration contract

Status: implementation slice

Canonical context:

- `docs/product/ds-181r-components-v2-development-handoff.md`
- `docs/product/ds-181r-00-components-v2-product-reset.md`
- `docs/product/ds-181r-01-components-v2-capability-matrix.md`

This document records the implementation decisions made by DS-181R-01. It does not reopen the rejected Components workspace implementation and does not define a new visible Components layout.

## 1. Identity contract

A Component instance is no longer identified by `ComponentContractType`.

Persisted identity is:

```text
ComponentContract
├─ id
├─ projectId
├─ key
├─ name
├─ templateKey
├─ category
├─ contractVersion
├─ type             # temporary Wave A compatibility metadata
├─ contract
├─ createdAt
└─ updatedAt
```

Rules:

- `key` is the stable machine identity inside one project;
- `key` is unique by `(projectId, key)`;
- `key` uses lower-camel alphanumeric form and is limited to 64 characters;
- renaming the display `name` does not rename `key`;
- `name` is user-facing and is not an identity authority;
- `templateKey` selects the rendering/authoring template and is not unique;
- multiple Component instances may therefore share the same `templateKey`;
- `category` is persisted Component metadata and is not inferred from identity;
- legacy `type` remains temporarily for the five Wave A templates so existing UI paths can continue operating during the migration, but it no longer has a unique database constraint and must not be used as the V2 identity authority.

This removes the previous one-Component-per-type constraint without requiring a visible Components redesign in this slice.

## 2. Versioning and migration

`contractVersion` is explicit persisted metadata.

- existing Component JSON remains version `1` in storage;
- DS-181R-01 does not destructively rewrite every existing JSON contract;
- version `1` records are normalized to the V2 domain contract when read;
- the normalized V2 contract has `version: 2`;
- future V2 persistence must store `contractVersion = 2` and a valid V2 JSON contract;
- unsupported contract versions fail closed instead of being guessed.

The V1 -> V2 migration is deterministic for the five existing seeds:

- Button;
- TextField;
- Card;
- Alert;
- Dialog.

Legacy semantic content is preserved:

- purpose;
- usage guidelines;
- content guidelines;
- anatomy;
- accessibility;
- forbidden patterns;
- lifecycle status;
- variants;
- sizes;
- states;
- all existing token bindings, including custom binding keys.

Recognized legacy visual token bindings are additionally projected into V2 first-class visual properties. The original binding is not deleted during normalization.

## 3. Template and slot contract

Identity, template and renderer remain separate concepts.

Wave A template keys are currently:

- `button`;
- `textField`;
- `card`;
- `alert`;
- `dialog`.

Template slots are fixed structural capabilities. Users may configure supported optional slots but may not create arbitrary child trees in DS-181R.

Wave A slot profiles:

```text
Button
├─ LeadingIcon?
├─ Label
├─ TrailingIcon?
└─ LoadingIndicator?

TextField
├─ Label?
├─ Field
│  ├─ LeadingAdornment?
│  ├─ Input
│  └─ TrailingAdornment?
├─ HelpText?
└─ ErrorText?

Card
├─ Header?
├─ Content
└─ Footer?

Alert
├─ Icon?
├─ Title?
├─ Content
├─ Actions?
└─ Dismiss?

Dialog
├─ Backdrop
└─ Panel
   ├─ Header?
   ├─ Content
   ├─ Footer?
   └─ CloseAction?
```

`Anatomy` remains semantic/documentation content. `slots` are renderer-facing structural configuration. They are intentionally distinct fields; the product must not require users to manually keep two duplicated representations synchronized.

The V1 migration derives an initial slot configuration from legacy Anatomy only as a compatibility bootstrap.

## 4. DesignValue contract

Component visual properties use typed DesignValues instead of arbitrary CSS strings.

Supported source modes are deliberately narrow:

- token reference;
- validated explicit value;
- a small curated mode where the property requires one (`auto`, `fill`).

Token references carry both the token type and token path.

Examples:

```ts
{
  source: 'token',
  tokenType: 'color',
  path: 'color.semantic.action.primary',
}

{
  source: 'value',
  value: '#ff8731',
}
```

DS-181R-01 does not introduce a raw CSS editor, `calc(...)`, arbitrary declarations or freeform style objects.

## 5. Visual capability families

The V2 domain supports sparse properties grouped by capability:

- dimensions;
- spacing;
- border;
- radius;
- surface/elevation;
- typography;
- layout;
- overflow.

Not every future template must expose every property. The schema defines the safe value language; template capability metadata remains responsible for deciding which properties the editor will expose.

## 6. Overrides and precedence

Overrides are sparse. Missing properties inherit.

The deterministic resolution order is:

```text
template defaults
  -> Component base
  -> Variant override
  -> Size override
  -> State override
```

For the first V2 editor implementation, only one Variant, one Size and one State are resolved at a time. Later additions such as compound conditions must define a new explicit precedence contract rather than relying on object iteration order.

Resetting an override removes the authored property from that override. It does not copy the inherited value into the override.

## 7. Token reference integrity

The legacy token-binding system remains supported.

V2 also introduces first-class token references inside visual DesignValues. Token rename/delete integrity therefore covers both representations:

- `tokenBindings[].tokenPath`;
- V2 `{ source: 'token', path }` DesignValues in base properties, slots and overrides.

A token rename migrates both forms atomically with the existing project token/theme mutation transaction.

When a non-blocking Component reference is detached during token deletion:

- the legacy token binding is removed;
- the matching V2 DesignValue property is removed so normal inheritance/fallback can resume.

References from another Token remain blocking, as before.

## 8. Downstream compatibility boundary

The canonical project source normalizes persisted Component records to V2 and also exposes a legacy semantic adapter for existing Documentation, AI, Export and Accessibility consumers.

This lets downstream consumers migrate incrementally instead of forcing one repository-wide rewrite in the same slice.

The current visible Components editor intentionally continues writing V1 JSON in DS-181R-01 because it does not yet expose V2 visual/slot controls. Persisting a normalized V2 object from that editor would risk silently deleting fields that the current UI cannot edit.

The first V2-aware writer must:

1. load through the V2 normalization boundary;
2. edit only its owned V2 fields;
3. persist `contractVersion = 2`;
4. preserve semantic fields and custom token bindings.

## 9. Rollback contract

The database migration is additive before it removes only the old uniqueness rule:

1. add `key`, `templateKey`, `category`, `contractVersion`;
2. backfill existing rows from the five legacy types;
3. enforce non-null identity metadata;
4. replace unique `(projectId, type)` with unique `(projectId, key)`;
5. add a `(projectId, templateKey)` lookup index.

While no project contains two rows sharing the same legacy `type`, rollback can restore the old `(projectId, type)` unique index and remove the new columns.

Once a released V2 writer allows two Component identities to share one template/type, rollback to the old schema is no longer mechanically safe. A rollback at that point requires an explicit data reconciliation step before restoring legacy uniqueness.

DS-181R-01 itself does not add a visible arbitrary-Component creation flow, so the integration branch remains inside the mechanically reversible window.

## 10. Explicit non-goals of this slice

DS-181R-01 does not:

- reuse or merge `refactor/components-workspace-v2`;
- ship the rejected workspace implementation;
- redesign the visible Components page;
- introduce a Figma-like freeform canvas;
- implement arbitrary nested children;
- implement responsive overrides;
- implement compound override conditions;
- replace the five Wave A renderers;
- automatically merge its PR into the integration branch.

Those concerns belong to later DS-181R slices after this domain contract is qualified.
