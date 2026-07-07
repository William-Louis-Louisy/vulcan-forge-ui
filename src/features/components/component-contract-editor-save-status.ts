import type { ProjectSaveStatus } from '@/components/layout/ProjectTopbarBreadcrumb';

type ComponentContractEditorSaveStatusInput = {
  isPending: boolean;
  hasUnsavedChanges: boolean;
  hasValidationError: boolean;
  hasFormError: boolean;
};

export function getComponentContractEditorSaveStatus({
  isPending,
  hasUnsavedChanges,
  hasValidationError,
  hasFormError,
}: ComponentContractEditorSaveStatusInput): ProjectSaveStatus {
  if (isPending) {
    return 'saving';
  }

  if (hasValidationError || hasFormError) {
    return 'error';
  }

  if (hasUnsavedChanges) {
    return 'unsaved';
  }

  return 'saved';
}
