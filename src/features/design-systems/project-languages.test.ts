import { describe, expect, it } from 'vitest';
import {
  ensureDefaultLocaleIsSupported,
  toggleSupportedLocale,
  updateDefaultLocale,
} from './project-languages';

describe('project languages helpers', () => {
  it('keeps unique supported locales', () => {
    expect(
      ensureDefaultLocaleIsSupported({
        defaultLocale: 'en',
        supportedLocales: ['en', 'fr', 'fr'],
      }),
    ).toEqual(['en', 'fr']);
  });

  it('adds the default locale when it is missing from supported locales', () => {
    expect(
      ensureDefaultLocaleIsSupported({
        defaultLocale: 'fr',
        supportedLocales: ['en'],
      }),
    ).toEqual(['fr', 'en']);
  });

  it('does not remove the default locale when toggled', () => {
    expect(
      toggleSupportedLocale({
        locale: 'en',
        defaultLocale: 'en',
        supportedLocales: ['en', 'fr'],
      }),
    ).toEqual(['en', 'fr']);
  });

  it('toggles a non-default supported locale', () => {
    expect(
      toggleSupportedLocale({
        locale: 'fr',
        defaultLocale: 'en',
        supportedLocales: ['en', 'fr'],
      }),
    ).toEqual(['en']);
  });

  it('adds the new default locale to supported locales', () => {
    expect(
      updateDefaultLocale({
        defaultLocale: 'fr',
        supportedLocales: ['en'],
      }),
    ).toEqual({
      defaultLocale: 'fr',
      supportedLocales: ['fr', 'en'],
    });
  });
});
