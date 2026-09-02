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
    expect(english.unset).toBe('Default');
    expect(french.unset).toBe('Default');
  });

  it('keeps Fill ownership while deferred effects stay out of the inspector', () => {
    const messages =
      componentV2CustomizationMessages.en.ComponentsRegistryPage
        .buttonCustomization;

    expect(messages.groups.fill).toBe('Fill');
    expect(messages.properties.background).toBe('Background');
    expect(messages.properties.foreground).toBe('Foreground');
    expect('surface' in messages.groups).toBe(false);
    expect('elevation' in messages.properties).toBe(false);
  });
});
