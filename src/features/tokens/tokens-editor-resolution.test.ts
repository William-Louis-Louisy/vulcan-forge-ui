import { describe, expect, it } from 'vitest';
import {
  createTokenDictionary,
  type DesignToken,
} from '@/domain/design-system';
import { createTokenRows } from './tokens-editor.utils';

const spacingToken = {
  path: 'spacing.test.reference',
  type: 'spacing',
  value: '16px',
  status: 'ready',
} satisfies DesignToken;

const typographyToken = {
  path: 'typography.body.test',
  type: 'typography',
  value: {
    fontFamily: 'Inter',
    fontSize: '{spacing.test.reference}',
    lineHeight: '1.5',
  },
  status: 'ready',
} satisfies DesignToken;

describe('tokens editor cross-set resolution', () => {
  it('exposes resolved typography values from the project token dictionary', () => {
    const dictionary = createTokenDictionary([spacingToken, typographyToken]);
    const result = createTokenRows([typographyToken], dictionary);

    expect(result.rows[0]).toMatchObject({
      path: 'typography.body.test',
      rawValue: {
        fontFamily: 'Inter',
        fontSize: '{spacing.test.reference}',
        lineHeight: '1.5',
      },
      resolvedValue: {
        fontFamily: 'Inter',
        fontSize: '16px',
        lineHeight: '1.5',
      },
    });
  });
});
