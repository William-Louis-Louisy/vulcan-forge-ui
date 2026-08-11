const DEFAULT_PROJECT_SWATCHES = ['#ffffff', '#070707', '#FF8731', '#586644'];
const PROJECT_SWATCH_THEME_ROLES = [
  'background',
  'surface',
  'accent',
  'content',
] as const;

type RawTokenSet = {
  tokens: unknown;
};

type RawTheme = {
  mode: unknown;
  tokens: unknown;
};

type RawToken = {
  path?: unknown;
  value?: unknown;
  reference?: unknown;
};

type ProjectPaletteInput = {
  tokenSets: RawTokenSet[];
  themes: RawTheme[];
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isHexColor(value: unknown): value is string {
  return (
    typeof value === 'string' &&
    /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(value)
  );
}

function getReferencePath(value: unknown) {
  if (typeof value === 'string') {
    const match = value.match(/^\{(.+)\}$/);
    return match?.[1] ?? null;
  }

  if (isRecord(value) && typeof value.path === 'string') {
    return value.path;
  }

  return null;
}

function parseRawTokens(rawTokens: unknown): RawToken[] {
  const parsedTokens = Array.isArray(rawTokens)
    ? rawTokens
    : isRecord(rawTokens)
      ? Object.entries(rawTokens).map(([path, value]) =>
          isRecord(value) ? { path, ...value } : { path, value },
        )
      : [];

  return parsedTokens.filter(isRecord);
}

function createTokenMap(tokenSets: RawTokenSet[]) {
  const tokenMap = new Map<string, RawToken>();

  for (const tokenSet of tokenSets) {
    for (const token of parseRawTokens(tokenSet.tokens)) {
      if (typeof token.path === 'string') {
        tokenMap.set(token.path, token);
      }
    }
  }

  return tokenMap;
}

function resolveTokenColor({
  path,
  tokenMap,
  visited = new Set<string>(),
}: {
  path: string;
  tokenMap: Map<string, RawToken>;
  visited?: Set<string>;
}): string | null {
  if (visited.has(path)) {
    return null;
  }

  visited.add(path);

  const token = tokenMap.get(path);

  if (!token) {
    return null;
  }

  if (isHexColor(token.value)) {
    return token.value;
  }

  const referencePath =
    getReferencePath(token.reference) ?? getReferencePath(token.value);

  if (!referencePath) {
    return null;
  }

  return resolveTokenColor({
    path: referencePath,
    tokenMap,
    visited,
  });
}

function getThemeRoleValue(themeTokens: unknown, role: string): unknown {
  if (!isRecord(themeTokens)) {
    return null;
  }

  const color = themeTokens.color;

  if (!isRecord(color)) {
    return null;
  }

  return color[role];
}

function resolveThemeRoleColor({
  themeTokens,
  role,
  tokenMap,
}: {
  themeTokens: unknown;
  role: string;
  tokenMap: Map<string, RawToken>;
}) {
  const rawValue = getThemeRoleValue(themeTokens, role);

  if (isHexColor(rawValue)) {
    return rawValue;
  }

  const referencePath = getReferencePath(rawValue);

  return referencePath
    ? resolveTokenColor({
        path: referencePath,
        tokenMap,
      })
    : null;
}

function createAvailableResolvedColors(tokenMap: Map<string, RawToken>) {
  const colors: string[] = [];

  for (const path of tokenMap.keys()) {
    const color = resolveTokenColor({
      path,
      tokenMap,
    });

    if (color && !colors.includes(color)) {
      colors.push(color);
    }
  }

  return colors;
}

export function createProjectCardSwatches({
  tokenSets,
  themes,
}: ProjectPaletteInput) {
  const tokenMap = createTokenMap(tokenSets);
  const preferredTheme =
    themes.find((theme) => theme.mode === 'light') ?? themes[0] ?? null;
  const availableResolvedColors = createAvailableResolvedColors(tokenMap);
  const usedColors = new Set<string>();

  return PROJECT_SWATCH_THEME_ROLES.map((role, index) => {
    const themeColor = preferredTheme
      ? resolveThemeRoleColor({
          themeTokens: preferredTheme.tokens,
          role,
          tokenMap,
        })
      : null;

    if (themeColor) {
      usedColors.add(themeColor);
      return themeColor;
    }

    const availableColor = availableResolvedColors.find(
      (color) => !usedColors.has(color),
    );

    if (availableColor) {
      usedColors.add(availableColor);
      return availableColor;
    }

    return DEFAULT_PROJECT_SWATCHES[index] ?? '#000000';
  });
}
