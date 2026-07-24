import { describe, expect, it } from 'vitest';

import type { BrandProfile } from '@/domain/design-system';
import {
  countMissingBrandTranslations,
  parseStoredBrandProfile,
  resolveBrandLocalizedField,
} from './brand-profile.utils';

const profile: BrandProfile = {
  visualStyle: 'technical',
  uiDensity: 'cozy',
  inspirationKeywords: ['precise'],
  localizedContent: {
    tagline: {
      fr: 'Le travail d’abord.',
    },
    shortDescription: {
      en: 'A focused operations console.',
      fr: 'Une console opérationnelle ciblée.',
    },
    personality: {
      fr: 'Précise et calme.',
    },
    terminology: [
      {
        preferred: {
          en: 'order',
          fr: 'commande',
        },
        avoid: [
          {
            fr: 'ticket',
          },
        ],
      },
    ],
    editorialRules: [
      {
        en: 'Never use emoji.',
        fr: 'Ne jamais utiliser d’émoji.',
      },
    ],
  },
};

describe('brand profile utilities', () => {
  it('falls back to the project default locale for incomplete content', () => {
    expect(
      resolveBrandLocalizedField({
        profile,
        field: 'tagline',
        locale: 'en',
        fallbackLocale: 'fr',
      }),
    ).toMatchObject({
      value: 'Le travail d’abord.',
      resolvedLocale: 'fr',
      usedFallback: true,
    });
  });

  it('counts missing translations across localized fields and rules', () => {
    expect(
      countMissingBrandTranslations({
        profile,
        supportedLocales: ['en', 'fr'],
      }),
    ).toBe(3);
  });

  it('returns the safe default for malformed stored content', () => {
    expect(
      parseStoredBrandProfile({
        visualStyle: 'enterprise',
        uiDensity: 'dense',
        inspirationKeywords: null,
        localizedContent: null,
      }),
    ).toMatchObject({
      visualStyle: 'minimal',
      uiDensity: 'cozy',
      inspirationKeywords: [],
      localizedContent: {},
    });
  });
});
