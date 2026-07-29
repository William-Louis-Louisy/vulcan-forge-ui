export type ActionBackedProjectSaveStatus =
  | 'saved'
  | 'unsaved'
  | 'saving'
  | 'error';

type GetActionBackedProjectSaveStatusInput = {
  isPending: boolean;
  hasUnsavedChanges: boolean;
  hasValidationError: boolean;
  hasCurrentActionError: boolean;
};

export function getActionBackedProjectSaveStatus({
  isPending,
  hasUnsavedChanges,
  hasValidationError,
  hasCurrentActionError,
}: GetActionBackedProjectSaveStatusInput): ActionBackedProjectSaveStatus {
  if (isPending) {
    return 'saving';
  }

  if (hasValidationError || hasCurrentActionError) {
    return 'error';
  }

  if (hasUnsavedChanges) {
    return 'unsaved';
  }

  return 'saved';
}
