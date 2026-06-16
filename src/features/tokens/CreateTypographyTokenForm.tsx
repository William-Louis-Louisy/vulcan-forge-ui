import {
  initialCreateDesignTokenActionState,
  type CreateDesignTokenFieldError,
} from './create-design-token.state';
import {
  parseTypographyTokenValue,
  serializeTypographyTokenFormValues,
  createEmptyTypographyTokenFormValues,
  type TypographyTokenFormValues,
} from './typography-token-value.utils';
import type { Locale } from '@/i18n/routing';
import { useActionState, useEffect, useMemo, useState } from 'react';
import { createDesignTokenAction } from './create-design-token.action';
import { usePreserveSaveContext } from '@/features/save-context/usePreserveSaveContext';

export type CreateTypographyTokenFormLabels = {
  title: string;
  description: string;
  pathLabel: string;
  pathPlaceholder: string;
  fontFamilyLabel: string;
  fontFamilyPlaceholder: string;
  fontSizeLabel: string;
  fontSizePlaceholder: string;
  fontWeightLabel: string;
  fontWeightPlaceholder: string;
  lineHeightLabel: string;
  lineHeightPlaceholder: string;
  letterSpacingLabel: string;
  letterSpacingPlaceholder: string;
  descriptionEnLabel: string;
  descriptionFrLabel: string;
  submit: string;
  success: string;
  cancel: string;
  fieldErrors: Partial<Record<CreateDesignTokenFieldError, string>>;
  formErrors: {
    unauthorized: string;
    projectNotFound: string;
    tokenSetNotFound: string;
    tokenSetMalformed: string;
    tokenValidationFailed: string;
    tokenPathAlreadyExists: string;
    unexpected: string;
  };
};

type CreateTypographyTokenFormProps = {
  locale: Locale;
  projectSlug: string;
  labels: CreateTypographyTokenFormLabels;
  onCancel: () => void;
  onCreated?: (tokenPath: string) => void;
};

function hasTypographyFieldValue(values: TypographyTokenFormValues) {
  return Object.values(values).some((value) => value.trim().length > 0);
}

export function CreateTypographyTokenForm({
  locale,
  projectSlug,
  labels,
  onCancel,
  onCreated,
}: CreateTypographyTokenFormProps) {
  const [state, formAction, isPending] = useActionState(
    createDesignTokenAction,
    initialCreateDesignTokenActionState,
  );

  const [typographyValues, setTypographyValues] =
    useState<TypographyTokenFormValues>(() =>
      state.values.value
        ? parseTypographyTokenValue(state.values.value)
        : createEmptyTypographyTokenFormValues(),
    );

  const preserveSaveContext = usePreserveSaveContext(
    `create-typography-token:${projectSlug}`,
  );

  useEffect(() => {
    if (state.status !== 'success') {
      return;
    }

    onCreated?.(state.values.path);
  }, [onCreated, state.status, state.values.path]);

  const serializedTypographyValue = useMemo(() => {
    if (!hasTypographyFieldValue(typographyValues)) {
      return '';
    }

    return serializeTypographyTokenFormValues(typographyValues);
  }, [typographyValues]);

  const pathErrors = state.fieldErrors.path ?? [];
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
      className="border-border-subtle bg-surface-primary shadow-soft mt-6 rounded-3xl border p-5"
    >
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="projectSlug" value={projectSlug} />
      <input type="hidden" name="type" value="typography" />
      <input type="hidden" name="value" value={serializedTypographyValue} />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">
            {labels.title}
          </h2>

          <p className="text-content-secondary mt-2 max-w-2xl text-sm leading-6">
            {labels.description}
          </p>
        </div>

        <button
          type="button"
          onClick={onCancel}
          className="border-border-subtle text-content-secondary hover:text-content-primary rounded-xl border px-3 py-2 text-sm font-semibold"
        >
          {labels.cancel}
        </button>
      </div>

      <div className="mt-5 grid gap-4">
        <div>
          <label
            htmlFor="create-typography-token-path"
            className="text-content-tertiary text-xs font-semibold tracking-[0.16em] uppercase"
          >
            {labels.pathLabel}
          </label>

          <input
            id="create-typography-token-path"
            name="path"
            defaultValue={state.values.path}
            aria-invalid={pathErrors.length > 0}
            className="border-border-subtle bg-background-subtle focus:border-action-primary mt-2 w-full rounded-xl border px-3 py-2 font-mono text-sm outline-none"
            placeholder={labels.pathPlaceholder}
          />

          {pathErrors.length > 0 ? (
            <ul className="text-action-danger mt-2 grid gap-1 text-xs font-semibold">
              {pathErrors.map((error) => (
                <li key={error}>{labels.fieldErrors[error] ?? error}</li>
              ))}
            </ul>
          ) : null}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="create-typography-font-family"
              className="text-content-tertiary text-xs font-semibold tracking-[0.16em] uppercase"
            >
              {labels.fontFamilyLabel}
            </label>

            <input
              id="create-typography-font-family"
              value={typographyValues.fontFamily}
              onChange={(event) =>
                updateTypographyField('fontFamily', event.target.value)
              }
              className="border-border-subtle bg-background-subtle focus:border-action-primary mt-2 w-full rounded-xl border px-3 py-2 text-sm outline-none"
              placeholder={labels.fontFamilyPlaceholder}
            />
          </div>

          <div>
            <label
              htmlFor="create-typography-font-size"
              className="text-content-tertiary text-xs font-semibold tracking-[0.16em] uppercase"
            >
              {labels.fontSizeLabel}
            </label>

            <input
              id="create-typography-font-size"
              value={typographyValues.fontSize}
              onChange={(event) =>
                updateTypographyField('fontSize', event.target.value)
              }
              className="border-border-subtle bg-background-subtle focus:border-action-primary mt-2 w-full rounded-xl border px-3 py-2 font-mono text-sm outline-none"
              placeholder={labels.fontSizePlaceholder}
            />
          </div>

          <div>
            <label
              htmlFor="create-typography-font-weight"
              className="text-content-tertiary text-xs font-semibold tracking-[0.16em] uppercase"
            >
              {labels.fontWeightLabel}
            </label>

            <input
              id="create-typography-font-weight"
              value={typographyValues.fontWeight}
              onChange={(event) =>
                updateTypographyField('fontWeight', event.target.value)
              }
              className="border-border-subtle bg-background-subtle focus:border-action-primary mt-2 w-full rounded-xl border px-3 py-2 font-mono text-sm outline-none"
              placeholder={labels.fontWeightPlaceholder}
            />
          </div>

          <div>
            <label
              htmlFor="create-typography-line-height"
              className="text-content-tertiary text-xs font-semibold tracking-[0.16em] uppercase"
            >
              {labels.lineHeightLabel}
            </label>

            <input
              id="create-typography-line-height"
              value={typographyValues.lineHeight}
              onChange={(event) =>
                updateTypographyField('lineHeight', event.target.value)
              }
              className="border-border-subtle bg-background-subtle focus:border-action-primary mt-2 w-full rounded-xl border px-3 py-2 font-mono text-sm outline-none"
              placeholder={labels.lineHeightPlaceholder}
            />
          </div>

          <div>
            <label
              htmlFor="create-typography-letter-spacing"
              className="text-content-tertiary text-xs font-semibold tracking-[0.16em] uppercase"
            >
              {labels.letterSpacingLabel}
            </label>

            <input
              id="create-typography-letter-spacing"
              value={typographyValues.letterSpacing}
              onChange={(event) =>
                updateTypographyField('letterSpacing', event.target.value)
              }
              className="border-border-subtle bg-background-subtle focus:border-action-primary mt-2 w-full rounded-xl border px-3 py-2 font-mono text-sm outline-none"
              placeholder={labels.letterSpacingPlaceholder}
            />
          </div>
        </div>

        {valueErrors.length > 0 ? (
          <ul className="text-action-danger grid gap-1 text-xs font-semibold">
            {valueErrors.map((error) => (
              <li key={error}>{labels.fieldErrors[error] ?? error}</li>
            ))}
          </ul>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="create-typography-description-en"
              className="text-content-tertiary text-xs font-semibold tracking-[0.16em] uppercase"
            >
              {labels.descriptionEnLabel}
            </label>

            <textarea
              id="create-typography-description-en"
              name="descriptionEn"
              defaultValue={state.values.descriptionEn}
              rows={3}
              className="border-border-subtle bg-background-subtle focus:border-action-primary mt-2 w-full rounded-xl border px-3 py-2 text-sm outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="create-typography-description-fr"
              className="text-content-tertiary text-xs font-semibold tracking-[0.16em] uppercase"
            >
              {labels.descriptionFrLabel}
            </label>

            <textarea
              id="create-typography-description-fr"
              name="descriptionFr"
              defaultValue={state.values.descriptionFr}
              rows={3}
              className="border-border-subtle bg-background-subtle focus:border-action-primary mt-2 w-full rounded-xl border px-3 py-2 text-sm outline-none"
            />
          </div>
        </div>
      </div>

      {state.formError ? (
        <p className="text-action-danger mt-4 text-xs font-semibold">
          {labels.formErrors[state.formError]}
        </p>
      ) : null}

      {state.status === 'success' ? (
        <p className="text-action-success mt-4 text-xs font-semibold">
          {labels.success}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className="bg-action-primary text-action-primary-content mt-5 rounded-xl px-4 py-2 text-sm font-semibold disabled:opacity-60"
      >
        {isPending ? '…' : labels.submit}
      </button>
    </form>
  );
}
