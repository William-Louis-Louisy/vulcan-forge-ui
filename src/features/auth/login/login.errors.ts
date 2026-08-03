import type { AuthError } from '@auth/core/errors';
import type { LoginActionState } from './login.state';

export type LoginFormError = NonNullable<LoginActionState['formError']>;

export function getLoginFormError(error: AuthError): LoginFormError {
  if (error.type !== 'CredentialsSignin') {
    return 'unexpected';
  }

  if ('code' in error && error.code === 'rate_limited') {
    return 'rateLimited';
  }

  return 'invalidCredentials';
}
