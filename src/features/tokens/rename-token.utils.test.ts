import { describe, expect, it } from 'vitest';
import type { DesignToken } from '@/domain/design-system';
import {
  renameTokenAcrossProject,
  renameTokenAndMigrateReferences,
} from './rename-token.utils';

describe('renameTokenAndMigrateReferences', () => {
  it('renames the target token path', () => {
    const tokens: DesignToken[] = [
      {
        path: 'color.primitive.blue.500',
        type: 'color',
        value: '#2563eb',
        status: 'ready',
      },
    ];

    const result = renameTokenAndMigrateReferences({
      tokens,
      currentTokenPath: 'color.primitive.blue.500',
      nextTokenPath: 'color.primitive.azure.500',
    });

    expect(result.status).toBe('success');

    if (result.status === 'success') {
      expect(result.tokens[0]?.path).toBe('color.primitive.azure.500');
    }
  });

  it('migrates references pointing to the renamed token', () => {
    const tokens: DesignToken[] = [
      {
        path: 'color.primitive.blue.500',
        type: 'color',
        value: '#2563eb',
        status: 'ready',
      },
      {
        path: 'color.semantic.action.background',
        type: 'color',
        value: '{color.primitive.blue.500}',
        reference: '{color.primitive.blue.500}',
        status: 'ready',
      },
    ];

    const result = renameTokenAndMigrateReferences({
      tokens,
      currentTokenPath: 'color.primitive.blue.500',
      nextTokenPath: 'color.primitive.azure.500',
    });

    expect(result.status).toBe('success');

    if (result.status === 'success') {
      expect(result.tokens[1]?.reference).toBe('{color.primitive.azure.500}');
      expect(result.tokens[1]?.value).toBe('{color.primitive.azure.500}');
      expect(result.migratedReferencesCount).toBe(2);
    }
  });

  it('returns an error when the token does not exist', () => {
    const result = renameTokenAndMigrateReferences({
      tokens: [],
      currentTokenPath: 'color.primitive.blue.500',
      nextTokenPath: 'color.primitive.azure.500',
    });

    expect(result).toEqual({
      status: 'error',
      error: 'tokenNotFound',
    });
  });

  it('returns an error when the next path already exists', () => {
    const tokens: DesignToken[] = [
      {
        path: 'color.primitive.blue.500',
        type: 'color',
        value: '#2563eb',
        status: 'ready',
      },
      {
        path: 'color.primitive.azure.500',
        type: 'color',
        value: '#0ea5e9',
        status: 'ready',
      },
    ];

    const result = renameTokenAndMigrateReferences({
      tokens,
      currentTokenPath: 'color.primitive.blue.500',
      nextTokenPath: 'color.primitive.azure.500',
    });

    expect(result).toEqual({
      status: 'error',
      error: 'tokenPathAlreadyExists',
    });
  });
});

describe('renameTokenAcrossProject', () => {
  const primitiveToken: DesignToken = {
    path: 'color.primitive.blue.500',
    type: 'color',
    value: '#2563eb',
    status: 'ready',
  };

  it('migrates token, theme and component references in one project result', () => {
    const result = renameTokenAcrossProject({
      tokenSets: [
        {
          id: 'colors',
          tokens: [primitiveToken],
        },
        {
          id: 'spacing',
          tokens: [
            {
              path: 'spacing.brand.control',
              type: 'spacing',
              value: '{color.primitive.blue.500}',
              reference: '{color.primitive.blue.500}',
              status: 'ready',
            },
          ],
        },
      ],
      targetTokenSetId: 'colors',
      themes: [
        {
          id: 'light',
          tokens: {
            color: {
              accent: '{color.primitive.blue.500}',
            },
          },
        },
      ],
      componentContracts: [
        {
          id: 'button',
          contract: {
            type: 'button',
            name: 'Button',
            purpose: { en: 'Primary action' },
            tokenBindings: [
              {
                key: 'background',
                tokenType: 'color',
                tokenPath: 'color.primitive.blue.500',
              },
            ],
          },
        },
      ],
      currentTokenPath: 'color.primitive.blue.500',
      nextTokenPath: 'color.primitive.azure.500',
    });

    expect(result.status).toBe('success');

    if (result.status !== 'success') {
      return;
    }

    expect(result.tokenSetUpdates).toHaveLength(2);
    expect(result.tokenSetUpdates[0]?.tokens[0]?.path).toBe(
      'color.primitive.azure.500',
    );
    expect(result.tokenSetUpdates[1]?.tokens[0]).toMatchObject({
      value: '{color.primitive.azure.500}',
      reference: '{color.primitive.azure.500}',
    });
    expect(result.themeUpdates).toEqual([
      {
        id: 'light',
        tokens: {
          color: {
            accent: '{color.primitive.azure.500}',
          },
        },
      },
    ]);
    expect(result.componentUpdates[0]?.contract).toMatchObject({
      tokenBindings: [
        {
          key: 'background',
          tokenType: 'color',
          tokenPath: 'color.primitive.azure.500',
        },
      ],
    });
    expect(result.migratedReferencesCount).toBe(4);
  });

  it('rejects a path already used by another token set', () => {
    const result = renameTokenAcrossProject({
      tokenSets: [
        {
          id: 'colors',
          tokens: [primitiveToken],
        },
        {
          id: 'spacing',
          tokens: [
            {
              path: 'color.primitive.azure.500',
              type: 'spacing',
              value: '1rem',
              status: 'ready',
            },
          ],
        },
      ],
      targetTokenSetId: 'colors',
      themes: [],
      componentContracts: [],
      currentTokenPath: 'color.primitive.blue.500',
      nextTokenPath: 'color.primitive.azure.500',
    });

    expect(result).toEqual({
      status: 'error',
      error: 'tokenPathAlreadyExists',
    });
  });

  it('migrates exact references nested inside composite token values', () => {
    const result = renameTokenAcrossProject({
      tokenSets: [
        {
          id: 'colors',
          tokens: [primitiveToken],
        },
        {
          id: 'typography',
          tokens: [
            {
              path: 'typography.body.brand',
              type: 'typography',
              value: {
                fontFamily: 'Inter Tight, sans-serif',
                fontSize: '{color.primitive.blue.500}',
              },
              status: 'ready',
            },
          ],
        },
      ],
      targetTokenSetId: 'colors',
      themes: [],
      componentContracts: [],
      currentTokenPath: 'color.primitive.blue.500',
      nextTokenPath: 'color.primitive.azure.500',
    });

    expect(result.status).toBe('success');

    if (result.status === 'success') {
      expect(result.tokenSetUpdates[1]?.tokens[0]?.value).toEqual({
        fontFamily: 'Inter Tight, sans-serif',
        fontSize: '{color.primitive.azure.500}',
      });
    }
  });
});
