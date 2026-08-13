'use client';

// Visual design-system status only. This UI does not handle authentication tokens or credentials.
import { Button, Select, type SelectOption } from '@/components/ui';
import type { DesignTokenStatus } from '@/domain/design-system';
import { useActionBackedProjectSaveStatus } from '@/features/save-context/useActionBackedProjectSaveStatus';
import { usePreserveSaveContext } from '@/features/save-context/usePreserveSaveContext';
import type { Locale } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { useActionState, useEffect, useState } from 'react';
import type { TokenSetType } from './tokens-editor.utils';
import { updateTokenStatusAction } from './update-token-status.action';
import { initialUpdateTokenStatusActionState } from './update-token-status.state';

const designTokenStatuses = ['draft', 'ready', 'deprecated'] as const;

type TokenStatusEditorProps = {
  locale: Locale;
  projectSlug: string;
  tokenSetType: TokenSetType;
  tokenPath: string;
  initialStatus: DesignTokenStatus;
  onUpdated: (tokenPath: string) => void;
};

export function TokenStatusEditor({
  locale,
  projectSlug,
  tokenSetType,
  tokenPath,
  initialStatus,
  onUpdated,
}: TokenStatusEditorProps) {
  const t = useTranslations('TokenStatusEditor');
  const [draftStatus, setDraftStatus] =
    useState<DesignTokenStatus>(initialStatus);
  const [state, formAction, isPending] = useActionState(
    updateTokenStatusAction,
    {
      ...initialUpdateTokenStatusActionState,
      values: {
        tokenStatus: initialStatus,
      },
    },
  );
  const sourceId =
    `design-token-status:${projectSlug}:${tokenSetType}:${tokenPath}`;
  const successfulFingerprint =
    state.status === 'success' ? state.values.tokenStatus : null;
  const {
    hasCurrentActionError,
    hasUnsavedChanges,
    markCurrentDraftSubmitted,
  } = useActionBackedProjectSaveStatus({
    sourceId,
    currentFingerprint: draftStatus,
    initialSavedFingerprint: initialStatus,
    actionStatus: state.status,
    successfulFingerprint,
    isPending,
  });
  const preserveSaveContext = usePreserveSaveContext(sourceId);
  const fieldError = hasCurrentActionError
    ? (state.fieldErrors.tokenStatus?.[0] ?? null)
    : null;
  const options: readonly SelectOption<DesignTokenStatus>[] =
    designTokenStatuses.map((status) => ({
      value: status,
      label: t(`options.${status}.label`),
      description: t(`options.${status}.description`),
    }));

  useEffect(() => {
    if (state.status === 'success') {
      onUpdated(tokenPath);
    }
  }, [onUpdated, state.status, tokenPath]);

  function handleSubmitCapture() {
    markCurrentDraftSubmitted();
    preserveSaveContext();
  }

  return (
    <form
      action={formAction}
      onSubmitCapture={handleSubmitCapture}
      className="border-border-subtle border-b py-4"
    >
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="projectSlug" value={projectSlug} />
      <input type="hidden" name="tokenSetType" value={tokenSetType} />
      <input type="hidden" name="tokenPath" value={tokenPath} />

      <label
        htmlFor={`token-status-${tokenPath}`}
        className="text-content-tertiary text-xs font-semibold tracking-[0.16em] uppercase"
      >
        {t('title')}
      </label>

      <Select
        id={`token-status-${tokenPath}`}
        name="tokenStatus"
        value={draftStatus}
        options={options}
        onValueChange={setDraftStatus}
        placeholder={t('placeholder')}
        disabled={isPending}
        invalid={Boolean(fieldError)}
        size="sm"
        className="mt-2"
      />

      <div className="mt-2 flex justify-end">
        <Button
          type="submit"
          size="sm"
          disabled={isPending || !hasUnsavedChanges}
        >
          {isPending ? t('saving') : t('save')}
        </Button>
      </div>

      {fieldError ? (
        <p className="text-action-danger mt-2 text-xs font-semibold">
          {t(`fieldErrors.${fieldError}`)}
        </p>
      ) : null}

      {hasCurrentActionError && state.formError ? (
        <p
          role="alert"
          className="text-action-danger mt-2 text-xs font-semibold"
        >
          {t(`formErrors.${state.formError}`)}
        </p>
      ) : null}

      {hasUnsavedChanges ? (
        <p
          role="status"
          className="text-action-warning mt-2 text-xs font-semibold"
        >
          {t('unsaved')}
        </p>
      ) : null}

      {state.status === 'success' && !hasUnsavedChanges ? (
        <p
          role="status"
          className="text-action-success mt-2 text-xs font-semibold"
        >
          {t('saved')}
        </p>
      ) : null}
    </form>
  );
}
