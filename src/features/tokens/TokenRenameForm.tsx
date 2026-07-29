'use client';

import type { Locale } from '@/i18n/routing';
import { useActionState, useEffect, useState } from 'react';
import { renameTokenAction } from './rename-token.action';
import type { TokenSetType } from './tokens-editor.utils';
import { initialRenameTokenActionState } from './rename-token.state';
import { usePreserveSaveContext } from '@/features/save-context/usePreserveSaveContext';
import { useActionBackedProjectSaveStatus } from '@/features/save-context/useActionBackedProjectSaveStatus';

export type TokenRenameFormLabels = {
  title: string;
  description: string;
  inputLabel: string;
  submit: string;
  success: string;
  fieldErrors: {
    tokenPathRequired: string;
    tokenPathInvalid: string;
  };
  formErrors: {
    unauthorized: string;
    projectNotFound: string;
    tokenSetNotFound: string;
    tokenSetMalformed: string;
    tokenValidationFailed: string;
    tokenNotFound: string;
    tokenPathAlreadyExists: string;
    unexpected: string;
  };
};

type TokenRenameFormProps = {
  locale: Locale;
  projectSlug: string;
  tokenSetType: TokenSetType;
  currentTokenPath: string;
  labels: TokenRenameFormLabels;
  onRenamed?: (nextTokenPath: string) => void;
};

export function TokenRenameForm({
  locale,
  projectSlug,
  tokenSetType,
  currentTokenPath,
  labels,
  onRenamed,
}: TokenRenameFormProps) {
  const [draftTokenPath, setDraftTokenPath] = useState(currentTokenPath);
  const [state, formAction, isPending] = useActionState(renameTokenAction, {
    ...initialRenameTokenActionState,
    values: {
      nextTokenPath: currentTokenPath,
    },
  });
  const sourceId = `rename-token:${projectSlug}:${currentTokenPath}`;
  const currentFingerprint = draftTokenPath.trim();
  const successfulFingerprint =
    state.status === 'success' ? state.values.nextTokenPath : null;
  const {
    hasCurrentActionError,
    hasUnsavedChanges,
    markCurrentDraftSubmitted,
  } = useActionBackedProjectSaveStatus({
    sourceId,
    currentFingerprint,
    initialSavedFingerprint: currentTokenPath,
    actionStatus: state.status,
    successfulFingerprint,
    isPending,
  });
  const preserveSaveContext = usePreserveSaveContext(sourceId);

  useEffect(() => {
    if (state.status !== 'success') {
      return;
    }

    setDraftTokenPath(state.values.nextTokenPath);
    onRenamed?.(state.values.nextTokenPath);
  }, [onRenamed, state.status, state.values.nextTokenPath]);

  const nextTokenPathErrors = hasCurrentActionError
    ? (state.fieldErrors.nextTokenPath ?? [])
    : [];

  function handleSubmitCapture() {
    markCurrentDraftSubmitted();
    preserveSaveContext();
  }

  return (
    <form
      action={formAction}
      onSubmitCapture={handleSubmitCapture}
      className="border-border-subtle space-y-3 border-b pb-2"
    >
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="projectSlug" value={projectSlug} />
      <input type="hidden" name="tokenSetType" value={tokenSetType} />
      <input type="hidden" name="currentTokenPath" value={currentTokenPath} />

      <div>
        <label
          htmlFor={`rename-token-${currentTokenPath}`}
          className="text-content-tertiary mt-4 block text-xs font-semibold tracking-[0.16em] uppercase"
        >
          {labels.title}
        </label>

        <input
          id={`rename-token-${currentTokenPath}`}
          name="nextTokenPath"
          value={draftTokenPath}
          onChange={(event) => setDraftTokenPath(event.target.value)}
          aria-invalid={nextTokenPathErrors.length > 0}
          className="border-border-subtle bg-surface-primary focus:border-action-primary mt-2 w-full rounded-md border px-3 py-2 font-mono text-sm outline-none"
        />

        {nextTokenPathErrors.length > 0 ? (
          <ul className="text-action-danger mt-2 grid gap-1 text-xs font-semibold">
            {nextTokenPathErrors.map((error) => (
              <li key={error}>{labels.fieldErrors[error]}</li>
            ))}
          </ul>
        ) : null}

        {hasCurrentActionError && state.formError ? (
          <p className="text-action-danger mt-3 text-xs font-semibold">
            {labels.formErrors[state.formError]}
          </p>
        ) : null}

        {state.status === 'success' && !hasUnsavedChanges ? (
          <p className="text-action-success mt-3 text-xs font-semibold">
            {labels.success}
          </p>
        ) : null}

        <div className="inline-flex w-full items-center justify-end">
          <button
            type="submit"
            disabled={isPending || !hasUnsavedChanges}
            className="bg-action-primary text-action-primary-content mt-2 self-end rounded-md px-4 py-2 text-sm font-semibold disabled:opacity-60"
          >
            {isPending ? '…' : labels.submit}
          </button>
        </div>
      </div>
    </form>
  );
}
