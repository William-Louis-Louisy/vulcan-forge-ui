import { describe, expect, it } from 'vitest';
import { componentV2CustomizationMessages } from './component-v2-customization-messages';

describe('Component V2 Button customization messages', () => {
  it('keeps technical design-system vocabulary canonical across locales', () => {
    const english =
      componentV2CustomizationMessages.en.ComponentsRegistryPage
        .buttonCustomization;
    const french =
      componentV2CustomizationMessages.fr.ComponentsRegistryPage
        .buttonCustomization;

    expect(french.groups).toEqual(english.groups);
    expect(french.properties).toEqual(english.properties);
    expect(french.borderStyles).toEqual(english.borderStyles);
    expect(french.textAlignments).toEqual(english.textAlignments);
  });

  it('does not duplicate Visual Tokens or deferred effects ownership', () => {
    const messages =
      componentV2CustomizationMessages.en.ComponentsRegistryPage
        .buttonCustomization;

    expect('surface' in messages.groups).toBe(false);
    expect('background' in messages.properties).toBe(false);
    expect('foreground' in messages.properties).toBe(false);
    expect('elevation' in messages.properties).toBe(false);
  });
});
