import { describe, expect, it } from 'vitest';
import type { DesignToken } from '@/domain/design-system';
import { renameTokenAndMigrateReferences } from './rename-token.utils';

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
      expect(result.migratedReferencesCount).toBe(1);
      expect(result.tokens[1]?.value).toBe('{color.primitive.azure.500}');
      expect(result.tokens[1]?.reference).toBe('{color.primitive.azure.500}');
      expect(result.migratedReferencesCount).toBe(1);
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
