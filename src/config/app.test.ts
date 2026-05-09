import { appConfig } from './app';
import { describe, expect, it } from 'vitest';

describe('appConfig', () => {
  it('defines the public product name', () => {
    expect(appConfig.name).toBe('VulcanForgeUI');
  });

  it('defines English and French as supported locales', () => {
    expect(appConfig.supportedLocales).toEqual(['en', 'fr']);
  });

  it('uses a supported locale as default locale', () => {
    expect(appConfig.supportedLocales).toContain(appConfig.defaultLocale);
  });
});
