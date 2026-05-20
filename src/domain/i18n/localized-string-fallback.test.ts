import { describe, expect, it } from 'vitest';
import {
  collectLocalizedStringFallbackWarnings,
  getAvailableLocalizedStringLocales,
  getMissingLocalizedStringLocales,
  resolveLocalizedString,
} from './localized-string-fallback';

describe('localized string fallback helpers', () => {
  it('resolves the requested locale when available', () => {
    const result = resolveLocalizedString({
      localizedString: {
        en: 'Color',
        fr: 'Couleur',
      },
      locale: 'fr',
      fallbackLocale: 'en',
    });

    expect(result).toMatchObject({
      value: 'Couleur',
      requestedLocale: 'fr',
      resolvedLocale: 'fr',
      usedFallback: false,
      status: 'resolved',
      warning: null,
    });
  });

  it('uses the fallback locale when the requested locale is missing', () => {
    const result = resolveLocalizedString({
      localizedString: {
        en: 'Color',
      },
      locale: 'fr',
      fallbackLocale: 'en',
    });

    expect(result).toMatchObject({
      value: 'Color',
      requestedLocale: 'fr',
      resolvedLocale: 'en',
      usedFallback: true,
      status: 'fallback_used',
      warning: {
        code: 'localizedStringFallbackUsed',
        requestedLocale: 'fr',
        resolvedLocale: 'en',
        fallbackLocale: 'en',
        missingLocales: ['fr'],
      },
    });
  });

  it('uses the first available locale when requested and fallback locales are missing', () => {
    const result = resolveLocalizedString({
      localizedString: {
        fr: 'Couleur',
      },
      locale: 'en',
      fallbackLocale: 'en',
    });

    expect(result).toMatchObject({
      value: 'Couleur',
      requestedLocale: 'en',
      resolvedLocale: 'fr',
      usedFallback: true,
      status: 'fallback_used',
      warning: {
        code: 'localizedStringFallbackUsed',
      },
    });
  });

  it('returns a missing result when no locale is available', () => {
    const result = resolveLocalizedString({
      localizedString: {},
      locale: 'fr',
      fallbackLocale: 'en',
      missingValue: '—',
    });

    expect(result).toMatchObject({
      value: '—',
      requestedLocale: 'fr',
      resolvedLocale: null,
      usedFallback: false,
      status: 'missing',
      availableLocales: [],
      missingLocales: ['en', 'fr'],
      warning: {
        code: 'localizedStringMissing',
      },
    });
  });

  it('detects available and missing locales', () => {
    const localizedString = {
      en: 'Color',
      fr: '',
    };

    expect(getAvailableLocalizedStringLocales(localizedString)).toEqual(['en']);

    expect(getMissingLocalizedStringLocales(localizedString)).toEqual(['fr']);
  });

  it('collects warnings for exports and previews', () => {
    const directResolution = resolveLocalizedString({
      localizedString: {
        en: 'Color',
        fr: 'Couleur',
      },
      locale: 'fr',
    });

    const fallbackResolution = resolveLocalizedString({
      localizedString: {
        en: 'Color',
      },
      locale: 'fr',
    });

    expect(
      collectLocalizedStringFallbackWarnings([
        directResolution,
        fallbackResolution,
      ]),
    ).toEqual([
      {
        code: 'localizedStringFallbackUsed',
        requestedLocale: 'fr',
        resolvedLocale: 'en',
        fallbackLocale: 'en',
        missingLocales: ['fr'],
      },
    ]);
  });
});
