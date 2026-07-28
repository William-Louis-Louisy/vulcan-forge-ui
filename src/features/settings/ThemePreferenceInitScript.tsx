import { themePreferenceStorageKey } from './theme-preference.client';

export function ThemePreferenceInitScript() {
  const script = `
(function () {
  try {
    var storageKey = ${JSON.stringify(themePreferenceStorageKey)};
    var storedPreference = window.localStorage.getItem(storageKey);
    var themePreference =
      storedPreference === 'dark' ||
      storedPreference === 'light' ||
      storedPreference === 'system'
        ? storedPreference
        : 'system';

    var resolvedTheme =
      themePreference === 'system'
        ? window.matchMedia &&
          window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light'
        : themePreference;

    var root = document.documentElement;

    root.classList.toggle('dark', resolvedTheme === 'dark');
    root.dataset.themePreference = themePreference;
    root.dataset.theme = resolvedTheme;
    root.style.colorScheme = resolvedTheme;
  } catch {
  }
})();
`;

  return (
    <script
      id="theme-preference-init"
      dangerouslySetInnerHTML={{ __html: script }}
    />
  );
}
