export type CreateThemeColorRoleActionState = {
  status: 'idle' | 'success' | 'error';
  formError:
    | 'unauthorized'
    | 'invalidPayload'
    | 'themeNotFound'
    | 'invalidTokenReference'
    | 'invalidRoleKey'
    | 'invalidTokenPath'
    | 'themeTokensMalformed'
    | 'roleAlreadyExists'
    | 'unexpected'
    | null;
};

export const initialCreateThemeColorRoleActionState: CreateThemeColorRoleActionState =
  {
    status: 'idle',
    formError: null,
  };
