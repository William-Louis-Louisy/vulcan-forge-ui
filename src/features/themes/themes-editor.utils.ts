import {
  evaluateContrast,
  type ContrastEvaluation,
} from '@/domain/accessibility';

export const themeModes = ['light', 'dark'] as const;

export type ThemeMode = (typeof themeModes)[number];

export type ThemeEditorTheme = {
  id: string;
  mode: ThemeMode;
  name: string;
  tokens: unknown;
  updatedAt: Date;
};

export type ThemeColorPair = {
  key: string;
  foregroundKey: string;
  backgroundKey: string;
  foregroundValue: string | null;
  backgroundValue: string | null;
  contrast: ContrastEvaluation | null;
};

export const themeContrastPairDefinitions = [
  {
    key: 'contentOnBackground',
    foregroundKey: 'content',
    backgroundKey: 'background',
  },
  {
    key: 'mutedOnBackground',
    foregroundKey: 'muted',
    backgroundKey: 'background',
  },
  {
    key: 'contentOnSurface',
    foregroundKey: 'content',
    backgroundKey: 'surface',
  },
  {
    key: 'accentOnBackground',
    foregroundKey: 'accent',
    backgroundKey: 'background',
  },
] as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export function isThemeMode(value: string): value is ThemeMode {
  return themeModes.includes(value as ThemeMode);
}

export function sortThemesByMode<T extends { mode: ThemeMode }>(
  themes: T[],
): T[] {
  return [...themes].sort(
    (firstTheme, secondTheme) =>
      themeModes.indexOf(firstTheme.mode) -
      themeModes.indexOf(secondTheme.mode),
  );
}

export function getThemeColorValue({
  tokens,
  colorKey,
}: {
  tokens: unknown;
  colorKey: string;
}): string | null {
  if (!isRecord(tokens)) {
    return null;
  }

  const color = tokens.color;

  if (!isRecord(color)) {
    return null;
  }

  const value = color[colorKey];

  return typeof value === 'string' && value.trim().length > 0 ? value : null;
}

export function getThemeContrastPairs(tokens: unknown): ThemeColorPair[] {
  return themeContrastPairDefinitions.map((pair) => {
    const foregroundValue = getThemeColorValue({
      tokens,
      colorKey: pair.foregroundKey,
    });

    const backgroundValue = getThemeColorValue({
      tokens,
      colorKey: pair.backgroundKey,
    });

    return {
      key: pair.key,
      foregroundKey: pair.foregroundKey,
      backgroundKey: pair.backgroundKey,
      foregroundValue,
      backgroundValue,
      contrast:
        foregroundValue && backgroundValue
          ? evaluateContrast({
              foreground: foregroundValue,
              background: backgroundValue,
              textSize: 'normal',
            })
          : null,
    };
  });
}
