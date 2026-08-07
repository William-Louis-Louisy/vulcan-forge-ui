'use client';

import { useActionState, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button, Input } from '@/components/ui';
import { AppLink } from '@/components/navigation/AppLink';
import {
  AuthErrorSummary,
  PasswordField,
  getPasswordDraftIssue,
  passwordsMatchDraft,
  type AuthErrorSummaryItem,
} from '@/features/auth/shared';
import type { Locale } from '@/i18n/routing';
import { signupAction } from './signup.action';
import { getSignupLegalMessages } from './signup-legal.messages';
import {
  initialSignupActionState,
  type SignupActionState,
} from './signup.state';

type SignupFormProps = {
  locale: Locale;
  returnTo: string;
};

function getFirstError(
  errors: SignupActionState['fieldErrors'] | undefined,
  field: 'name' | 'email' | 'password' | 'passwordConfirmation',
) {
  return errors?.[field]?.[0] ?? null;
}

export function SignupForm({ locale, returnTo }: SignupFormProps) {
  const t = useTranslations('SignupPage');
  const legalMessages = getSignupLegalMessages(locale);
  const [state, formAction, isPending] = useActionState(
    signupAction,
    initialSignupActionState,
  );
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [dismissedPasswordErrorState, setDismissedPasswordErrorState] =
    useState<SignupActionState | null>(null);
  const [
    dismissedPasswordConfirmationErrorState,
    setDismissedPasswordConfirmationErrorState,
  ] = useState<SignupActionState | null>(null);

  const safeState = state ?? initialSignupActionState;
  const nameError = getFirstError(safeState.fieldErrors, 'name');
  const emailError = getFirstError(safeState.fieldErrors, 'email');
  const serverPasswordError =
    dismissedPasswordErrorState === safeState
      ? null
      : getFirstError(safeState.fieldErrors, 'password');
  const serverPasswordConfirmationError =
    dismissedPasswordConfirmationErrorState === safeState
      ? null
      : getFirstError(safeState.fieldErrors, 'passwordConfirmation');
  const passwordDraftIssue = getPasswordDraftIssue(password);
  const confirmationMatches = passwordsMatchDraft({
    password,
    confirmation: passwordConfirmation,
  });
  const passwordError = serverPasswordError ?? passwordDraftIssue;
  const passwordConfirmationError =
    serverPasswordConfirmationError ??
    (confirmationMatches ? null : 'passwordConfirmationMismatch');
  const errorSummaryItems: AuthErrorSummaryItem[] = [];

  if (nameError) {
    errorSummaryItems.push({
      fieldId: 'signup-name',
      message: t(`validation.${nameError}`),
    });
  }

  if (emailError) {
    errorSummaryItems.push({
      fieldId: 'signup-email',
      message: t(`validation.${emailError}`),
    });
  }

  if (serverPasswordError) {
    errorSummaryItems.push({
      fieldId: 'signup-password',
      message: t(`validation.${serverPasswordError}`),
    });
  }

  if (serverPasswordConfirmationError) {
    errorSummaryItems.push({
      fieldId: 'signup-password-confirmation',
      message: t(`validation.${serverPasswordConfirmationError}`),
    });
  }

  return (
    <form action={formAction} className="mt-8 space-y-5">
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="returnTo" value={returnTo} />

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
        <label htmlFor="signup-name" className="text-sm font-medium">
          {t('form.nameLabel')}
        </label>
        <Input
          id="signup-name"
          name="name"
          type="text"
          autoComplete="name"
          required
          minLength={2}
          maxLength={80}
          defaultValue={safeState.values.name}
          invalid={Boolean(nameError)}
          aria-describedby={nameError ? 'signup-name-error' : undefined}
          aria-errormessage={nameError ? 'signup-name-error' : undefined}
          className="mt-2"
        />
        {nameError ? (
          <p id="signup-name-error" className="text-action-danger mt-2 text-sm">
            {t(`validation.${nameError}`)}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="signup-email" className="text-sm font-medium">
          {t('form.emailLabel')}
        </label>
        <Input
          id="signup-email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="username"
          required
          defaultValue={safeState.values.email}
          invalid={Boolean(emailError)}
          aria-describedby={emailError ? 'signup-email-error' : undefined}
          aria-errormessage={emailError ? 'signup-email-error' : undefined}
          className="mt-2"
        />
        {emailError ? (
          <p
            id="signup-email-error"
            className="text-action-danger mt-2 text-sm"
          >
            {t(`validation.${emailError}`)}
          </p>
        ) : null}
      </div>

      <PasswordField
        id="signup-password"
        name="password"
        label={t('form.passwordLabel')}
        autoComplete="new-password"
        required
        value={password}
        onChange={(event) => {
          setPassword(event.currentTarget.value);
          setDismissedPasswordErrorState(safeState);
        }}
        help={t('form.passwordHelp')}
        error={passwordError ? t(`validation.${passwordError}`) : undefined}
        showPasswordLabel={t('form.passwordVisibility.show')}
        hidePasswordLabel={t('form.passwordVisibility.hide')}
      />

      <PasswordField
        id="signup-password-confirmation"
        name="passwordConfirmation"
        label={t('form.passwordConfirmationLabel')}
        autoComplete="new-password"
        required
        value={passwordConfirmation}
        onChange={(event) => {
          setPasswordConfirmation(event.currentTarget.value);
          setDismissedPasswordConfirmationErrorState(safeState);
        }}
        error={
          passwordConfirmationError
            ? t(`validation.${passwordConfirmationError}`)
            : undefined
        }
        showPasswordLabel={t('form.passwordVisibility.show')}
        hidePasswordLabel={t('form.passwordVisibility.hide')}
      />

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? t('form.submitPending') : t('form.submit')}
      </Button>

      <p className="text-content-tertiary text-center text-xs leading-5">
        {legalMessages.beforeTerms}{' '}
        <AppLink
          href="/terms"
          className="text-content-secondary font-semibold underline underline-offset-2"
        >
          {legalMessages.terms}
        </AppLink>{' '}
        {legalMessages.betweenLinks}{' '}
        <AppLink
          href="/privacy"
          className="text-content-secondary font-semibold underline underline-offset-2"
        >
          {legalMessages.privacy}
        </AppLink>
        .
      </p>
    </form>
  );
}
