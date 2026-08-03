import type { SignupValidationMessageKey } from './signup.schema';

export type SignupField =
  | 'name'
  | 'email'
  | 'password'
  | 'passwordConfirmation';

export type SignupActionState = {
  status: 'idle' | 'error';
  fieldErrors: Partial<Record<SignupField, SignupValidationMessageKey[]>>;
  formError:
    | 'accountCreatedSignInFailed'
    | 'rateLimited'
    | 'signupUnavailable'
    | 'unexpected'
    | null;
  values: {
    name: string;
    email: string;
  };
};

export const initialSignupActionState: SignupActionState = {
  status: 'idle',
  fieldErrors: {},
  formError: null,
  values: {
    name: '',
    email: '',
  },
};
