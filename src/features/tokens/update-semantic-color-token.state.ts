import type { UpdateSemanticColorTokenValidationMessageKey } from './semantic-color-token.schema';

export type UpdateSemanticColorTokenField = 'referencePath';

export type UpdateSemanticColorTokenActionState = {
  status: 'idle' | 'success' | 'error';
  fieldErrors: Partial<
    Record<
      UpdateSemanticColorTokenField,
      UpdateSemanticColorTokenValidationMessageKey[]
    >
  >;
  formError:
    | 'unauthorized'
    | 'projectNotFound'
    | 'tokenSetNotFound'
    | 'tokenSetMalformed'
    | 'tokenNotFound'
    | 'notSemanticColorToken'
    | 'aliasNotFound'
    | 'aliasInvalid'
    | 'unexpected'
    | 'tokenValidationFailed'
    | null;
  values: {
    referencePath: string;
  };
};

export const initialUpdateSemanticColorTokenActionState: UpdateSemanticColorTokenActionState =
  {
    status: 'idle',
    fieldErrors: {},
    formError: null,
    values: {
      referencePath: '',
    },
  };
