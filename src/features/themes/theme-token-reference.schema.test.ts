import { describe, expect, it } from 'vitest';
import { updateThemeTokenReferenceSchema } from './theme-token-reference.schema';

describe('theme token reference schema', () => {
  it('accepts a valid theme token reference update payload', () => {
    expect(
      updateThemeTokenReferenceSchema.safeParse({
        locale: 'fr',
        projectSlug: 'aurora-system',
        themeId: 'theme-id',
        colorKey: 'background',
        tokenPath: 'color.primitive.neutral.50',
      }).success,
    ).toBe(true);
  });

  it('rejects an unknown theme color slot', () => {
    expect(
      updateThemeTokenReferenceSchema.safeParse({
        locale: 'fr',
        projectSlug: 'aurora-system',
        themeId: 'theme-id',
        colorKey: 'brand',
        tokenPath: 'color.primitive.accent.primary',
      }).success,
    ).toBe(false);
  });
});
