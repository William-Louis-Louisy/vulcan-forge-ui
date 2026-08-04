'use server';

import bcrypt from 'bcryptjs';
import { AuthError } from '@auth/core/errors';
import { headers } from 'next/headers';
import { signIn } from '@/auth';
import { prisma } from '@/server/db/prisma';
import {
  consumeAuthRateLimit,
  resetAuthAccountRateLimit,
} from '@/server/auth/auth-rate-limit';
import { recordAuthSecurityEvent } from '@/server/auth/auth-security-events';
import type { SignupActionState } from './signup.state';
import { getSignupPersistenceError } from './signup.errors';
import { createPersonalWorkspaceSlug } from '@/domain/workspaces/slug';
import { appLocales, defaultAppLocale, isAppLocale } from '@/domain/i18n';
import { signupSchema, type SignupValidationMessageKey } from './signup.schema';

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
): SignupActionState['fieldErrors'] {
  const normalizedErrors: SignupActionState['fieldErrors'] = {};

  if (fieldErrors.name?.length) {
    normalizedErrors.name = fieldErrors.name as SignupValidationMessageKey[];
  }

  if (fieldErrors.email?.length) {
    normalizedErrors.email = fieldErrors.email as SignupValidationMessageKey[];
  }

  if (fieldErrors.password?.length) {
    normalizedErrors.password =
      fieldErrors.password as SignupValidationMessageKey[];
  }

  if (fieldErrors.passwordConfirmation?.length) {
    normalizedErrors.passwordConfirmation =
      fieldErrors.passwordConfirmation as SignupValidationMessageKey[];
  }

  return normalizedErrors;
}

function createErrorState({
  formError,
  values,
}: {
  formError: NonNullable<SignupActionState['formError']>;
  values: SignupActionState['values'];
}): SignupActionState {
  return {
    status: 'error',
    fieldErrors: {},
    formError,
    values,
  };
}

export async function signupAction(
  _previousState: SignupActionState,
  formData: FormData,
): Promise<SignupActionState> {
  const locale = getActionLocale(formData);
  const values = {
    name: getFormStringValue(formData, 'name'),
    email: getFormStringValue(formData, 'email'),
  };

  let rateLimit: Awaited<ReturnType<typeof consumeAuthRateLimit>>;

  try {
    rateLimit = await consumeAuthRateLimit({
      accountIdentifier: values.email,
      headers: await headers(),
      operation: 'signup',
    });
  } catch {
    return createErrorState({
      formError: 'unexpected',
      values,
    });
  }

  if (!rateLimit.allowed) {
    recordAuthSecurityEvent('auth.signup.rate_limited', {
      accountFingerprint: rateLimit.accountFingerprint,
      ipFingerprint: rateLimit.context.ipFingerprint,
      requestId: rateLimit.context.requestId,
      retryAfterSeconds: rateLimit.retryAfterSeconds,
    });

    return createErrorState({
      formError: 'rateLimited',
      values,
    });
  }

  const parsed = signupSchema.safeParse({
    ...values,
    password: getFormStringValue(formData, 'password'),
    passwordConfirmation: getFormStringValue(formData, 'passwordConfirmation'),
  });

  if (!parsed.success) {
    return {
      status: 'error',
      fieldErrors: normalizeFieldErrors(parsed.error.flatten().fieldErrors),
      formError: null,
      values,
    };
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);
  let userId: string;

  try {
    userId = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name: parsed.data.name,
          email: parsed.data.email,
          passwordHash,
          preferences: {
            create: {
              locale,
              themePreference: 'system',
            },
          },
        },
        select: {
          id: true,
          name: true,
        },
      });

      await tx.workspace.create({
        data: {
          name: `${user.name ?? 'User'}'s workspace`,
          slug: createPersonalWorkspaceSlug(user.id),
          ownerId: user.id,
          settings: {
            create: {
              defaultLocale: locale,
              supportedLocales: [...appLocales],
            },
          },
          members: {
            create: {
              userId: user.id,
              role: 'owner',
            },
          },
        },
      });

      return user.id;
    });
  } catch (error) {
    const formError = getSignupPersistenceError(error);

    recordAuthSecurityEvent(
      formError === 'signupUnavailable'
        ? 'auth.signup.duplicate'
        : 'auth.signup.unexpected_error',
      {
        accountFingerprint: rateLimit.accountFingerprint,
        ipFingerprint: rateLimit.context.ipFingerprint,
        requestId: rateLimit.context.requestId,
      },
    );

    return createErrorState({
      formError,
      values,
    });
  }

  await resetAuthAccountRateLimit({
    accountIdentifier: parsed.data.email,
    operation: 'signup',
  });

  recordAuthSecurityEvent('auth.signup.created', {
    accountFingerprint: rateLimit.accountFingerprint,
    ipFingerprint: rateLimit.context.ipFingerprint,
    requestId: rateLimit.context.requestId,
    userId,
  });

  try {
    await signIn('credentials', {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: `/${locale}/app`,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      recordAuthSecurityEvent('auth.signup.sign_in_failed', {
        accountFingerprint: rateLimit.accountFingerprint,
        ipFingerprint: rateLimit.context.ipFingerprint,
        requestId: rateLimit.context.requestId,
        userId,
      });

      return createErrorState({
        formError: 'accountCreatedSignInFailed',
        values,
      });
    }

    throw error;
  }

  return createErrorState({
    formError: 'unexpected',
    values,
  });
}
