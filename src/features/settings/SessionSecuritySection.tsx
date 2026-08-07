'use client';

import { useActionState } from 'react';

import { Button } from '@/components/ui';
import type { Locale } from '@/i18n/routing';
import { logoutAllSessionsAction } from './logout-all-sessions.action';
import { getSessionSecurityMessages } from './session-security.messages';
import { initialLogoutAllSessionsActionState } from './session-security.state';

type SessionSecuritySectionProps = {
  locale: Locale;
};

export function SessionSecuritySection({ locale }: SessionSecuritySectionProps) {
  const messages = getSessionSecurityMessages(locale);
  const [state, formAction, isPending] = useActionState(
    logoutAllSessionsAction,
    initialLogoutAllSessionsActionState,
  );

  return (
    <section className="border-border-subtle grid gap-6 border-b py-8 xl:grid-cols-[minmax(12rem,0.38fr)_minmax(0,1fr)] xl:gap-12">
      <div className="max-w-sm">
        <h2 className="text-base font-semibold tracking-tight">
          {messages.title}
        </h2>
        <p className="text-content-secondary mt-1 text-sm leading-6">
          {messages.description}
        </p>
      </div>

      <div className="min-w-0">
        <form action={formAction} className="max-w-2xl">
          <p className="text-content-secondary text-sm leading-6">
            {messages.summary}
          </p>

          {state.formError ? (
            <p role="alert" className="text-action-danger mt-3 text-xs font-semibold">
              {messages.error}
            </p>
          ) : null}

          <div className="mt-4">
            <Button
              type="submit"
              variant="secondary"
              size="sm"
              disabled={isPending}
            >
              {isPending ? messages.pending : messages.action}
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}
