export type DeleteAccountField = 'confirmationEmail' | 'currentPassword';

export type DeleteAccountActionState = {
  status: 'idle' | 'error';
  fieldErrors: Partial<Record<DeleteAccountField, string[]>>;
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
