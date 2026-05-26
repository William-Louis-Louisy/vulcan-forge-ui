import { z } from 'zod';
import {
  designTokenSchema,
  getResolvedTokenByPath,
  resolveDesignTokens,
} from '@/domain/design-system';
import {
  getThemeColorValue,
  sortThemesByMode,
  type ThemeEditorTheme,
  type ThemeMode,
} from './themes-editor.utils';

const designTokenArraySchema = z.array(designTokenSchema);

export type PreviewThemeColors = {
  background: string;
  surface: string;
  content: string;
  muted: string;
  accent: string;
  border: string;
};

export type PreviewTheme = {
  id: string;
  mode: ThemeMode;
  name: string;
  colors: PreviewThemeColors;
};

const fallbackThemeColors: Record<ThemeMode, PreviewThemeColors> = {
  light: {
    background: '#f7f3eb',
    surface: '#ffffff',
    content: '#111827',
    muted: '#3a4454',
    accent: '#ff8731',
    border: '#d9d2c4',
  },
  dark: {
    background: '#070707',
    surface: '#1e1e1e',
    content: '#e2e7ef',
    muted: '#a0b1ca',
    accent: '#ff8731',
    border: '#303030',
  },
};

function getResolvedStringTokenValue({
  tokens,
  path,
}: {
  tokens: unknown;
  path: string;
}): string | null {
  const parsedTokens = designTokenArraySchema.safeParse(tokens);

  if (!parsedTokens.success) {
    return null;
  }

  const resolution = resolveDesignTokens(parsedTokens.data);
  const token = getResolvedTokenByPath({
    path,
    result: resolution,
  });

  return typeof token?.resolvedValue === 'string' ? token.resolvedValue : null;
}

export function createPreviewTheme({
  theme,
  colorTokenSetTokens,
}: {
  theme: ThemeEditorTheme;
  colorTokenSetTokens: unknown;
}): PreviewTheme {
  const fallbackColors = fallbackThemeColors[theme.mode];

  const resolvedAccent =
    getResolvedStringTokenValue({
      tokens: colorTokenSetTokens,
      path: 'color.semantic.action.primary',
    }) ??
    getThemeColorValue({
      tokens: theme.tokens,
      colorKey: 'accent',
    });

  return {
    id: theme.id,
    mode: theme.mode,
    name: theme.name,
    colors: {
      background:
        getThemeColorValue({
          tokens: theme.tokens,
          colorKey: 'background',
        }) ?? fallbackColors.background,
      surface:
        getThemeColorValue({
          tokens: theme.tokens,
          colorKey: 'surface',
        }) ?? fallbackColors.surface,
      content:
        getThemeColorValue({
          tokens: theme.tokens,
          colorKey: 'content',
        }) ?? fallbackColors.content,
      muted:
        getThemeColorValue({
          tokens: theme.tokens,
          colorKey: 'muted',
        }) ?? fallbackColors.muted,
      accent: resolvedAccent ?? fallbackColors.accent,
      border: fallbackColors.border,
    },
  };
}

export function createPreviewThemes({
  themes,
  colorTokenSetTokens,
}: {
  themes: ThemeEditorTheme[];
  colorTokenSetTokens: unknown;
}): PreviewTheme[] {
  return sortThemesByMode(themes).map((theme) =>
    createPreviewTheme({
      theme,
      colorTokenSetTokens,
    }),
  );
}

export function getDefaultPreviewThemeMode(
  themes: readonly PreviewTheme[],
): ThemeMode {
  return (
    themes.find((theme) => theme.mode === 'light')?.mode ??
    themes[0]?.mode ??
    'light'
  );
}
