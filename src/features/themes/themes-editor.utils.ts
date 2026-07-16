import { z } from 'zod';
import {
  isHexColor,
  evaluateContrast,
  type ContrastEvaluation,
} from '@/domain/accessibility';
import {
  designTokenSchema,
  resolveDesignTokens,
  pathToTokenReference,
  tokenReferenceToPath,
} from '@/domain/design-system';

export const themeModes = ['light', 'dark'] as const;

export type ThemeMode = (typeof themeModes)[number];

export const themeColorKeys = [
  'background',
  'surface',
  'content',
  'muted',
  'accent',
] as const;

export type ThemeColorKey = (typeof themeColorKeys)[number];

export type ThemeEditorTheme = {
  id: string;
  mode: ThemeMode;
  name: string;
  tokens: unknown;
  updatedAt: Date;
};

export type ThemeColorTokenOption = {
  path: string;
  reference: string;
  value: string;
  label: string;
};

export type ThemeColorPair = {
  key: string;
  foregroundKey: ThemeColorKey;
  backgroundKey: ThemeColorKey;
  foregroundReferencePath: string | null;
  backgroundReferencePath: string | null;
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
    key: 'contentOnSurface',
    foregroundKey: 'content',
    backgroundKey: 'surface',
  },
  {
    key: 'mutedOnBackground',
    foregroundKey: 'muted',
    backgroundKey: 'background',
  },
  {
    key: 'mutedOnSurface',
    foregroundKey: 'muted',
    backgroundKey: 'surface',
  },
  {
    key: 'accentOnBackground',
    foregroundKey: 'accent',
    backgroundKey: 'background',
  },
  {
    key: 'accentOnSurface',
    foregroundKey: 'accent',
    backgroundKey: 'surface',
  },
] as const satisfies readonly {
  key: string;
  foregroundKey: ThemeColorKey;
  backgroundKey: ThemeColorKey;
}[];

const designTokenArraySchema = z.array(designTokenSchema);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
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

export function createThemeColorTokenOptions(
  tokens: unknown,
): ThemeColorTokenOption[] {
  const parsedTokens = designTokenArraySchema.safeParse(tokens);

  if (!parsedTokens.success) {
    return [];
  }

  const resolvedTokens = resolveDesignTokens(parsedTokens.data);

  return resolvedTokens.tokens
    .filter(
      (token) =>
        token.type === 'color' &&
        token.isResolved &&
        typeof token.resolvedValue === 'string' &&
        isHexColor(token.resolvedValue),
    )
    .map((token) => ({
      path: token.path,
      reference: pathToTokenReference(token.path),
      value: token.resolvedValue as string,
      label: token.path,
    }))
    .sort((firstOption, secondOption) => {
      const firstIsSemantic = firstOption.path.startsWith('color.semantic.');
      const secondIsSemantic = secondOption.path.startsWith('color.semantic.');

      if (firstIsSemantic && !secondIsSemantic) {
        return -1;
      }

      if (!firstIsSemantic && secondIsSemantic) {
        return 1;
      }

      return firstOption.path.localeCompare(secondOption.path);
    });
}

export function getThemeColorRawValue({
  tokens,
  colorKey,
}: {
  tokens: unknown;
  colorKey: ThemeColorKey;
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

export function getThemeColorReferencePath({
  tokens,
  colorKey,
}: {
  tokens: unknown;
  colorKey: ThemeColorKey;
}): string | null {
  const rawValue = getThemeColorRawValue({
    tokens,
    colorKey,
  });

  return rawValue ? tokenReferenceToPath(rawValue) : null;
}

export function getThemeColorValue({
  tokens,
  colorKey,
  colorTokenOptions = [],
}: {
  tokens: unknown;
  colorKey: ThemeColorKey;
  colorTokenOptions?: ThemeColorTokenOption[];
}): string | null {
  const rawValue = getThemeColorRawValue({
    tokens,
    colorKey,
  });

  if (!rawValue) {
    return null;
  }

  const referencePath = tokenReferenceToPath(rawValue);

  if (referencePath) {
    return (
      colorTokenOptions.find((option) => option.path === referencePath)
        ?.value ?? null
    );
  }

  return isHexColor(rawValue) ? rawValue : null;
}

export function getThemeContrastPairs({
  tokens,
  colorTokenOptions = [],
}: {
  tokens: unknown;
  colorTokenOptions?: ThemeColorTokenOption[];
}): ThemeColorPair[] {
  return themeContrastPairDefinitions.map((pair) => {
    const foregroundReferencePath = getThemeColorReferencePath({
      tokens,
      colorKey: pair.foregroundKey,
    });

    const backgroundReferencePath = getThemeColorReferencePath({
      tokens,
      colorKey: pair.backgroundKey,
    });

    const foregroundValue = getThemeColorValue({
      tokens,
      colorKey: pair.foregroundKey,
      colorTokenOptions,
    });

    const backgroundValue = getThemeColorValue({
      tokens,
      colorKey: pair.backgroundKey,
      colorTokenOptions,
    });

    return {
      key: pair.key,
      foregroundKey: pair.foregroundKey,
      backgroundKey: pair.backgroundKey,
      foregroundReferencePath,
      backgroundReferencePath,
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
