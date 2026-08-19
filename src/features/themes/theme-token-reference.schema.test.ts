import { describe, expect, it } from 'vitest';
import { updateThemeTokenReferenceSchema } from './theme-token-reference.schema';

describe('theme token reference schema', () => {
  it('accepts a valid known theme role update payload', () => {
    expect(
      updateThemeTokenReferenceSchema.safeParse({
        locale: 'fr',
        projectSlug: 'aurora-system',
        themeId: 'theme-id',
        roleKey: 'background',
        tokenPath: 'color.primitive.neutral.50',
      }).success,
    ).toBe(true);
  });

  it('accepts a valid custom theme role update payload', () => {
    expect(
      updateThemeTokenReferenceSchema.safeParse({
        locale: 'fr',
        projectSlug: 'aurora-system',
        themeId: 'theme-id',
        roleKey: 'border-subtle',
        tokenPath: 'color.primitive.accent.primary',
      }).success,
    ).toBe(true);
  });

  it('rejects an invalid theme role key', () => {
    expect(
      updateThemeTokenReferenceSchema.safeParse({
        locale: 'fr',
        projectSlug: 'aurora-system',
        themeId: 'theme-id',
        roleKey: 'Border_subtle',
        tokenPath: 'color.primitive.accent.primary',
      }).success,
    ).toBe(false);
  });
});
