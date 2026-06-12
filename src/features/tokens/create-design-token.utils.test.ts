import { describe, expect, it } from 'vitest';
import type { DesignToken } from '@/domain/design-system';
import { createDesignToken } from './create-design-token.utils';

describe('createDesignToken', () => {
  it('creates a spacing token', () => {
    const result = createDesignToken({
      tokens: [],
      type: 'spacing',
      path: 'spacing.4',
      value: '1rem',
      descriptionEn: 'Base spacing',
      descriptionFr: 'Espacement de base',
    });

    expect(result.status).toBe('success');

    if (result.status === 'success') {
      expect(result.token).toEqual({
        path: 'spacing.4',
        type: 'spacing',
        value: '1rem',
        status: 'draft',
        description: {
          en: 'Base spacing',
          fr: 'Espacement de base',
        },
      });
    }
  });

  it('creates a radius token', () => {
    const result = createDesignToken({
      tokens: [],
      type: 'radius',
      path: 'radius.md',
      value: '0.5rem',
    });

    expect(result.status).toBe('success');

    if (result.status === 'success') {
      expect(result.token).toMatchObject({
        path: 'radius.md',
        type: 'radius',
        value: '0.5rem',
        status: 'draft',
      });
    }
  });

  it('creates a motion token', () => {
    const result = createDesignToken({
      tokens: [],
      type: 'motion',
      path: 'motion.duration.fast',
      value: '150ms',
    });

    expect(result.status).toBe('success');

    if (result.status === 'success') {
      expect(result.token.value).toBe('150ms');
    }
  });

  it('creates a typography token as a JSON string value', () => {
    const value = JSON.stringify({
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: '1.5',
    });

    const result = createDesignToken({
      tokens: [],
      type: 'typography',
      path: 'typography.body.md',
      value,
    });

    expect(result.status).toBe('success');

    if (result.status === 'success') {
      expect(result.token).toMatchObject({
        path: 'typography.body.md',
        type: 'typography',
        value,
        status: 'draft',
      });
    }
  });

  it('returns an error when the path already exists', () => {
    const tokens: DesignToken[] = [
      {
        path: 'spacing.4',
        type: 'spacing',
        value: '1rem',
        status: 'ready',
      },
    ];

    const result = createDesignToken({
      tokens,
      type: 'spacing',
      path: 'spacing.4',
      value: '2rem',
    });

    expect(result).toEqual({
      status: 'error',
      error: 'tokenPathAlreadyExists',
    });
  });

  it('returns a value validation error', () => {
    const result = createDesignToken({
      tokens: [],
      type: 'spacing',
      path: 'spacing.invalid',
      value: 'large',
    });

    expect(result).toEqual({
      status: 'error',
      error: 'tokenSpacingValueInvalid',
    });
  });
});
