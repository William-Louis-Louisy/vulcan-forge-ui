import {
  createThemeColorTokenOptions,
  getThemeColorRawValue,
  getThemeColorValue,
  sortThemesByMode,
  themeColorKeys,
  type ThemeColorKey,
  type ThemeEditorTheme,
  type ThemeMode,
} from './themes-editor.utils';

export type PreviewThemeColors = {
  background: string;
  surface: string;
  content: string;
  muted: string;
  accent: string;
  info: string;
  success: string;
  warning: string;
  danger: string;
  accentContent: string;
  accentSoft: string;
  border: string;
};

export type PreviewThemePaletteEntry = {
  key: ThemeColorKey;
  value: string;
  rawValue: string | null;
  status: 'resolved' | 'fallback';
};

export type PreviewTheme = {
  id: string;
  mode: ThemeMode;
  name: string;
  colors: PreviewThemeColors;
  palette: PreviewThemePaletteEntry[];
  resolvedColorCount: number;
  fallbackColorKeys: ThemeColorKey[];
};

type PreviewThemeBaseColors = Record<ThemeColorKey, string> & {
  border: string;
};

const fallbackThemeColors: Record<ThemeMode, PreviewThemeBaseColors> = {
  light: {
    background: '#f7f3eb',
    surface: '#ffffff',
    content: '#111827',
    muted: '#3a4454',
    accent: '#ff8731',
    info: '#2563eb',
    success: '#15803d',
    warning: '#b45309',
    danger: '#b91c1c',
    border: '#d9d2c4',
  },
  dark: {
    background: '#070707',
    surface: '#1e1e1e',
    content: '#e2e7ef',
    muted: '#a0b1ca',
    accent: '#ff8731',
    info: '#60a5fa',
    success: '#4ade80',
    warning: '#fbbf24',
    danger: '#f87171',
    border: '#303030',
  },
};

export function createPreviewTheme({
  theme,
  colorTokenSetTokens,
}: {
  theme: ThemeEditorTheme;
  colorTokenSetTokens: unknown;
}): PreviewTheme {
  const fallbackColors = fallbackThemeColors[theme.mode];
  const colorTokenOptions = createThemeColorTokenOptions(colorTokenSetTokens);
  const resolvedPrimaryAction =
    colorTokenOptions.find(
      (option) => option.path === 'color.semantic.action.primary',
    )?.value ?? null;

  const palette = themeColorKeys.map((key) => {
    const rawValue = getThemeColorRawValue({
      tokens: theme.tokens,
      colorKey: key,
    });
    const resolvedValue = getThemeColorValue({
      tokens: theme.tokens,
      colorKey: key,
      colorTokenOptions,
    });
    const semanticAccentFallback =
      key === 'accent' ? resolvedPrimaryAction : null;

    return {
      key,
      rawValue,
      value: resolvedValue ?? semanticAccentFallback ?? fallbackColors[key],
      status: resolvedValue || semanticAccentFallback ? 'resolved' : 'fallback',
    } satisfies PreviewThemePaletteEntry;
  });

  const paletteByKey = Object.fromEntries(
    palette.map((entry) => [entry.key, entry.value]),
  ) as Record<ThemeColorKey, string>;
  const fallbackColorKeys = palette
    .filter((entry) => entry.status === 'fallback')
    .map((entry) => entry.key);
  const accentContent = getReadableAccentContent(paletteByKey.accent);

  return {
    id: theme.id,
    mode: theme.mode,
    name: theme.name,
    colors: {
      background: paletteByKey.background,
      surface: paletteByKey.surface,
      content: paletteByKey.content,
      muted: paletteByKey.muted,
      accent: paletteByKey.accent,
      info: paletteByKey.info,
      success: paletteByKey.success,
      warning: paletteByKey.warning,
      danger: paletteByKey.danger,
      accentContent,
      accentSoft: `color-mix(in srgb, ${paletteByKey.accent} 16%, ${paletteByKey.surface})`,
      border: fallbackColors.border,
    },
    palette,
    resolvedColorCount: palette.length - fallbackColorKeys.length,
    fallbackColorKeys,
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

export function getReadableAccentContent(accent: string): string {
  const normalizedAccent = accent.trim().replace('#', '');

  if (!/^[0-9a-fA-F]{6}$/.test(normalizedAccent)) {
    return '#111111';
  }

  const red = Number.parseInt(normalizedAccent.slice(0, 2), 16);
  const green = Number.parseInt(normalizedAccent.slice(2, 4), 16);
  const blue = Number.parseInt(normalizedAccent.slice(4, 6), 16);
  const luminance = (0.2126 * red + 0.7152 * green + 0.0722 * blue) / 255;

  return luminance > 0.52 ? '#111111' : '#ffffff';
}
