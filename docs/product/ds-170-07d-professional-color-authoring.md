# DS-170-07D — Professional color authoring

## Objective

Replace primitive-color text-only authoring with a guided, synchronized color picker before the final DS-170 user journey.

The interaction must remain suitable for technical users: visual selection supplements exact hexadecimal entry rather than replacing it.

## Scope

- add one reusable controlled color-picker field for primitive color values;
- keep direct `#RGB`, `#RRGGBB` and `#RRGGBBAA` entry;
- expose the browser-native visual color selector from a clear swatch control;
- add an explicit opacity control synchronized with the optional hexadecimal alpha channel;
- preserve opacity when the RGB value changes visually;
- normalize values produced by visual controls to uppercase hexadecimal;
- preserve invalid manual drafts so validation feedback and correction remain predictable;
- integrate the field into primitive color creation;
- integrate the field into primitive color editing;
- keep semantic color authoring reference-based;
- preserve project save-status behavior for edited primitive tokens;
- provide English and French labels for picker-specific controls;
- add focused utility and interaction tests.

## Product boundary

- no color-space expansion beyond hexadecimal RGB/RGBA;
- no persistence or Prisma changes;
- no change to semantic-token alias behavior;
- no automatic palette generation;
- no recent-colors or saved-swatches collection;
- no component preview-role selector, which remains DS-170-07E.

## Interaction model

### Manual authoring

The hexadecimal input remains the source submitted to existing server actions. Users can type, paste and copy exact values. Invalid drafts are not silently replaced by the picker fallback.

### Visual authoring

The swatch exposes a native visual color selector. Selecting a color updates the RGB portion while preserving the current alpha channel.

### Opacity

The opacity slider maps `0–100%` to the two-digit hexadecimal alpha channel:

- `100%` produces `#RRGGBB`;
- values below `100%` produce `#RRGGBBAA`;
- changing opacity from an invalid draft starts from the visible fallback color rather than producing malformed output.

## Automated validation

The focused tests cover:

- parsing shorthand, six-digit and eight-digit hexadecimal values;
- normalized uppercase output;
- native-picker RGB synchronization;
- alpha preservation when RGB changes;
- adding and removing the alpha channel from opacity changes;
- manual entry preservation;
- English and French accessible control labels.

## Manual QA

### Primitive creation

1. Open Tokens and create a primitive color token.
2. Verify the hexadecimal field defaults to `#000000`.
3. Open the visual picker from the swatch and select another color.
4. Verify the hexadecimal value updates immediately.
5. Move opacity below `100%` and verify an eight-digit value is produced.
6. Return opacity to `100%` and verify the alpha suffix is removed.
7. Type a valid shorthand value such as `#F83` and create the token.
8. Type an invalid value and verify creation is disabled until the value is valid.

### Primitive editing

1. Select an existing primitive color token.
2. Change RGB visually and verify the project save status becomes unsaved.
3. Change opacity and verify the value and preview stay synchronized.
4. Save and verify the status moves through saving to saved.
5. Type an invalid draft and verify the error state appears without losing the draft.
6. Correct the draft using the picker and verify the stale error clears.

### Accessibility and responsive behavior

1. Reach the hexadecimal input, swatch picker and opacity slider by keyboard.
2. Verify the controls expose meaningful English and French labels.
3. Verify focus indication is visible on the swatch control.
4. Verify the field remains usable in the creation dialog and token inspector at mobile, tablet and desktop widths.
