import type { SignupActionState } from './signup.state';

export type SignupFormError = NonNullable<SignupActionState['formError']>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export function getSignupPersistenceError(error: unknown): SignupFormError {
  if (isRecord(error) && error.code === 'P2002') {
    return 'signupUnavailable';
  }

  return 'unexpected';
}
