'use client';

import { useState, type FormEvent } from 'react';
import { EyeIcon, EyeSlashIcon } from '@phosphor-icons/react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui';
import { AppLink } from '@/components/navigation/AppLink';
import type { ResetPasswordValidationMessageKey } from './reset-password.schema';

type ResetStatus =
  | 'error'
  | 'idle'
  | 'passwordCheckUnavailable'
  | 'passwordHashingUnavailable'
  | 'rateLimited'
  | 'reset'
  | 'unexpected';

type ResetResponse = {
  fieldErrors?: {
    password?: ResetPasswordValidationMessageKey[];
    passwordConfirmation?: ResetPasswordValidationMessageKey[];
  };
  status: ResetStatus | 'expired' | 'invalid';
};

const inputClassName =
  'border-border-subtle bg-surface-primary text-content-primary focus:border-action-primary mt-2 w-full rounded-md border px-3 py-2 outline-none transition';

export function ResetPasswordForm() {
  const t = useTranslations('PasswordResetPage');
  const [status, setStatus] = useState<ResetStatus>('idle');
  const [fieldErrors, setFieldErrors] = useState<
    NonNullable<ResetResponse['fieldErrors']>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmationVisible, setIsConfirmationVisible] = useState(false);
  const passwordError = fieldErrors.password?.[0] ?? null;
  const confirmationError = fieldErrors.passwordConfirmation?.[0] ?? null;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus('idle');
    setFieldErrors({});

    const formData = new FormData(event.currentTarget);

    try {
      const response = await fetch('/api/auth/password-recovery/reset', {
        method: 'POST',
        body: JSON.stringify({
          password: formData.get('password'),
          passwordConfirmation: formData.get('passwordConfirmation'),
        }),
        cache: 'no-store',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const payload = (await response.json()) as ResetResponse;

      if (payload.status === 'expired' || payload.status === 'invalid') {
        window.location.assign(
          `${window.location.pathname}?status=${payload.status}`,
        );
        return;
      }

      setFieldErrors(payload.fieldErrors ?? {});
      setStatus(payload.status);
    } catch {
      setStatus('unexpected');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (status === 'reset') {
    return (
      <div className="mt-6">
        <p
          role="status"
          className="border-action-success/30 bg-action-success/10 text-action-success rounded-md border px-4 py-3 text-sm leading-6"
        >
          {t('states.reset.description')}
        </p>
        <AppLink
          href="/login"
          className="text-action-accent mt-5 inline-flex font-semibold"
        >
          {t('actions.signIn')}
        </AppLink>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-5">
      {status !== 'idle' && status !== 'error' ? (
        <p
          role="alert"
          className="border-action-danger/30 bg-action-danger/10 text-action-danger rounded-md border px-4 py-3 text-sm"
        >
          {t(`validation.${status}`)}
        </p>
      ) : null}

      <div>
        <label htmlFor="reset-password" className="text-sm font-medium">
          {t('form.passwordLabel')}
        </label>
        <div className="relative">
          <input
            id="reset-password"
            name="password"
            type={isPasswordVisible ? 'text' : 'password'}
            autoComplete="new-password"
            aria-invalid={Boolean(passwordError)}
            aria-describedby={
              passwordError
                ? 'reset-password-help reset-password-error'
                : 'reset-password-help'
            }
            className={`${inputClassName} pr-12`}
          />
          <VisibilityButton
            controls="reset-password"
            isVisible={isPasswordVisible}
            onToggle={() => setIsPasswordVisible((current) => !current)}
            showLabel={t('form.passwordVisibility.show')}
            hideLabel={t('form.passwordVisibility.hide')}
          />
        </div>
        <p
          id="reset-password-help"
          className="text-content-tertiary mt-2 text-sm"
        >
          {t('form.passwordHelp')}
        </p>
        {passwordError ? (
          <p
            id="reset-password-error"
            className="text-action-danger mt-2 text-sm"
          >
            {t(`validation.${passwordError}`)}
          </p>
        ) : null}
      </div>

      <div>
        <label
          htmlFor="reset-password-confirmation"
          className="text-sm font-medium"
        >
          {t('form.passwordConfirmationLabel')}
        </label>
        <div className="relative">
          <input
            id="reset-password-confirmation"
            name="passwordConfirmation"
            type={isConfirmationVisible ? 'text' : 'password'}
            autoComplete="new-password"
            aria-invalid={Boolean(confirmationError)}
            aria-describedby={
              confirmationError
                ? 'reset-password-confirmation-error'
                : undefined
            }
            className={`${inputClassName} pr-12`}
          />
          <VisibilityButton
            controls="reset-password-confirmation"
            isVisible={isConfirmationVisible}
            onToggle={() => setIsConfirmationVisible((current) => !current)}
            showLabel={t('form.passwordVisibility.show')}
            hideLabel={t('form.passwordVisibility.hide')}
          />
        </div>
        {confirmationError ? (
          <p
            id="reset-password-confirmation-error"
            className="text-action-danger mt-2 text-sm"
          >
            {t(`validation.${confirmationError}`)}
          </p>
        ) : null}
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? t('form.submitPending') : t('form.submit')}
      </Button>
    </form>
  );
}

function VisibilityButton({
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
