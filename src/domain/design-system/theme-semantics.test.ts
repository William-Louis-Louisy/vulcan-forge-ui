import { describe, expect, it } from 'vitest';
import {
  createThemeColorTokenOptions,
  deleteThemeColorRole,
  getThemeColorRoleKeys,
  getThemeColorValue,
  getThemeContrastPairs,
  isCustomThemeColorRoleKey,
  isThemeColorKey,
  isThemeMode,
  sortThemesByMode,
  themeColorKeys,
  themeCoreColorKeys,
  themeStatusColorKeys,
} from './theme-semantics';

describe('theme semantics', () => {
  it('owns the supported theme mode ordering', () => {
    expect(isThemeMode('light')).toBe(true);
    expect(isThemeMode('dark')).toBe(true);
    expect(isThemeMode('system')).toBe(false);
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

  it('keeps known roles first and appends authored custom roles alphabetically', () => {
    expect(isThemeColorKey('background')).toBe(true);
    expect(isThemeColorKey('border-subtle')).toBe(false);
    expect(isCustomThemeColorRoleKey('border-subtle')).toBe(true);
    expect(isCustomThemeColorRoleKey('background')).toBe(false);
    expect(isCustomThemeColorRoleKey('invalid_role')).toBe(false);
    expect(
      getThemeColorRoleKeys({
        color: {
          background: '#ffffff',
          overlay: '{color.semantic.overlay}',
          'border-subtle': '{color.semantic.border.subtle}',
          invalid_role: '{color.semantic.invalid}',
        },
      }),
    ).toEqual([...themeColorKeys, 'border-subtle', 'overlay']);
  });

  it('deletes only the selected custom role without mutating the source theme', () => {
    const tokens = {
      color: {
        background: '#ffffff',
        'border-subtle': '{color.semantic.border.subtle}',
        overlay: '{color.semantic.overlay}',
      },
      radius: {
        card: '{radius.md}',
      },
    };

    expect(
      deleteThemeColorRole({
        tokens,
        roleKey: 'border-subtle',
      }),
    ).toEqual({
      status: 'success',
      roleKey: 'border-subtle',
      tokens: {
        color: {
          background: '#ffffff',
          overlay: '{color.semantic.overlay}',
        },
        radius: {
          card: '{radius.md}',
        },
      },
    });
    expect(tokens.color['border-subtle']).toBe(
      '{color.semantic.border.subtle}',
    );
  });

  it('protects built-in roles and reports missing custom roles', () => {
    expect(
      deleteThemeColorRole({
        tokens: {
          color: {
            background: '#ffffff',
          },
        },
        roleKey: 'background',
      }),
    ).toEqual({
      status: 'error',
      error: 'protectedRole',
    });

    expect(
      deleteThemeColorRole({
        tokens: {
          color: {
            background: '#ffffff',
          },
        },
        roleKey: 'overlay',
      }),
    ).toEqual({
      status: 'error',
      error: 'roleNotFound',
    });
  });

  it('evaluates status roles against theme background and surface', () => {
    expect(themeCoreColorKeys).toEqual([
      'background',
      'surface',
      'content',
      'muted',
      'accent',
    ]);
    expect(themeStatusColorKeys).toEqual([
      'info',
      'success',
      'warning',
      'danger',
    ]);
    expect(themeColorKeys).toEqual([
      ...themeCoreColorKeys,
      ...themeStatusColorKeys,
    ]);

    const pairs = getThemeContrastPairs({
      tokens: {
        color: {
          background: '#F7F3EB',
          surface: '#ffffff',
          content: '#070707',
          muted: '#3A4454',
          accent: '#586644',
          info: '#2563EB',
          success: '#15803D',
          warning: '#B45309',
          danger: '#B91C1C',
        },
      },
    });

    expect(
      pairs.map((pair) => [pair.foregroundKey, pair.backgroundKey]),
    ).toEqual([
      ['content', 'background'],
      ['content', 'surface'],
      ['muted', 'background'],
      ['muted', 'surface'],
      ['accent', 'background'],
      ['accent', 'surface'],
      ['info', 'background'],
      ['info', 'surface'],
      ['success', 'background'],
      ['success', 'surface'],
      ['warning', 'background'],
      ['warning', 'surface'],
      ['danger', 'background'],
      ['danger', 'surface'],
    ]);
    expect(
      pairs
        .filter((pair) =>
          themeStatusColorKeys.some((key) => key === pair.foregroundKey),
        )
        .every((pair) => pair.contrast?.status === 'pass'),
    ).toBe(true);
  });

  it('does not invent missing status-role issues for legacy themes', () => {
    const pairs = getThemeContrastPairs({
      tokens: {
        color: {
          background: '#ffffff',
          surface: '#ffffff',
          content: '#070707',
          muted: '#3A4454',
          accent: '#586644',
        },
      },
    });

    expect(pairs.map((pair) => pair.key)).toEqual([
      'contentOnBackground',
      'contentOnSurface',
      'mutedOnBackground',
      'mutedOnSurface',
      'accentOnBackground',
      'accentOnSurface',
    ]);
  });

  it('evaluates only the status roles that are authored on a legacy theme', () => {
    const pairs = getThemeContrastPairs({
      tokens: {
        color: {
          background: '#ffffff',
          surface: '#ffffff',
          content: '#070707',
          muted: '#3A4454',
          accent: '#586644',
          danger: '#B91C1C',
        },
      },
    });

    expect(pairs.map((pair) => pair.key)).toEqual([
      'contentOnBackground',
      'contentOnSurface',
      'mutedOnBackground',
      'mutedOnSurface',
      'accentOnBackground',
      'accentOnSurface',
      'dangerOnBackground',
      'dangerOnSurface',
    ]);
  });

  it('resolves theme references before evaluating contrast', () => {
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

    expect(
      getThemeContrastPairs({
        tokens: {
          color: {
            content: '{color.primitive.neutral.950}',
            background: '{color.primitive.neutral.0}',
          },
        },
        colorTokenOptions,
      })[0],
    ).toMatchObject({
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

  it('resolves semantic status role references like other theme colors', () => {
    const colorTokenOptions = createThemeColorTokenOptions([
      {
        path: 'color.primitive.blue.600',
        type: 'color',
        value: '#2563EB',
        status: 'ready',
      },
      {
        path: 'color.semantic.status.info.light',
        type: 'color',
        value: '{color.primitive.blue.600}',
        reference: '{color.primitive.blue.600}',
        status: 'ready',
      },
    ]);

    expect(
      getThemeColorValue({
        tokens: {
          color: {
            info: '{color.semantic.status.info.light}',
          },
        },
        colorKey: 'info',
        colorTokenOptions,
      }),
    ).toBe('#2563EB');
  });
});
