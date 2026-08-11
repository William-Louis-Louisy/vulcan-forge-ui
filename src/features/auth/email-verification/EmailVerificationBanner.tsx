'use client';

import { EnvelopeSimple, XIcon } from '@phosphor-icons/react';
import { useTranslations } from 'next-intl';
import {
  createContext,
  useActionState,
  useContext,
  useState,
  type ReactNode,
} from 'react';
import { Button } from '@/components/ui';
import type { Locale } from '@/i18n/routing';
import { resendEmailVerificationAction } from './resend-email-verification.action';
import { initialResendEmailVerificationActionState } from './resend-email-verification.state';

type EmailVerificationNoticeContextValue = {
  isOpen: boolean;
  close: () => void;
  toggle: () => void;
};

const EmailVerificationNoticeContext =
  createContext<EmailVerificationNoticeContextValue | null>(null);

function useEmailVerificationNotice() {
  const context = useContext(EmailVerificationNoticeContext);

  if (!context) {
    throw new Error(
      'Email verification notice controls must be rendered inside EmailVerificationNoticeProvider.',
    );
  }

  return context;
}

export function EmailVerificationNoticeProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <EmailVerificationNoticeContext.Provider
      value={{
        isOpen,
        close: () => setIsOpen(false),
        toggle: () => setIsOpen((current) => !current),
      }}
    >
      {children}
    </EmailVerificationNoticeContext.Provider>
  );
}

export function EmailVerificationTopbarTrigger() {
  const t = useTranslations('AppShell.emailVerification');
  const { isOpen, toggle } = useEmailVerificationNotice();
  const label = isOpen ? t('hide') : t('show');

  return (
    <Button
      type="button"
      size="sm"
      variant="ghost"
      aria-label={label}
      aria-pressed={isOpen}
      title={label}
      onClick={toggle}
      className="text-action-warning relative min-w-9 px-2"
    >
      <EnvelopeSimple aria-hidden="true" size={18} weight="duotone" />
      <span
        aria-hidden="true"
        className="bg-action-warning absolute top-1.5 right-1.5 size-1.5 rounded-full"
      />
    </Button>
  );
}

export function EmailVerificationBanner({ locale }: { locale: Locale }) {
  const t = useTranslations('AppShell.emailVerification');
  const feedbackT = useTranslations('EmailVerificationPage.feedback');
  const { close, isOpen } = useEmailVerificationNotice();
  const [state, formAction, isPending] = useActionState(
    resendEmailVerificationAction,
    initialResendEmailVerificationActionState,
  );
  const isPositive =
    state.status === 'sent' || state.status === 'alreadyVerified';

  if (!isOpen) {
    return null;
  }

  return (
    <section
      aria-label={t('title')}
      className="border-action-warning/30 bg-surface-primary text-content-primary shadow-elevated fixed right-4 bottom-4 left-4 z-70 rounded-lg border p-4 sm:left-auto sm:w-[28rem]"
    >
      <div className="flex min-w-0 items-start gap-3">
        <EnvelopeSimple
          aria-hidden="true"
          className="text-action-warning mt-0.5 size-5 shrink-0"
          weight="duotone"
        />

        <div className="min-w-0 flex-1">
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

        <Button
          type="button"
          size="sm"
          variant="ghost"
          aria-label={t('dismiss')}
          title={t('dismiss')}
          onClick={close}
          className="-mt-1 -mr-1 min-w-9 shrink-0 px-2"
        >
          <XIcon aria-hidden="true" size={16} />
        </Button>
      </div>

      <form action={formAction} className="mt-4 flex justify-end">
        <input type="hidden" name="locale" value={locale} />
        <Button
          type="submit"
          size="sm"
          variant="secondary"
          disabled={isPending}
        >
          {isPending ? t('resending') : t('resend')}
        </Button>
      </form>
    </section>
  );
}
