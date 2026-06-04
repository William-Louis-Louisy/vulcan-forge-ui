import {
  isThemeMode,
  sortThemesByMode,
  getThemeColorValue,
  getThemeContrastPairs,
} from './themes-editor.utils';
import { describe, expect, it } from 'vitest';

describe('themes editor utils', () => {
  it('detects theme modes', () => {
    expect(isThemeMode('light')).toBe(true);
    expect(isThemeMode('dark')).toBe(true);
    expect(isThemeMode('system')).toBe(false);
  });

  it('sorts themes using light then dark order', () => {
    expect(
      sortThemesByMode([
        { mode: 'dark', name: 'Dark' },
        { mode: 'light', name: 'Light' },
      ]),
    ).toEqual([
      { mode: 'light', name: 'Light' },
      { mode: 'dark', name: 'Dark' },
    ]);
  });

  it('reads theme color values', () => {
    expect(
      getThemeColorValue({
        tokens: {
          color: {
            background: '#070707',
          },
        },
        colorKey: 'background',
      }),
    ).toBe('#070707');
  });

  it('returns null for missing theme color values', () => {
    expect(
      getThemeColorValue({
        tokens: {},
        colorKey: 'background',
      }),
    ).toBeNull();
  });

  it('returns key contrast preview pairs', () => {
    expect(
      getThemeContrastPairs({
        color: {
          background: '#070707',
          surface: '#1E1E1E',
          content: '#E2E7EF',
          muted: '#A0B1CA',
          accent: '#FF8731',
        },
      }),
    ).toMatchObject([
      {
        key: 'contentOnBackground',
        foregroundValue: '#E2E7EF',
        backgroundValue: '#070707',
      },
      {
        key: 'mutedOnBackground',
        foregroundValue: '#A0B1CA',
        backgroundValue: '#070707',
      },
      {
        key: 'contentOnSurface',
        foregroundValue: '#E2E7EF',
        backgroundValue: '#1E1E1E',
      },
      {
        key: 'accentOnBackground',
        foregroundValue: '#FF8731',
        backgroundValue: '#070707',
      },
    ]);
  });

  it('evaluates contrast for theme color pairs when both colors are available', () => {
    const pairs = getThemeContrastPairs({
      color: {
        content: '#111827',
        background: '#ffffff',
        muted: '#6b7280',
        surface: '#f9fafb',
        accent: '#2563eb',
      },
    });

    expect(pairs[0]).toMatchObject({
      key: 'contentOnBackground',
      foregroundValue: '#111827',
      backgroundValue: '#ffffff',
      contrast: {
        isValid: true,
        requiredRatio: 4.5,
        status: 'pass',
      },
    });

    expect(pairs[0]?.contrast?.ratio).toBeGreaterThan(0);
  });

  it('returns a missing contrast evaluation when one color is unavailable', () => {
    const pairs = getThemeContrastPairs({
      color: {
        content: '#111827',
      },
    });

    expect(pairs[0]).toMatchObject({
      key: 'contentOnBackground',
      foregroundValue: '#111827',
      backgroundValue: null,
      contrast: null,
    });
  });
});
