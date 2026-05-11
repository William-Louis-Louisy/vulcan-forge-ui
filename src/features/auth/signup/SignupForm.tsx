'use client';

import { useActionState } from 'react';
import { Button } from '@/components/ui';
import { useTranslations } from 'next-intl';
import type { Locale } from '@/i18n/routing';
import { signupAction } from './signup.action';
import {
  initialSignupActionState,
  type SignupActionState,
} from './signup.state';

type SignupFormProps = {
  locale: Locale;
};

function getFirstError(
  errors: SignupActionState['fieldErrors'] | undefined,
  field: 'name' | 'email' | 'password',
) {
  return errors?.[field]?.[0] ?? null;
}

export function SignupForm({ locale }: SignupFormProps) {
  const t = useTranslations('SignupPage');
  const [state, formAction, isPending] = useActionState(
    signupAction,
    initialSignupActionState,
  );

  const safeState = state ?? initialSignupActionState;

  const nameError = getFirstError(safeState.fieldErrors, 'name');
  const emailError = getFirstError(safeState.fieldErrors, 'email');
  const passwordError = getFirstError(safeState.fieldErrors, 'password');

  return (
    <form action={formAction} className="mt-8 space-y-5">
      <input type="hidden" name="locale" value={locale} />

      {safeState.formError ? (
        <p
          role="alert"
          className="border-action-danger/30 bg-action-danger/10 text-action-danger rounded-lg border px-4 py-3 text-sm"
        >
          {t(`validation.${safeState.formError}`)}
        </p>
      ) : null}

      <div>
        <label htmlFor="name" className="text-sm font-medium">
          {t('form.nameLabel')}
        </label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          defaultValue={safeState.values.name}
          aria-invalid={Boolean(nameError)}
          aria-describedby={nameError ? 'name-error' : undefined}
          className="border-border-default bg-surface-primary text-content-primary mt-2 min-h-11 w-full rounded-lg border px-3"
        />
        {nameError ? (
          <p id="name-error" className="text-action-danger mt-2 text-sm">
            {t(`validation.${nameError}`)}
          </p>
        ) : null}
      </div>

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
          className="border-border-default bg-surface-primary text-content-primary mt-2 min-h-11 w-full rounded-lg border px-3"
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
          autoComplete="new-password"
          aria-invalid={Boolean(passwordError)}
          aria-describedby={passwordError ? 'password-error' : 'password-help'}
          className="border-border-default bg-surface-primary text-content-primary mt-2 min-h-11 w-full rounded-lg border px-3"
        />
        <p id="password-help" className="text-content-tertiary mt-2 text-sm">
          {t('form.passwordHelp')}
        </p>
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
