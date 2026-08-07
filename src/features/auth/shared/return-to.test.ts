import { describe, expect, it } from 'vitest';
import { getLocalizedAuthReturnTo, getSafeAuthReturnTo } from './return-to';

describe('getSafeAuthReturnTo', () => {
  it('preserves a localized application path and query string', () => {
    expect(
      getSafeAuthReturnTo({
        locale: 'en',
        returnTo: '/en/app/projects/project-1/tokens?set=color&view=table',
      }),
    ).toBe('/en/app/projects/project-1/tokens?set=color&view=table');
  });

  it('allows encoded separators inside query values', () => {
    expect(
      getSafeAuthReturnTo({
        locale: 'en',
        returnTo: '/en/app/search?path=%2Fcomponents%2Fbutton',
      }),
    ).toBe('/en/app/search?path=%2Fcomponents%2Fbutton');
  });

  it.each([
    'https://example.com/en/app',
    '//example.com/en/app',
    '/fr/app',
    '/en/login',
    '/en/application',
    '/en/app\\settings',
    '/en/app/%2f%2fevil.example',
    '/en/app/%5cevil.example',
    '/en/app/%252f%252fevil.example',
    '/en/app#fragment',
    `/en/app${String.fromCharCode(0)}/settings`,
  ])('falls back for an unsafe destination: %s', (returnTo) => {
    expect(getSafeAuthReturnTo({ locale: 'en', returnTo })).toBe('/en/app');
  });

  it('falls back when the value is absent or too long', () => {
    expect(getSafeAuthReturnTo({ locale: 'fr', returnTo: null })).toBe(
      '/fr/app',
    );
    expect(
      getSafeAuthReturnTo({
        locale: 'fr',
        returnTo: `/fr/app?${'a'.repeat(2_100)}`,
      }),
    ).toBe('/fr/app');
  });
});

describe('getLocalizedAuthReturnTo', () => {
  it('changes the application locale and preserves path and query', () => {
    expect(
      getLocalizedAuthReturnTo({
        currentLocale: 'en',
        nextLocale: 'fr',
        returnTo: '/en/app/projects/project-1/tokens?set=color',
      }),
    ).toBe('/fr/app/projects/project-1/tokens?set=color');
  });

  it('uses the next locale fallback for an invalid current destination', () => {
    expect(
      getLocalizedAuthReturnTo({
        currentLocale: 'en',
        nextLocale: 'fr',
        returnTo: 'https://example.com/en/app',
      }),
    ).toBe('/fr/app');
  });
});
