// Visual design-system tokens only: colors, spacing, radius, typography and motion.
import { describe, expect, it } from 'vitest';
import type { DesignToken } from './design-token.schema';
import { renameTokenAcrossProject } from './reference-integrity/design-reference-migration';

const primitiveToken: DesignToken = {
  path: 'color.primitive.blue.500',
  type: 'color',
  value: '#2563eb',
  status: 'ready',
};

describe('design reference migration characterization', () => {
  it('returns tokenNotFound when the target set does not contain the token', () => {
    const result = renameTokenAcrossProject({
      tokenSets: [{ id: 'colors', tokens: [primitiveToken] }],
      targetTokenSetId: 'colors',
      themes: [],
      componentContracts: [],
      currentTokenPath: 'color.primitive.missing',
      nextTokenPath: 'color.primitive.azure.500',
    });

    expect(result).toEqual({ status: 'error', error: 'tokenNotFound' });
  });

  it('trims the next path before migrating exact references', () => {
    const result = renameTokenAcrossProject({
      tokenSets: [
        { id: 'colors', tokens: [primitiveToken] },
        {
          id: 'semantic',
          tokens: [
            {
              path: 'color.semantic.action.background',
              type: 'color',
              value: '{color.primitive.blue.500}',
              reference: '{color.primitive.blue.500}',
              status: 'ready',
            },
          ],
        },
      ],
      targetTokenSetId: 'colors',
      themes: [],
      componentContracts: [],
      currentTokenPath: 'color.primitive.blue.500',
      nextTokenPath: '  color.primitive.azure.500  ',
    });

    expect(result.status).toBe('success');
    if (result.status !== 'success') return;

    expect(result.tokenSetUpdates[0]?.tokens[0]?.path).toBe(
      'color.primitive.azure.500',
    );
    expect(result.tokenSetUpdates[1]?.tokens[0]).toMatchObject({
      value: '{color.primitive.azure.500}',
      reference: '{color.primitive.azure.500}',
    });
  });

  it('does not rewrite partial string matches', () => {
    const result = renameTokenAcrossProject({
      tokenSets: [{ id: 'colors', tokens: [primitiveToken] }],
      targetTokenSetId: 'colors',
      themes: [
        {
          id: 'light',
          tokens: {
            note: 'Use {color.primitive.blue.500} for accents',
          },
        },
      ],
      componentContracts: [],
      currentTokenPath: 'color.primitive.blue.500',
      nextTokenPath: 'color.primitive.azure.500',
    });

    expect(result.status).toBe('success');
    if (result.status !== 'success') return;

    expect(result.themeUpdates).toEqual([]);
    expect(result.migratedReferencesCount).toBe(0);
  });
});
