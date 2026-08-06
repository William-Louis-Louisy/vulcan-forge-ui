'use client';

import { useActionState } from 'react';
import { useTranslations } from 'next-intl';
import { AppLink } from '@/components/navigation/AppLink';
import { Button, Input } from '@/components/ui';
import {
  AuthErrorSummary,
  PasswordField,
  type AuthErrorSummaryItem,
} from '@/features/auth/shared';
import type { Locale } from '@/i18n/routing';
import { loginAction } from './login.action';
import { initialLoginActionState, type LoginActionState } from './login.state';

type LoginFormProps = {
  locale: Locale;
  registered?: boolean;
  authenticationRequired?: boolean;
  returnTo: string;
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
  returnTo,
}: LoginFormProps) {
  const t = useTranslations('LoginPage');
  const passwordT = useTranslations('SignupPage.form.passwordVisibility');
  const errorT = useTranslations('ErrorSurfaces');
  const [state, formAction, isPending] = useActionState(
    loginAction,
    initialLoginActionState,
  );

  const safeState = state ?? initialLoginActionState;
  const emailError = getFirstError(safeState.fieldErrors, 'email');
  const passwordError = getFirstError(safeState.fieldErrors, 'password');
  const errorSummaryItems: AuthErrorSummaryItem[] = [];

  if (emailError) {
    errorSummaryItems.push({
      fieldId: 'login-email',
      message: t(`validation.${emailError}`),
    });
  }

  if (passwordError) {
    errorSummaryItems.push({
      fieldId: 'login-password',
      message: t(`validation.${passwordError}`),
    });
  }

  return (
    <form action={formAction} className="mt-8 space-y-5" noValidate>
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="returnTo" value={returnTo} />

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

      <AuthErrorSummary focusKey={safeState} items={errorSummaryItems} />

      <div>
        <label htmlFor="login-email" className="text-sm font-medium">
          {t('form.emailLabel')}
        </label>
        <Input
          id="login-email"
          name="email"
          type="email"
          autoComplete="username"
          inputMode="email"
          required
          defaultValue={safeState.values.email}
          invalid={Boolean(emailError)}
          aria-describedby={emailError ? 'login-email-error' : undefined}
          aria-errormessage={emailError ? 'login-email-error' : undefined}
          className="mt-2"
        />
        {emailError ? (
          <p
            id="login-email-error"
            className="text-action-danger mt-2 text-sm"
          >
            {t(`validation.${emailError}`)}
          </p>
        ) : null}
      </div>

      <div className="space-y-3">
        <PasswordField
          id="login-password"
          name="password"
          label={t('form.passwordLabel')}
          autoComplete="current-password"
          required
          error={
            passwordError ? t(`validation.${passwordError}`) : undefined
          }
          showPasswordLabel={passwordT('show')}
          hidePasswordLabel={passwordT('hide')}
        />
        <div className="text-right">
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
