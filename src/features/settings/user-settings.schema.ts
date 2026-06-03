import { z } from 'zod';
import { appLocaleSchema } from '@/domain/i18n';

export const themePreferenceSchema = z.enum(['system', 'light', 'dark']);

export type ThemePreference = z.infer<typeof themePreferenceSchema>;

export const userSettingsSchema = z.object({
  locale: appLocaleSchema,
  themePreference: themePreferenceSchema,
});

export type UserSettings = z.infer<typeof userSettingsSchema>;

export const defaultUserSettings: UserSettings = {
  locale: 'en',
  themePreference: 'system',
};

export function parseUserSettings(settings: unknown): UserSettings {
  const parsedSettings = userSettingsSchema.safeParse(settings);

  return parsedSettings.success ? parsedSettings.data : defaultUserSettings;
}
