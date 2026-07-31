# DS-170-07E — Component preview role bindings

## Objective

Replace free-form preview-role authoring with a guided binding workflow while preserving the component contract's ability to carry arbitrary token binding keys.

## Product decisions

- Supported preview roles are selected through the shared accessible `Select` primitive.
- A newly added binding receives the first available supported role.
- Supported roles are unique within a component contract; roles already assigned by another binding are disabled.
- Selecting a supported role enforces its compatible token type and clears an incompatible token path.
- The constrained token type remains visible but locked after it is valid.
- Existing aliases recognized by the preview continue to resolve to their supported role.
- An advanced custom-role option preserves arbitrary binding keys and restores manual token-type selection.
- No persistence or Prisma change is introduced.

## Supported roles and token types

| Preview role | Required token type |
| ------------ | ------------------- |
| `background` | `color`             |
| `foreground` | `color`             |
| `border`     | `color`             |
| `radius`     | `radius`            |
| `padding`    | `spacing`           |
| `paddingX`   | `spacing`           |
| `paddingY`   | `spacing`           |
| `duration`   | `motion`            |
| `motion`     | `motion`            |

Typography tokens remain available through custom roles because the current preview has no official typography role.

## Interaction model

1. Add a visual token binding.
2. The editor selects the first unused official preview role.
3. The compatible token type is assigned automatically.
4. The token-path selector lists only tokens of that type.
5. Switching to another official role updates the type and clears the path when required.
6. Switching to **Custom role (advanced)** reveals an exact key field and unlocks token-type selection.

## Cursor affordance correction

The first correction covered shared `Button`, `Select` and `SegmentedControl` primitives only. That left native buttons authored directly inside layout and feature components unchanged, including the user menu, locale switcher, project switcher and mobile menu triggers.

The final contract is defined at the application foundation level:

- enabled native buttons, selects, checkbox controls, radio controls, color controls and summaries use the pointer cursor;
- disabled native controls use the not-allowed cursor;
- labels owning checkbox and radio controls inherit the matching enabled or disabled affordance;
- component-level cursor utilities remain available for explicit exceptions such as a selected locale using the default cursor;
- automated coverage verifies that the global contract remains present.

This makes the behavior apply to current and future controls whether or not they consume the shared `Button` primitive.

## Accessibility

- The role selector uses the shared combobox/listbox interaction.
- Disabled duplicate roles expose their unavailable state and reason.
- Role labels, custom-role guidance and type metadata are localized in English and French.
- Keyboard navigation, typeahead, focus restoration and Escape behavior are inherited from the shared `Select` primitive.
- Cursor affordance supplements semantic HTML and keyboard behavior; it does not replace either.

## Automated coverage

- role-to-token-type constraints;
- official, alias, custom and empty role detection;
- normalized duplicate-role tracking;
- first-available role selection;
- guided binding creation;
- compatible token filtering;
- duplicate official-role disabling;
- advanced custom-role authoring;
- global enabled and disabled cursor contracts for native controls and their checkbox/radio labels.

## Manual QA

### Guided role flow

1. Open a component contract with no visual token binding.
2. Add a visual token and verify that `background` is selected.
3. Verify that the token type is `color` and locked.
4. Verify that only color tokens are offered.
5. Change the role to `radius` and verify that the type becomes `radius` and the token path is cleared.
6. Add another binding and verify that the next unused role is selected.
7. Open its role selector and verify that roles already used by another binding are disabled.

### Custom role flow

1. Select **Custom role (advanced)**.
2. Enter an arbitrary key such as `fontWeight`.
3. Verify that token-type selection is unlocked.
4. Select `typography`, choose a typography token and save.
5. Reload the component and verify that the arbitrary binding remains editable as a custom role.

### Cursor affordance

1. Verify the pointer cursor on shared buttons and selects.
2. Verify the pointer cursor on the user-menu trigger.
3. Verify the pointer cursor on inactive locale-switcher options and the default cursor on the active locale.
4. Verify the pointer cursor on the project-switcher trigger.
5. Verify the pointer cursor on authenticated and public mobile-menu triggers.
6. Verify pointer affordance on checkbox, radio, color and disclosure controls.
7. Verify disabled controls expose a not-allowed cursor unless an explicit product-specific override applies.

### Regression checks

- Existing canonical bindings remain selected correctly.
- Existing recognized aliases continue to drive the preview.
- Save-status reporting moves through unsaved, saving and saved states.
- English and French labels fit on desktop, tablet and mobile.
- Keyboard-only operation works for role, type and token-path selectors.
