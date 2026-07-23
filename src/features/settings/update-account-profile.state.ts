import type { AccountProfileValidationMessageKey } from './account-profile.schema';

export type AccountProfile = {
  name: string;
  email: string;
};

export type AccountProfileField = 'name' | 'email' | 'currentPassword';

export type AccountProfileFieldErrorKey =
  | AccountProfileValidationMessageKey
  | 'currentPasswordRequired'
  | 'currentPasswordIncorrect'
  | 'emailAlreadyUsed';

export type UpdateAccountProfileActionState = {
  status: 'idle' | 'success' | 'error';
  fieldErrors: Partial<
    Record<AccountProfileField, AccountProfileFieldErrorKey[]>
  >;
  formError:
    | 'unauthorized'
    | 'accountNotFound'
    | 'emailAlreadyUsed'
    | 'currentPasswordRequired'
    | 'currentPasswordIncorrect'
    | 'invalidPayload'
    | 'unexpected'
    | null;
  savedProfile: AccountProfile | null;
};

export const initialUpdateAccountProfileActionState: UpdateAccountProfileActionState =
  {
    status: 'idle',
    fieldErrors: {},
    formError: null,
    savedProfile: null,
  };
