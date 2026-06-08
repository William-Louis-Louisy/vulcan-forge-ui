import {
  isThemePreference,
  applyThemePreference,
  persistThemePreference,
  resolveThemePreference,
  getPublicThemePreference,
  getStoredThemePreference,
  themePreferenceStorageKey,
} from './theme-preference.client';
import { afterEach, describe, expect, it, vi } from 'vitest';

describe('theme preference client helpers', () => {
  afterEach(() => {
    window.localStorage.clear();
    vi.unstubAllGlobals();
    document.documentElement.className = '';
    delete document.documentElement.dataset.theme;
    delete document.documentElement.dataset.themePreference;
    document.documentElement.style.colorScheme = '';
  });

  it('validates theme preference values', () => {
    expect(isThemePreference('system')).toBe(true);
    expect(isThemePreference('light')).toBe(true);
    expect(isThemePreference('dark')).toBe(true);
    expect(isThemePreference('nope')).toBe(false);
    expect(isThemePreference(null)).toBe(false);
  });

  it('persists and reads a stored theme preference', () => {
    persistThemePreference('dark');

    expect(window.localStorage.getItem(themePreferenceStorageKey)).toBe('dark');
    expect(getStoredThemePreference()).toBe('dark');
    expect(getPublicThemePreference()).toBe('dark');
  });

  it('falls back to system when the stored preference is invalid', () => {
    window.localStorage.setItem(themePreferenceStorageKey, 'invalid');

    expect(getStoredThemePreference()).toBeNull();
    expect(getPublicThemePreference()).toBe('system');
  });

  it('resolves system preference from matchMedia', () => {
    vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: true }));

    expect(resolveThemePreference('system')).toBe('dark');
  });

  it('applies the resolved theme to the document root', () => {
    applyThemePreference('dark');

    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(document.documentElement.dataset.themePreference).toBe('dark');
    expect(document.documentElement.style.colorScheme).toBe('dark');
  });
});
