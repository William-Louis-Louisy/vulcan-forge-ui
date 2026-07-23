'use client';

import { useActionState, useState } from 'react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui';
import type { Locale } from '@/i18n/routing';
import { deleteAccountAction } from './delete-account.action';
import {
  initialDeleteAccountActionState,
  type DeleteAccountActionState,
  type DeleteAccountField,
} from './delete-account.state';

type DeleteAccountSectionProps = {
  email: string;
  locale: Locale;
};

function getFirstError(
  errors: DeleteAccountActionState['fieldErrors'],
  field: DeleteAccountField,
) {
  return errors[field]?.[0] ?? null;
}

export function DeleteAccountSection({
  email,
  locale,
}: DeleteAccountSectionProps) {
  const t = useTranslations('SettingsPage');
  const [isConfirming, setIsConfirming] = useState(false);
  const [state, formAction, isPending] = useActionState(
    deleteAccountAction,
    initialDeleteAccountActionState,
  );

  const emailError = getFirstError(state.fieldErrors, 'confirmationEmail');
  const passwordError = getFirstError(state.fieldErrors, 'currentPassword');

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

            <div className="border-action-danger/30 bg-action-danger/5 rounded-md border p-4">
              <h3 className="text-sm font-semibold">
                {t('danger.confirmation.title')}
              </h3>
              <p className="text-content-secondary mt-1 text-xs leading-5">
                {t('danger.confirmation.description')}
              </p>

              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="delete-account-email"
                    className="text-sm font-semibold"
                  >
                    {t('danger.confirmation.emailLabel')}
                  </label>
                  <input
                    id="delete-account-email"
                    name="confirmationEmail"
                    type="email"
                    autoComplete="off"
                    disabled={isPending}
                    placeholder={email}
                    aria-invalid={Boolean(emailError)}
                    aria-describedby={
                      emailError
                        ? 'delete-account-email-error'
                        : 'delete-account-email-description'
                    }
                    className="border-border-default bg-surface-primary text-content-primary focus-visible:outline-border-focus mt-2 min-h-10 w-full rounded-md border px-3 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                  <p
                    id="delete-account-email-description"
                    className="text-content-tertiary mt-2 text-xs leading-5"
                  >
                    {t('danger.confirmation.emailDescription', { email })}
                  </p>
                  {emailError ? (
                    <p
                      id="delete-account-email-error"
                      className="text-action-danger mt-2 text-xs"
                    >
                      {t(`danger.validation.${emailError}`)}
                    </p>
                  ) : null}
                </div>

                <div>
                  <label
                    htmlFor="delete-account-password"
                    className="text-sm font-semibold"
                  >
                    {t('danger.confirmation.passwordLabel')}
                  </label>
                  <input
                    id="delete-account-password"
                    name="currentPassword"
                    type="password"
                    autoComplete="current-password"
                    disabled={isPending}
                    aria-invalid={Boolean(passwordError)}
                    aria-describedby={
                      passwordError
                        ? 'delete-account-password-error'
                        : undefined
                    }
                    className="border-border-default bg-surface-primary text-content-primary focus-visible:outline-border-focus mt-2 min-h-10 w-full rounded-md border px-3 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                  {passwordError ? (
                    <p
                      id="delete-account-password-error"
                      className="text-action-danger mt-2 text-xs"
                    >
                      {t(`danger.validation.${passwordError}`)}
                    </p>
                  ) : null}
                </div>
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
                  onClick={() => setIsConfirming(false)}
                >
                  {t('danger.confirmation.cancel')}
                </Button>
                <Button
                  type="submit"
                  variant="danger"
                  size="sm"
                  disabled={isPending}
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
