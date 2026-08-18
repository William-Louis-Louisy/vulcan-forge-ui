import { describe, expect, it } from 'vitest';
import type { DesignToken } from '@/domain/design-system';
import { updateTokenStatus } from './update-token-status.utils';

const tokens: DesignToken[] = [
  {
    path: 'color.primitive.accent.inkBlue',
    type: 'color',
    value: '#010021',
    status: 'draft',
    description: { en: 'Ink blue' },
  },
  {
    path: 'spacing.4',
    type: 'spacing',
    value: '1rem',
    status: 'ready',
  },
];

describe('updateTokenStatus', () => {
  it('moves an existing design token from draft to ready', () => {
    const result = updateTokenStatus({
      tokens,
      tokenPath: 'color.primitive.accent.inkBlue',
      nextStatus: 'ready',
    });

    expect(result.status).toBe('success');

    if (result.status === 'success') {
      expect(result.tokens[0]).toEqual({
        path: 'color.primitive.accent.inkBlue',
        type: 'color',
        value: '#010021',
        status: 'ready',
        description: { en: 'Ink blue' },
      });
      expect(result.tokens[1]).toBe(tokens[1]);
    }
  });

  it('supports deprecating an existing design token', () => {
    const result = updateTokenStatus({
      tokens,
      tokenPath: 'spacing.4',
      nextStatus: 'deprecated',
    });

    expect(result.status).toBe('success');

    if (result.status === 'success') {
      expect(result.tokens[1]?.status).toBe('deprecated');
    }
  });

  it('returns tokenNotFound without changing the collection', () => {
    expect(
      updateTokenStatus({
        tokens,
        tokenPath: 'color.primitive.missing',
        nextStatus: 'ready',
      }),
    ).toEqual({
      status: 'error',
      error: 'tokenNotFound',
    });
  });
});
