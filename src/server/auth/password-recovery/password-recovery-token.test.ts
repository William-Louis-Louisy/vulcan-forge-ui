import { describe, expect, it } from 'vitest';
import {
  createPasswordRecoveryToken,
  hashPasswordRecoveryToken,
} from './password-recovery-token';

describe('password recovery tokens', () => {
  it('creates an opaque Base64URL token and a SHA-256 fingerprint', () => {
    const result = createPasswordRecoveryToken();

    expect(result.token).toMatch(/^[A-Za-z0-9_-]+$/);
    expect(result.token).toHaveLength(43);
    expect(result.tokenHash).toHaveLength(64);
    expect(result.tokenHash).not.toBe(result.token);
  });

  it('rejects malformed and oversized token values', () => {
    expect(hashPasswordRecoveryToken('')).toBeNull();
    expect(hashPasswordRecoveryToken('not valid')).toBeNull();
    expect(hashPasswordRecoveryToken('a'.repeat(129))).toBeNull();
  });
});
