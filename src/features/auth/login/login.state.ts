import type { LoginValidationMessageKey } from './login.schema';

export type LoginField = 'email' | 'password';

export type LoginActionState = {
  status: 'idle' | 'error';
  fieldErrors: Partial<Record<LoginField, LoginValidationMessageKey[]>>;
  formError: 'invalidCredentials' | 'unexpected' | null;
  values: {
    email: string;
  };
};

export const initialLoginActionState: LoginActionState = {
  status: 'idle',
  fieldErrors: {},
  formError: null,
  values: {
    email: '',
  },
};
