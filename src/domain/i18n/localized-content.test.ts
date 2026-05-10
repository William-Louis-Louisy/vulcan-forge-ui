import {
  hasLocalizedValue,
  resolveLocalizedString,
  type LocalizedString,
} from './localized-content';
import { describe, expect, it } from 'vitest';

describe('resolveLocalizedString', () => {
  it('returns the requested locale when available', () => {
    const value: LocalizedString = {
      en: 'Design system',
      fr: 'Design system',
    };

    expect(resolveLocalizedString({ value, locale: 'fr' })).toEqual({
      value: 'Design system',
      locale: 'fr',
      requestedLocale: 'fr',
      fallbackUsed: false,
      missing: false,
    });
  });

  it('uses the fallback locale when the requested locale is missing', () => {
    const value: LocalizedString = {
      en: 'Create tokens',
    };

    expect(resolveLocalizedString({ value, locale: 'fr' })).toEqual({
      value: 'Create tokens',
      locale: 'en',
      requestedLocale: 'fr',
      fallbackUsed: true,
      missing: false,
    });
  });

  it('marks the value as missing when no locale is available', () => {
    expect(resolveLocalizedString({ value: {}, locale: 'fr' })).toEqual({
      value: '',
      locale: 'en',
      requestedLocale: 'fr',
      fallbackUsed: true,
      missing: true,
    });
  });

  it('detects whether a localized value exists', () => {
    expect(hasLocalizedValue({ fr: 'Bonjour' }, 'fr')).toBe(true);
    expect(hasLocalizedValue({ fr: '   ' }, 'fr')).toBe(false);
    expect(hasLocalizedValue({ en: 'Hello' }, 'fr')).toBe(false);
  });
});
