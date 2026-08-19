export type UpdateThemeTokenReferenceActionState = {
  status: 'idle' | 'success' | 'error';
  formError:
    | 'unauthorized'
    | 'invalidPayload'
    | 'themeNotFound'
    | 'invalidTokenReference'
    | 'invalidRoleKey'
    | 'invalidTokenPath'
    | 'themeTokensMalformed'
    | 'unexpected'
    | null;
};

export const initialUpdateThemeTokenReferenceActionState: UpdateThemeTokenReferenceActionState =
  {
    status: 'idle',
    formError: null,
  };
