import { describe, expect, it } from 'vitest';
import type { DesignToken, TypographyTokenValue } from './design-token.schema';
import { createTokenDictionary } from './token-resolution';
import { normalizeTypographySpacingReferences } from './typography-reference-normalization';

const spacingToken: DesignToken = {
  path: 'spacing.test.reference',
  type: 'spacing',
  value: '1.25rem',
  status: 'ready',
};

const colorToken: DesignToken = {
  path: 'color.test.reference',
  type: 'color',
  value: '#ffffff',
  status: 'ready',
};

function normalize(
  value: TypographyTokenValue,
  tokens: DesignToken[] = [spacingToken, colorToken],
) {
  return normalizeTypographySpacingReferences({
    value,
    dictionary: createTokenDictionary(tokens),
  });
}

describe('normalizeTypographySpacingReferences', () => {
  it('keeps direct CSS values unchanged', () => {
    expect(
      normalize({
        fontSize: '1.25rem',
        letterSpacing: '0.02em',
      }),
    ).toEqual({
      status: 'success',
      value: {
        fontSize: '1.25rem',
        letterSpacing: '0.02em',
      },
    });
  });

  it('canonicalizes known spacing token paths entered without braces', () => {
    expect(
      normalize({
        fontSize: 'spacing.test.reference',
        letterSpacing: 'spacing.test.reference',
      }),
    ).toEqual({
      status: 'success',
      value: {
        fontSize: '{spacing.test.reference}',
        letterSpacing: '{spacing.test.reference}',
      },
    });
  });

  it('keeps already canonical spacing references canonical', () => {
    expect(
      normalize({
        fontSize: ' {spacing.test.reference} ',
        letterSpacing: '{spacing.test.reference}',
      }),
    ).toEqual({
      status: 'success',
      value: {
        fontSize: '{spacing.test.reference}',
        letterSpacing: '{spacing.test.reference}',
      },
    });
  });

  it('preserves unknown direct values instead of guessing that they are references', () => {
    expect(
      normalize({
        fontSize: 'clamp(1rem, 2vw, 2rem)',
        letterSpacing: 'custom.value',
      }),
    ).toEqual({
      status: 'success',
      value: {
        fontSize: 'clamp(1rem, 2vw, 2rem)',
        letterSpacing: 'custom.value',
      },
    });
  });

  it('rejects references to an incompatible token type', () => {
    expect(
      normalize({
        fontSize: 'color.test.reference',
      }),
    ).toEqual({
      status: 'error',
      field: 'fontSize',
      referencePath: 'color.test.reference',
    });
  });
});
