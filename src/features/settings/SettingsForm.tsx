'use client';

import { Button } from '@/components/ui';
import type { AppLocale } from '@/domain/i18n';
import { useTranslations, useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { applyThemePreference } from './theme-preference.client';
import { useActionState, useMemo, useState, useEffect } from 'react';
import { updateUserSettingsAction } from './update-user-settings.action';
import type { ThemePreference, UserSettings } from './user-settings.schema';
import { initialUpdateUserSettingsActionState } from './update-user-settings.state';
import { usePreserveSaveContext } from '@/features/save-context/usePreserveSaveContext';

type SettingsFormProps = {
  initialSettings: UserSettings;
};

const locales = ['en', 'fr'] as const satisfies readonly AppLocale[];
const themePreferences = [
  'system',
  'light',
  'dark',
] as const satisfies readonly ThemePreference[];

export function SettingsForm({ initialSettings }: SettingsFormProps) {
  const t = useTranslations('SettingsPage');
  const router = useRouter();
  const pathname = usePathname();
  const pageLocale = useLocale() as AppLocale;

  const [state, formAction, isPending] = useActionState(
    updateUserSettingsAction,
    initialUpdateUserSettingsActionState,
  );

  const [locale, setLocale] = useState<AppLocale>(initialSettings.locale);
  const [themePreference, setThemePreference] = useState<ThemePreference>(
    initialSettings.themePreference,
  );

  useEffect(() => {
    applyThemePreference(themePreference);
  }, [themePreference]);

  const currentSettings = useMemo(
    () => ({
      locale,
      themePreference,
    }),
    [locale, themePreference],
  );

  const lastSavedSettings = state.savedSettings ?? initialSettings;

  const hasUnsavedChanges =
    JSON.stringify(currentSettings) !== JSON.stringify(lastSavedSettings);

  const preserveSaveContext = usePreserveSaveContext('settings');

  useEffect(() => {
    if (state.status !== 'success' || !state.savedSettings) {
      return;
    }

    if (state.savedSettings.locale !== pageLocale) {
      router.replace(pathname, {
        locale: state.savedSettings.locale,
      });

      return;
    }

    router.refresh();
  }, [pageLocale, pathname, router, state.savedSettings, state.status]);

  return (
    <form
      action={formAction}
      onSubmitCapture={preserveSaveContext}
      className="border-border-subtle bg-surface-primary shadow-soft mt-8 rounded-3xl border p-6"
    >
      <div className="grid gap-8">
        <fieldset>
          <legend className="text-lg font-semibold tracking-tight">
            {t('locale.title')}
          </legend>

          <p className="text-content-secondary mt-2 text-sm leading-6">
            {t('locale.description')}
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {locales.map((availableLocale) => (
              <label
                key={availableLocale}
                className="border-border-subtle bg-background-subtle flex items-start gap-3 rounded-2xl border p-4 text-sm"
              >
                <input
                  className="mt-1"
                  type="radio"
                  name="locale"
                  value={availableLocale}
                  checked={locale === availableLocale}
                  onChange={() => setLocale(availableLocale)}
                />

                <span>
                  <span className="block font-semibold">
                    {t(`locale.options.${availableLocale}.label`)}
                  </span>

                  <span className="text-content-secondary mt-1 block text-xs leading-5">
                    {t(`locale.options.${availableLocale}.description`)}
                  </span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="text-lg font-semibold tracking-tight">
            {t('theme.title')}
          </legend>

          <p className="text-content-secondary mt-2 text-sm leading-6">
            {t('theme.description')}
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {themePreferences.map((availableThemePreference) => (
              <label
                key={availableThemePreference}
                className="border-border-subtle bg-background-subtle flex items-start gap-3 rounded-2xl border p-4 text-sm"
              >
                <input
                  className="mt-1"
                  type="radio"
                  name="themePreference"
                  value={availableThemePreference}
                  checked={themePreference === availableThemePreference}
                  onChange={() => setThemePreference(availableThemePreference)}
                />

                <span>
                  <span className="block font-semibold">
                    {t(`theme.options.${availableThemePreference}.label`)}
                  </span>

                  <span className="text-content-secondary mt-1 block text-xs leading-5">
                    {t(`theme.options.${availableThemePreference}.description`)}
                  </span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="border-border-subtle flex flex-col gap-3 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold">
              {hasUnsavedChanges ? t('form.unsaved') : t('form.saved')}
            </p>

            <p className="text-content-secondary mt-1 text-xs leading-5">
              {t('form.description')}
            </p>
          </div>

          <Button type="submit" disabled={isPending || !hasUnsavedChanges}>
            {isPending ? t('form.saving') : t('form.save')}
          </Button>
        </div>

        {state.status === 'success' ? (
          <p
            role="status"
            className="text-action-success text-sm font-semibold"
          >
            {t('form.success')}
          </p>
        ) : null}

        {state.formError ? (
          <p role="alert" className="text-action-danger text-sm font-semibold">
            {t(`form.errors.${state.formError}`)}
          </p>
        ) : null}
      </div>
    </form>
  );
}
