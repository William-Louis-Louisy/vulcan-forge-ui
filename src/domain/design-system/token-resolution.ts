import {
  designTokenValueSchema,
  type DesignToken,
} from './design-token.schema';

export type TokenResolutionErrorCode =
  | 'tokenNotFound'
  | 'circularReference'
  | 'invalidReference'
  | 'unresolvedReference';

export type TokenResolutionError = {
  code: TokenResolutionErrorCode;
  tokenPath: string;
  referencePath?: string;
  chain: string[];
};

export type ResolvedToken = {
  path: string;
  type: DesignToken['type'];
  rawValue: DesignToken['value'];
  resolvedValue: DesignToken['value'];
  reference: string | null;
  resolvedReferencePath: string | null;
  resolutionChain: string[];
  isResolved: boolean;
  errors: TokenResolutionError[];
};

export type TokenResolutionResult = {
  tokens: ResolvedToken[];
  errors: TokenResolutionError[];
};

type ResolveTokenValueResult = {
  resolvedValue: DesignToken['value'];
  resolvedReferencePath: string | null;
  chain: string[];
  errors: TokenResolutionError[];
};

type ResolveNestedValueResult = {
  value: unknown;
  errors: TokenResolutionError[];
};

export type TokenDictionary = Map<string, DesignToken>;

const tokenReferencePattern = /^\{([a-zA-Z0-9._-]+)\}$/;

export function pathToTokenReference(path: string): string {
  return `{${path}}`;
}

export function tokenReferenceToPath(reference: string): string | null {
  const match = tokenReferencePattern.exec(reference.trim());

  return match?.[1] ?? null;
}

export function isTokenReference(value: unknown): value is string {
  return typeof value === 'string' && tokenReferenceToPath(value) !== null;
}

export function createTokenDictionary(
  tokens: readonly DesignToken[],
): TokenDictionary {
  return new Map(tokens.map((token) => [token.path, token]));
}

function createError({
  code,
  tokenPath,
  referencePath,
  chain,
}: TokenResolutionError): TokenResolutionError {
  const error: TokenResolutionError = {
    code,
    tokenPath,
    chain,
  };

  if (referencePath) {
    error.referencePath = referencePath;
  }

  return error;
}

function resolveNestedValue({
  value,
  dictionary,
  chain,
  rootTokenPath,
}: {
  value: unknown;
  dictionary: TokenDictionary;
  chain: string[];
  rootTokenPath: string;
}): ResolveNestedValueResult {
  if (isTokenReference(value)) {
    const referencePath = tokenReferenceToPath(value);

    if (!referencePath) {
      return {
        value,
        errors: [
          createError({
            code: 'invalidReference',
            tokenPath: rootTokenPath,
            chain,
          }),
        ],
      };
    }

    if (chain.includes(referencePath)) {
      return {
        value,
        errors: [
          createError({
            code: 'circularReference',
            tokenPath: rootTokenPath,
            referencePath,
            chain: [...chain, referencePath],
          }),
        ],
      };
    }

    const referencedToken = dictionary.get(referencePath);

    if (!referencedToken) {
      return {
        value,
        errors: [
          createError({
            code: 'tokenNotFound',
            tokenPath: rootTokenPath,
            referencePath,
            chain,
          }),
        ],
      };
    }

    const nestedResolution = resolveTokenValue({
      token: referencedToken,
      dictionary,
      chain: [...chain, referencePath],
      rootTokenPath,
    });

    return {
      value:
        nestedResolution.errors.length === 0
          ? nestedResolution.resolvedValue
          : value,
      errors: nestedResolution.errors,
    };
  }

  if (Array.isArray(value)) {
    const resolvedItems = value.map((item) =>
      resolveNestedValue({
        value: item,
        dictionary,
        chain,
        rootTokenPath,
      }),
    );

    return {
      value: resolvedItems.map((item) => item.value),
      errors: resolvedItems.flatMap((item) => item.errors),
    };
  }

  if (typeof value === 'object' && value !== null) {
    const resolvedEntries = Object.entries(value).map(([key, nestedValue]) => {
      const result = resolveNestedValue({
        value: nestedValue,
        dictionary,
        chain,
        rootTokenPath,
      });

      return {
        key,
        ...result,
      };
    });

    return {
      value: Object.fromEntries(
        resolvedEntries.map(({ key, value: resolvedValue }) => [
          key,
          resolvedValue,
        ]),
      ),
      errors: resolvedEntries.flatMap((entry) => entry.errors),
    };
  }

  return {
    value,
    errors: [],
  };
}

function resolveTokenValue({
  token,
  dictionary,
  chain,
  rootTokenPath,
}: {
  token: DesignToken;
  dictionary: TokenDictionary;
  chain: string[];
  rootTokenPath: string;
}): ResolveTokenValueResult {
  const referenceValue = token.reference ?? token.value;

  if (!isTokenReference(referenceValue)) {
    if (typeof token.value !== 'object' || token.value === null) {
      return {
        resolvedValue: token.value,
        resolvedReferencePath: null,
        chain,
        errors: [],
      };
    }

    const nestedResolution = resolveNestedValue({
      value: token.value,
      dictionary,
      chain,
      rootTokenPath,
    });
    const parsedResolvedValue = designTokenValueSchema.safeParse(
      nestedResolution.value,
    );

    if (!parsedResolvedValue.success) {
      return {
        resolvedValue: token.value,
        resolvedReferencePath: null,
        chain,
        errors: [
          ...nestedResolution.errors,
          createError({
            code: 'unresolvedReference',
            tokenPath: rootTokenPath,
            chain,
          }),
        ],
      };
    }

    return {
      resolvedValue: parsedResolvedValue.data,
      resolvedReferencePath: null,
      chain,
      errors: nestedResolution.errors,
    };
  }

  const referencePath = tokenReferenceToPath(referenceValue);

  if (!referencePath) {
    return {
      resolvedValue: token.value,
      resolvedReferencePath: null,
      chain,
      errors: [
        createError({
          code: 'invalidReference',
          tokenPath: rootTokenPath,
          chain,
        }),
      ],
    };
  }

  if (chain.includes(referencePath)) {
    return {
      resolvedValue: token.value,
      resolvedReferencePath: referencePath,
      chain: [...chain, referencePath],
      errors: [
        createError({
          code: 'circularReference',
          tokenPath: rootTokenPath,
          referencePath,
          chain: [...chain, referencePath],
        }),
      ],
    };
  }

  const referencedToken = dictionary.get(referencePath);

  if (!referencedToken) {
    return {
      resolvedValue: token.value,
      resolvedReferencePath: referencePath,
      chain,
      errors: [
        createError({
          code: 'tokenNotFound',
          tokenPath: rootTokenPath,
          referencePath,
          chain,
        }),
      ],
    };
  }

  const nestedResolution = resolveTokenValue({
    token: referencedToken,
    dictionary,
    chain: [...chain, referencePath],
    rootTokenPath,
  });

  return {
    resolvedValue: nestedResolution.resolvedValue,
    resolvedReferencePath: referencePath,
    chain: nestedResolution.chain,
    errors: nestedResolution.errors,
  };
}

export function resolveDesignToken({
  token,
  dictionary,
}: {
  token: DesignToken;
  dictionary: TokenDictionary;
}): ResolvedToken {
  const resolution = resolveTokenValue({
    token,
    dictionary,
    chain: [token.path],
    rootTokenPath: token.path,
  });

  const referenceValue = token.reference ?? token.value;
  const referencePath = isTokenReference(referenceValue)
    ? tokenReferenceToPath(referenceValue)
    : null;

  return {
    path: token.path,
    type: token.type,
    rawValue: token.value,
    resolvedValue: resolution.resolvedValue,
    reference: typeof token.reference === 'string' ? token.reference : null,
    resolvedReferencePath: referencePath,
    resolutionChain: resolution.chain,
    isResolved: resolution.errors.length === 0,
    errors: resolution.errors,
  };
}

export function resolveDesignTokens(
  tokens: readonly DesignToken[],
): TokenResolutionResult {
  const dictionary = createTokenDictionary(tokens);

  const resolvedTokens = tokens.map((token) =>
    resolveDesignToken({
      token,
      dictionary,
    }),
  );

  return {
    tokens: resolvedTokens,
    errors: resolvedTokens.flatMap((token) => token.errors),
  };
}

export function getResolvedTokenByPath({
  path,
  result,
}: {
  path: string;
  result: TokenResolutionResult;
}): ResolvedToken | null {
  return result.tokens.find((token) => token.path === path) ?? null;
}
