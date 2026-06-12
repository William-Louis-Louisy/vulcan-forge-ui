import type { TokenSetSaveError } from './token-set-save.service';
import type { CreateColorTokenValidationMessageKey } from './create-color-token.schema';

export type CreateColorTokenField =
  | 'kind'
  | 'path'
  | 'value'
  | 'referencePath'
  | 'descriptionEn'
  | 'descriptionFr';

export type CreateColorTokenFormError =
  | TokenSetSaveError
  | 'unauthorized'
  | 'tokenPathAlreadyExists'
  | 'tokenSetNotFound'
  | 'primitiveReferenceNotFound'
  | 'primitiveReferenceInvalid';

export type CreateColorTokenActionState = {
  status: 'idle' | 'success' | 'error';
  fieldErrors: Partial<
    Record<CreateColorTokenField, CreateColorTokenValidationMessageKey[]>
  >;
  formError: CreateColorTokenFormError | null;
  values: {
    kind: 'primitive' | 'semantic';
    path: string;
    value: string;
    referencePath: string;
    descriptionEn: string;
    descriptionFr: string;
  };
};

export const initialCreateColorTokenActionState: CreateColorTokenActionState = {
  status: 'idle',
  fieldErrors: {},
  formError: null,
  values: {
    kind: 'primitive',
    path: '',
    value: '#000000',
    referencePath: '',
    descriptionEn: '',
    descriptionFr: '',
  },
};
