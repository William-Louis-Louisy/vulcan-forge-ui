'use client';

import { useActionState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui';
import type { Locale } from '@/i18n/routing';
import { resendEmailVerificationAction } from './resend-email-verification.action';
import { initialResendEmailVerificationActionState } from './resend-email-verification.state';

export function ResendEmailVerificationForm({ locale }: { locale: Locale }) {
  const t = useTranslations('EmailVerificationPage');
  const [state, formAction, isPending] = useActionState(
    resendEmailVerificationAction,
    initialResendEmailVerificationActionState,
  );
  const isPositive =
    state.status === 'sent' || state.status === 'alreadyVerified';

  return (
    <form action={formAction} className="mt-6">
      <input type="hidden" name="locale" value={locale} />

      {state.status !== 'idle' ? (
        <p
          role={isPositive ? 'status' : 'alert'}
          className={`mb-4 rounded-md border px-4 py-3 text-sm ${
            isPositive
              ? 'border-action-success/30 bg-action-success/10 text-action-success'
              : 'border-action-danger/30 bg-action-danger/10 text-action-danger'
          }`}
        >
          {t(`feedback.${state.status}`)}
        </p>
      ) : null}

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? t('actions.resending') : t('actions.resend')}
      </Button>
    </form>
  );
}
