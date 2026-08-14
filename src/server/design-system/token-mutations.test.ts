import { describe, expect, it } from 'vitest';
import type { DesignToken } from '@/domain/design-system';
import {
  parseStoredTokenSetTokens,
  saveValidatedTokenSetTokens,
} from './token-mutations';

const readyColorToken: DesignToken = {
  path: 'color.primitive.blue.500',
  type: 'color',
  value: '#2563eb',
  status: 'ready',
};

describe('token mutation storage boundary', () => {
  it('parses persisted design tokens before feature mutations use them', () => {
    expect(parseStoredTokenSetTokens([readyColorToken])).toEqual({
      status: 'success',
      tokens: [readyColorToken],
    });
  });

  it('reports malformed persisted token sets', () => {
    expect(
      parseStoredTokenSetTokens([
        {
          ...readyColorToken,
          status: 'unknown',
        },
      ]),
    ).toEqual({
      status: 'error',
      error: 'tokenSetMalformed',
    });
  });

  it('rejects invalid token writes before persistence', async () => {
    const invalidTokens = [
      {
        ...readyColorToken,
        path: '',
      },
    ] as unknown as DesignToken[];

    await expect(
      saveValidatedTokenSetTokens({
        tokenSetId: 'unused-for-invalid-input',
        tokens: invalidTokens,
      }),
    ).resolves.toEqual({
      status: 'error',
      error: 'tokenValidationFailed',
    });
  });
});
