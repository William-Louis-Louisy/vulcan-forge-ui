'use client';

import { useTranslations } from 'next-intl';
import type { Locale } from '@/i18n/routing';
import {
  initialUpdateSemanticColorTokenActionState,
  type UpdateSemanticColorTokenActionState,
} from './update-semantic-color-token.state';
import { useActionState, useMemo, useState } from 'react';
import type { PrimitiveColorTokenAliasOption } from './tokens-editor.utils';
import { updateSemanticColorTokenAction } from './update-semantic-color-token.action';
import { usePreserveSaveContext } from '@/features/save-context/usePreserveSaveContext';

type SemanticColorTokenAliasEditorProps = {
  locale: Locale;
  projectSlug: string;
  tokenPath: string;
  initialReferencePath: string;
  resolvedColorValue: string | null;
  primitiveOptions: PrimitiveColorTokenAliasOption[];
};

function getFirstError(
  errors: UpdateSemanticColorTokenActionState['fieldErrors'],
) {
  return errors.referencePath?.[0] ?? null;
}

export function SemanticColorTokenAliasEditor({
  locale,
  projectSlug,
  tokenPath,
  initialReferencePath,
  resolvedColorValue,
  primitiveOptions,
}: SemanticColorTokenAliasEditorProps) {
  const t = useTranslations('TokensEditorPage');
  const [referencePath, setReferencePath] = useState(initialReferencePath);

  const [state, formAction, isPending] = useActionState(
    updateSemanticColorTokenAction,
    {
      ...initialUpdateSemanticColorTokenActionState,
      values: {
        referencePath: initialReferencePath,
      },
    },
  );

  const hasUnsavedChanges = referencePath !== state.values.referencePath;

  const selectedOption = useMemo(
    () => primitiveOptions.find((option) => option.path === referencePath),
    [primitiveOptions, referencePath],
  );

  const previewValue = selectedOption?.value ?? resolvedColorValue;
  const referencePathError = getFirstError(state.fieldErrors);
  const hasPrimitiveOptions = primitiveOptions.length > 0;

  const preserveSaveContext = usePreserveSaveContext(
    `semantic-color-token:${projectSlug}:${tokenPath}`,
  );

  return (
    <form
      action={formAction}
      onSubmitCapture={preserveSaveContext}
      className="border-border-subtle space-y-3 border-b pb-2"
    >
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="projectSlug" value={projectSlug} />
      <input type="hidden" name="tokenPath" value={tokenPath} />

      <label
        htmlFor={`semantic-alias-${tokenPath}`}
        className="text-content-tertiary text-xs font-semibold tracking-[0.18em] uppercase"
      >
        {t('semanticAliasEditor.label')}
      </label>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <select
          id={`semantic-alias-${tokenPath}`}
          name="referencePath"
          value={referencePath}
          onChange={(event) => setReferencePath(event.target.value)}
          disabled={!hasPrimitiveOptions || isPending}
          aria-invalid={Boolean(referencePathError)}
          aria-describedby={
            referencePathError
              ? `semantic-alias-${tokenPath}-error`
              : `semantic-alias-${tokenPath}-help`
          }
          className="border-border-subtle bg-surface-primary focus:border-action-primary mt-2 w-full flex-1 rounded-md border py-2 pr-5 pl-3 font-mono text-sm outline-none"
        >
          {primitiveOptions.map((option) => (
            <option key={option.path} value={option.path}>
              {option.label}
            </option>
          ))}
        </select>

        <button
          type="submit"
          disabled={isPending || !hasPrimitiveOptions}
          className="bg-action-primary text-action-primary-content mt-2 self-end rounded-md px-4 py-2 text-sm font-semibold disabled:opacity-60"
        >
          {isPending
            ? t('semanticAliasEditor.saving')
            : t('semanticAliasEditor.save')}
        </button>
      </div>

      <div className="mt-2 flex items-center gap-2">
        {previewValue ? (
          <span
            role="img"
            aria-label={t('semanticAliasEditor.previewLabel', {
              value: previewValue,
            })}
            className="border-border-subtle size-5 rounded-full border"
            style={{ backgroundColor: previewValue }}
          />
        ) : null}

        <p
          id={`semantic-alias-${tokenPath}-help`}
          className="text-content-tertiary text-xs"
        >
          {hasPrimitiveOptions
            ? t('semanticAliasEditor.help')
            : t('semanticAliasEditor.noPrimitiveOptions')}
        </p>
      </div>

      {referencePathError ? (
        <p
          id={`semantic-alias-${tokenPath}-error`}
          className="text-action-danger mt-2 text-xs font-semibold"
        >
          {t(`semanticAliasEditor.validation.${referencePathError}`)}
        </p>
      ) : null}

      {state.formError ? (
        <p
          role="alert"
          className="text-action-danger mt-2 text-xs font-semibold"
        >
          {t(`semanticAliasEditor.validation.${state.formError}`)}
        </p>
      ) : null}

      {hasUnsavedChanges ? (
        <p
          role="status"
          className="text-action-warning mt-2 text-xs font-semibold"
        >
          {t('saveStatus.unsaved')}
        </p>
      ) : null}

      {state.status === 'success' && !hasUnsavedChanges ? (
        <p
          role="status"
          className="text-action-success mt-2 text-xs font-semibold"
        >
          {t('saveStatus.saved')}
        </p>
      ) : null}
    </form>
  );
}
