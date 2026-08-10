'use client';

import {
  parseTypographyTokenValue,
  serializeTypographyTokenFormValues,
  type TypographyTokenFormValues,
} from './typography-token-value.utils';
import { Button } from '@/components/ui';
import type { Locale } from '@/i18n/routing';
import { useActionState, useEffect, useMemo, useState } from 'react';
import { updateDesignTokenValueAction } from './update-design-token-value.action';
import { usePreserveSaveContext } from '@/features/save-context/usePreserveSaveContext';
import { useActionBackedProjectSaveStatus } from '@/features/save-context/useActionBackedProjectSaveStatus';
import { initialUpdateDesignTokenValueActionState } from './update-design-token-value.state';
import { validateTokenValueForType } from './token-value-validation.utils';

export type TypographyTokenValueEditorLabels = {
  title: string;
  fontFamilyLabel: string;
  fontSizeLabel: string;
  fontWeightLabel: string;
  lineHeightLabel: string;
  letterSpacingLabel: string;
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

type TypographyTokenValueEditorProps = {
  locale: Locale;
  projectSlug: string;
  tokenPath: string;
  initialValue: unknown;
  labels: TypographyTokenValueEditorLabels;
  onUpdated: (tokenPath: string) => void;
};

function hasTypographyFieldValue(values: TypographyTokenFormValues) {
  return Object.values(values).some((value) => value.trim().length > 0);
}

export function TypographyTokenValueEditor({
  locale,
  projectSlug,
  tokenPath,
  initialValue,
  labels,
  onUpdated,
}: TypographyTokenValueEditorProps) {
  const initialTypographyValues = parseTypographyTokenValue(
    initialValue,
    tokenPath,
  );
  const initialSerializedValue = hasTypographyFieldValue(
    initialTypographyValues,
  )
    ? serializeTypographyTokenFormValues(initialTypographyValues)
    : '';
  const [state, formAction, isPending] = useActionState(
    updateDesignTokenValueAction,
    {
      ...initialUpdateDesignTokenValueActionState,
      values: {
        value: initialSerializedValue,
      },
    },
  );

  const [typographyValues, setTypographyValues] =
    useState<TypographyTokenFormValues>(() => initialTypographyValues);
  const sourceId = `typography-token-value:${projectSlug}:${tokenPath}`;
  const preserveSaveContext = usePreserveSaveContext(sourceId);

  const serializedTypographyValue = useMemo(() => {
    if (!hasTypographyFieldValue(typographyValues)) {
      return '';
    }

    return serializeTypographyTokenFormValues(typographyValues);
  }, [typographyValues]);
  const localValueError = validateTokenValueForType({
    type: 'typography',
    value: serializedTypographyValue,
  });
  const successfulFingerprint =
    state.status === 'success' ? state.values.value : null;
  const {
    hasCurrentActionError,
    hasUnsavedChanges,
    markCurrentDraftSubmitted,
  } = useActionBackedProjectSaveStatus({
    sourceId,
    currentFingerprint: serializedTypographyValue,
    initialSavedFingerprint: initialSerializedValue,
    actionStatus: state.status,
    successfulFingerprint,
    isPending,
    hasValidationError: Boolean(localValueError),
  });
  const submittedValueErrors = hasCurrentActionError
    ? (state.fieldErrors.value ?? [])
    : [];
  const valueErrors = localValueError
    ? [localValueError]
    : submittedValueErrors;

  useEffect(() => {
    if (state.status === 'success') {
      onUpdated(tokenPath);
    }
  }, [onUpdated, state.status, tokenPath]);

  function updateTypographyField(
    field: keyof TypographyTokenFormValues,
    value: string,
  ) {
    setTypographyValues((currentValues) => ({
      ...currentValues,
      [field]: value,
    }));
  }

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
      <input type="hidden" name="tokenSetType" value="typography" />
      <input type="hidden" name="tokenPath" value={tokenPath} />
      <input type="hidden" name="value" value={serializedTypographyValue} />

      <p className="text-content-tertiary text-xs font-semibold tracking-[0.18em] uppercase">
        {labels.title}
      </p>

      <div className="mt-3 grid gap-3">
        <div>
          <label className="text-content-tertiary text-xs font-semibold">
            {labels.fontFamilyLabel}
          </label>

          <input
            value={typographyValues.fontFamily}
            onChange={(event) =>
              updateTypographyField('fontFamily', event.target.value)
            }
            className="border-border-subtle bg-surface-primary focus:border-action-primary mt-1 w-full rounded-md border px-3 py-2 font-mono text-sm outline-none"
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="text-content-tertiary text-xs font-semibold">
              {labels.fontSizeLabel}
            </label>

            <input
              value={typographyValues.fontSize}
              onChange={(event) =>
                updateTypographyField('fontSize', event.target.value)
              }
              className="border-border-subtle bg-surface-primary focus:border-action-primary mt-1 w-full rounded-md border px-3 py-2 font-mono text-sm outline-none"
            />
          </div>

          <div>
            <label className="text-content-tertiary text-xs font-semibold">
              {labels.fontWeightLabel}
            </label>

            <input
              value={typographyValues.fontWeight}
              onChange={(event) =>
                updateTypographyField('fontWeight', event.target.value)
              }
              className="border-border-subtle bg-surface-primary focus:border-action-primary mt-1 w-full rounded-md border px-3 py-2 font-mono text-sm outline-none"
            />
          </div>

          <div>
            <label className="text-content-tertiary text-xs font-semibold">
              {labels.lineHeightLabel}
            </label>

            <input
              value={typographyValues.lineHeight}
              onChange={(event) =>
                updateTypographyField('lineHeight', event.target.value)
              }
              className="border-border-subtle bg-surface-primary focus:border-action-primary mt-1 w-full rounded-md border px-3 py-2 font-mono text-sm outline-none"
            />
          </div>

          <div>
            <label className="text-content-tertiary text-xs font-semibold">
              {labels.letterSpacingLabel}
            </label>

            <input
              value={typographyValues.letterSpacing}
              onChange={(event) =>
                updateTypographyField('letterSpacing', event.target.value)
              }
              className="border-border-subtle bg-surface-primary focus:border-action-primary mt-1 w-full rounded-md border px-3 py-2 font-mono text-sm outline-none"
            />
          </div>
        </div>
      </div>

      {valueErrors.length > 0 ? (
        <ul className="text-action-danger mt-3 grid gap-1 text-xs font-semibold">
          {valueErrors.map((error) => (
            <li key={error}>{labels.fieldErrors[error] ?? error}</li>
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

      <div className="mt-2 inline-flex w-full items-center justify-end">
        <Button
          type="submit"
          disabled={isPending || !hasUnsavedChanges || Boolean(localValueError)}
        >
          {isPending ? '…' : labels.submit}
        </Button>
      </div>
    </form>
  );
}
