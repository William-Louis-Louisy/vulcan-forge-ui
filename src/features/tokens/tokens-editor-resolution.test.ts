import { describe, expect, it } from 'vitest';
import type { DesignToken } from '@/domain/design-system';
import {
  createTokenRows,
  createTokensEditorTokenDictionary,
} from './tokens-editor.utils';

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
    letterSpacing: '{spacing.test.reference}',
  },
  status: 'ready',
} satisfies DesignToken;

describe('tokens editor cross-set resolution', () => {
  it('exposes resolved typography values from the project token dictionary', () => {
    const dictionary = createTokensEditorTokenDictionary([
      { tokens: [spacingToken] },
      { tokens: [typographyToken] },
    ]);
    const result = createTokenRows([typographyToken], dictionary);

    expect(result.rows[0]).toMatchObject({
      path: 'typography.body.test',
      rawValue: {
        fontFamily: 'Inter',
        fontSize: '{spacing.test.reference}',
        lineHeight: '1.5',
        letterSpacing: '{spacing.test.reference}',
      },
      resolvedValue: {
        fontFamily: 'Inter',
        fontSize: '16px',
        lineHeight: '1.5',
        letterSpacing: '16px',
      },
    });
  });

  it('keeps valid reference targets resolvable when their token set contains malformed legacy entries', () => {
    const dictionary = createTokensEditorTokenDictionary([
      {
        tokens: [
          spacingToken,
          {
            path: '',
            type: 'spacing',
            value: null,
            status: 'ready',
          },
        ],
      },
      { tokens: [typographyToken] },
    ]);
    const result = createTokenRows([typographyToken], dictionary);

    expect(result.rows[0]?.resolvedValue).toMatchObject({
      fontSize: '16px',
      letterSpacing: '16px',
    });
  });
});
