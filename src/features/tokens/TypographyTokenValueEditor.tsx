import {
  parseTypographyTokenValue,
  serializeTypographyTokenFormValues,
  type TypographyTokenFormValues,
} from './typography-token-value.utils';
import type { Locale } from '@/i18n/routing';
import { useActionState, useEffect, useMemo, useState } from 'react';
import { updateDesignTokenValueAction } from './update-design-token-value.action';
import { usePreserveSaveContext } from '@/features/save-context/usePreserveSaveContext';
import { initialUpdateDesignTokenValueActionState } from './update-design-token-value.state';

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
  initialValue: string;
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
  const [state, formAction, isPending] = useActionState(
    updateDesignTokenValueAction,
    {
      ...initialUpdateDesignTokenValueActionState,
      values: {
        value: initialValue,
      },
    },
  );

  const [typographyValues, setTypographyValues] =
    useState<TypographyTokenFormValues>(() =>
      parseTypographyTokenValue(initialValue),
    );

  const preserveSaveContext = usePreserveSaveContext(
    `typography-token-value:${projectSlug}:${tokenPath}`,
  );

  useEffect(() => {
    if (state.status !== 'success') {
      return;
    }

    onUpdated(tokenPath);
  }, [onUpdated, state.status, tokenPath]);

  useEffect(() => {
    if (state.status !== 'success') {
      return;
    }

    onUpdated(tokenPath);
  }, [onUpdated, state.status, tokenPath]);

  const serializedTypographyValue = useMemo(() => {
    if (!hasTypographyFieldValue(typographyValues)) {
      return '';
    }

    return serializeTypographyTokenFormValues(typographyValues);
  }, [typographyValues]);

  const valueErrors = state.fieldErrors.value ?? [];

  function updateTypographyField(
    field: keyof TypographyTokenFormValues,
    value: string,
  ) {
    setTypographyValues((currentValues) => ({
      ...currentValues,
      [field]: value,
    }));
  }

  return (
    <form
      action={formAction}
      onSubmitCapture={preserveSaveContext}
      className="border-border-subtle bg-surface-primary mt-3 rounded-xl border p-3"
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
            className="border-border-default bg-background-subtle mt-1 w-full rounded-lg border px-3 py-2 text-sm"
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
              className="border-border-default bg-background-subtle mt-1 w-full rounded-lg border px-3 py-2 font-mono text-sm"
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
              className="border-border-default bg-background-subtle mt-1 w-full rounded-lg border px-3 py-2 font-mono text-sm"
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
              className="border-border-default bg-background-subtle mt-1 w-full rounded-lg border px-3 py-2 font-mono text-sm"
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
              className="border-border-default bg-background-subtle mt-1 w-full rounded-lg border px-3 py-2 font-mono text-sm"
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

      {state.formError ? (
        <p className="text-action-danger mt-3 text-xs font-semibold">
          {labels.formErrors[state.formError]}
        </p>
      ) : null}

      {state.status === 'success' ? (
        <p className="text-action-success mt-3 text-xs font-semibold">
          {labels.success}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className="bg-action-primary text-action-primary-content mt-4 rounded-lg px-3 py-2 text-sm font-semibold disabled:opacity-60"
      >
        {isPending ? '…' : labels.submit}
      </button>
    </form>
  );
}
