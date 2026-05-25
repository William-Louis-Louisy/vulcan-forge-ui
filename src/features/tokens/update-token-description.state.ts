import type { UpdateTokenDescriptionValidationMessageKey } from './token-description.schema';

export type UpdateTokenDescriptionField = 'descriptionEn' | 'descriptionFr';

export type UpdateTokenDescriptionActionState = {
  status: 'idle' | 'success' | 'error';
  fieldErrors: Partial<
    Record<
      UpdateTokenDescriptionField,
      UpdateTokenDescriptionValidationMessageKey[]
    >
  >;
  formError:
    | 'unauthorized'
    | 'projectNotFound'
    | 'tokenSetNotFound'
    | 'tokenSetMalformed'
    | 'tokenNotFound'
    | 'unexpected'
    | 'tokenValidationFailed'
    | null;
  values: {
    descriptionEn: string;
    descriptionFr: string;
  };
};

export const initialUpdateTokenDescriptionActionState: UpdateTokenDescriptionActionState =
  {
    status: 'idle',
    fieldErrors: {},
    formError: null,
    values: {
      descriptionEn: '',
      descriptionFr: '',
    },
  };
