import { describe, expect, it } from 'vitest';
import {
  createEmailVerificationToken,
  hashEmailVerificationToken,
} from './email-verification-token';

describe('email verification tokens', () => {
  it('generates random URL-safe tokens and deterministic hashes', () => {
    const first = createEmailVerificationToken();
    const second = createEmailVerificationToken();

    expect(first.token).toMatch(/^[A-Za-z0-9_-]+$/);
    expect(first.token).not.toBe(second.token);
    expect(first.tokenHash).toHaveLength(64);
    expect(hashEmailVerificationToken(first.token)).toBe(first.tokenHash);
  });

  it.each(['', 'contains spaces', 'contains/slash', 'a'.repeat(129)])(
    'rejects malformed token input: %s',
    (token) => {
      expect(hashEmailVerificationToken(token)).toBeNull();
    },
  );
});
