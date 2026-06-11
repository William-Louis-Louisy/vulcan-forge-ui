import type { TokenSetSaveError } from './token-set-save.service';
import type { RenameTokenValidationMessageKey } from './token-rename.schema';

export type RenameTokenField = 'nextTokenPath';

export type RenameTokenFormError =
  | TokenSetSaveError
  | 'unauthorized'
  | 'tokenNotFound'
  | 'tokenPathAlreadyExists'
  | 'tokenSetNotFound';

export type RenameTokenActionState = {
  status: 'idle' | 'success' | 'error';
  fieldErrors: Partial<
    Record<RenameTokenField, RenameTokenValidationMessageKey[]>
  >;
  formError: RenameTokenFormError | null;
  values: {
    nextTokenPath: string;
  };
};

export const initialRenameTokenActionState: RenameTokenActionState = {
  status: 'idle',
  fieldErrors: {},
  formError: null,
  values: {
    nextTokenPath: '',
  },
};
