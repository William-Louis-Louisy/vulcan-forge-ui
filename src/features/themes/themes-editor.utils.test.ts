import {
  isThemeMode,
  sortThemesByMode,
  getThemeColorValue,
  getThemeContrastPairs,
  createThemeColorTokenOptions,
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

  it('returns the complete background and surface contrast matrix pairs', () => {
    expect(
      getThemeContrastPairs({
        tokens: {
          color: {
            background: '#070707',
            surface: '#1E1E1E',
            content: '#E2E7EF',
            muted: '#A0B1CA',
            accent: '#FF8731',
          },
        },
      }),
    ).toMatchObject([
      {
        key: 'contentOnBackground',
        foregroundValue: '#E2E7EF',
        backgroundValue: '#070707',
      },
      {
        key: 'contentOnSurface',
        foregroundValue: '#E2E7EF',
        backgroundValue: '#1E1E1E',
      },
      {
        key: 'mutedOnBackground',
        foregroundValue: '#A0B1CA',
        backgroundValue: '#070707',
      },
      {
        key: 'mutedOnSurface',
        foregroundValue: '#A0B1CA',
        backgroundValue: '#1E1E1E',
      },
      {
        key: 'accentOnBackground',
        foregroundValue: '#FF8731',
        backgroundValue: '#070707',
      },
      {
        key: 'accentOnSurface',
        foregroundValue: '#FF8731',
        backgroundValue: '#1E1E1E',
      },
    ]);
  });

  it('evaluates contrast for theme color pairs when both colors are available', () => {
    const pairs = getThemeContrastPairs({
      tokens: {
        color: {
          content: '#111827',
          background: '#ffffff',
          muted: '#6b7280',
          surface: '#f9fafb',
          accent: '#2563eb',
        },
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
      tokens: {
        color: {
          content: '#111827',
        },
      },
    });

    expect(pairs[0]).toMatchObject({
      key: 'contentOnBackground',
      foregroundValue: '#111827',
      backgroundValue: null,
      contrast: null,
    });
  });

  it('creates token reference options from resolved color tokens', () => {
    const options = createThemeColorTokenOptions([
      {
        path: 'color.primitive.accent.primary',
        type: 'color',
        value: '#ff8731',
        status: 'ready',
      },
      {
        path: 'color.semantic.action.primary',
        type: 'color',
        value: '{color.primitive.accent.primary}',
        reference: '{color.primitive.accent.primary}',
        status: 'ready',
      },
    ]);

    expect(options).toEqual([
      {
        path: 'color.semantic.action.primary',
        reference: '{color.semantic.action.primary}',
        value: '#ff8731',
        label: 'color.semantic.action.primary',
      },
      {
        path: 'color.primitive.accent.primary',
        reference: '{color.primitive.accent.primary}',
        value: '#ff8731',
        label: 'color.primitive.accent.primary',
      },
    ]);
  });

  it('resolves theme colors from token references', () => {
    const colorTokenOptions = createThemeColorTokenOptions([
      {
        path: 'color.primitive.neutral.950',
        type: 'color',
        value: '#070707',
        status: 'ready',
      },
    ]);

    expect(
      getThemeColorValue({
        tokens: {
          color: {
            background: '{color.primitive.neutral.950}',
          },
        },
        colorKey: 'background',
        colorTokenOptions,
      }),
    ).toBe('#070707');
  });

  it('keeps direct hex theme colors as legacy fallback', () => {
    expect(
      getThemeColorValue({
        tokens: {
          color: {
            background: '#ffffff',
          },
        },
        colorKey: 'background',
      }),
    ).toBe('#ffffff');
  });

  it('evaluates contrast pairs from resolved token references', () => {
    const colorTokenOptions = createThemeColorTokenOptions([
      {
        path: 'color.primitive.neutral.0',
        type: 'color',
        value: '#ffffff',
        status: 'ready',
      },
      {
        path: 'color.primitive.neutral.950',
        type: 'color',
        value: '#070707',
        status: 'ready',
      },
    ]);

    const pairs = getThemeContrastPairs({
      tokens: {
        color: {
          content: '{color.primitive.neutral.950}',
          background: '{color.primitive.neutral.0}',
        },
      },
      colorTokenOptions,
    });

    expect(pairs[0]).toMatchObject({
      key: 'contentOnBackground',
      foregroundReferencePath: 'color.primitive.neutral.950',
      backgroundReferencePath: 'color.primitive.neutral.0',
      foregroundValue: '#070707',
      backgroundValue: '#ffffff',
      contrast: {
        isValid: true,
        status: 'pass',
      },
    });
  });
});
