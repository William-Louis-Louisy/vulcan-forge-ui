'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

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
  const submittedFingerprintRef = useRef<string | null>(null);

  useEffect(() => {
    setSavedFingerprint(initialSavedFingerprint);
    submittedFingerprintRef.current = null;
  }, [initialSavedFingerprint, sourceId]);

  useEffect(() => {
    if (actionStatus === 'success' && successfulFingerprint !== null) {
      setSavedFingerprint(successfulFingerprint);
    }
  }, [actionStatus, successfulFingerprint]);

  const effectiveSavedFingerprint =
    actionStatus === 'success' && successfulFingerprint !== null
      ? successfulFingerprint
      : savedFingerprint;
  const hasUnsavedChanges =
    currentFingerprint !== effectiveSavedFingerprint;
  const hasCurrentActionError =
    actionStatus === 'error' &&
    submittedFingerprintRef.current === currentFingerprint;
  const status = getActionBackedProjectSaveStatus({
    isPending,
    hasUnsavedChanges,
    hasValidationError,
    hasCurrentActionError,
  });

  useProjectSaveStatus(sourceId, status);

  const markCurrentDraftSubmitted = useCallback(() => {
    submittedFingerprintRef.current = currentFingerprint;
  }, [currentFingerprint]);

  return {
    hasCurrentActionError,
    hasUnsavedChanges,
    markCurrentDraftSubmitted,
    status,
  };
}
