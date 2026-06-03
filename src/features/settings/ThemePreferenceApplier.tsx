'use client';

import { useEffect } from 'react';
import type { ThemePreference } from './user-settings.schema';
import { applyThemePreference } from './theme-preference.client';

type ThemePreferenceApplierProps = {
  themePreference: ThemePreference;
};

export function ThemePreferenceApplier({
  themePreference,
}: ThemePreferenceApplierProps) {
  useEffect(() => {
    applyThemePreference(themePreference);

    if (themePreference !== 'system') {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    function handleSystemThemeChange() {
      applyThemePreference('system');
    }

    mediaQuery.addEventListener('change', handleSystemThemeChange);

    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, [themePreference]);

  return null;
}
