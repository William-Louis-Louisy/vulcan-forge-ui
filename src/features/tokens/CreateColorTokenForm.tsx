import type { Locale } from '@/i18n/routing';
import { useActionState, useEffect, useState } from 'react';
import {
  Button,
  DialogActions,
  Input,
  Select,
  Textarea,
} from '@/components/ui';
import { ColorPickerField } from './ColorPickerField';
import { createColorTokenAction } from './create-color-token.action';
import type { CreateColorTokenValidationMessageKey } from './create-color-token.schema';
import { initialCreateColorTokenActionState } from './create-color-token.state';
import { primitiveColorHexPattern } from './primitive-color-token.schema';
import type { PrimitiveColorTokenAliasOption } from './tokens-editor.utils';
import { usePreserveSaveContext } from '@/features/save-context/usePreserveSaveContext';

export type CreateColorTokenFormLabels = {
  title: string;
  description: string;
  kindLabel: string;
  primitiveKind: string;
  semanticKind: string;
  pathLabel: string;
  valueLabel: string;
  referenceLabel: string;
  descriptionEnLabel: string;
  descriptionFrLabel: string;
  submit: string;
  success: string;
  cancel: string;
  fieldErrors: {
    tokenPathRequired: string;
    tokenPathInvalid: string;
    tokenValueRequired: string;
    tokenColorValueInvalid: string;
    tokenReferenceRequired: string;
    tokenReferenceInvalid: string;
  };
  formErrors: {
    unauthorized: string;
    projectNotFound: string;
    tokenSetNotFound: string;
    tokenSetMalformed: string;
    tokenValidationFailed: string;
    tokenPathAlreadyExists: string;
    primitiveReferenceNotFound: string;
    primitiveReferenceInvalid: string;
    unexpected: string;
  };
};

type CreateColorTokenFormProps = {
  locale: Locale;
  projectSlug: string;
  primitiveColorAliasOptions: PrimitiveColorTokenAliasOption[];
  labels: CreateColorTokenFormLabels;
  onCancel: () => void;
  onCreated?: (tokenPath: string) => void;
};

export function CreateColorTokenForm({
  locale,
  projectSlug,
  primitiveColorAliasOptions,
  labels,
  onCancel,
  onCreated,
}: CreateColorTokenFormProps) {
  const [kind, setKind] = useState<'primitive' | 'semantic'>('primitive');

  const [state, formAction, isPending] = useActionState(
    createColorTokenAction,
    initialCreateColorTokenActionState,
  );

  const [primitiveValue, setPrimitiveValue] = useState(
    () => state.values.value || '#000000',
  );
  const [referencePath, setReferencePath] = useState(
    () =>
      state.values.referencePath || primitiveColorAliasOptions[0]?.path || '',
  );

  const preserveSaveContext = usePreserveSaveContext(
    `create-color-token:${projectSlug}`,
  );

  useEffect(() => {
    if (state.status !== 'success') {
      return;
    }

    onCreated?.(state.values.path);
  }, [onCreated, state.status, state.values.path]);

  const pathErrors = state.fieldErrors.path ?? [];
  const submittedValueErrors = state.fieldErrors.value ?? [];
  const referencePathErrors = state.fieldErrors.referencePath ?? [];
  const trimmedPrimitiveValue = primitiveValue.trim();
  const localPrimitiveValueError: CreateColorTokenValidationMessageKey | null =
    kind !== 'primitive'
      ? null
      : trimmedPrimitiveValue.length === 0
        ? 'tokenValueRequired'
        : primitiveColorHexPattern.test(trimmedPrimitiveValue)
          ? null
          : 'tokenColorValueInvalid';
  const valueErrors: CreateColorTokenValidationMessageKey[] =
    localPrimitiveValueError
      ? [localPrimitiveValueError]
      : primitiveValue === state.values.value
        ? submittedValueErrors
        : [];
  const hasInvalidPrimitiveValue = Boolean(localPrimitiveValueError);

  return (
    <form
      action={formAction}
      onSubmitCapture={preserveSaveContext}
      className="bg-surface-primary p-5 sm:p-6"
    >
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="projectSlug" value={projectSlug} />
      <input type="hidden" name="kind" value={kind} />

      <div>
        <h2 className="text-xl font-semibold tracking-tight">{labels.title}</h2>

        <p className="text-content-secondary mt-2 max-w-2xl text-sm leading-6">
          {labels.description}
        </p>
      </div>

      <fieldset className="mt-5">
        <legend className="text-content-tertiary text-xs font-semibold tracking-[0.16em] uppercase">
          {labels.kindLabel}
        </legend>

        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          <label className="border-border-subtle bg-surface-primary has-checked:border-action-accent has-checked:bg-action-accent/10 flex cursor-pointer items-center gap-2 rounded-md border p-3 text-sm font-semibold transition">
            <input
              type="radio"
              name="kindChoice"
              value="primitive"
              checked={kind === 'primitive'}
              onChange={() => setKind('primitive')}
              className="accent-[var(--vf-action-accent)]"
            />
            {labels.primitiveKind}
          </label>

          <label className="border-border-subtle bg-surface-primary has-checked:border-action-accent has-checked:bg-action-accent/10 flex cursor-pointer items-center gap-2 rounded-md border p-3 text-sm font-semibold transition">
            <input
              type="radio"
              name="kindChoice"
              value="semantic"
              checked={kind === 'semantic'}
              onChange={() => setKind('semantic')}
              className="accent-[var(--vf-action-accent)]"
            />
            {labels.semanticKind}
          </label>
        </div>
      </fieldset>

      <div className="mt-5 grid gap-4">
        <div>
          <label
            htmlFor="create-token-path"
            className="text-content-tertiary text-xs font-semibold tracking-[0.16em] uppercase"
          >
            {labels.pathLabel}
          </label>

          <Input
            id="create-token-path"
            name="path"
            defaultValue={state.values.path}
            invalid={pathErrors.length > 0}
            textMode="technical"
            className="mt-2"
            placeholder={
              kind === 'primitive'
                ? 'color.primitive.azure.500'
                : 'color.semantic.action.background'
            }
          />

          {pathErrors.length > 0 ? (
            <ul className="text-action-danger mt-2 grid gap-1 text-xs font-semibold">
              {pathErrors.map((error) => (
                <li key={error}>{labels.fieldErrors[error]}</li>
              ))}
            </ul>
          ) : null}
        </div>

        {kind === 'primitive' ? (
          <div>
            <ColorPickerField
              id="create-token-value"
              name="value"
              label={labels.valueLabel}
              locale={locale}
              value={primitiveValue}
              onValueChange={setPrimitiveValue}
              invalid={valueErrors.length > 0}
              disabled={isPending}
              ariaDescribedBy={
                valueErrors.length > 0 ? 'create-token-value-errors' : undefined
              }
            />

            {valueErrors.length > 0 ? (
              <ul
                id="create-token-value-errors"
                className="text-action-danger mt-2 grid gap-1 text-xs font-semibold"
              >
                {valueErrors.map((error) => (
                  <li key={error}>{labels.fieldErrors[error]}</li>
                ))}
              </ul>
            ) : null}
          </div>
        ) : (
          <>
            <input type="hidden" name="value" value="semantic-reference" />

            <div>
              <label
                htmlFor="create-token-reference"
                className="text-content-tertiary text-xs font-semibold tracking-[0.16em] uppercase"
              >
                {labels.referenceLabel}
              </label>

              <Select
                id="create-token-reference"
                name="referencePath"
                value={referencePath}
                options={primitiveColorAliasOptions.map((option) => ({
                  value: option.path,
                  label: option.label,
                  description: option.value,
                  swatch: option.value,
                }))}
                onValueChange={setReferencePath}
                placeholder={labels.referenceLabel}
                disabled={primitiveColorAliasOptions.length === 0}
                invalid={referencePathErrors.length > 0}
                textMode="technical"
                className="mt-2"
              />

              {referencePathErrors.length > 0 ? (
                <ul className="text-action-danger mt-2 grid gap-1 text-xs font-semibold">
                  {referencePathErrors.map((error) => (
                    <li key={error}>{labels.fieldErrors[error]}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          </>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="create-token-description-en"
              className="text-content-tertiary text-xs font-semibold tracking-[0.16em] uppercase"
            >
              {labels.descriptionEnLabel}
            </label>

            <Textarea
              id="create-token-description-en"
              name="descriptionEn"
              defaultValue={state.values.descriptionEn}
              rows={3}
              className="mt-2"
            />
          </div>

          <div>
            <label
              htmlFor="create-token-description-fr"
              className="text-content-tertiary text-xs font-semibold tracking-[0.16em] uppercase"
            >
              {labels.descriptionFrLabel}
            </label>

            <Textarea
              id="create-token-description-fr"
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
        <Button
          type="submit"
          disabled={isPending || hasInvalidPrimitiveValue}
          className="w-full sm:w-auto"
        >
          {isPending ? '…' : labels.submit}
        </Button>
      </DialogActions>
    </form>
  );
}
