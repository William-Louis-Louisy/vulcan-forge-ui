'use client';

import { useActionState } from 'react';
import { useTranslations } from 'next-intl';
import { Button, Input } from '@/components/ui';
import { requestPasswordRecoveryAction } from './request-password-recovery.action';
import {
  initialRequestPasswordRecoveryActionState,
  type RequestPasswordRecoveryActionState,
} from './request-password-recovery.state';

function getEmailError(
  fieldErrors: RequestPasswordRecoveryActionState['fieldErrors'],
) {
  return fieldErrors.email?.[0] ?? null;
}

export function RequestPasswordRecoveryForm() {
  const t = useTranslations('PasswordRecoveryRequestPage');
  const [state, formAction, isPending] = useActionState(
    requestPasswordRecoveryAction,
    initialRequestPasswordRecoveryActionState,
  );
  const safeState = state ?? initialRequestPasswordRecoveryActionState;
  const emailError = getEmailError(safeState.fieldErrors);

  return (
    <form action={formAction} className="mt-8 space-y-5">
      {safeState.status === 'submitted' ? (
        <div
          role="status"
          className="border-action-success/30 bg-action-success/10 text-action-success rounded-md border px-4 py-3 text-sm leading-6"
        >
          {t('submitted')}
        </div>
      ) : null}

      <div>
        <label htmlFor="recovery-email" className="text-sm font-medium">
          {t('form.emailLabel')}
        </label>
        <Input
          id="recovery-email"
          name="email"
          type="email"
          autoComplete="email"
          defaultValue={safeState.values.email}
          invalid={Boolean(emailError)}
          aria-describedby={emailError ? 'recovery-email-error' : undefined}
          className="mt-2"
        />
        {emailError ? (
          <p
            id="recovery-email-error"
            className="text-action-danger mt-2 text-sm"
          >
            {t(`validation.${emailError}`)}
          </p>
        ) : null}
      </div>

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? t('form.submitPending') : t('form.submit')}
      </Button>
    </form>
  );
}
