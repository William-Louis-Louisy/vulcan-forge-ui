// Visual design-system status only. This module does not handle authentication tokens or credentials.
export type UpdateTokenStatusActionState = {
  status: 'idle' | 'success' | 'error';
  fieldErrors: {
    tokenStatus?: Array<'invalidStatus'>;
  };
  formError:
    | 'unauthorized'
    | 'projectNotFound'
    | 'tokenSetNotFound'
    | 'tokenSetMalformed'
    | 'tokenValidationFailed'
    | 'tokenNotFound'
    | 'unexpected'
    | null;
  values: {
    tokenStatus: string;
  };
};

export const initialUpdateTokenStatusActionState: UpdateTokenStatusActionState =
  {
    status: 'idle',
    fieldErrors: {},
    formError: null,
    values: {
      tokenStatus: '',
    },
  };
