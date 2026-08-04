import { AuthError, CredentialsSignin } from '@auth/core/errors';
import { describe, expect, it } from 'vitest';
import { getLoginFormError } from './login.errors';

class RateLimitedCredentialsError extends CredentialsSignin {
  code = 'rate_limited';
}

class InternalAuthError extends AuthError {
  static type = 'CallbackRouteError';
}

describe('getLoginFormError', () => {
  it('maps regular credential rejection to the generic credentials message', () => {
    expect(getLoginFormError(new CredentialsSignin())).toBe(
      'invalidCredentials',
    );
  });

  it('maps the explicit throttling code to the cooldown message', () => {
    expect(getLoginFormError(new RateLimitedCredentialsError())).toBe(
      'rateLimited',
    );
  });

  it('keeps unexpected Auth.js failures distinct from user mistakes', () => {
    expect(getLoginFormError(new InternalAuthError())).toBe('unexpected');
  });
});
