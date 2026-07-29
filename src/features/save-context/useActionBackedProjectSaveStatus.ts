'use client';

import { useCallback, useState } from 'react';

import {
  type ProjectSaveStatus,
  useProjectSaveStatus,
} from '@/components/layout/ProjectTopbarBreadcrumb';

type ActionStatus = 'idle' | 'success' | 'error';

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
}: GetActionBackedProjectSaveStatusInput): ProjectSaveStatus {
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

type UseActionBackedProjectSaveStatusInput = {
  sourceId: string;
  currentFingerprint: string;
  initialSavedFingerprint: string;
  actionStatus: ActionStatus;
  successfulFingerprint: string | null;
  isPending: boolean;
  hasValidationError?: boolean;
};

export function useActionBackedProjectSaveStatus({
  sourceId,
  currentFingerprint,
  initialSavedFingerprint,
  actionStatus,
  successfulFingerprint,
  isPending,
  hasValidationError = false,
}: UseActionBackedProjectSaveStatusInput) {
  const [savedFingerprint, setSavedFingerprint] = useState(
    initialSavedFingerprint,
  );
  const [submittedFingerprint, setSubmittedFingerprint] = useState<
    string | null
  >(null);
  const effectiveSavedFingerprint =
    actionStatus === 'success' && successfulFingerprint !== null
      ? successfulFingerprint
      : savedFingerprint;
  const hasUnsavedChanges = currentFingerprint !== effectiveSavedFingerprint;
  const hasCurrentActionError =
    actionStatus === 'error' && submittedFingerprint === currentFingerprint;
  const status = getActionBackedProjectSaveStatus({
    isPending,
    hasUnsavedChanges,
    hasValidationError,
    hasCurrentActionError,
  });

  useProjectSaveStatus(sourceId, status);

  const markCurrentDraftSubmitted = useCallback(() => {
    setSavedFingerprint(effectiveSavedFingerprint);
    setSubmittedFingerprint(currentFingerprint);
  }, [currentFingerprint, effectiveSavedFingerprint]);

  return {
    hasCurrentActionError,
    hasUnsavedChanges,
    markCurrentDraftSubmitted,
    status,
  };
}
