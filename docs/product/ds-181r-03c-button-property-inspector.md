# DS-181R-03C — Button property inspector UX/UI

## Status

UX/UI refinement stacked on the manually accepted DS-181R-03B Button behavior. The goal is to make the Button customization model materially clearer before the V2 pattern is generalized to another component template.

## Product direction

The Button visual editor is no longer treated as a long technical form. It behaves as a compact property inspector inspired by established design-tool interfaces such as Figma:

- show the properties that are useful now;
- progressively disclose optional property groups;
- keep editing context visible and compact;
- avoid duplicate authoring surfaces for the same visual capability;
- preserve the canonical Component V2 data model rather than reproducing Figma's internal model.

This is interaction-pattern inspiration, not a visual clone of Figma.

## Single visual-authoring surface

For Button:

- the dedicated Component V2 inspector is the only live visual authoring surface;
- the legacy semantic-contract **Visual tokens** editor is not rendered for Button;
- existing legacy token bindings remain present in compatibility data and can still seed migration behavior;
- semantic fields remain editable through the existing component contract editor;
- other templates continue using their current legacy Visual tokens editor until their own V2 customization slice exists.

This removes the previous ambiguity where users could edit related visual concerns in two different sections.

## Inspector structure

### Editing context

The inspector exposes the V2 authoring layers as a compact segmented control:

`Base | Variant | Size | State`

Unavailable axes are disabled when the semantic contract has no entries for that axis. Variant, Size and State expose a target selector only when active.

### Core groups

The following groups remain visible because they are fundamental to Button geometry:

- Dimensions;
- Spacing;
- Radius.

They retain Token / explicit / inherited behavior and continue writing sparse canonical V2 data.

### Optional groups

The inspector header exposes one `+` action. Optional groups can be added progressively:

- Fill;
- Stroke / Border;
- Typography.

Adding a group only reveals its controls; it does not invent an override value. A value is authored only when the user chooses a Token, explicit value, or another controlled mode.

Removing an optional group resets the values owned by that group in the current editing layer and therefore restores inheritance. Other groups and other V2 layers remain untouched.

`Fill` owns the V2 `surface.background` and `surface.foreground` values. `Stroke / Border` owns the V2 border group. Typography keeps its canonical V2 typography value.

## Radius interaction

Radius follows the established property-inspector pattern:

- one uniform Radius control is shown by default;
- an **Independent corners** checkbox enables per-corner authoring;
- when enabled, the UI reveals Top-left, Top-right, Bottom-right and Bottom-left controls;
- when disabled again, corner overrides in the current editing layer are removed and the uniform/inherited behavior is restored;
- if a stored V2 scope already owns at least one corner override, the checkbox starts enabled when that scope is opened.

DS-181R-03B correctness rules remain authoritative:

- setting a uniform radius clears same-layer corners;
- cross-layer inheritance remains template → base → variant → size → state;
- `radius.full` retains the accepted asymmetric preview behavior.

## Design-value controls

The former card-per-property layout is replaced by compact property rows. Each row keeps the canonical controlled source model:

- Inherit / default;
- Token, when compatible tokens exist;
- Explicit value;
- Auto / Fill only for supported dimension properties.

The source selector, resolved Token/value editor and reset affordance are grouped on the same row where space permits.

## Sparse persistence contract

The UX redesign does not change persistence semantics:

- preview updates immediately from the local V2 draft;
- the save action still sends only `{visual, overrides}`;
- reset removes authored data instead of copying inherited values;
- optional group removal is scope-local;
- semantic saves continue preserving V2-only visual data.

## Out of scope

This slice deliberately does not add:

- elevation/effects/shadow authoring;
- new visual property families;
- freeform CSS;
- arbitrary composition;
- another component template;
- a general redesign of the semantic contract editor.

Effects will be reconsidered only after this inspector model is accepted in real use.

## Acceptance gate

Before this pattern is generalized, manual QA must establish that the Button editor is materially clearer and faster than the previous fieldset-based form, specifically:

- uniform radius is the obvious default;
- independent corners are discoverable without adding noise to the default state;
- optional visual groups are easy to add and remove;
- there is only one Button visual-authoring surface;
- Base / Variant / Size / State context remains understandable;
- Token / explicit / inherited behavior remains predictable;
- persistence and immediate preview still work.

If this interaction model is not materially better, the project should refine Button again rather than scale it to Wave A templates.

The product gate applies to the interaction model itself: effects, shadows and elevation must not be used to compensate for an inspector structure that is still unclear.
