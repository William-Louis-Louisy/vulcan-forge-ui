import { describe, expect, it } from 'vitest';
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

  it('rejects short passwords', () => {
    expect(
      signupSchema.safeParse({
        name: 'William',
        email: 'william@example.com',
        password: 'short',
        passwordConfirmation: 'short',
      }).success,
    ).toBe(false);
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
