'use client';

import { Button } from '@/components/ui';
import { useTranslations } from 'next-intl';
import type { Locale } from '@/i18n/routing';
import {
  initialUpdateSemanticColorTokenActionState,
  type UpdateSemanticColorTokenActionState,
} from './update-semantic-color-token.state';
import { useActionState, useMemo, useState } from 'react';
import type { PrimitiveColorTokenAliasOption } from './tokens-editor.utils';
import { useProjectSaveStatus } from '@/components/layout/ProjectTopbarBreadcrumb';
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
  const inputId = `semantic-alias-${tokenPath}`;

  const preserveSaveContext = usePreserveSaveContext(
    `semantic-color-token:${projectSlug}:${tokenPath}`,
  );

  useProjectSaveStatus(
    `semantic-color:${projectSlug}:${tokenPath}`,
    isPending
      ? 'saving'
      : state.formError
        ? 'error'
        : hasUnsavedChanges
          ? 'unsaved'
          : 'saved',
  );

  return (
    <form
      action={formAction}
      onSubmitCapture={preserveSaveContext}
      className="min-w-0"
      data-semantic-alias-editor={tokenPath}
    >
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="projectSlug" value={projectSlug} />
      <input type="hidden" name="tokenPath" value={tokenPath} />

      <div className="grid min-w-0 gap-3 md:grid-cols-[minmax(13rem,1.35fr)_minmax(7rem,0.65fr)_auto] md:items-center">
        <div className="min-w-0">
          <label
            htmlFor={inputId}
            className="text-content-tertiary text-[0.6875rem] font-semibold tracking-[0.14em] uppercase md:sr-only"
          >
            {t('semanticAliasEditor.label')}
          </label>

          <select
            id={inputId}
            name="referencePath"
            value={referencePath}
            onChange={(event) => setReferencePath(event.target.value)}
            disabled={!hasPrimitiveOptions || isPending}
            aria-invalid={Boolean(referencePathError)}
            aria-describedby={
              referencePathError
                ? `${inputId}-error`
                : `${inputId}-help`
            }
            className="border-border-default bg-surface-primary text-content-primary mt-1 min-h-10 w-full min-w-0 rounded-md border px-3 font-mono text-xs outline-none focus:border-action-primary md:mt-0"
          >
            {primitiveOptions.map((option) => (
              <option key={option.path} value={option.path}>
                {option.label} — {option.value}
              </option>
            ))}
          </select>

          <p
            id={`${inputId}-help`}
            className="text-content-tertiary mt-1 min-w-0 truncate font-mono text-[0.6875rem]"
          >
            {hasPrimitiveOptions
              ? referencePath
                ? `{${referencePath}}`
                : t('semanticAliasEditor.help')
              : t('semanticAliasEditor.noPrimitiveOptions')}
          </p>
        </div>

        <div className="min-w-0">
          <p className="text-content-tertiary text-[0.6875rem] font-semibold tracking-[0.14em] uppercase md:sr-only">
            {t('semanticAliasEditor.previewLabel', {
              value: previewValue ?? '—',
            })}
          </p>
          <div className="mt-1 flex min-w-0 items-center gap-2 md:mt-0">
            {previewValue ? (
              <span
                role="img"
                aria-label={t('semanticAliasEditor.previewLabel', {
                  value: previewValue,
                })}
                className="border-border-subtle size-5 shrink-0 rounded-full border"
                style={{ backgroundColor: previewValue }}
              />
            ) : (
              <span className="border-border-default size-5 shrink-0 rounded-full border border-dashed" />
            )}
            <span className="text-content-secondary min-w-0 truncate font-mono text-xs">
              {previewValue ?? '—'}
            </span>
          </div>
        </div>

        <div className="flex min-w-0 items-center justify-between gap-3 md:justify-end">
          <span
            className={[
              'shrink-0 rounded-full px-2 py-1 text-[0.6875rem] font-semibold',
              hasUnsavedChanges
                ? 'bg-action-warning/10 text-action-warning'
                : 'bg-action-success/10 text-action-success',
            ].join(' ')}
          >
            {hasUnsavedChanges
              ? t('saveStatus.unsaved')
              : t('saveStatus.saved')}
          </span>

          <Button
            type="submit"
            size="sm"
            disabled={
              isPending || !hasPrimitiveOptions || !hasUnsavedChanges
            }
            className="shrink-0"
          >
            {isPending
              ? t('semanticAliasEditor.saving')
              : t('semanticAliasEditor.save')}
          </Button>
        </div>
      </div>

      {referencePathError ? (
        <p
          id={`${inputId}-error`}
          className="text-action-danger mt-2 text-xs font-semibold"
        >
          {t(`semanticAliasEditor.validation.${referencePathError}`)}
        </p>
      ) : null}

      {state.formError ? (
        <p role="alert" className="text-action-danger mt-2 text-xs font-semibold">
          {t(`semanticAliasEditor.validation.${state.formError}`)}
        </p>
      ) : null}

      {state.status === 'success' && !hasUnsavedChanges ? (
        <p role="status" className="sr-only">
          {t('saveStatus.saved')}
        </p>
      ) : null}
    </form>
  );
}
