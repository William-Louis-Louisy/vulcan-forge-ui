export type DeleteProjectField = 'confirmationName';

export type DeleteProjectValidationError = 'confirmationNameMismatch';

export type DeleteProjectFormError =
  | 'invalidPayload'
  | 'unauthorized'
  | 'forbiddenOrNotFound'
  | 'confirmationNameMismatch'
  | 'unexpected';

export type DeleteProjectActionState = {
  status: 'idle' | 'error';
  fieldErrors: Partial<
    Record<DeleteProjectField, DeleteProjectValidationError[]>
  >;
  formError: DeleteProjectFormError | null;
};

export const initialDeleteProjectActionState: DeleteProjectActionState = {
  status: 'idle',
  fieldErrors: {},
  formError: null,
};
