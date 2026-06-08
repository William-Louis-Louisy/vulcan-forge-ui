import type { ThemePreference } from './user-settings.schema';

export type ResolvedThemePreference = 'light' | 'dark';

export const themePreferenceStorageKey = 'vulcanforgeui:theme-preference';

const themePreferences = ['system', 'light', 'dark'] as const;

export function isThemePreference(value: unknown): value is ThemePreference {
  return (
    typeof value === 'string' &&
    themePreferences.includes(value as ThemePreference)
  );
}

export function getStoredThemePreference(): ThemePreference | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const storedPreference = window.localStorage.getItem(
    themePreferenceStorageKey,
  );

  return isThemePreference(storedPreference) ? storedPreference : null;
}

export function getPublicThemePreference(): ThemePreference {
  return getStoredThemePreference() ?? 'system';
}

export function persistThemePreference(themePreference: ThemePreference) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(themePreferenceStorageKey, themePreference);
}

function getSystemThemePreference(): ResolvedThemePreference {
  if (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  ) {
    return 'dark';
  }

  return 'light';
}

export function resolveThemePreference(
  themePreference: ThemePreference,
): ResolvedThemePreference {
  if (themePreference === 'system') {
    return getSystemThemePreference();
  }

  return themePreference;
}

export function applyThemePreference(themePreference: ThemePreference) {
  if (typeof document === 'undefined') {
    return;
  }

  const resolvedTheme = resolveThemePreference(themePreference);
  const root = document.documentElement;

  root.classList.toggle('dark', resolvedTheme === 'dark');
  root.dataset.themePreference = themePreference;
  root.dataset.theme = resolvedTheme;
  root.style.colorScheme = resolvedTheme;
}
