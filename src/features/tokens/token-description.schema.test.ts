import { describe, expect, it } from 'vitest';
import { updateTokenDescriptionSchema } from './token-description.schema';

describe('updateTokenDescriptionSchema', () => {
  it('accepts localized descriptions', () => {
    expect(
      updateTokenDescriptionSchema.safeParse({
        descriptionEn: 'Primary action color.',
        descriptionFr: 'Couleur principale des actions.',
      }).success,
    ).toBe(true);
  });

  it('accepts a missing localized description because fallback is allowed', () => {
    expect(
      updateTokenDescriptionSchema.safeParse({
        descriptionEn: 'Primary action color.',
        descriptionFr: '',
      }).success,
    ).toBe(true);
  });

  it('rejects overly long descriptions', () => {
    expect(
      updateTokenDescriptionSchema.safeParse({
        descriptionEn: 'a'.repeat(241),
        descriptionFr: '',
      }).success,
    ).toBe(false);
  });
});
