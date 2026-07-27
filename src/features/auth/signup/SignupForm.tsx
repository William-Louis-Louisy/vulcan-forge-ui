'use client';

import { useActionState, useState } from 'react';
import { EyeIcon, EyeSlashIcon } from '@phosphor-icons/react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui';
import type { Locale } from '@/i18n/routing';
import { signupAction } from './signup.action';
import {
  initialSignupActionState,
  type SignupActionState,
} from './signup.state';

type SignupFormProps = {
  locale: Locale;
};

const inputClassName =
  'border-border-subtle bg-surface-primary text-content-primary focus:border-action-primary mt-2 w-full rounded-md border px-3 py-2 outline-none transition';

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
          className="border-action-danger/30 bg-action-danger/10 text-action-danger rounded-md border px-4 py-3 text-sm"
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
          className={inputClassName}
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
        <div className="relative">
          <input
            id="password"
            name="password"
            type={isPasswordVisible ? 'text' : 'password'}
            autoComplete="new-password"
            aria-invalid={Boolean(passwordError)}
            aria-describedby={
              passwordError ? 'password-help password-error' : 'password-help'
            }
            className={`${inputClassName} pr-12`}
          />
          <PasswordVisibilityButton
            isVisible={isPasswordVisible}
            onToggle={() => setIsPasswordVisible((current) => !current)}
            controls="password"
            showLabel={t('form.passwordVisibility.show')}
            hideLabel={t('form.passwordVisibility.hide')}
          />
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
        <div className="relative">
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
            className={`${inputClassName} pr-12`}
          />
          <PasswordVisibilityButton
            isVisible={isPasswordConfirmationVisible}
            onToggle={() =>
              setIsPasswordConfirmationVisible((current) => !current)
            }
            controls="passwordConfirmation"
            showLabel={t('form.passwordVisibility.show')}
            hideLabel={t('form.passwordVisibility.hide')}
          />
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

function PasswordVisibilityButton({
  controls,
  hideLabel,
  isVisible,
  onToggle,
  showLabel,
}: {
  controls: string;
  hideLabel: string;
  isVisible: boolean;
  onToggle: () => void;
  showLabel: string;
}) {
  const label = isVisible ? hideLabel : showLabel;

  return (
    <button
      type="button"
      aria-controls={controls}
      aria-label={label}
      aria-pressed={isVisible}
      onClick={onToggle}
      className="border-border-subtle text-content-secondary hover:bg-surface-secondary hover:text-content-primary absolute right-0 bottom-0 flex h-[calc(100%-0.5rem)] w-11 items-center justify-center rounded-r-md border-l transition"
    >
      {isVisible ? (
        <EyeSlashIcon aria-hidden="true" size={18} weight="bold" />
      ) : (
        <EyeIcon aria-hidden="true" size={18} weight="bold" />
      )}
    </button>
  );
}
