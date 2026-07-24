import { describe, expect, it } from 'vitest';
import {
  brandProfileLocalizedContentSchema,
  brandProfileSchema,
} from './brand-profile.schema';

describe('brandProfileLocalizedContentSchema', () => {
  it('accepts localized brand content and structured editorial guidance', () => {
    expect(
      brandProfileLocalizedContentSchema.safeParse({
        tagline: {
          en: 'Built for focused teams.',
          fr: 'Pensé pour les équipes concentrées.',
        },
        shortDescription: {
          en: 'A design system for the core product.',
          fr: 'Un design system pour le produit principal.',
        },
        terminology: [
          {
            preferred: {
              en: 'order',
              fr: 'commande',
            },
            avoid: [
              {
                en: 'ticket',
                fr: 'ticket',
              },
            ],
          },
        ],
        editorialRules: [
          {
            en: 'Do not use emoji.',
            fr: 'Ne pas utiliser d’émoji.',
          },
        ],
      }).success,
    ).toBe(true);
  });

  it('rejects localized values without any usable locale', () => {
    expect(
      brandProfileLocalizedContentSchema.safeParse({
        shortDescription: {},
      }).success,
    ).toBe(false);
  });
});

describe('brandProfileSchema', () => {
  it('accepts a valid complete brand profile', () => {
    expect(
      brandProfileSchema.safeParse({
        visualStyle: 'premium',
        uiDensity: 'cozy',
        inspirationKeywords: ['warm off-white', 'precise'],
        localizedContent: {
          personality: {
            en: 'Precise and calm.',
            fr: 'Précise et calme.',
          },
          audience: {
            en: 'Workshop operators.',
          },
          toneOfVoice: {
            en: 'Direct. No exclamation marks.',
          },
          terminology: [],
          editorialRules: [],
        },
      }).success,
    ).toBe(true);
  });

  it('rejects unknown visual styles and densities', () => {
    expect(
      brandProfileSchema.safeParse({
        visualStyle: 'enterprise',
        uiDensity: 'dense',
        inspirationKeywords: [],
        localizedContent: {},
      }).success,
    ).toBe(false);
  });
});
