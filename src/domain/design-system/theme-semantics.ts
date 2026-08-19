import { z } from 'zod';
import {
  evaluateContrast,
  isHexColor,
  type ContrastEvaluation,
} from '@/domain/accessibility/contrast';
import { designTokenSchema } from './design-token.schema';
import { themeRoleKeySchema } from './theme-role-authoring';
import {
  pathToTokenReference,
  resolveDesignTokens,
  tokenReferenceToPath,
} from './token-resolution';
import { themeModeSchema, type ThemeMode } from './theme.schema';

export const themeModes = themeModeSchema.options;

export const themeCoreColorKeys = [
  'background',
  'surface',
  'content',
  'muted',
  'accent',
] as const;

export const themeStatusColorKeys = [
  'info',
  'success',
  'warning',
  'danger',
] as const;

export const themeColorKeys = [
  ...themeCoreColorKeys,
  ...themeStatusColorKeys,
] as const;

export type ThemeCoreColorKey = (typeof themeCoreColorKeys)[number];
export type ThemeStatusColorKey = (typeof themeStatusColorKeys)[number];
export type ThemeColorKey = (typeof themeColorKeys)[number];

export type DesignSystemTheme = {
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
  backgroundKey: ThemeCoreColorKey;
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
  {
    key: 'infoOnBackground',
    foregroundKey: 'info',
    backgroundKey: 'background',
  },
  {
    key: 'infoOnSurface',
    foregroundKey: 'info',
    backgroundKey: 'surface',
  },
  {
    key: 'successOnBackground',
    foregroundKey: 'success',
    backgroundKey: 'background',
  },
  {
    key: 'successOnSurface',
    foregroundKey: 'success',
    backgroundKey: 'surface',
  },
  {
    key: 'warningOnBackground',
    foregroundKey: 'warning',
    backgroundKey: 'background',
  },
  {
    key: 'warningOnSurface',
    foregroundKey: 'warning',
    backgroundKey: 'surface',
  },
  {
    key: 'dangerOnBackground',
    foregroundKey: 'danger',
    backgroundKey: 'background',
  },
  {
    key: 'dangerOnSurface',
    foregroundKey: 'danger',
    backgroundKey: 'surface',
  },
] as const satisfies readonly {
  key: string;
  foregroundKey: ThemeColorKey;
  backgroundKey: ThemeCoreColorKey;
}[];

const designTokenArraySchema = z.array(designTokenSchema);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isThemeStatusColorKey(
  value: ThemeColorKey,
): value is ThemeStatusColorKey {
  return themeStatusColorKeys.some((key) => key === value);
}

export function isThemeColorKey(value: string): value is ThemeColorKey {
  return themeColorKeys.some((key) => key === value);
}

export function isThemeMode(value: string): value is ThemeMode {
  return themeModeSchema.safeParse(value).success;
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

export function getThemeColorRoleKeys(tokens: unknown): string[] {
  if (!isRecord(tokens) || !isRecord(tokens.color)) {
    return [...themeColorKeys];
  }

  const customRoleKeys = Object.keys(tokens.color)
    .filter(
      (roleKey) =>
        !isThemeColorKey(roleKey) && themeRoleKeySchema.safeParse(roleKey).success,
    )
    .sort((firstRoleKey, secondRoleKey) =>
      firstRoleKey.localeCompare(secondRoleKey),
    );

  return [...themeColorKeys, ...customRoleKeys];
}

export function getThemeColorRawValue({
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

export function getThemeColorReferencePath({
  tokens,
  colorKey,
}: {
  tokens: unknown;
  colorKey: string;
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
  colorKey: string;
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
  return themeContrastPairDefinitions
    .filter((pair) => {
      if (!isThemeStatusColorKey(pair.foregroundKey)) {
        return true;
      }

      return (
        getThemeColorRawValue({
          tokens,
          colorKey: pair.foregroundKey,
        }) !== null
      );
    })
    .map((pair) => {
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
