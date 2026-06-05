export type UpdateThemeTokenReferenceActionState = {
  status: 'idle' | 'success' | 'error';
  formError:
    | 'unauthorized'
    | 'invalidPayload'
    | 'themeNotFound'
    | 'invalidTokenReference'
    | 'unexpected'
    | null;
};

export const initialUpdateThemeTokenReferenceActionState: UpdateThemeTokenReferenceActionState =
  {
    status: 'idle',
    formError: null,
  };
