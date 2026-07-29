export type DeleteProjectField = 'confirmationName';

export type DeleteProjectFormError =
  | 'invalidPayload'
  | 'unauthorized'
  | 'forbiddenOrNotFound'
  | 'confirmationNameMismatch'
  | 'unexpected';

export type DeleteProjectActionState = {
  status: 'idle' | 'error';
  fieldErrors: Partial<Record<DeleteProjectField, string[]>>;
  formError: DeleteProjectFormError | null;
};

export const initialDeleteProjectActionState: DeleteProjectActionState = {
  status: 'idle',
  fieldErrors: {},
  formError: null,
};
