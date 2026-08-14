import type { ComponentContract } from './component-contract.schema';
import {
  designTokenSetSchema,
  type DesignToken,
  type DesignTokenSet,
} from './design-token.schema';
import {
  createTokenDictionary,
  resolveDesignToken,
  type TokenDictionary,
} from './token-resolution';

export type RawComponentTokenSet = {
  type: string;
  name: string;
  tokens: unknown;
};

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

export type ParsedComponentTokenSets = {
  tokenSets: DesignTokenSet[];
  invalidTokenSetsCount: number;
};

export function parseComponentTokenSets(
  tokenSets: RawComponentTokenSet[],
): ParsedComponentTokenSets {
  const parsedTokenSets: DesignTokenSet[] = [];
  let invalidTokenSetsCount = 0;

  for (const tokenSet of tokenSets) {
    const parsedTokenSet = designTokenSetSchema.safeParse(tokenSet);

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

function createComponentTokenDictionary(
  tokenSets: DesignTokenSet[],
): TokenDictionary {
  return createTokenDictionary(
    tokenSets.flatMap((tokenSet) => tokenSet.tokens),
  );
}

function resolveComponentTokenValue({
  dictionary,
  token,
}: {
  dictionary: TokenDictionary;
  token: DesignToken;
}): DesignToken['value'] {
  const resolvedToken = resolveDesignToken({
    token,
    dictionary,
  });

  return resolvedToken.isResolved ? resolvedToken.resolvedValue : token.value;
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
  const dictionary = createComponentTokenDictionary(tokenSets);

  for (const binding of bindings) {
    const token = dictionary.get(binding.tokenPath);

    if (!token || token.type !== binding.tokenType) {
      missingBindings.push(binding);
      continue;
    }

    resolvedBindings[binding.key] = {
      key: binding.key,
      tokenType: token.type,
      tokenPath: binding.tokenPath,
      value: token.value,
      resolvedValue: resolveComponentTokenValue({
        dictionary,
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
  rawTokenSets: RawComponentTokenSet[];
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
