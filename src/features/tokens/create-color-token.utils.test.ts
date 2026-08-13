import { describe, expect, it } from 'vitest';
import type { DesignToken } from '@/domain/design-system';
import { createColorToken } from './create-color-token.utils';

describe('createColorToken', () => {
  it('creates a primitive color token as ready', () => {
    const result = createColorToken({
      tokens: [],
      kind: 'primitive',
      path: 'color.primitive.azure.500',
      value: '#0ea5e9',
      descriptionEn: 'Azure 500',
      descriptionFr: 'Azure 500',
    });

    expect(result.status).toBe('success');

    if (result.status === 'success') {
      expect(result.token).toEqual({
        path: 'color.primitive.azure.500',
        type: 'color',
        value: '#0ea5e9',
        status: 'ready',
        description: {
          en: 'Azure 500',
          fr: 'Azure 500',
        },
      });

      expect(result.tokens).toHaveLength(1);
    }
  });

  it('creates a semantic color token referencing a primitive token as ready', () => {
    const tokens: DesignToken[] = [
      {
        path: 'color.primitive.azure.500',
        type: 'color',
        value: '#0ea5e9',
        status: 'ready',
      },
    ];

    const result = createColorToken({
      tokens,
      kind: 'semantic',
      path: 'color.semantic.action.background',
      value: '',
      referencePath: 'color.primitive.azure.500',
    });

    expect(result.status).toBe('success');

    if (result.status === 'success') {
      expect(result.token.value).toBe('{color.primitive.azure.500}');
      expect(result.token.reference).toBe('{color.primitive.azure.500}');
      expect(result.token.status).toBe('ready');
      expect(result.tokens).toHaveLength(2);
    }
  });

  it('returns an error when the path already exists', () => {
    const tokens: DesignToken[] = [
      {
        path: 'color.primitive.azure.500',
        type: 'color',
        value: '#0ea5e9',
        status: 'ready',
      },
    ];

    const result = createColorToken({
      tokens,
      kind: 'primitive',
      path: 'color.primitive.azure.500',
      value: '#0284c7',
    });

    expect(result).toEqual({
      status: 'error',
      error: 'tokenPathAlreadyExists',
    });
  });

  it('returns an error when the semantic reference does not exist', () => {
    const result = createColorToken({
      tokens: [],
      kind: 'semantic',
      path: 'color.semantic.action.background',
      value: '',
      referencePath: 'color.primitive.missing.500',
    });

    expect(result).toEqual({
      status: 'error',
      error: 'primitiveReferenceNotFound',
    });
  });
});
