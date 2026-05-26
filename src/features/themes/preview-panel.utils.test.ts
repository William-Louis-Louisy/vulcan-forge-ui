import { describe, expect, it } from 'vitest';
import type { ThemeEditorTheme } from './themes-editor.utils';
import {
  createPreviewTheme,
  createPreviewThemes,
  getDefaultPreviewThemeMode,
} from './preview-panel.utils';

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
    },
  },
};

describe('preview panel utils', () => {
  it('creates preview theme colors from theme tokens', () => {
    expect(
      createPreviewTheme({
        theme: lightTheme,
        colorTokenSetTokens: [],
      }),
    ).toMatchObject({
      mode: 'light',
      colors: {
        background: '#f7f3eb',
        surface: '#ffffff',
        content: '#111827',
        muted: '#3a4454',
        accent: '#ff8731',
      },
    });
  });

  it('uses resolved semantic action color as preview accent', () => {
    expect(
      createPreviewTheme({
        theme: lightTheme,
        colorTokenSetTokens: [
          {
            path: 'color.primitive.accent.primary',
            type: 'color',
            value: '#00aaff',
            status: 'ready',
          },
          {
            path: 'color.semantic.action.primary',
            type: 'color',
            value: '{color.primitive.accent.primary}',
            reference: '{color.primitive.accent.primary}',
            status: 'ready',
          },
        ],
      }).colors.accent,
    ).toBe('#00aaff');
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
    expect(
      getDefaultPreviewThemeMode([
        {
          id: 'dark-theme',
          mode: 'dark',
          name: 'Dark',
          colors: {
            background: '#070707',
            surface: '#1e1e1e',
            content: '#e2e7ef',
            muted: '#a0b1ca',
            accent: '#ff8731',
            border: '#303030',
          },
        },
        {
          id: 'light-theme',
          mode: 'light',
          name: 'Light',
          colors: {
            background: '#f7f3eb',
            surface: '#ffffff',
            content: '#111827',
            muted: '#3a4454',
            accent: '#ff8731',
            border: '#d9d2c4',
          },
        },
      ]),
    ).toBe('light');
  });
});
