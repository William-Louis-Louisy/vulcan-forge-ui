'use client';

import { useActionState } from 'react';
import { Button } from '@/components/ui';
import { useTranslations } from 'next-intl';
import type { Locale } from '@/i18n/routing';
import { saveAccessibilityReportAction } from './save-accessibility-report.action';
import { usePreserveSaveContext } from '@/features/save-context/usePreserveSaveContext';
import { initialSaveAccessibilityReportActionState } from './save-accessibility-report.state';

type SaveAccessibilityReportButtonProps = {
  locale: Locale;
  projectSlug: string;
};

export function SaveAccessibilityReportButton({
  locale,
  projectSlug,
}: SaveAccessibilityReportButtonProps) {
  const t = useTranslations('AccessibilityCenterPage');

  const [state, formAction, isPending] = useActionState(
    saveAccessibilityReportAction,
    initialSaveAccessibilityReportActionState,
  );

  const preserveSaveContext = usePreserveSaveContext(
    `accessibility-report:${projectSlug}`,
  );

  return (
    <form
      action={formAction}
      onSubmitCapture={preserveSaveContext}
      className="border-border-subtle bg-surface-primary shadow-soft rounded-3xl border p-5"
    >
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="projectSlug" value={projectSlug} />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">
            {t('saveReport.title')}
          </h2>
          <p className="text-content-secondary mt-2 text-sm leading-6">
            {t('saveReport.description')}
          </p>
        </div>

        <Button type="submit" disabled={isPending}>
          {isPending ? t('saveReport.saving') : t('saveReport.action')}
        </Button>
      </div>

      {state.status === 'success' && state.savedReport ? (
        <p
          role="status"
          className="text-action-success mt-4 text-sm font-semibold"
        >
          {t('saveReport.success', {
            score: state.savedReport.score,
            status: state.savedReport.status,
          })}
        </p>
      ) : null}

      {state.formError ? (
        <p
          role="alert"
          className="text-action-danger mt-4 text-sm font-semibold"
        >
          {t(`saveReport.errors.${state.formError}`)}
        </p>
      ) : null}
    </form>
  );
}
