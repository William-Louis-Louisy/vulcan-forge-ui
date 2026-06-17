import {
  designTokenSetSchema,
  type ComponentContract,
  type DesignToken,
  type DesignTokenSet,
} from '@/domain/design-system';

export type ComponentResolvedTokenBinding = {
  key: string;
  tokenType: DesignToken['type'];
  tokenPath: string;
  value: DesignToken['value'];
  resolvedValue: DesignToken['value'];
  status: DesignToken['status'];
  isResolved: boolean;
};

export type ComponentTokenBindingResolution = {
  bindings: Record<string, ComponentResolvedTokenBinding>;
  missingBindings: ComponentContract['tokenBindings'];
  invalidTokenSetsCount: number;
};

export type ComponentTokenOption = {
  type: DesignToken['type'];
  path: string;
  label: string;
};

export function createComponentTokenOptions(
  rawTokenSets: Array<{
    type: string;
    name: string;
    tokens: unknown;
  }>,
): ComponentTokenOption[] {
  const parsedTokenSets = parseComponentTokenSets(rawTokenSets);

  return parsedTokenSets.tokenSets.flatMap((tokenSet) =>
    tokenSet.tokens.map((token) => ({
      type: token.type,
      path: token.path,
      label: token.path,
    })),
  );
}

export function parseComponentTokenSets(
  tokenSets: Array<{
    type: string;
    name: string;
    tokens: unknown;
  }>,
): {
  tokenSets: DesignTokenSet[];
  invalidTokenSetsCount: number;
} {
  const parsedTokenSets: DesignTokenSet[] = [];
  let invalidTokenSetsCount = 0;

  for (const tokenSet of tokenSets) {
    const parsedTokenSet = designTokenSetSchema.safeParse({
      type: tokenSet.type,
      name: tokenSet.name,
      tokens: tokenSet.tokens,
    });

    if (!parsedTokenSet.success) {
      invalidTokenSetsCount += 1;
      continue;
    }

    parsedTokenSets.push(parsedTokenSet.data);
  }

  return {
    tokenSets: parsedTokenSets,
    invalidTokenSetsCount,
  };
}

function getTokenReferencePath(value: DesignToken['value']): string | null {
  if (typeof value !== 'string') {
    return null;
  }

  const referenceMatch = value.match(/^\{([a-zA-Z0-9._-]+)\}$/);

  return referenceMatch?.[1] ?? null;
}

function findTokenByPath({
  tokenSets,
  tokenPath,
}: {
  tokenSets: DesignTokenSet[];
  tokenPath: string;
}): DesignToken | null {
  for (const tokenSet of tokenSets) {
    const token = tokenSet.tokens.find(
      (candidate) => candidate.path === tokenPath,
    );

    if (token) {
      return token;
    }
  }

  return null;
}

function resolveTokenValue({
  tokenSets,
  token,
  visitedPaths = new Set<string>(),
}: {
  tokenSets: DesignTokenSet[];
  token: DesignToken;
  visitedPaths?: Set<string>;
}): DesignToken['value'] {
  const referencePath = getTokenReferencePath(token.reference ?? token.value);

  if (!referencePath || visitedPaths.has(referencePath)) {
    return token.value;
  }

  visitedPaths.add(referencePath);

  const referencedToken = findTokenByPath({
    tokenSets,
    tokenPath: referencePath,
  });

  if (!referencedToken) {
    return token.value;
  }

  return resolveTokenValue({
    tokenSets,
    token: referencedToken,
    visitedPaths,
  });
}

export function resolveComponentTokenBindings({
  bindings,
  tokenSets,
}: {
  bindings: ComponentContract['tokenBindings'];
  tokenSets: DesignTokenSet[];
}): Omit<ComponentTokenBindingResolution, 'invalidTokenSetsCount'> {
  const resolvedBindings: Record<string, ComponentResolvedTokenBinding> = {};
  const missingBindings: ComponentContract['tokenBindings'] = [];

  for (const binding of bindings) {
    const token = findTokenByPath({
      tokenSets,
      tokenPath: binding.tokenPath,
    });

    if (!token || token.type !== binding.tokenType) {
      missingBindings.push(binding);
      continue;
    }

    resolvedBindings[binding.key] = {
      key: binding.key,
      tokenType: token.type,
      tokenPath: binding.tokenPath,
      value: token.value,
      resolvedValue: resolveTokenValue({
        tokenSets,
        token,
      }),
      status: token.status,
      isResolved: true,
    };
  }

  return {
    bindings: resolvedBindings,
    missingBindings,
  };
}

export function createComponentTokenBindingResolution({
  bindings,
  rawTokenSets,
}: {
  bindings: ComponentContract['tokenBindings'];
  rawTokenSets: Array<{
    type: string;
    name: string;
    tokens: unknown;
  }>;
}): ComponentTokenBindingResolution {
  const parsedTokenSets = parseComponentTokenSets(rawTokenSets);
  const resolvedBindings = resolveComponentTokenBindings({
    bindings,
    tokenSets: parsedTokenSets.tokenSets,
  });

  return {
    ...resolvedBindings,
    invalidTokenSetsCount: parsedTokenSets.invalidTokenSetsCount,
  };
}
