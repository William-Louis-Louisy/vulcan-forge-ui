import { describe, expect, it } from 'vitest';
import { updatePrimitiveColorTokenSchema } from './primitive-color-token.schema';

describe('updatePrimitiveColorTokenSchema', () => {
  it('accepts valid hex colors', () => {
    expect(
      updatePrimitiveColorTokenSchema.safeParse({ value: '#fff' }).success,
    ).toBe(true);
    expect(
      updatePrimitiveColorTokenSchema.safeParse({ value: '#ffffff' }).success,
    ).toBe(true);
    expect(
      updatePrimitiveColorTokenSchema.safeParse({ value: '#ffffffff' }).success,
    ).toBe(true);
  });

  it('rejects invalid hex colors', () => {
    expect(
      updatePrimitiveColorTokenSchema.safeParse({ value: 'red' }).success,
    ).toBe(false);
    expect(
      updatePrimitiveColorTokenSchema.safeParse({ value: '#ff' }).success,
    ).toBe(false);
    expect(
      updatePrimitiveColorTokenSchema.safeParse({ value: '' }).success,
    ).toBe(false);
  });
});
