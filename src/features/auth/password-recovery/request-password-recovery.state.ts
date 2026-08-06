import type { RequestPasswordRecoveryValidationMessageKey } from './request-password-recovery.schema';

export type RequestPasswordRecoveryActionState = {
  fieldErrors: {
    email?: RequestPasswordRecoveryValidationMessageKey[];
  };
  status: 'error' | 'idle' | 'submitted';
  values: {
    email: string;
  };
};

export const initialRequestPasswordRecoveryActionState: RequestPasswordRecoveryActionState = {
  fieldErrors: {},
  status: 'idle',
  values: {
    email: '',
  },
};
