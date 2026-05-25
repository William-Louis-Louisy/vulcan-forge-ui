import { describe, expect, it } from 'vitest';
import { parseStoredTokenSetTokens } from './token-set-save.service';

describe('parseStoredTokenSetTokens', () => {
  it('accepts valid stored token JSON', () => {
    expect(
      parseStoredTokenSetTokens([
        {
          path: 'color.primitive.accent.primary',
          type: 'color',
          value: '#ff8731',
          status: 'ready',
        },
      ]),
    ).toMatchObject({
      status: 'success',
      tokens: [
        {
          path: 'color.primitive.accent.primary',
          type: 'color',
          value: '#ff8731',
        },
      ],
    });
  });

  it('rejects malformed stored token JSON', () => {
    expect(parseStoredTokenSetTokens({ invalid: true })).toEqual({
      status: 'error',
      error: 'tokenSetMalformed',
    });
  });
});
