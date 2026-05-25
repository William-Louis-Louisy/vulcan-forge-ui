import type { UpdatePrimitiveColorTokenValidationMessageKey } from './primitive-color-token.schema';

export type UpdatePrimitiveColorTokenField = 'value';

export type UpdatePrimitiveColorTokenActionState = {
  status: 'idle' | 'success' | 'error';
  fieldErrors: Partial<
    Record<
      UpdatePrimitiveColorTokenField,
      UpdatePrimitiveColorTokenValidationMessageKey[]
    >
  >;
  formError:
    | 'unauthorized'
    | 'projectNotFound'
    | 'tokenSetNotFound'
    | 'tokenSetMalformed'
    | 'tokenNotFound'
    | 'notPrimitiveColorToken'
    | 'unexpected'
    | 'tokenValidationFailed'
    | null;
  values: {
    value: string;
  };
};

export const initialUpdatePrimitiveColorTokenActionState: UpdatePrimitiveColorTokenActionState =
  {
    status: 'idle',
    fieldErrors: {},
    formError: null,
    values: {
      value: '',
    },
  };
