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
      className="flex min-w-0 flex-col items-end gap-2"
    >
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="projectSlug" value={projectSlug} />

      <Button type="submit" size="sm" disabled={isPending}>
        {isPending ? t('saveReport.saving') : t('saveReport.action')}
      </Button>

      {state.status === 'success' && state.savedReport ? (
        <p
          role="status"
          className="text-action-success max-w-sm text-right text-xs font-semibold"
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
          className="text-action-danger max-w-sm text-right text-xs font-semibold"
        >
          {t(`saveReport.errors.${state.formError}`)}
        </p>
      ) : null}
    </form>
  );
}
