'use client';

import { useActionState, useState } from 'react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui';
import type { Locale } from '@/i18n/routing';
import { deleteProjectAction } from './delete-project.action';
import {
  initialDeleteProjectActionState,
  type DeleteProjectActionState,
  type DeleteProjectField,
} from './delete-project.state';

type DeleteProjectSectionProps = {
  locale: Locale;
  projectId: string;
  projectName: string;
  projectSlug: string;
};

function getFirstError(
  errors: DeleteProjectActionState['fieldErrors'],
  field: DeleteProjectField,
) {
  return errors[field]?.[0] ?? null;
}

export function DeleteProjectSection({
  locale,
  projectId,
  projectName,
  projectSlug,
}: DeleteProjectSectionProps) {
  const t = useTranslations('ProjectSettingsPage');
  const [isConfirming, setIsConfirming] = useState(false);
  const [confirmationName, setConfirmationName] = useState('');
  const [state, formAction, isPending] = useActionState(
    deleteProjectAction,
    initialDeleteProjectActionState,
  );

  const confirmationError = getFirstError(
    state.fieldErrors,
    'confirmationName',
  );
  const canSubmit = confirmationName === projectName && !isPending;

  function cancelConfirmation() {
    setConfirmationName('');
    setIsConfirming(false);
  }

  return (
    <section className="grid gap-6 py-8 xl:grid-cols-[minmax(12rem,0.38fr)_minmax(0,1fr)] xl:gap-12">
      <div className="max-w-sm">
        <h2 className="text-action-danger text-base font-semibold tracking-tight">
          {t('danger.title')}
        </h2>
        <p className="text-content-secondary mt-1 text-sm leading-6">
          {t('danger.description')}
        </p>
      </div>

      <div className="min-w-0">
        {!isConfirming ? (
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-content-secondary max-w-2xl text-sm leading-6">
              {t('danger.summary')}
            </p>
            <Button
              type="button"
              variant="danger"
              size="sm"
              className="shrink-0"
              onClick={() => setIsConfirming(true)}
            >
              {t('danger.request')}
            </Button>
          </div>
        ) : (
          <form action={formAction} className="max-w-2xl">
            <input type="hidden" name="locale" value={locale} />
            <input type="hidden" name="projectId" value={projectId} />
            <input type="hidden" name="projectSlug" value={projectSlug} />

            <div className="border-action-danger/30 bg-action-danger/5 rounded-md border p-4">
              <h3 className="text-sm font-semibold">
                {t('danger.confirmation.title')}
              </h3>
              <p className="text-content-secondary mt-1 text-xs leading-5">
                {t('danger.confirmation.description', { projectName })}
              </p>

              <div className="mt-5">
                <label
                  htmlFor="delete-project-name"
                  className="text-sm font-semibold"
                >
                  {t('danger.confirmation.nameLabel')}
                </label>
                <input
                  id="delete-project-name"
                  name="confirmationName"
                  type="text"
                  autoComplete="off"
                  spellCheck={false}
                  disabled={isPending}
                  value={confirmationName}
                  onChange={(event) => setConfirmationName(event.target.value)}
                  aria-invalid={Boolean(confirmationError)}
                  aria-describedby={
                    confirmationError
                      ? 'delete-project-name-error'
                      : 'delete-project-name-description'
                  }
                  className="border-border-default bg-surface-primary text-content-primary focus-visible:outline-border-focus mt-2 min-h-10 w-full rounded-md border px-3 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                />
                <p
                  id="delete-project-name-description"
                  className="text-content-tertiary mt-2 text-xs leading-5"
                >
                  {t('danger.confirmation.nameDescription', { projectName })}
                </p>
                {confirmationError ? (
                  <p
                    id="delete-project-name-error"
                    className="text-action-danger mt-2 text-xs"
                  >
                    {t(`danger.validation.${confirmationError}`)}
                  </p>
                ) : null}
              </div>

              {state.formError ? (
                <p
                  role="alert"
                  className="text-action-danger mt-4 text-xs font-semibold"
                >
                  {t(`danger.errors.${state.formError}`)}
                </p>
              ) : null}

              <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  disabled={isPending}
                  onClick={cancelConfirmation}
                >
                  {t('danger.confirmation.cancel')}
                </Button>
                <Button
                  type="submit"
                  variant="danger"
                  size="sm"
                  disabled={!canSubmit}
                >
                  {isPending
                    ? t('danger.confirmation.deleting')
                    : t('danger.confirmation.delete')}
                </Button>
              </div>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
