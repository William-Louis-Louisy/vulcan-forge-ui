import type { ThemePreference } from './user-settings.schema';

export type ResolvedThemePreference = 'light' | 'dark';

function getSystemThemePreference(): ResolvedThemePreference {
  if (
    typeof window !== 'undefined' &&
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
