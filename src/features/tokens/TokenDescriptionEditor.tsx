'use client';

import { Button } from '@/components/ui';
import { useTranslations } from 'next-intl';
import type { Locale } from '@/i18n/routing';
import { useActionState, useState } from 'react';
import { updateTokenDescriptionAction } from './update-token-description.action';
import {
  initialUpdateTokenDescriptionActionState,
  type UpdateTokenDescriptionActionState,
} from './update-token-description.state';

type TokenDescriptionEditorProps = {
  locale: Locale;
  projectSlug: string;
  tokenSetType: string;
  tokenPath: string;
  initialDescriptionEn: string;
  initialDescriptionFr: string;
};

function getFirstError(
  errors: UpdateTokenDescriptionActionState['fieldErrors'],
  field: 'descriptionEn' | 'descriptionFr',
) {
  return errors[field]?.[0] ?? null;
}

export function TokenDescriptionEditor({
  locale,
  projectSlug,
  tokenSetType,
  tokenPath,
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

  const hasUnsavedChanges =
    descriptionEn !== state.values.descriptionEn ||
    descriptionFr !== state.values.descriptionFr;

  const descriptionEnError = getFirstError(state.fieldErrors, 'descriptionEn');
  const descriptionFrError = getFirstError(state.fieldErrors, 'descriptionFr');

  const isEnglishMissing = descriptionEn.trim().length === 0;
  const isFrenchMissing = descriptionFr.trim().length === 0;

  return (
    <form
      action={formAction}
      className="border-border-subtle bg-surface-primary mt-3 rounded-xl border p-3"
    >
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="projectSlug" value={projectSlug} />
      <input type="hidden" name="tokenSetType" value={tokenSetType} />
      <input type="hidden" name="tokenPath" value={tokenPath} />

      <p className="text-content-tertiary text-xs font-semibold tracking-[0.18em] uppercase">
        {t('descriptionEditor.title')}
      </p>

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
                : isEnglishMissing
                  ? `description-en-${tokenPath}-warning`
                  : undefined
            }
            className="border-border-default bg-background-subtle text-content-primary mt-1 w-full rounded-lg border px-3 py-2 text-sm"
          />

          {isEnglishMissing ? (
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
                : isFrenchMissing
                  ? `description-fr-${tokenPath}-warning`
                  : undefined
            }
            className="border-border-default bg-background-subtle text-content-primary mt-1 w-full rounded-lg border px-3 py-2 text-sm"
          />

          {isFrenchMissing ? (
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

      <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-content-tertiary text-xs">
          {t('descriptionEditor.fallbackNotice')}
        </p>

        <Button type="submit" disabled={isPending}>
          {isPending
            ? t('descriptionEditor.saving')
            : t('descriptionEditor.save')}
        </Button>
      </div>

      {state.formError ? (
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
  );
}
