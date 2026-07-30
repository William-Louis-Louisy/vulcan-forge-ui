# DS-170-07D — Professional color authoring

## Objective

Replace primitive-color text-only authoring with a guided, synchronized color picker before the final DS-170 user journey.

The interaction must remain suitable for technical users: visual selection supplements exact hexadecimal entry rather than replacing it.

## Scope

- add one reusable controlled color-picker field for primitive color values;
- keep direct `#RGB`, `#RRGGBB` and `#RRGGBBAA` entry;
- expose a custom visual color picker from a clear swatch control;
- provide an interactive saturation-and-brightness plane and hue slider;
- provide Picker, HSB, HSL and RGB authoring modes;
- expose the browser EyeDropper API when supported;
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

- persisted token values remain hexadecimal RGB/RGBA;
- HSB and HSL are editing representations and do not change the stored model;
- the eyedropper depends on browser support and has a disabled fallback;
- no persistence or Prisma changes;
- no change to semantic-token alias behavior;
- no automatic palette generation;
- no recent-colors or saved-swatches collection;
- no component preview-role selector, which remains DS-170-07E.

## Interaction model

### Manual authoring

The hexadecimal input remains the source submitted to existing server actions. Users can type, paste and copy exact values. Invalid drafts are not silently replaced by the picker fallback.

### Visual authoring

The swatch opens an application-controlled popover containing a saturation-and-brightness plane, hue slider, synchronized value editor and mode selector. Pointer and keyboard changes update the RGB portion while preserving the current alpha channel.

The mode selector exposes:

- Picker for direct hexadecimal authoring;
- HSB for hue, saturation and brightness channels;
- HSL for hue, saturation and lightness channels;
- RGB for red, green and blue channels.

The eyedropper samples a screen color through the browser API when available. Cancelling the browser eyedropper leaves the draft unchanged.

### Opacity

The opacity slider maps `0–100%` to the two-digit hexadecimal alpha channel:

- `100%` produces `#RRGGBB`;
- values below `100%` produce `#RRGGBBAA`;
- changing opacity from an invalid draft starts from the visible fallback color rather than producing malformed output.

## Automated validation

The focused tests cover:

- parsing shorthand, six-digit and eight-digit hexadecimal values;
- normalized uppercase output;
- RGB, HSB and HSL conversions;
- visual hue synchronization;
- mode selection and RGB channel editing;
- alpha preservation when color channels change;
- adding and removing the alpha channel from opacity changes;
- manual entry preservation;
- English and French accessible control labels.

## Manual QA

### Primitive creation

1. Open Tokens and create a primitive color token.
2. Verify the hexadecimal field defaults to `#000000`.
3. Open the visual picker from the swatch and select another color in the saturation-and-brightness plane.
4. Move the hue slider and verify the hexadecimal value updates immediately.
5. Open the mode menu and verify Picker, HSB, HSL and RGB are available with a visible selected state.
6. Edit at least one channel in each numeric mode and verify the picker and hexadecimal value stay synchronized.
7. Move opacity below `100%` and verify an eight-digit value is produced.
8. Return opacity to `100%` and verify the alpha suffix is removed.
9. Type a valid shorthand value such as `#F83` and create the token.
10. Type an invalid value and verify creation is disabled until the value is valid.

### Primitive editing

1. Select an existing primitive color token.
2. Change RGB visually and verify the project save status becomes unsaved.
3. Change opacity and verify the value and preview stay synchronized.
4. Save and verify the status moves through saving to saved.
5. Type an invalid draft and verify the error state appears without losing the draft.
6. Correct the draft using the picker and verify the stale error clears.
7. Use the eyedropper in a supported browser and verify the sampled color preserves the current opacity.
8. In an unsupported browser, verify the eyedropper action is visibly disabled.

### Accessibility and responsive behavior

1. Reach the hexadecimal input, swatch trigger, saturation-and-brightness plane, hue slider, mode selector, channel inputs, eyedropper and opacity slider by keyboard.
2. Verify arrow keys operate the saturation-and-brightness plane and standard range controls.
3. Verify the controls expose meaningful English and French labels.
4. Verify focus indications remain visible throughout the picker.
5. Verify Escape and outside interaction close the popover predictably.
6. Verify the popover remains usable without clipping in the creation dialog and token inspector at mobile, tablet and desktop widths.
7. Verify the picker remains legible in light and dark appearances.
