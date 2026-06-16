import type { CreateDesignTokenError } from './create-design-token.utils';

export type CreateDesignTokenField =
  | 'path'
  | 'value'
  | 'descriptionEn'
  | 'descriptionFr';

export type CreateDesignTokenFormError =
  | 'unauthorized'
  | 'projectNotFound'
  | 'tokenSetNotFound'
  | 'tokenSetMalformed'
  | 'tokenValidationFailed'
  | 'tokenPathAlreadyExists'
  | 'unexpected';

export type CreateDesignTokenFieldError = Exclude<
  CreateDesignTokenError,
  'tokenPathAlreadyExists'
>;

export type CreateDesignTokenActionState = {
  status: 'idle' | 'success' | 'error';
  fieldErrors: Partial<
    Record<CreateDesignTokenField, CreateDesignTokenFieldError[]>
  >;
  formError: CreateDesignTokenFormError | null;
  values: {
    path: string;
    value: string;
    descriptionEn: string;
    descriptionFr: string;
  };
};

export const initialCreateDesignTokenActionState: CreateDesignTokenActionState =
  {
    status: 'idle',
    fieldErrors: {},
    formError: null,
    values: {
      path: '',
      value: '',
      descriptionEn: '',
      descriptionFr: '',
    },
  };
