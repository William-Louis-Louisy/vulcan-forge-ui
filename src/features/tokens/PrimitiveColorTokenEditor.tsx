'use client';

import { Button } from '@/components/ui';
import { useTranslations } from 'next-intl';
import type { Locale } from '@/i18n/routing';
import {
  initialUpdatePrimitiveColorTokenActionState,
  type UpdatePrimitiveColorTokenActionState,
} from './update-primitive-color-token.state';
import { useActionState, useState } from 'react';
import { primitiveColorHexPattern } from './primitive-color-token.schema';
import { usePreserveSaveContext } from '@/features/save-context/usePreserveSaveContext';
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

  const hasUnsavedChanges = draftValue !== state.values.value;

  const valueError = getFirstError(state.fieldErrors);
  const isPreviewValid = primitiveColorHexPattern.test(draftValue);

  const preserveSaveContext = usePreserveSaveContext(
    `primitive-color-token:${projectSlug}:${tokenPath}`,
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
        htmlFor={`primitive-color-${tokenPath}`}
        className="text-content-tertiary text-xs font-semibold tracking-[0.18em] uppercase"
      >
        {t('primitiveColorEditor.label')}
      </label>

      <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <span
            aria-label={t('primitiveColorEditor.previewLabel', {
              value: isPreviewValid ? draftValue : initialValue,
            })}
            role="img"
            className="border-border-subtle size-12 shrink-0 rounded-md border"
            style={{
              backgroundColor: isPreviewValid ? draftValue : initialValue,
            }}
          />

          <input
            id={`primitive-color-${tokenPath}`}
            name="value"
            value={draftValue}
            onChange={(event) => setDraftValue(event.target.value)}
            aria-invalid={Boolean(valueError)}
            aria-describedby={
              valueError
                ? `primitive-color-${tokenPath}-error`
                : `primitive-color-${tokenPath}-help`
            }
            className="border-border-subtle bg-surface-primary focus:border-action-primary w-full rounded-md border px-3 py-2 font-mono text-sm outline-none"
          />
        </div>

        <Button type="submit" disabled={isPending}>
          {isPending
            ? t('primitiveColorEditor.saving')
            : t('primitiveColorEditor.save')}
        </Button>
      </div>

      <p
        id={`primitive-color-${tokenPath}-help`}
        className="text-content-tertiary mt-2 text-xs"
      >
        {t('primitiveColorEditor.help')}
      </p>

      {valueError ? (
        <p
          id={`primitive-color-${tokenPath}-error`}
          className="text-action-danger mt-2 text-xs font-semibold"
        >
          {t(`primitiveColorEditor.validation.${valueError}`)}
        </p>
      ) : null}

      {state.formError ? (
        <p
          role="alert"
          className="text-action-danger mt-2 text-xs font-semibold"
        >
          {t(`primitiveColorEditor.validation.${state.formError}`)}
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
