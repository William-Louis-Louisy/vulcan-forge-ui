'use client';

import { Button } from '@/components/ui';
import type { Locale } from '@/i18n/routing';
import { useActionState, useEffect, useState } from 'react';
import type { TokenSetType } from './tokens-editor.utils';
import { updateDesignTokenValueAction } from './update-design-token-value.action';
import { usePreserveSaveContext } from '@/features/save-context/usePreserveSaveContext';
import { initialUpdateDesignTokenValueActionState } from './update-design-token-value.state';
import { useActionBackedProjectSaveStatus } from '@/features/save-context/useActionBackedProjectSaveStatus';
import { validateTokenValueForType } from './token-value-validation.utils';

export type DesignTokenValueEditorLabels = {
  label: string;
  submit: string;
  success: string;
  fieldErrors: Partial<Record<string, string>>;
  formErrors: {
    unauthorized: string;
    projectNotFound: string;
    tokenSetNotFound: string;
    tokenSetMalformed: string;
    tokenValidationFailed: string;
    tokenNotFound: string;
    tokenTypeMismatch: string;
    unexpected: string;
  };
};

type DesignTokenValueEditorProps = {
  locale: Locale;
  projectSlug: string;
  tokenSetType: TokenSetType;
  tokenPath: string;
  initialValue: string;
  labels: DesignTokenValueEditorLabels;
  onUpdated: (tokenPath: string, tokenSetType: TokenSetType) => void;
};

export function DesignTokenValueEditor({
  locale,
  projectSlug,
  tokenSetType,
  tokenPath,
  initialValue,
  labels,
  onUpdated,
}: DesignTokenValueEditorProps) {
  const [draftValue, setDraftValue] = useState(initialValue);
  const [state, formAction, isPending] = useActionState(
    updateDesignTokenValueAction,
    {
      ...initialUpdateDesignTokenValueActionState,
      values: {
        value: initialValue,
      },
    },
  );
  const sourceId = `design-token-value:${projectSlug}:${tokenSetType}:${tokenPath}`;
  const currentFingerprint = draftValue.trim();
  const localValueError = validateTokenValueForType({
    type: tokenSetType,
    value: draftValue,
  });
  const successfulFingerprint =
    state.status === 'success' ? state.values.value : null;
  const {
    hasCurrentActionError,
    hasUnsavedChanges,
    markCurrentDraftSubmitted,
  } = useActionBackedProjectSaveStatus({
    sourceId,
    currentFingerprint,
    initialSavedFingerprint: initialValue.trim(),
    actionStatus: state.status,
    successfulFingerprint,
    isPending,
    hasValidationError: Boolean(localValueError),
  });
  const preserveSaveContext = usePreserveSaveContext(sourceId);

  useEffect(() => {
    if (state.status === 'success') {
      onUpdated(tokenPath, tokenSetType);
    }
  }, [onUpdated, state.status, tokenPath, tokenSetType]);

  const submittedValueErrors = hasCurrentActionError
    ? (state.fieldErrors.value ?? [])
    : [];
  const valueErrors = localValueError
    ? [localValueError]
    : submittedValueErrors;

  function handleSubmitCapture() {
    markCurrentDraftSubmitted();
    preserveSaveContext();
  }

  return (
    <form
      action={formAction}
      onSubmitCapture={handleSubmitCapture}
      className="border-border-subtle border-b pb-2"
    >
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="projectSlug" value={projectSlug} />
      <input type="hidden" name="tokenSetType" value={tokenSetType} />
      <input type="hidden" name="tokenPath" value={tokenPath} />

      <label
        htmlFor={`token-value-${tokenPath}`}
        className="text-content-tertiary text-xs font-semibold tracking-[0.16em] uppercase"
      >
        {labels.label}
      </label>

      <input
        id={`token-value-${tokenPath}`}
        name="value"
        value={draftValue}
        onChange={(event) => setDraftValue(event.target.value)}
        aria-invalid={valueErrors.length > 0}
        className="border-border-subtle bg-surface-primary focus:border-action-primary mt-2 w-full rounded-md border px-3 py-2 font-mono text-sm outline-none"
      />

      <div className="mt-2 flex justify-end">
        <Button
          type="submit"
          size="sm"
          disabled={isPending || !hasUnsavedChanges || Boolean(localValueError)}
        >
          {isPending ? '…' : labels.submit}
        </Button>
      </div>

      {valueErrors.length > 0 ? (
        <ul className="text-action-danger mt-2 grid gap-1 text-xs font-semibold">
          {valueErrors.map((error) => (
            <li key={error}>{labels.fieldErrors[error] ?? error}</li>
          ))}
        </ul>
      ) : null}

      {hasCurrentActionError && state.formError ? (
        <p className="text-action-danger mt-2 text-xs font-semibold">
          {labels.formErrors[state.formError]}
        </p>
      ) : null}

      {state.status === 'success' && !hasUnsavedChanges ? (
        <p className="text-action-success mt-2 text-xs font-semibold">
          {labels.success}
        </p>
      ) : null}
    </form>
  );
}
