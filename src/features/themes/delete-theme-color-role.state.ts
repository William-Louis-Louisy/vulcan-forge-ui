export type DeleteThemeColorRoleActionState = {
  status: 'idle' | 'success' | 'error';
  formError:
    | 'unauthorized'
    | 'invalidPayload'
    | 'themeNotFound'
    | 'invalidRoleKey'
    | 'protectedRole'
    | 'themeTokensMalformed'
    | 'roleNotFound'
    | 'unexpected'
    | null;
  deletedRoleKey: string | null;
};

export const initialDeleteThemeColorRoleActionState: DeleteThemeColorRoleActionState =
  {
    status: 'idle',
    formError: null,
    deletedRoleKey: null,
  };
