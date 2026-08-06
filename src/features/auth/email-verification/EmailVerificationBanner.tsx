'use client';

import { EnvelopeSimple } from '@phosphor-icons/react';
import { useTranslations } from 'next-intl';
import { useActionState } from 'react';
import { Button } from '@/components/ui';
import type { Locale } from '@/i18n/routing';
import { resendEmailVerificationAction } from './resend-email-verification.action';
import { initialResendEmailVerificationActionState } from './resend-email-verification.state';

export function EmailVerificationBanner({ locale }: { locale: Locale }) {
  const t = useTranslations('AppShell.emailVerification');
  const feedbackT = useTranslations('EmailVerificationPage.feedback');
  const [state, formAction, isPending] = useActionState(
    resendEmailVerificationAction,
    initialResendEmailVerificationActionState,
  );
  const isPositive =
    state.status === 'sent' || state.status === 'alreadyVerified';

  return (
    <section
      aria-label={t('title')}
      className="border-action-warning/30 bg-action-warning/10 text-content-primary border-b px-4 py-3 sm:px-6 lg:px-8"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <EnvelopeSimple
            aria-hidden="true"
            className="text-action-warning mt-0.5 size-5 shrink-0"
            weight="duotone"
          />

          <div className="min-w-0">
            <p className="text-sm font-semibold">{t('title')}</p>
            <p className="text-content-secondary mt-1 text-sm leading-6">
              {t('description')}
            </p>

            {state.status !== 'idle' ? (
              <p
                role={isPositive ? 'status' : 'alert'}
                className={`mt-2 text-sm font-medium ${
                  isPositive ? 'text-action-success' : 'text-action-danger'
                }`}
              >
                {feedbackT(state.status)}
              </p>
            ) : null}
          </div>
        </div>

        <form action={formAction} className="shrink-0">
          <input type="hidden" name="locale" value={locale} />
          <Button
            type="submit"
            size="sm"
            variant="secondary"
            disabled={isPending}
            className="w-full sm:w-auto"
          >
            {isPending ? t('resending') : t('resend')}
          </Button>
        </form>
      </div>
    </section>
  );
}
