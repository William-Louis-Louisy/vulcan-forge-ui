import { describe, expect, it } from 'vitest';
import {
  createThemeColorTokenOptions,
  getThemeContrastPairs,
  isThemeMode,
  sortThemesByMode,
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
});
