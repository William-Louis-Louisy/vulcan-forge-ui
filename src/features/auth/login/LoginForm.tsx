'use client';

import { useActionState } from 'react';
import { useTranslations } from 'next-intl';
import { AppLink } from '@/components/navigation/AppLink';
import { Button, Input } from '@/components/ui';
import type { Locale } from '@/i18n/routing';
import { loginAction } from './login.action';
import { initialLoginActionState, type LoginActionState } from './login.state';

type LoginFormProps = {
  locale: Locale;
  registered?: boolean;
  authenticationRequired?: boolean;
};

function getFirstError(
  errors: LoginActionState['fieldErrors'] | undefined,
  field: 'email' | 'password',
) {
  return errors?.[field]?.[0] ?? null;
}

export function LoginForm({
  locale,
  registered = false,
  authenticationRequired = false,
}: LoginFormProps) {
  const t = useTranslations('LoginPage');
  const errorT = useTranslations('ErrorSurfaces');
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

      {authenticationRequired ? (
        <div
          role="status"
          className="border-action-info/30 bg-action-info/10 rounded-md border px-4 py-3"
        >
          <p className="text-action-info text-sm font-semibold">
            {errorT('authenticationRequired.title')}
          </p>
          <p className="text-content-secondary mt-1 text-sm leading-6">
            {errorT('authenticationRequired.description')}
          </p>
        </div>
      ) : null}

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
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          defaultValue={safeState.values.email}
          invalid={Boolean(emailError)}
          aria-describedby={emailError ? 'email-error' : undefined}
          className="mt-2"
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
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          invalid={Boolean(passwordError)}
          aria-describedby={passwordError ? 'password-error' : undefined}
          className="mt-2"
        />
        {passwordError ? (
          <p id="password-error" className="text-action-danger mt-2 text-sm">
            {t(`validation.${passwordError}`)}
          </p>
        ) : null}
        <div className="mt-3 text-right">
          <AppLink
            href="/forgot-password"
            className="text-action-accent text-sm font-semibold"
          >
            {t('form.forgotPassword')}
          </AppLink>
        </div>
      </div>

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? t('form.submitPending') : t('form.submit')}
      </Button>
    </form>
  );
}
