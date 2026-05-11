import { describe, expect, it } from 'vitest';
import { loginSchema } from './login.schema';

describe('loginSchema', () => {
  it('accepts a valid login payload', () => {
    expect(
      loginSchema.parse({
        email: 'William@example.com',
        password: 'strong-password-123',
      }),
    ).toEqual({
      email: 'william@example.com',
      password: 'strong-password-123',
    });
  });

  it('rejects invalid email', () => {
    expect(
      loginSchema.safeParse({
        email: 'invalid-email',
        password: 'strong-password-123',
      }).success,
    ).toBe(false);
  });

  it('rejects empty password', () => {
    expect(
      loginSchema.safeParse({
        email: 'william@example.com',
        password: '',
      }).success,
    ).toBe(false);
  });
});
