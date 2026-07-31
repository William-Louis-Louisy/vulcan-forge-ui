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

The first correction covered shared `Button`, `Select` and `SegmentedControl` primitives only. The next attempt placed a generic native-control selector inside Tailwind's base cascade layer and tested only that the selector text existed. That did not prove the rendered cursor behavior and left several real surfaces unchanged during QA.

The corrected contract now uses a dedicated unlayered `interactive-cursor.css` stylesheet imported after Tailwind. It has deliberate cascade priority over layered component and utility rules and defines:

- pointer cursors for enabled native buttons, selects, checkbox controls, radio controls, color controls, summaries and ARIA buttons;
- not-allowed cursors for disabled native and ARIA controls;
- pointer or not-allowed affordances for labels owning checkbox and radio inputs;
- an explicit default-cursor exception for the currently selected disabled locale.

Frequently used controls also expose their intent directly through `cursor-pointer`, including the user-menu trigger, logout action, locale-switcher options, Token editor tabs and the component delete trigger. The unlayered native contract covers directly authored controls such as the project switcher and the Components localized-content locale buttons.

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
- computed pointer behavior for enabled native and ARIA controls;
- computed not-allowed behavior for disabled controls;
- computed default-cursor behavior for the active locale exception;
- checkbox and radio label selector coverage.

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
2. Verify the pointer cursor on the user-menu trigger, Settings link and logout action.
3. Verify the pointer cursor on inactive topbar locale options and the default cursor on the active locale.
4. Verify the pointer cursor on the project-switcher trigger.
5. Verify the pointer cursor on the Components localized-content locale buttons and component delete trigger.
6. Verify the pointer cursor on every Tokens family tab.
7. Verify the pointer cursor on authenticated and public mobile-menu triggers.
8. Verify pointer affordance on checkbox, radio, color and disclosure controls.
9. Verify disabled controls expose a not-allowed cursor unless an explicit product-specific override applies.

### Regression checks

- Existing canonical bindings remain selected correctly.
- Existing recognized aliases continue to drive the preview.
- Save-status reporting moves through unsaved, saving and saved states.
- English and French labels fit on desktop, tablet and mobile.
- Keyboard-only operation works for role, type and token-path selectors.
