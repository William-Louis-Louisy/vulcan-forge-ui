import {
  createPreviewTheme,
  createPreviewThemes,
  getDefaultPreviewThemeMode,
  getReadableAccentContent,
} from './preview-panel.utils';
import { describe, expect, it } from 'vitest';
import type { ThemeEditorTheme } from './themes-editor.utils';

const updatedAt = new Date('2026-05-01T00:00:00.000Z');

const lightTheme: ThemeEditorTheme = {
  id: 'light-theme',
  mode: 'light',
  name: 'Light',
  updatedAt,
  tokens: {
    color: {
      background: '#f7f3eb',
      surface: '#ffffff',
      content: '#111827',
      muted: '#3a4454',
      accent: '#ff8731',
      info: '#2563eb',
      success: '#15803d',
      warning: '#b45309',
      danger: '#b91c1c',
    },
  },
};

const darkTheme: ThemeEditorTheme = {
  id: 'dark-theme',
  mode: 'dark',
  name: 'Dark',
  updatedAt,
  tokens: {
    color: {
      background: '#070707',
      surface: '#1e1e1e',
      content: '#e2e7ef',
      muted: '#a0b1ca',
      accent: '#ff8731',
      info: '#60a5fa',
      success: '#4ade80',
      warning: '#fbbf24',
      danger: '#f87171',
    },
  },
};

describe('preview panel utils', () => {
  it('creates a fully resolved preview palette from theme tokens', () => {
    const previewTheme = createPreviewTheme({
      theme: lightTheme,
      colorTokenSetTokens: [],
    });

    expect(previewTheme).toMatchObject({
      mode: 'light',
      colors: {
        background: '#f7f3eb',
        surface: '#ffffff',
        content: '#111827',
        muted: '#3a4454',
        accent: '#ff8731',
        info: '#2563eb',
        success: '#15803d',
        warning: '#b45309',
        danger: '#b91c1c',
        accentContent: '#111111',
      },
      resolvedColorCount: 9,
      fallbackColorKeys: [],
    });
    expect(previewTheme.palette.map((entry) => entry.status)).toEqual(
      Array.from({ length: 9 }, () => 'resolved'),
    );
  });

  it('uses a resolved semantic action color when the theme accent references it', () => {
    const previewTheme = createPreviewTheme({
      theme: {
        id: 'light-theme',
        mode: 'light',
        name: 'Light',
        tokens: {
          color: {
            accent: '{color.semantic.action.primary}',
          },
        },
        updatedAt: new Date('2026-01-01T00:00:00.000Z'),
      },
      colorTokenSetTokens: [
        {
          path: 'color.primitive.brand.primary',
          type: 'color',
          value: '#00aaff',
          status: 'ready',
        },
        {
          path: 'color.semantic.action.primary',
          type: 'color',
          value: '{color.primitive.brand.primary}',
          reference: '{color.primitive.brand.primary}',
          status: 'ready',
        },
      ],
    });

    expect(previewTheme.colors.accent).toBe('#00aaff');
    expect(
      previewTheme.palette.find((entry) => entry.key === 'accent'),
    ).toMatchObject({
      status: 'resolved',
      value: '#00aaff',
    });
  });

  it('tracks missing and unresolved mappings while rendering safe fallbacks', () => {
    const previewTheme = createPreviewTheme({
      theme: {
        id: 'dark-theme',
        mode: 'dark',
        name: 'Dark',
        tokens: {
          color: {
            background: '{color.missing.background}',
            content: 'not-a-color',
            accent: '#003366',
          },
        },
        updatedAt,
      },
      colorTokenSetTokens: [],
    });

    expect(previewTheme.fallbackColorKeys).toEqual([
      'background',
      'surface',
      'content',
      'muted',
      'info',
      'success',
      'warning',
      'danger',
    ]);
    expect(previewTheme.resolvedColorCount).toBe(1);
    expect(previewTheme.colors).toMatchObject({
      background: '#070707',
      surface: '#1e1e1e',
      content: '#e2e7ef',
      muted: '#a0b1ca',
      accent: '#003366',
      info: '#60a5fa',
      success: '#4ade80',
      warning: '#fbbf24',
      danger: '#f87171',
      accentContent: '#ffffff',
    });
  });

  it('selects readable foreground colors for light and dark accents', () => {
    expect(getReadableAccentContent('#ff8731')).toBe('#111111');
    expect(getReadableAccentContent('#003366')).toBe('#ffffff');
  });

  it('sorts preview themes light then dark', () => {
    expect(
      createPreviewThemes({
        themes: [darkTheme, lightTheme],
        colorTokenSetTokens: [],
      }).map((theme) => theme.mode),
    ).toEqual(['light', 'dark']);
  });

  it('returns light as the default preview theme mode when available', () => {
    const previewThemes = createPreviewThemes({
      themes: [darkTheme, lightTheme],
      colorTokenSetTokens: [],
    });

    expect(getDefaultPreviewThemeMode(previewThemes)).toBe('light');
  });
});
