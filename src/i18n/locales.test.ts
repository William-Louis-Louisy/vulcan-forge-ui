import { routing } from './routing';
import { describe, expect, it } from 'vitest';
import { localeLabels, localeShortLabels } from './locales';

describe('locale labels', () => {
  it('defines a label for each supported locale', () => {
    for (const locale of routing.locales) {
      expect(localeLabels[locale]).toBeTruthy();
      expect(localeShortLabels[locale]).toBeTruthy();
    }
  });

  it('uses short uppercase labels for the language switcher', () => {
    expect(localeShortLabels).toEqual({
      en: 'EN',
      fr: 'FR',
    });
  });
});
