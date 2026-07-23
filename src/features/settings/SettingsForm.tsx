'use client';

import { Button } from '@/components/ui';
import type { AppLocale } from '@/domain/i18n';
import { useTranslations, useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { applyThemePreference } from './theme-preference.client';
import {
  useActionState,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
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
      className="border-border-subtle bg-surface-primary shadow-soft min-w-0 overflow-hidden rounded-md border"
    >
      <header className="border-border-subtle border-b p-5">
        <h2 className="text-base font-semibold tracking-tight">
          {t('preferences.title')}
        </h2>
        <p className="text-content-secondary mt-1 text-xs leading-5">
          {t('preferences.description')}
        </p>
      </header>

      <div className="divide-border-subtle divide-y">
        <fieldset
          aria-labelledby="settings-locale-title"
          aria-describedby="settings-locale-description"
          className="grid min-w-0 gap-4 p-5 lg:grid-cols-[minmax(0,0.72fr)_minmax(18rem,1.28fr)] lg:gap-8"
        >
          <div className="min-w-0">
            <h3
              id="settings-locale-title"
              className="text-sm font-semibold tracking-tight"
            >
              {t('locale.title')}
            </h3>
            <p
              id="settings-locale-description"
              className="text-content-secondary mt-1 text-xs leading-5"
            >
              {t('locale.description')}
            </p>
          </div>

          <div className="grid min-w-0 gap-2 sm:grid-cols-2">
            {locales.map((availableLocale) => (
              <PreferenceChoice
                key={availableLocale}
                name="locale"
                value={availableLocale}
                label={t(`locale.options.${availableLocale}.label`)}
                description={t(
                  `locale.options.${availableLocale}.description`,
                )}
                checked={locale === availableLocale}
                disabled={isPending}
                preview={
                  <span className="font-mono text-[0.6875rem] font-bold tracking-[0.08em]">
                    {availableLocale.toUpperCase()}
                  </span>
                }
                onChange={() => setLocale(availableLocale)}
              />
            ))}
          </div>
        </fieldset>

        <fieldset
          aria-labelledby="settings-theme-title"
          aria-describedby="settings-theme-description"
          className="grid min-w-0 gap-4 p-5 lg:grid-cols-[minmax(0,0.72fr)_minmax(18rem,1.28fr)] lg:gap-8"
        >
          <div className="min-w-0">
            <h3
              id="settings-theme-title"
              className="text-sm font-semibold tracking-tight"
            >
              {t('theme.title')}
            </h3>
            <p
              id="settings-theme-description"
              className="text-content-secondary mt-1 text-xs leading-5"
            >
              {t('theme.description')}
            </p>
          </div>

          <div className="grid min-w-0 gap-2 sm:grid-cols-3">
            {themePreferences.map((availableThemePreference) => (
              <PreferenceChoice
                key={availableThemePreference}
                name="themePreference"
                value={availableThemePreference}
                label={t(
                  `theme.options.${availableThemePreference}.label`,
                )}
                description={t(
                  `theme.options.${availableThemePreference}.description`,
                )}
                checked={themePreference === availableThemePreference}
                disabled={isPending}
                preview={
                  <AppearancePreview preference={availableThemePreference} />
                }
                onChange={() =>
                  setThemePreference(availableThemePreference)
                }
              />
            ))}
          </div>
        </fieldset>
      </div>

      {state.status === 'success' ? (
        <p
          role="status"
          className="border-action-success/20 bg-action-success/10 text-action-success mx-5 mt-5 rounded-md border px-3 py-2 text-xs font-semibold"
        >
          {t('form.success')}
        </p>
      ) : null}

      {state.formError ? (
        <p
          role="alert"
          className="border-action-danger/20 bg-action-danger/10 text-action-danger mx-5 mt-5 rounded-md border px-3 py-2 text-xs font-semibold"
        >
          {t(`form.errors.${state.formError}`)}
        </p>
      ) : null}

      <footer className="border-border-subtle bg-background-subtle/60 flex flex-col gap-3 border-t p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div aria-live="polite" className="min-w-0">
          <p
            className={[
              'text-sm font-semibold',
              hasUnsavedChanges
                ? 'text-action-warning'
                : 'text-content-primary',
            ].join(' ')}
          >
            {hasUnsavedChanges ? t('form.unsaved') : t('form.saved')}
          </p>
          <p className="text-content-secondary mt-0.5 text-xs leading-5">
            {t('form.description')}
          </p>
        </div>

        <Button
          type="submit"
          size="sm"
          disabled={isPending || !hasUnsavedChanges}
          className="shrink-0"
        >
          {isPending ? t('form.saving') : t('form.save')}
        </Button>
      </footer>
    </form>
  );
}

type PreferenceChoiceProps = {
  name: 'locale' | 'themePreference';
  value: string;
  label: string;
  description: string;
  checked: boolean;
  disabled: boolean;
  preview: ReactNode;
  onChange: () => void;
};

function PreferenceChoice({
  name,
  value,
  label,
  description,
  checked,
  disabled,
  preview,
  onChange,
}: PreferenceChoiceProps) {
  return (
    <label
      className={[
        'focus-within:outline-border-focus relative flex min-w-0 cursor-pointer items-start gap-3 rounded-md border p-3 transition focus-within:outline-2 focus-within:outline-offset-2',
        checked
          ? 'border-action-primary bg-action-primary/5'
          : 'border-border-subtle bg-background-subtle hover:border-border-default hover:bg-surface-secondary',
        disabled ? 'cursor-not-allowed opacity-60' : '',
      ].join(' ')}
    >
      <input
        className="sr-only"
        type="radio"
        name={name}
        value={value}
        checked={checked}
        disabled={disabled}
        onChange={onChange}
      />

      <span
        aria-hidden="true"
        className="border-border-subtle bg-surface-primary text-content-secondary flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-md border"
      >
        {preview}
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-xs font-semibold">{label}</span>
        <span className="text-content-secondary mt-1 block text-[0.6875rem] leading-4">
          {description}
        </span>
      </span>

      <span
        aria-hidden="true"
        className={[
          'mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border',
          checked
            ? 'border-action-primary bg-action-primary'
            : 'border-border-default bg-surface-primary',
        ].join(' ')}
      >
        {checked ? (
          <span className="bg-action-primary-content size-1.5 rounded-full" />
        ) : null}
      </span>
    </label>
  );
}

function AppearancePreview({ preference }: { preference: ThemePreference }) {
  if (preference === 'system') {
    return (
      <span
        aria-hidden="true"
        className="border-border-default grid size-5 grid-cols-2 overflow-hidden rounded-sm border"
      >
        <span className="bg-white" />
        <span className="bg-neutral-900" />
      </span>
    );
  }

  return (
    <span
      aria-hidden="true"
      className={[
        'border-border-default size-5 rounded-sm border',
        preference === 'light' ? 'bg-white' : 'bg-neutral-900',
      ].join(' ')}
    />
  );
}
