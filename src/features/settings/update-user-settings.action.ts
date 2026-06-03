'use server';

import { auth } from '@/auth';
import {
  AppLocale as PrismaAppLocale,
  ThemePreference as PrismaThemePreference,
} from '@/generated/prisma/client';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/server/db/prisma';
import { userSettingsSchema } from './user-settings.schema';
import type { UpdateUserSettingsActionState } from './update-user-settings.state';

function getFormStringValue(formData: FormData, key: string): string {
  const value = formData.get(key);

  return typeof value === 'string' ? value : '';
}

function toPrismaLocale(locale: 'en' | 'fr') {
  return locale === 'fr' ? PrismaAppLocale.fr : PrismaAppLocale.en;
}

function toPrismaThemePreference(themePreference: 'system' | 'light' | 'dark') {
  switch (themePreference) {
    case 'light':
      return PrismaThemePreference.light;

    case 'dark':
      return PrismaThemePreference.dark;

    case 'system':
      return PrismaThemePreference.system;
  }
}

export async function updateUserSettingsAction(
  _previousState: UpdateUserSettingsActionState,
  formData: FormData,
): Promise<UpdateUserSettingsActionState> {
  const parsedSettings = userSettingsSchema.safeParse({
    locale: getFormStringValue(formData, 'locale'),
    themePreference: getFormStringValue(formData, 'themePreference'),
  });

  if (!parsedSettings.success) {
    return {
      status: 'error',
      formError: 'invalidPayload',
      savedSettings: null,
    };
  }

  const session = await auth();

  if (!session?.user?.id) {
    return {
      status: 'error',
      formError: 'unauthorized',
      savedSettings: null,
    };
  }

  try {
    await prisma.userPreference.upsert({
      where: {
        userId: session.user.id,
      },
      create: {
        userId: session.user.id,
        locale: toPrismaLocale(parsedSettings.data.locale),
        themePreference: toPrismaThemePreference(
          parsedSettings.data.themePreference,
        ),
      },
      update: {
        locale: toPrismaLocale(parsedSettings.data.locale),
        themePreference: toPrismaThemePreference(
          parsedSettings.data.themePreference,
        ),
      },
    });

    revalidatePath(`/${parsedSettings.data.locale}/app/settings`);

    return {
      status: 'success',
      formError: null,
      savedSettings: parsedSettings.data,
    };
  } catch {
    return {
      status: 'error',
      formError: 'unexpected',
      savedSettings: null,
    };
  }
}
