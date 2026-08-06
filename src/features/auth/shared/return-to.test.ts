import { describe, expect, it } from 'vitest';
import { getSafeAuthReturnTo } from './return-to';

describe('getSafeAuthReturnTo', () => {
  it('preserves a localized application path and query string', () => {
    expect(
      getSafeAuthReturnTo({
        locale: 'en',
        returnTo: '/en/app/projects/project-1/tokens?set=color&view=table',
      }),
    ).toBe('/en/app/projects/project-1/tokens?set=color&view=table');
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
    '/en/app#fragment',
    '/en/app\u0000/settings',
  ])('falls back for an unsafe destination: %s', (returnTo) => {
    expect(getSafeAuthReturnTo({ locale: 'en', returnTo })).toBe('/en/app');
  });

  it('falls back when the value is absent or too long', () => {
    expect(getSafeAuthReturnTo({ locale: 'fr', returnTo: null })).toBe(
      '/fr/app',
    );
    expect(
      getSafeAuthReturnTo({ locale: 'fr', returnTo: `/fr/app?${'a'.repeat(2_100)}` }),
    ).toBe('/fr/app');
  });
});
