'use server';

import bcrypt from 'bcryptjs';
import { signIn } from '@/auth';
import { prisma } from '@/server/db/prisma';
import type { SignupActionState } from './signup.state';
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

export async function signupAction(
  _previousState: SignupActionState,
  formData: FormData,
): Promise<SignupActionState> {
  const locale = getActionLocale(formData);

  const values = {
    name: getFormStringValue(formData, 'name'),
    email: getFormStringValue(formData, 'email'),
  };

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

  const existingUser = await prisma.user.findUnique({
    where: {
      email: parsed.data.email,
    },
    select: {
      id: true,
    },
  });

  if (existingUser) {
    return {
      status: 'error',
      fieldErrors: {},
      formError: 'emailAlreadyUsed',
      values,
    };
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);

  await prisma.$transaction(async (tx) => {
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
  });

  await signIn('credentials', {
    email: parsed.data.email,
    password: parsed.data.password,
    redirectTo: `/${locale}/app`,
  });

  return {
    status: 'error',
    fieldErrors: {},
    formError: 'unexpected',
    values,
  };
}
