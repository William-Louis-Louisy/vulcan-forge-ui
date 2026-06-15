import type { TokenSetSaveError } from './token-set-save.service';
import type { CreateDesignTokenFieldError } from './create-design-token.state';

export type UpdateDesignTokenValueActionState = {
  status: 'idle' | 'success' | 'error';
  fieldErrors: {
    value?: CreateDesignTokenFieldError[];
  };
  formError:
    | TokenSetSaveError
    | 'unauthorized'
    | 'tokenNotFound'
    | 'tokenTypeMismatch'
    | null;
  values: {
    value: string;
  };
};

export const initialUpdateDesignTokenValueActionState: UpdateDesignTokenValueActionState =
  {
    status: 'idle',
    fieldErrors: {},
    formError: null,
    values: {
      value: '',
    },
  };
