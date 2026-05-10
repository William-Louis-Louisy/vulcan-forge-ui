import { describe, expect, it } from 'vitest';
import {
  appLocales,
  defaultAppLocale,
  fallbackAppLocale,
  isAppLocale,
} from './locales';

describe('domain locales', () => {
  it('supports English and French', () => {
    expect(appLocales).toEqual(['en', 'fr']);
  });

  it('uses a supported default locale', () => {
    expect(appLocales).toContain(defaultAppLocale);
  });

  it('uses a supported fallback locale', () => {
    expect(appLocales).toContain(fallbackAppLocale);
  });

  it('narrows valid locale strings', () => {
    expect(isAppLocale('en')).toBe(true);
    expect(isAppLocale('fr')).toBe(true);
    expect(isAppLocale('es')).toBe(false);
  });
});
