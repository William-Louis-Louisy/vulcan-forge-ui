import { describe, expect, it } from 'vitest';
import { signupSchema } from './signup.schema';

describe('signupSchema', () => {
  it('accepts a valid signup payload', () => {
    expect(
      signupSchema.parse({
        name: 'William',
        email: 'William@example.com',
        password: 'strong-password-123',
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
      }).success,
    ).toBe(false);
  });

  it('rejects short passwords', () => {
    expect(
      signupSchema.safeParse({
        name: 'William',
        email: 'william@example.com',
        password: 'short',
      }).success,
    ).toBe(false);
  });
});
