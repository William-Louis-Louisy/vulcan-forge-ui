import { describe, expect, it } from 'vitest';
import {
  brandProfileLocalizedContentSchema,
  brandProfileSchema,
} from './brand-profile.schema';

describe('brandProfileLocalizedContentSchema', () => {
  it('accepts localized brand content', () => {
    expect(
      brandProfileLocalizedContentSchema.safeParse({
        name: {
          en: 'Core Product UI',
          fr: 'Core Product UI',
        },
        description: {
          en: 'A design system for the core product.',
          fr: 'Un design system pour le produit principal.',
        },
      }).success,
    ).toBe(true);
  });

  it('rejects missing localized name', () => {
    expect(
      brandProfileLocalizedContentSchema.safeParse({
        description: {
          en: 'Missing name.',
        },
      }).success,
    ).toBe(false);
  });
});

describe('brandProfileSchema', () => {
  it('accepts a valid brand profile', () => {
    expect(
      brandProfileSchema.safeParse({
        visualDirection: 'minimal',
        localizedContent: {
          name: {
            en: 'Core Product UI',
            fr: 'Core Product UI',
          },
          designPrinciples: [
            {
              en: 'Clarity first.',
              fr: 'La clarté d’abord.',
            },
          ],
        },
      }).success,
    ).toBe(true);
  });
});
