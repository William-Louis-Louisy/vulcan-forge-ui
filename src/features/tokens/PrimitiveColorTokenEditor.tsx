'use client';

import { Button } from '@/components/ui';
import { useTranslations } from 'next-intl';
import type { Locale } from '@/i18n/routing';
import {
  initialUpdatePrimitiveColorTokenActionState,
  type UpdatePrimitiveColorTokenActionState,
} from './update-primitive-color-token.state';
import { useActionState, useState } from 'react';
import { ColorPickerField } from './ColorPickerField';
import { primitiveColorHexPattern } from './primitive-color-token.schema';
import { usePreserveSaveContext } from '@/features/save-context/usePreserveSaveContext';
import { useActionBackedProjectSaveStatus } from '@/features/save-context/useActionBackedProjectSaveStatus';
import { updatePrimitiveColorTokenAction } from './update-primitive-color-token.action';

type PrimitiveColorTokenEditorProps = {
  locale: Locale;
  projectSlug: string;
  tokenPath: string;
  initialValue: string;
};

function getFirstError(
  errors: UpdatePrimitiveColorTokenActionState['fieldErrors'],
) {
  return errors.value?.[0] ?? null;
}

export function PrimitiveColorTokenEditor({
  locale,
  projectSlug,
  tokenPath,
  initialValue,
}: PrimitiveColorTokenEditorProps) {
  const t = useTranslations('TokensEditorPage');
  const [draftValue, setDraftValue] = useState(initialValue);

  const [state, formAction, isPending] = useActionState(
    updatePrimitiveColorTokenAction,
    {
      ...initialUpdatePrimitiveColorTokenActionState,
      values: {
        value: initialValue,
      },
    },
  );
  const sourceId = `primitive-color-token:${projectSlug}:${tokenPath}`;
  const currentFingerprint = draftValue.trim();
  const isPreviewValid = primitiveColorHexPattern.test(currentFingerprint);
  const localValueError = isPreviewValid
    ? null
    : currentFingerprint.length === 0
      ? 'primitiveColorRequired'
      : 'primitiveColorHexInvalid';
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
  const submittedValueError = hasCurrentActionError
    ? getFirstError(state.fieldErrors)
    : null;
  const valueError = localValueError ?? submittedValueError;
  const helpId = `primitive-color-${tokenPath}-help`;
  const errorId = `primitive-color-${tokenPath}-error`;

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

      <ColorPickerField
        id={`primitive-color-${tokenPath}`}
        name="value"
        label={t('primitiveColorEditor.label')}
        locale={locale}
        value={draftValue}
        onValueChange={setDraftValue}
        fallbackValue={initialValue}
        invalid={Boolean(valueError)}
        disabled={isPending}
        ariaDescribedBy={valueError ? `${helpId} ${errorId}` : helpId}
      />

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isPending || !hasUnsavedChanges || Boolean(localValueError)}
        >
          {isPending
            ? t('primitiveColorEditor.saving')
            : t('primitiveColorEditor.save')}
        </Button>
      </div>

      <p id={helpId} className="text-content-tertiary mt-2 text-xs">
        {t('primitiveColorEditor.help')}
      </p>

      {valueError ? (
        <p
          id={errorId}
          className="text-action-danger mt-2 text-xs font-semibold"
        >
          {t(`primitiveColorEditor.validation.${valueError}`)}
        </p>
      ) : null}

      {hasCurrentActionError && state.formError ? (
        <p
          role="alert"
          className="text-action-danger mt-2 text-xs font-semibold"
        >
          {t(`primitiveColorEditor.validation.${state.formError}`)}
        </p>
      ) : null}

      {hasUnsavedChanges && !localValueError ? (
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
