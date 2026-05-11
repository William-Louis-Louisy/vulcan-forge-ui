'use server';

import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';
import { prisma } from '@/server/db/prisma';
import { appLocales, defaultAppLocale, isAppLocale } from '@/domain/i18n';
import { createPersonalWorkspaceSlug } from '@/domain/workspaces/slug';
import { signupSchema, type SignupValidationMessageKey } from './signup.schema';
import type { SignupActionState } from './signup.state';

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

  redirect(`/${locale}/login?registered=1`);
}
