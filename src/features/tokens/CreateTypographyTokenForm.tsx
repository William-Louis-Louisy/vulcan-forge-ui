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
import { Button, DialogActions, Input, Textarea } from '@/components/ui';
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
  initialPath: string;
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
  initialPath,
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
      className="bg-surface-primary p-5 sm:p-6"
    >
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="projectSlug" value={projectSlug} />
      <input type="hidden" name="type" value="typography" />
      <input type="hidden" name="value" value={serializedTypographyValue} />

      <div>
        <h2 className="text-xl font-semibold tracking-tight">{labels.title}</h2>

        <p className="text-content-secondary mt-2 max-w-2xl text-sm leading-6">
          {labels.description}
        </p>
      </div>

      <div className="mt-5 grid gap-4">
        <div>
          <label
            htmlFor="create-typography-token-path"
            className="text-content-tertiary text-xs font-semibold tracking-[0.16em] uppercase"
          >
            {labels.pathLabel}
          </label>

          <Input
            id="create-typography-token-path"
            name="path"
            defaultValue={state.values.path || initialPath}
            invalid={pathErrors.length > 0}
            textMode="technical"
            className="mt-2"
            autoFocus
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
          <TypographyInput
            id="create-typography-font-family"
            label={labels.fontFamilyLabel}
            value={typographyValues.fontFamily}
            placeholder={labels.fontFamilyPlaceholder}
            onChange={(value) => updateTypographyField('fontFamily', value)}
          />
          <TypographyInput
            id="create-typography-font-size"
            label={labels.fontSizeLabel}
            value={typographyValues.fontSize}
            placeholder={labels.fontSizePlaceholder}
            onChange={(value) => updateTypographyField('fontSize', value)}
            technical
          />
          <TypographyInput
            id="create-typography-font-weight"
            label={labels.fontWeightLabel}
            value={typographyValues.fontWeight}
            placeholder={labels.fontWeightPlaceholder}
            onChange={(value) => updateTypographyField('fontWeight', value)}
            technical
          />
          <TypographyInput
            id="create-typography-line-height"
            label={labels.lineHeightLabel}
            value={typographyValues.lineHeight}
            placeholder={labels.lineHeightPlaceholder}
            onChange={(value) => updateTypographyField('lineHeight', value)}
            technical
          />
          <TypographyInput
            id="create-typography-letter-spacing"
            label={labels.letterSpacingLabel}
            value={typographyValues.letterSpacing}
            placeholder={labels.letterSpacingPlaceholder}
            onChange={(value) => updateTypographyField('letterSpacing', value)}
            technical
          />
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

            <Textarea
              id="create-typography-description-en"
              name="descriptionEn"
              defaultValue={state.values.descriptionEn}
              rows={3}
              className="mt-2"
            />
          </div>

          <div>
            <label
              htmlFor="create-typography-description-fr"
              className="text-content-tertiary text-xs font-semibold tracking-[0.16em] uppercase"
            >
              {labels.descriptionFrLabel}
            </label>

            <Textarea
              id="create-typography-description-fr"
              name="descriptionFr"
              defaultValue={state.values.descriptionFr}
              rows={3}
              className="mt-2"
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

      <DialogActions>
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          className="w-full sm:w-auto"
        >
          {labels.cancel}
        </Button>
        <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
          {isPending ? '…' : labels.submit}
        </Button>
      </DialogActions>
    </form>
  );
}

function TypographyInput({
  id,
  label,
  value,
  placeholder,
  onChange,
  technical = false,
}: {
  id: string;
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  technical?: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="text-content-tertiary text-xs font-semibold tracking-[0.16em] uppercase"
      >
        {label}
      </label>
      <Input
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        textMode={technical ? 'technical' : 'default'}
        className="mt-2"
        placeholder={placeholder}
      />
    </div>
  );
}
