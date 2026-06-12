import type { Locale } from '@/i18n/routing';
import { useActionState, useEffect, useMemo, useState } from 'react';
import { createColorTokenAction } from './create-color-token.action';
import type { PrimitiveColorTokenAliasOption } from './tokens-editor.utils';
import { initialCreateColorTokenActionState } from './create-color-token.state';
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

  const preserveSaveContext = usePreserveSaveContext(
    `create-color-token:${projectSlug}`,
  );

  const firstPrimitiveReferencePath = useMemo(
    () => primitiveColorAliasOptions[0]?.path ?? '',
    [primitiveColorAliasOptions],
  );

  useEffect(() => {
    if (state.status !== 'success') {
      return;
    }

    onCreated?.(state.values.path);
  }, [onCreated, state.status, state.values.path]);

  const pathErrors = state.fieldErrors.path ?? [];
  const valueErrors = state.fieldErrors.value ?? [];
  const referencePathErrors = state.fieldErrors.referencePath ?? [];

  return (
    <form
      action={formAction}
      onSubmitCapture={preserveSaveContext}
      className="border-border-subtle bg-surface-primary shadow-soft mt-6 rounded-3xl border p-5"
    >
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="projectSlug" value={projectSlug} />
      <input type="hidden" name="kind" value={kind} />

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

      <fieldset className="mt-5">
        <legend className="text-content-tertiary text-xs font-semibold tracking-[0.16em] uppercase">
          {labels.kindLabel}
        </legend>

        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          <label className="border-border-subtle bg-background-subtle has-checked:border-action-primary has-checked:bg-action-primary/10 rounded-2xl border p-3 text-sm font-semibold">
            <input
              type="radio"
              name="kindChoice"
              value="primitive"
              checked={kind === 'primitive'}
              onChange={() => setKind('primitive')}
              className="mr-2"
            />
            {labels.primitiveKind}
          </label>

          <label className="border-border-subtle bg-background-subtle has-checked:border-action-primary has-checked:bg-action-primary/10 rounded-2xl border p-3 text-sm font-semibold">
            <input
              type="radio"
              name="kindChoice"
              value="semantic"
              checked={kind === 'semantic'}
              onChange={() => setKind('semantic')}
              className="mr-2"
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

          <input
            id="create-token-path"
            name="path"
            defaultValue={state.values.path}
            aria-invalid={pathErrors.length > 0}
            className="border-border-subtle bg-background-subtle focus:border-action-primary mt-2 w-full rounded-xl border px-3 py-2 font-mono text-sm outline-none"
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
            <label
              htmlFor="create-token-value"
              className="text-content-tertiary text-xs font-semibold tracking-[0.16em] uppercase"
            >
              {labels.valueLabel}
            </label>

            <input
              id="create-token-value"
              name="value"
              defaultValue={state.values.value || '#000000'}
              aria-invalid={valueErrors.length > 0}
              className="border-border-subtle bg-background-subtle focus:border-action-primary mt-2 w-full rounded-xl border px-3 py-2 font-mono text-sm outline-none"
              placeholder="#0ea5e9"
            />

            {valueErrors.length > 0 ? (
              <ul className="text-action-danger mt-2 grid gap-1 text-xs font-semibold">
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

              <select
                id="create-token-reference"
                name="referencePath"
                defaultValue={
                  state.values.referencePath || firstPrimitiveReferencePath
                }
                aria-invalid={referencePathErrors.length > 0}
                className="border-border-subtle bg-background-subtle focus:border-action-primary mt-2 w-full rounded-xl border px-3 py-2 font-mono text-sm outline-none"
              >
                {primitiveColorAliasOptions.map((option) => (
                  <option key={option.path} value={option.path}>
                    {option.label}
                  </option>
                ))}
              </select>

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

            <textarea
              id="create-token-description-en"
              name="descriptionEn"
              defaultValue={state.values.descriptionEn}
              rows={3}
              className="border-border-subtle bg-background-subtle focus:border-action-primary mt-2 w-full rounded-xl border px-3 py-2 text-sm outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="create-token-description-fr"
              className="text-content-tertiary text-xs font-semibold tracking-[0.16em] uppercase"
            >
              {labels.descriptionFrLabel}
            </label>

            <textarea
              id="create-token-description-fr"
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
