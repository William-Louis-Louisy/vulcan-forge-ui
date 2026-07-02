const DEFAULT_PROJECT_SWATCHES = ['#ffffff', '#070707', '#FF8731', '#586644'];

const PROJECT_SWATCH_TOKEN_PATH_GROUPS = [
  [
    'color.semantic.background.app',
    'color.primitive.neutral.950',
    'color.bg.app',
    'color.background.app',
  ],
  [
    'color.primitive.neutral.0',
    'color.primitive.neutral.50',
    'color.semantic.foreground.primary',
    'color.fg.primary',
  ],
  [
    'color.semantic.action.primary',
    'color.primitive.accent.primary',
    'color.action.primary',
    'color.action.accent',
  ],
  [
    'color.primitive.accent.secondary',
    'color.semantic.action.secondary',
    'color.action.secondary',
    'color.semantic.action.danger',
    'color.action.danger',
  ],
];

type RawTokenSet = {
  tokens: unknown;
};

type RawToken = {
  path?: unknown;
  value?: unknown;
  reference?: unknown;
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

function resolveFirstAvailableColor({
  paths,
  tokenMap,
}: {
  paths: string[];
  tokenMap: Map<string, RawToken>;
}) {
  for (const path of paths) {
    const color = resolveTokenColor({
      path,
      tokenMap,
    });

    if (color) {
      return color;
    }
  }

  return null;
}

export function createProjectCardSwatches(tokenSets: RawTokenSet[]) {
  const tokenMap = createTokenMap(tokenSets);

  return PROJECT_SWATCH_TOKEN_PATH_GROUPS.map((paths, index) => {
    return (
      resolveFirstAvailableColor({
        paths,
        tokenMap,
      }) ?? DEFAULT_PROJECT_SWATCHES[index]
    );
  });
}
