'use client';

import { useTranslations } from 'next-intl';
import type { Locale } from '@/i18n/routing';
import {
  initialUpdateSemanticColorTokenActionState,
  type UpdateSemanticColorTokenActionState,
} from './update-semantic-color-token.state';
import { useActionState, useEffect, useMemo, useState } from 'react';
import type { PrimitiveColorTokenAliasOption } from './tokens-editor.utils';
import { Button, Select } from '@/components/ui';
import { updateSemanticColorTokenAction } from './update-semantic-color-token.action';
import { usePreserveSaveContext } from '@/features/save-context/usePreserveSaveContext';
import { useActionBackedProjectSaveStatus } from '@/features/save-context/useActionBackedProjectSaveStatus';

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
  const sourceId = `semantic-color-token:${projectSlug}:${tokenPath}`;

  const selectedOption = useMemo(
    () => primitiveOptions.find((option) => option.path === referencePath),
    [primitiveOptions, referencePath],
  );
  const hasPrimitiveOptions = primitiveOptions.length > 0;
  const successfulFingerprint =
    state.status === 'success' ? state.values.referencePath : null;
  const {
    hasCurrentActionError,
    hasUnsavedChanges,
    markCurrentDraftSubmitted,
  } = useActionBackedProjectSaveStatus({
    sourceId,
    currentFingerprint: referencePath,
    initialSavedFingerprint: initialReferencePath,
    actionStatus: state.status,
    successfulFingerprint,
    isPending,
    hasValidationError: hasPrimitiveOptions && !selectedOption,
  });
  const preserveSaveContext = usePreserveSaveContext(sourceId);
  const previewValue = selectedOption?.value ?? resolvedColorValue;
  const referencePathError = hasCurrentActionError
    ? getFirstError(state.fieldErrors)
    : null;
  const helpId = `semantic-alias-${tokenPath}-help`;
  const errorId = `semantic-alias-${tokenPath}-error`;

  useEffect(() => {
    if (state.status === 'success') {
      setReferencePath(state.values.referencePath);
    }
  }, [state.status, state.values.referencePath]);

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
      <input type="hidden" name="tokenPath" value={tokenPath} />

      <label
        htmlFor={`semantic-alias-${tokenPath}`}
        className="text-content-tertiary text-xs font-semibold tracking-[0.18em] uppercase"
      >
        {t('semanticAliasEditor.label')}
      </label>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
        <Select
          id={`semantic-alias-${tokenPath}`}
          name="referencePath"
          value={referencePath}
          options={primitiveOptions.map((option) => ({
            value: option.path,
            label: option.label,
            description: option.value,
            swatch: option.value,
          }))}
          onValueChange={setReferencePath}
          placeholder={t('semanticAliasEditor.label')}
          disabled={!hasPrimitiveOptions || isPending}
          invalid={Boolean(referencePathError)}
          ariaDescribedBy={referencePathError ? errorId : helpId}
          textMode="technical"
          className="flex-1"
        />

        <Button
          type="submit"
          disabled={isPending || !hasPrimitiveOptions || !hasUnsavedChanges}
          className="w-full sm:w-auto"
        >
          {isPending
            ? t('semanticAliasEditor.saving')
            : t('semanticAliasEditor.save')}
        </Button>
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

        <p id={helpId} className="text-content-tertiary text-xs">
          {hasPrimitiveOptions
            ? t('semanticAliasEditor.help')
            : t('semanticAliasEditor.noPrimitiveOptions')}
        </p>
      </div>

      {referencePathError ? (
        <p
          id={errorId}
          className="text-action-danger mt-2 text-xs font-semibold"
        >
          {t(`semanticAliasEditor.validation.${referencePathError}`)}
        </p>
      ) : null}

      {hasCurrentActionError && state.formError ? (
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
