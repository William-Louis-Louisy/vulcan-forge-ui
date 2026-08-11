'use client';

import { Button, ContextualHelp } from '@/components/ui';
import {
  initialUpdateTokenDescriptionActionState,
  type UpdateTokenDescriptionActionState,
} from './update-token-description.state';
import { useTranslations } from 'next-intl';
import type { Locale } from '@/i18n/routing';
import { useActionState, useState } from 'react';
import { updateTokenDescriptionAction } from './update-token-description.action';
import { usePreserveSaveContext } from '@/features/save-context/usePreserveSaveContext';
import { useActionBackedProjectSaveStatus } from '@/features/save-context/useActionBackedProjectSaveStatus';

type TokenDescriptionEditorProps = {
  locale: Locale;
  projectSlug: string;
  tokenSetType: string;
  tokenPath: string;
  sectionLabel?: string;
  descriptionRecommended?: boolean;
  initialDescriptionEn: string;
  initialDescriptionFr: string;
};

function getFirstError(
  errors: UpdateTokenDescriptionActionState['fieldErrors'],
  field: 'descriptionEn' | 'descriptionFr',
) {
  return errors[field]?.[0] ?? null;
}

function createDescriptionFingerprint(
  descriptionEn: string,
  descriptionFr: string,
) {
  return JSON.stringify({ descriptionEn, descriptionFr });
}

export function TokenDescriptionEditor({
  locale,
  projectSlug,
  tokenSetType,
  tokenPath,
  sectionLabel,
  descriptionRecommended,
  initialDescriptionEn,
  initialDescriptionFr,
}: TokenDescriptionEditorProps) {
  const t = useTranslations('TokensEditorPage');

  const [descriptionEn, setDescriptionEn] = useState(initialDescriptionEn);
  const [descriptionFr, setDescriptionFr] = useState(initialDescriptionFr);

  const [state, formAction, isPending] = useActionState(
    updateTokenDescriptionAction,
    {
      ...initialUpdateTokenDescriptionActionState,
      values: {
        descriptionEn: initialDescriptionEn,
        descriptionFr: initialDescriptionFr,
      },
    },
  );
  const sourceId = `token-description:${projectSlug}:${tokenPath}`;
  const currentFingerprint = createDescriptionFingerprint(
    descriptionEn,
    descriptionFr,
  );
  const successfulFingerprint =
    state.status === 'success'
      ? createDescriptionFingerprint(
          state.values.descriptionEn,
          state.values.descriptionFr,
        )
      : null;
  const {
    hasCurrentActionError,
    hasUnsavedChanges,
    markCurrentDraftSubmitted,
  } = useActionBackedProjectSaveStatus({
    sourceId,
    currentFingerprint,
    initialSavedFingerprint: createDescriptionFingerprint(
      initialDescriptionEn,
      initialDescriptionFr,
    ),
    actionStatus: state.status,
    successfulFingerprint,
    isPending,
  });
  const preserveSaveContext = usePreserveSaveContext(sourceId);
  const descriptionEnError = hasCurrentActionError
    ? getFirstError(state.fieldErrors, 'descriptionEn')
    : null;
  const descriptionFrError = hasCurrentActionError
    ? getFirstError(state.fieldErrors, 'descriptionFr')
    : null;
  const shouldRecommendDescription =
    descriptionRecommended ??
    (tokenSetType === 'color' && tokenPath.startsWith('color.semantic.'));
  const showEnglishWarning =
    shouldRecommendDescription && descriptionEn.trim().length === 0;
  const showFrenchWarning =
    shouldRecommendDescription && descriptionFr.trim().length === 0;
  const descriptionHelp = t('descriptionEditor.fallbackNotice');

  function handleSubmitCapture() {
    markCurrentDraftSubmitted();
    preserveSaveContext();
  }

  return (
    <div className="mt-4">
      {sectionLabel ? (
        <div className="flex items-center gap-1.5">
          <p className="text-content-tertiary text-xs font-semibold tracking-[0.16em] uppercase">
            {sectionLabel}
          </p>
          <ContextualHelp
            content={descriptionHelp}
            ariaLabel={`${sectionLabel}: ${descriptionHelp}`}
          />
        </div>
      ) : null}

      <form
        action={formAction}
        onSubmitCapture={handleSubmitCapture}
        className="border-border-subtle border-b pb-2"
      >
        <input type="hidden" name="locale" value={locale} />
        <input type="hidden" name="projectSlug" value={projectSlug} />
        <input type="hidden" name="tokenSetType" value={tokenSetType} />
        <input type="hidden" name="tokenPath" value={tokenPath} />

        <div className="mt-3 grid gap-3">
          <div>
            <label
              htmlFor={`description-en-${tokenPath}`}
              className="text-content-secondary text-xs font-semibold"
            >
              {t('descriptionEditor.fields.en')}
            </label>

            <textarea
              id={`description-en-${tokenPath}`}
              name="descriptionEn"
              rows={3}
              value={descriptionEn}
              onChange={(event) => setDescriptionEn(event.target.value)}
              aria-invalid={Boolean(descriptionEnError)}
              aria-describedby={
                descriptionEnError
                  ? `description-en-${tokenPath}-error`
                  : showEnglishWarning
                    ? `description-en-${tokenPath}-warning`
                    : undefined
              }
              className="border-border-subtle bg-surface-primary focus:border-action-primary mt-1 w-full rounded-md border px-3 py-2 font-mono text-sm outline-none"
            />

            {showEnglishWarning ? (
              <p
                id={`description-en-${tokenPath}-warning`}
                className="text-action-warning mt-1 text-xs font-semibold"
              >
                {t('descriptionEditor.missingLanguage')}
              </p>
            ) : null}

            {descriptionEnError ? (
              <p
                id={`description-en-${tokenPath}-error`}
                className="text-action-danger mt-1 text-xs font-semibold"
              >
                {t(`descriptionEditor.validation.${descriptionEnError}`)}
              </p>
            ) : null}
          </div>

          <div>
            <label
              htmlFor={`description-fr-${tokenPath}`}
              className="text-content-secondary text-xs font-semibold"
            >
              {t('descriptionEditor.fields.fr')}
            </label>

            <textarea
              id={`description-fr-${tokenPath}`}
              name="descriptionFr"
              rows={3}
              value={descriptionFr}
              onChange={(event) => setDescriptionFr(event.target.value)}
              aria-invalid={Boolean(descriptionFrError)}
              aria-describedby={
                descriptionFrError
                  ? `description-fr-${tokenPath}-error`
                  : showFrenchWarning
                    ? `description-fr-${tokenPath}-warning`
                    : undefined
              }
              className="border-border-subtle bg-surface-primary focus:border-action-primary mt-1 w-full rounded-md border px-3 py-2 font-mono text-sm outline-none"
            />

            {showFrenchWarning ? (
              <p
                id={`description-fr-${tokenPath}-warning`}
                className="text-action-warning mt-1 text-xs font-semibold"
              >
                {t('descriptionEditor.missingLanguage')}
              </p>
            ) : null}

            {descriptionFrError ? (
              <p
                id={`description-fr-${tokenPath}-error`}
                className="text-action-danger mt-1 text-xs font-semibold"
              >
                {t(`descriptionEditor.validation.${descriptionFrError}`)}
              </p>
            ) : null}
          </div>
        </div>

        {!sectionLabel ? (
          <p className="text-content-tertiary mt-3 text-xs">
            {descriptionHelp}
          </p>
        ) : null}

        <div className="mt-1 flex justify-end">
          <Button
            type="submit"
            size="sm"
            disabled={isPending || !hasUnsavedChanges}
          >
            {isPending
              ? t('descriptionEditor.saving')
              : t('descriptionEditor.save')}
          </Button>
        </div>

        {hasCurrentActionError && state.formError ? (
          <p
            role="alert"
            className="text-action-danger mt-2 text-xs font-semibold"
          >
            {t(`descriptionEditor.validation.${state.formError}`)}
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
    </div>
  );
}
