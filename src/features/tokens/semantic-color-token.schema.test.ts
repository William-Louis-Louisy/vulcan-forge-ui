import { describe, expect, it } from 'vitest';
import { updateSemanticColorTokenSchema } from './semantic-color-token.schema';

describe('updateSemanticColorTokenSchema', () => {
  it('accepts primitive color token paths', () => {
    expect(
      updateSemanticColorTokenSchema.safeParse({
        referencePath: 'color.primitive.accent.primary',
      }).success,
    ).toBe(true);
  });

  it('rejects semantic color paths as aliases', () => {
    expect(
      updateSemanticColorTokenSchema.safeParse({
        referencePath: 'color.semantic.action.primary',
      }).success,
    ).toBe(false);
  });

  it('rejects invalid references', () => {
    expect(
      updateSemanticColorTokenSchema.safeParse({
        referencePath: '{color.primitive.accent.primary}',
      }).success,
    ).toBe(false);
  });
});
