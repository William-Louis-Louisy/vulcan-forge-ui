import { describe, expect, it } from 'vitest';
import { publicSurfaceMessages } from './public-surface-messages';

function flattenKeys(value: unknown, prefix = ''): string[] {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return [prefix];
  }

  return Object.entries(value).flatMap(([key, nestedValue]) =>
    flattenKeys(nestedValue, prefix ? `${prefix}.${key}` : key),
  );
}

describe('publicSurfaceMessages', () => {
  it('keeps English and French message shapes aligned', () => {
    expect(flattenKeys(publicSurfaceMessages.en).sort()).toEqual(
      flattenKeys(publicSurfaceMessages.fr).sort(),
    );
  });

  it('keeps unavailable plans honest and non-interactive', () => {
    for (const locale of ['en', 'fr'] as const) {
      const pricing = publicSurfaceMessages[locale].PricingPage;

      expect(pricing.tiers.freeBeta.cta).not.toBe('');
      expect(pricing.tiers.proSoon.cta).toBe('');
      expect(pricing.tiers.teamSoon.cta).toBe('');
      expect(pricing.tiers.proSoon.unavailable).not.toBe('');
      expect(pricing.tiers.teamSoon.unavailable).not.toBe('');
    }
  });

  it('keeps the approved signup confirmation contract in the base form', () => {
    expect(publicSurfaceMessages.en.SignupPage.title).toBe(
      'Forge your first system.',
    );
    expect(publicSurfaceMessages.fr.SignupPage.title).toBe(
      'Forgez votre premier système.',
    );
  });
});
