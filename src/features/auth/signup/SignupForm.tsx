'use client';

import {
  initialSignupActionState,
  type SignupActionState,
} from './signup.state';
import { Button } from '@/components/ui';
import { useTranslations } from 'next-intl';
import type { Locale } from '@/i18n/routing';
import { signupAction } from './signup.action';
import { useActionState, useState } from 'react';
import { EyeIcon, EyeSlashIcon } from '@phosphor-icons/react';

type SignupFormProps = {
  locale: Locale;
};

function getFirstError(
  errors: SignupActionState['fieldErrors'] | undefined,
  field: 'name' | 'email' | 'password' | 'passwordConfirmation',
) {
  return errors?.[field]?.[0] ?? null;
}

export function SignupForm({ locale }: SignupFormProps) {
  const t = useTranslations('SignupPage');
  const [state, formAction, isPending] = useActionState(
    signupAction,
    initialSignupActionState,
  );

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isPasswordConfirmationVisible, setIsPasswordConfirmationVisible] =
    useState(false);

  const safeState = state ?? initialSignupActionState;

  const nameError = getFirstError(safeState.fieldErrors, 'name');
  const emailError = getFirstError(safeState.fieldErrors, 'email');
  const passwordError = getFirstError(safeState.fieldErrors, 'password');
  const passwordConfirmationError = getFirstError(
    safeState.fieldErrors,
    'passwordConfirmation',
  );

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

        <div className="relative mt-2 flex gap-2">
          <input
            id="password"
            name="password"
            type={isPasswordVisible ? 'text' : 'password'}
            autoComplete="new-password"
            aria-invalid={Boolean(passwordError)}
            aria-describedby={
              passwordError ? 'password-error' : 'password-help'
            }
            className="border-border-default bg-surface-primary text-content-primary min-h-11 w-full rounded-lg border pr-14 pl-3"
          />

          <button
            type="button"
            className="border-border-default text-content-primary absolute top-1/2 right-0 min-h-11 w-fit -translate-y-1/2 rounded-r-lg border px-3"
            onClick={() => setIsPasswordVisible((isVisible) => !isVisible)}
            aria-pressed={isPasswordVisible}
            aria-controls="password"
            aria-label={
              isPasswordVisible
                ? t('form.passwordVisibility.hide')
                : t('form.passwordVisibility.show')
            }
          >
            <span className="sr-only">
              {isPasswordVisible
                ? t('form.passwordVisibility.hide')
                : t('form.passwordVisibility.show')}
            </span>

            {isPasswordVisible ? (
              <EyeSlashIcon aria-hidden="true" size={18} weight="bold" />
            ) : (
              <EyeIcon aria-hidden="true" size={18} weight="bold" />
            )}
          </button>
        </div>

        <p id="password-help" className="text-content-tertiary mt-2 text-sm">
          {t('form.passwordHelp')}
        </p>

        {passwordError ? (
          <p id="password-error" className="text-action-danger mt-2 text-sm">
            {t(`validation.${passwordError}`)}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="passwordConfirmation" className="text-sm font-medium">
          {t('form.passwordConfirmationLabel')}
        </label>

        <div className="relative mt-2 flex gap-2">
          <input
            id="passwordConfirmation"
            name="passwordConfirmation"
            type={isPasswordConfirmationVisible ? 'text' : 'password'}
            autoComplete="new-password"
            aria-invalid={Boolean(passwordConfirmationError)}
            aria-describedby={
              passwordConfirmationError
                ? 'password-confirmation-error'
                : undefined
            }
            className="border-border-default bg-surface-primary text-content-primary min-h-11 w-full rounded-lg border pr-14 pl-3"
          />

          <button
            type="button"
            className="border-border-default text-content-primary absolute top-1/2 right-0 min-h-11 w-fit -translate-y-1/2 rounded-r-lg border px-3"
            onClick={() =>
              setIsPasswordConfirmationVisible((isVisible) => !isVisible)
            }
            aria-pressed={isPasswordConfirmationVisible}
            aria-controls="passwordConfirmation"
            aria-label={
              isPasswordConfirmationVisible
                ? t('form.passwordVisibility.hide')
                : t('form.passwordVisibility.show')
            }
          >
            <span className="sr-only">
              {isPasswordConfirmationVisible
                ? t('form.passwordVisibility.hide')
                : t('form.passwordVisibility.show')}
            </span>

            {isPasswordConfirmationVisible ? (
              <EyeSlashIcon aria-hidden="true" size={18} weight="bold" />
            ) : (
              <EyeIcon aria-hidden="true" size={18} weight="bold" />
            )}
          </button>
        </div>

        {passwordConfirmationError ? (
          <p
            id="password-confirmation-error"
            className="text-action-danger mt-2 text-sm"
          >
            {t(`validation.${passwordConfirmationError}`)}
          </p>
        ) : null}
      </div>

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? t('form.submitPending') : t('form.submit')}
      </Button>
    </form>
  );
}
