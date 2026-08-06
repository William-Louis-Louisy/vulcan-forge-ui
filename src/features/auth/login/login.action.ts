'use server';

import { AuthError } from '@auth/core/errors';
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';
import { defaultAppLocale, isAppLocale } from '@/domain/i18n';
import { getSafeAuthReturnTo } from '@/features/auth/shared/return-to';
import { getLoginFormError } from './login.errors';
import { loginSchema, type LoginValidationMessageKey } from './login.schema';
import type { LoginActionState } from './login.state';

type LoginFieldErrors = LoginActionState['fieldErrors'];

function getFormStringValue(formData: FormData, key: string): string {
  const value = formData.get(key);

  return typeof value === 'string' ? value : '';
}

function getActionLocale(formData: FormData) {
  const rawLocale = getFormStringValue(formData, 'locale');

  return isAppLocale(rawLocale) ? rawLocale : defaultAppLocale;
}

function normalizeFieldErrors(
  fieldErrors: Record<string, string[] | undefined>,
): LoginFieldErrors {
  const normalizedErrors: LoginFieldErrors = {};

  if (fieldErrors.email?.length) {
    normalizedErrors.email = fieldErrors.email as LoginValidationMessageKey[];
  }

  if (fieldErrors.password?.length) {
    normalizedErrors.password =
      fieldErrors.password as LoginValidationMessageKey[];
  }

  return normalizedErrors;
}

export async function loginAction(
  _previousState: LoginActionState,
  formData: FormData,
): Promise<LoginActionState> {
  const locale = getActionLocale(formData);
  const returnTo = getSafeAuthReturnTo({
    locale,
    returnTo: getFormStringValue(formData, 'returnTo'),
  });

  const values = {
    email: getFormStringValue(formData, 'email'),
  };

  const parsed = loginSchema.safeParse({
    ...values,
    password: getFormStringValue(formData, 'password'),
  });

  if (!parsed.success) {
    return {
      status: 'error',
      fieldErrors: normalizeFieldErrors(parsed.error.flatten().fieldErrors),
      formError: null,
      values,
    };
  }

  try {
    await signIn('credentials', {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: returnTo,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        status: 'error',
        fieldErrors: {},
        formError: getLoginFormError(error),
        values,
      };
    }

    throw error;
  }

  redirect(returnTo);
}
