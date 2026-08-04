import { describe, expect, it } from 'vitest';
import {
  PASSWORD_MAX_CODE_POINTS,
  PASSWORD_MIN_CODE_POINTS,
} from '@/server/auth/password/password.constants';
import { signupSchema } from './signup.schema';

describe('signupSchema', () => {
  it('accepts a valid signup payload', () => {
    expect(
      signupSchema.parse({
        name: 'William',
        email: 'William@example.com',
        password: 'strong-password-123',
        passwordConfirmation: 'strong-password-123',
      }),
    ).toEqual({
      name: 'William',
      email: 'william@example.com',
      password: 'strong-password-123',
    });
  });

  it('rejects invalid email', () => {
    expect(
      signupSchema.safeParse({
        name: 'William',
        email: 'invalid-email',
        password: 'strong-password-123',
        passwordConfirmation: 'strong-password-123',
      }).success,
    ).toBe(false);
  });

  it('enforces the configured Unicode code-point boundaries', () => {
    const tooShort = 'a'.repeat(PASSWORD_MIN_CODE_POINTS - 1);
    const tooLong = '🔐'.repeat(PASSWORD_MAX_CODE_POINTS + 1);

    const shortResult = signupSchema.safeParse({
      name: 'William',
      email: 'william@example.com',
      password: tooShort,
      passwordConfirmation: tooShort,
    });
    const longResult = signupSchema.safeParse({
      name: 'William',
      email: 'william@example.com',
      password: tooLong,
      passwordConfirmation: tooLong,
    });

    expect(shortResult.success).toBe(false);
    expect(longResult.success).toBe(false);

    if (!shortResult.success && !longResult.success) {
      expect(shortResult.error.issues).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: ['password'],
            message: 'passwordMinLength',
          }),
        ]),
      );
      expect(longResult.error.issues).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: ['password'],
            message: 'passwordTooLong',
          }),
        ]),
      );
    }
  });

  it('normalizes canonically equivalent passwords before comparison', () => {
    const decomposed = `secure-password-${'e\u0301'.repeat(2)}`;
    const composed = decomposed.normalize('NFC');

    expect(
      signupSchema.parse({
        name: 'William',
        email: 'william@example.com',
        password: decomposed,
        passwordConfirmation: composed,
      }).password,
    ).toBe(composed);
  });

  it('rejects malformed Unicode passwords', () => {
    const malformed = `secure-password-${String.fromCharCode(0xd800)}`;
    const result = signupSchema.safeParse({
      name: 'William',
      email: 'william@example.com',
      password: malformed,
      passwordConfirmation: malformed,
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: ['password'],
            message: 'passwordInvalidUnicode',
          }),
        ]),
      );
    }
  });

  it('rejects mismatched password confirmation', () => {
    const result = signupSchema.safeParse({
      name: 'William',
      email: 'william@example.com',
      password: 'strong-password-123',
      passwordConfirmation: 'different-password-123',
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: ['passwordConfirmation'],
            message: 'passwordConfirmationMismatch',
          }),
        ]),
      );
    }
  });
});
