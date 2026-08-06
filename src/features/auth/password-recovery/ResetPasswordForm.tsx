'use client';

import { useState, type FormEvent } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui';
import { AppLink } from '@/components/navigation/AppLink';
import {
  AuthErrorSummary,
  PasswordField,
  getPasswordDraftIssue,
  passwordsMatchDraft,
  type AuthErrorSummaryItem,
} from '@/features/auth/shared';
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

export function ResetPasswordForm() {
  const t = useTranslations('PasswordResetPage');
  const [status, setStatus] = useState<ResetStatus>('idle');
  const [fieldErrors, setFieldErrors] = useState<
    NonNullable<ResetResponse['fieldErrors']>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const serverPasswordError = fieldErrors.password?.[0] ?? null;
  const serverConfirmationError =
    fieldErrors.passwordConfirmation?.[0] ?? null;
  const passwordDraftIssue = getPasswordDraftIssue(password);
  const confirmationMatches = passwordsMatchDraft({
    password,
    confirmation: passwordConfirmation,
  });
  const passwordError = serverPasswordError ?? passwordDraftIssue;
  const confirmationError =
    serverConfirmationError ??
    (confirmationMatches ? null : 'passwordConfirmationMismatch');
  const errorSummaryItems: AuthErrorSummaryItem[] = [];

  if (serverPasswordError) {
    errorSummaryItems.push({
      fieldId: 'reset-password',
      message: t(`validation.${serverPasswordError}`),
    });
  }

  if (serverConfirmationError) {
    errorSummaryItems.push({
      fieldId: 'reset-password-confirmation',
      message: t(`validation.${serverConfirmationError}`),
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus('idle');
    setFieldErrors({});

    try {
      const response = await fetch('/api/auth/password-recovery/reset', {
        method: 'POST',
        body: JSON.stringify({
          password,
          passwordConfirmation,
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

      <AuthErrorSummary focusKey={fieldErrors} items={errorSummaryItems} />

      <PasswordField
        id="reset-password"
        name="password"
        label={t('form.passwordLabel')}
        autoComplete="new-password"
        required
        value={password}
        onChange={(event) => setPassword(event.currentTarget.value)}
        help={t('form.passwordHelp')}
        error={passwordError ? t(`validation.${passwordError}`) : undefined}
        showPasswordLabel={t('form.passwordVisibility.show')}
        hidePasswordLabel={t('form.passwordVisibility.hide')}
      />

      <PasswordField
        id="reset-password-confirmation"
        name="passwordConfirmation"
        label={t('form.passwordConfirmationLabel')}
        autoComplete="new-password"
        required
        value={passwordConfirmation}
        onChange={(event) =>
          setPasswordConfirmation(event.currentTarget.value)
        }
        error={
          confirmationError
            ? t(`validation.${confirmationError}`)
            : undefined
        }
        showPasswordLabel={t('form.passwordVisibility.show')}
        hidePasswordLabel={t('form.passwordVisibility.hide')}
      />

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? t('form.submitPending') : t('form.submit')}
      </Button>
    </form>
  );
}
