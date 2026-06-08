'use client';

import { useEffect } from 'react';
import {
  applyThemePreference,
  getPublicThemePreference,
} from './theme-preference.client';
import { usePathname } from 'next/navigation';

export function PublicThemePreferenceApplier() {
  const pathname = usePathname();

  useEffect(() => {
    const themePreference = getPublicThemePreference();

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
  }, [pathname]);

  return null;
}
