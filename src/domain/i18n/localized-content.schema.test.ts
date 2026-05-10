import {
  appLocaleSchema,
  localizedStringSchema,
} from './localized-content.schema';
import { describe, expect, it } from 'vitest';

describe('appLocaleSchema', () => {
  it('accepts supported locales', () => {
    expect(appLocaleSchema.parse('en')).toBe('en');
    expect(appLocaleSchema.parse('fr')).toBe('fr');
  });

  it('rejects unsupported locales', () => {
    expect(appLocaleSchema.safeParse('es').success).toBe(false);
  });
});

describe('localizedStringSchema', () => {
  it('accepts an English-only value', () => {
    expect(localizedStringSchema.parse({ en: 'Hello' })).toEqual({
      en: 'Hello',
    });
  });

  it('accepts a French-only value', () => {
    expect(localizedStringSchema.parse({ fr: 'Bonjour' })).toEqual({
      fr: 'Bonjour',
    });
  });

  it('accepts a bilingual value', () => {
    expect(
      localizedStringSchema.parse({
        en: 'Hello',
        fr: 'Bonjour',
      }),
    ).toEqual({
      en: 'Hello',
      fr: 'Bonjour',
    });
  });

  it('rejects an empty localized value', () => {
    expect(localizedStringSchema.safeParse({}).success).toBe(false);
  });
});
