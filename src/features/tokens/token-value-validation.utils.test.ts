import { describe, expect, it } from 'vitest';
import { validateTokenValueForType } from './token-value-validation.utils';

describe('validateTokenValueForType', () => {
  it('accepts valid spacing values', () => {
    expect(
      validateTokenValueForType({
        type: 'spacing',
        value: '1rem',
      }),
    ).toBeNull();

    expect(
      validateTokenValueForType({
        type: 'spacing',
        value: '24px',
      }),
    ).toBeNull();
  });

  it('rejects invalid spacing values', () => {
    expect(
      validateTokenValueForType({
        type: 'spacing',
        value: 'large',
      }),
    ).toBe('tokenSpacingValueInvalid');
  });

  it('accepts valid radius values', () => {
    expect(
      validateTokenValueForType({
        type: 'radius',
        value: '0.5rem',
      }),
    ).toBeNull();
  });

  it('accepts valid motion values', () => {
    expect(
      validateTokenValueForType({
        type: 'motion',
        value: '200ms',
      }),
    ).toBeNull();

    expect(
      validateTokenValueForType({
        type: 'motion',
        value: '0.2s',
      }),
    ).toBeNull();
  });

  it('rejects invalid motion values', () => {
    expect(
      validateTokenValueForType({
        type: 'motion',
        value: 'fast',
      }),
    ).toBe('tokenMotionValueInvalid');
  });

  it('accepts valid typography JSON values', () => {
    expect(
      validateTokenValueForType({
        type: 'typography',
        value: JSON.stringify({
          fontSize: '1rem',
          fontWeight: 600,
          lineHeight: '1.5',
        }),
      }),
    ).toBeNull();
  });

  it('rejects invalid typography values', () => {
    expect(
      validateTokenValueForType({
        type: 'typography',
        value: 'Inter',
      }),
    ).toBe('tokenTypographyValueInvalid');
  });
});
