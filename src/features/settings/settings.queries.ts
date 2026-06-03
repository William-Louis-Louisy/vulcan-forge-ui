import { prisma } from '@/server/db/prisma';
import type { AppLocale } from '@/domain/i18n';
import { defaultUserSettings, type UserSettings } from './user-settings.schema';

export type SettingsPageData = {
  user: {
    name: string | null;
    email: string;
  };
  settings: UserSettings;
};

export async function getSettingsPageData({
  userId,
}: {
  userId: string;
}): Promise<SettingsPageData | null> {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      name: true,
      email: true,
      preferences: {
        select: {
          locale: true,
          themePreference: true,
        },
      },
    },
  });

  if (!user) {
    return null;
  }

  return {
    user: {
      name: user.name,
      email: user.email,
    },
    settings: user.preferences
      ? {
          locale: user.preferences.locale as AppLocale,
          themePreference: user.preferences.themePreference,
        }
      : defaultUserSettings,
  };
}
