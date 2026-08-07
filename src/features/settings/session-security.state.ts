export type LogoutAllSessionsActionState = {
  formError: 'revocationFailed' | null;
};

export const initialLogoutAllSessionsActionState: LogoutAllSessionsActionState =
  {
    formError: null,
  };
