export type DeleteAccountActionState = {
  status: 'idle' | 'error';
  fieldErrors: Partial<
    Record<'confirmationEmail' | 'currentPassword', string[]>
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
