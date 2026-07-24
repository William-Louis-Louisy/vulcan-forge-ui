export type DeleteAccountField = 'confirmationEmail' | 'currentPassword';

export type DeleteAccountFieldErrorKey =
  | 'confirmationEmailMismatch'
  | 'currentPasswordIncorrect';

export type DeleteAccountActionState = {
  status: 'idle' | 'error';
  fieldErrors: Partial<
    Record<DeleteAccountField, DeleteAccountFieldErrorKey[]>
  >;
  formError:
    | 'unauthorized'
    | 'accountNotFound'
    | 'confirmationEmailMismatch'
    | 'currentPasswordIncorrect'
    | 'invalidPayload'
    | 'unexpected'
    | null;
};

export const initialDeleteAccountActionState: DeleteAccountActionState = {
  status: 'idle',
  fieldErrors: {},
  formError: null,
};
