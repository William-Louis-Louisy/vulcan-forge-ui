'use client';

import { useActionState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui';
import type { Locale } from '@/i18n/routing';
import { loginAction } from './login.action';
import { initialLoginActionState, type LoginActionState } from './login.state';

type LoginFormProps = {
  locale: Locale;
  registered?: boolean;
};

const inputClassName =
  'border-border-subtle bg-surface-primary text-content-primary focus:border-action-primary mt-2 w-full rounded-md border px-3 py-2 outline-none transition';

function getFirstError(
  errors: LoginActionState['fieldErrors'] | undefined,
  field: 'email' | 'password',
) {
  return errors?.[field]?.[0] ?? null;
}

export function LoginForm({ locale, registered = false }: LoginFormProps) {
  const t = useTranslations('LoginPage');
  const [state, formAction, isPending] = useActionState(
    loginAction,
    initialLoginActionState,
  );

  const safeState = state ?? initialLoginActionState;
  const emailError = getFirstError(safeState.fieldErrors, 'email');
  const passwordError = getFirstError(safeState.fieldErrors, 'password');

  return (
    <form action={formAction} className="mt-8 space-y-5">
      <input type="hidden" name="locale" value={locale} />

      {registered ? (
        <p
          role="status"
          className="border-action-success/30 bg-action-success/10 text-action-success rounded-md border px-4 py-3 text-sm"
        >
          {t('registeredSuccess')}
        </p>
      ) : null}

      {safeState.formError ? (
        <p
          role="alert"
          className="border-action-danger/30 bg-action-danger/10 text-action-danger rounded-md border px-4 py-3 text-sm"
        >
          {t(`validation.${safeState.formError}`)}
        </p>
      ) : null}

      <div>
        <label htmlFor="email" className="text-sm font-medium">
          {t('form.emailLabel')}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          defaultValue={safeState.values.email}
          aria-invalid={Boolean(emailError)}
          aria-describedby={emailError ? 'email-error' : undefined}
          className={inputClassName}
        />
        {emailError ? (
          <p id="email-error" className="text-action-danger mt-2 text-sm">
            {t(`validation.${emailError}`)}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="password" className="text-sm font-medium">
          {t('form.passwordLabel')}
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          aria-invalid={Boolean(passwordError)}
          aria-describedby={passwordError ? 'password-error' : undefined}
          className={inputClassName}
        />
        {passwordError ? (
          <p id="password-error" className="text-action-danger mt-2 text-sm">
            {t(`validation.${passwordError}`)}
          </p>
        ) : null}
      </div>

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? t('form.submitPending') : t('form.submit')}
      </Button>
    </form>
  );
}
