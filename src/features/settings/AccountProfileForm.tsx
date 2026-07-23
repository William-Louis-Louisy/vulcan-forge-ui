'use client';

import { useActionState, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui';
import type { Locale } from '@/i18n/routing';
import { usePreserveSaveContext } from '@/features/save-context/usePreserveSaveContext';
import { updateAccountProfileAction } from './update-account-profile.action';
import {
  initialUpdateAccountProfileActionState,
  type AccountProfile,
  type AccountProfileField,
  type UpdateAccountProfileActionState,
} from './update-account-profile.state';

type AccountProfileFormProps = {
  initialProfile: AccountProfile;
  locale: Locale;
};

function getFirstError(
  errors: UpdateAccountProfileActionState['fieldErrors'],
  field: AccountProfileField,
) {
  return errors[field]?.[0] ?? null;
}

export function AccountProfileForm({
  initialProfile,
  locale,
}: AccountProfileFormProps) {
  const t = useTranslations('SettingsPage');
  const preserveSaveContext = usePreserveSaveContext('account-profile');
  const [state, formAction, isPending] = useActionState(
    updateAccountProfileAction,
    initialUpdateAccountProfileActionState,
  );
  const [name, setName] = useState(initialProfile.name);
  const [email, setEmail] = useState(initialProfile.email);

  const lastSavedProfile = state.savedProfile ?? initialProfile;
  const currentProfile = useMemo(
    () => ({ name: name.trim(), email: email.trim().toLowerCase() }),
    [email, name],
  );
  const hasUnsavedChanges =
    currentProfile.name !== lastSavedProfile.name ||
    currentProfile.email !== lastSavedProfile.email;
  const emailChanged = currentProfile.email !== lastSavedProfile.email;

  const nameError = getFirstError(state.fieldErrors, 'name');
  const emailError = getFirstError(state.fieldErrors, 'email');
  const passwordError = getFirstError(state.fieldErrors, 'currentPassword');

  return (
    <form
      action={formAction}
      onSubmitCapture={preserveSaveContext}
      className="border-border-subtle grid gap-6 border-b py-8 xl:grid-cols-[minmax(12rem,0.38fr)_minmax(0,1fr)] xl:gap-12"
    >
      <div className="max-w-sm">
        <h2 className="text-base font-semibold tracking-tight">
          {t('account.title')}
        </h2>
        <p className="text-content-secondary mt-1 text-sm leading-6">
          {t('account.description')}
        </p>
      </div>

      <div className="min-w-0">
        <input type="hidden" name="locale" value={locale} />

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="min-w-0">
            <label htmlFor="settings-name" className="text-sm font-semibold">
              {t('account.name')}
            </label>
            <input
              id="settings-name"
              name="name"
              type="text"
              autoComplete="name"
              value={name}
              disabled={isPending}
              aria-invalid={Boolean(nameError)}
              aria-describedby={nameError ? 'settings-name-error' : undefined}
              onChange={(event) => setName(event.target.value)}
              className="border-border-default bg-surface-primary text-content-primary focus-visible:outline-border-focus mt-2 min-h-10 w-full rounded-md border px-3 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            />
            {nameError ? (
              <p
                id="settings-name-error"
                className="text-action-danger mt-2 text-xs"
              >
                {t(`account.validation.${nameError}`)}
              </p>
            ) : null}
          </div>

          <div className="min-w-0">
            <label htmlFor="settings-email" className="text-sm font-semibold">
              {t('account.email')}
            </label>
            <input
              id="settings-email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              disabled={isPending}
              aria-invalid={Boolean(emailError)}
              aria-describedby={
                emailError
                  ? 'settings-email-error'
                  : 'settings-email-description'
              }
              onChange={(event) => setEmail(event.target.value)}
              className="border-border-default bg-surface-primary text-content-primary focus-visible:outline-border-focus mt-2 min-h-10 w-full rounded-md border px-3 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            />
            <p
              id="settings-email-description"
              className="text-content-tertiary mt-2 text-xs leading-5"
            >
              {t('account.emailDescription')}
            </p>
            {emailError ? (
              <p
                id="settings-email-error"
                className="text-action-danger mt-2 text-xs"
              >
                {t(`account.validation.${emailError}`)}
              </p>
            ) : null}
          </div>
        </div>

        <div className="mt-5 max-w-md">
          <label
            htmlFor="settings-current-password"
            className="text-sm font-semibold"
          >
            {t('account.currentPassword')}
          </label>
          <input
            id="settings-current-password"
            name="currentPassword"
            type="password"
            autoComplete="current-password"
            disabled={isPending}
            aria-invalid={Boolean(passwordError)}
            aria-describedby={
              passwordError
                ? 'settings-current-password-error'
                : 'settings-current-password-description'
            }
            className="border-border-default bg-surface-primary text-content-primary focus-visible:outline-border-focus mt-2 min-h-10 w-full rounded-md border px-3 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          />
          <p
            id="settings-current-password-description"
            className="text-content-tertiary mt-2 text-xs leading-5"
          >
            {emailChanged
              ? t('account.currentPasswordRequired')
              : t('account.currentPasswordOptional')}
          </p>
          {passwordError ? (
            <p
              id="settings-current-password-error"
              className="text-action-danger mt-2 text-xs"
            >
              {t(`account.validation.${passwordError}`)}
            </p>
          ) : null}
        </div>

        {state.formError ? (
          <p
            role="alert"
            className="border-action-danger/20 bg-action-danger/10 text-action-danger mt-5 rounded-md border px-3 py-2 text-xs font-semibold"
          >
            {t(`account.errors.${state.formError}`)}
          </p>
        ) : null}

        {state.status === 'success' ? (
          <p
            role="status"
            className="border-action-success/20 bg-action-success/10 text-action-success mt-5 rounded-md border px-3 py-2 text-xs font-semibold"
          >
            {t('account.success')}
          </p>
        ) : null}

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-content-secondary text-xs leading-5">
            {hasUnsavedChanges ? t('account.unsaved') : t('account.saved')}
          </p>
          <Button
            type="submit"
            size="sm"
            disabled={isPending || !hasUnsavedChanges}
          >
            {isPending ? t('account.saving') : t('account.save')}
          </Button>
        </div>
      </div>
    </form>
  );
}
