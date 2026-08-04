import {
  PASSWORD_MAX_CODE_POINTS,
  PASSWORD_MIN_CODE_POINTS,
} from './password.constants';
import type { PasswordPolicyError } from './password.errors';
import {
  assertPasswordMeetsPolicy,
  countPasswordCodePoints,
  normalizePassword,
} from './password-normalization';

describe('password normalization and policy', () => {
  it('normalizes Unicode passwords to NFC', () => {
    const decomposed = `Mot de passe ${'e\u0301'.repeat(4)}`;

    expect(normalizePassword(decomposed)).toBe(decomposed.normalize('NFC'));
  });

  it('counts Unicode code points rather than UTF-16 code units', () => {
    const password = '🔐'.repeat(PASSWORD_MIN_CODE_POINTS);

    expect(password.length).toBe(PASSWORD_MIN_CODE_POINTS * 2);
    expect(countPasswordCodePoints(password)).toBe(PASSWORD_MIN_CODE_POINTS);
    expect(assertPasswordMeetsPolicy(password)).toBe(password);
  });

  it('accepts spaces and the configured boundary lengths', () => {
    expect(
      assertPasswordMeetsPolicy('correct horse battery staple'),
    ).toBe('correct horse battery staple');
    expect(
      assertPasswordMeetsPolicy('a'.repeat(PASSWORD_MIN_CODE_POINTS)),
    ).toHaveLength(PASSWORD_MIN_CODE_POINTS);
    expect(
      assertPasswordMeetsPolicy('a'.repeat(PASSWORD_MAX_CODE_POINTS)),
    ).toHaveLength(PASSWORD_MAX_CODE_POINTS);
  });

  it('rejects passwords outside the configured length range', () => {
    expect(() =>
      assertPasswordMeetsPolicy('a'.repeat(PASSWORD_MIN_CODE_POINTS - 1)),
    ).toThrowError(
      expect.objectContaining<Partial<PasswordPolicyError>>({
        violation: 'too_short',
      }),
    );
    expect(() =>
      assertPasswordMeetsPolicy('a'.repeat(PASSWORD_MAX_CODE_POINTS + 1)),
    ).toThrowError(
      expect.objectContaining<Partial<PasswordPolicyError>>({
        violation: 'too_long',
      }),
    );
  });

  it('rejects malformed Unicode containing lone surrogates', () => {
    expect(() =>
      normalizePassword(`valid prefix ${String.fromCharCode(0xd800)}`),
    ).toThrowError(
      expect.objectContaining<Partial<PasswordPolicyError>>({
        violation: 'invalid_unicode',
      }),
    );
  });
});
