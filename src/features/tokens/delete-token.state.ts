export type DeleteTokenDependencyKind = 'token' | 'theme' | 'component';

export type DeleteTokenDependency = {
  kind: DeleteTokenDependencyKind;
  label: string;
};

export type DeleteTokenFormError =
  | 'unauthorized'
  | 'projectNotFound'
  | 'tokenSetNotFound'
  | 'tokenSetMalformed'
  | 'tokenNotFound'
  | 'tokenInUse'
  | 'tokenValidationFailed'
  | 'unexpected';

export type DeleteTokenActionState = {
  status: 'idle' | 'error' | 'success';
  formError: DeleteTokenFormError | null;
  dependencies: DeleteTokenDependency[];
  deletedTokenPath: string | null;
};

export const initialDeleteTokenActionState: DeleteTokenActionState = {
  status: 'idle',
  formError: null,
  dependencies: [],
  deletedTokenPath: null,
};
