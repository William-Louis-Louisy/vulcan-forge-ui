import {
  componentContractSchema,
  designTokenSchema,
} from '@/domain/design-system';
import { pathToTokenReference } from '@/domain/design-system';
import type { DesignToken } from '@/domain/design-system';
import type { DeleteTokenDependency } from './delete-token.state';

export type DeleteTokenResult =
  | {
      status: 'success';
      tokens: DesignToken[];
    }
  | {
      status: 'error';
      error: 'tokenNotFound';
    };

function parseTokenArray(tokens: unknown): DesignToken[] {
  if (!Array.isArray(tokens)) {
    return [];
  }

  return tokens.flatMap((token) => {
    const parsedToken = designTokenSchema.safeParse(token);

    return parsedToken.success ? [parsedToken.data] : [];
  });
}

function collectReferenceLocations({
  value,
  reference,
  path = [],
}: {
  value: unknown;
  reference: string;
  path?: string[];
}): string[] {
  if (value === reference) {
    return [path.join('.') || 'root'];
  }

  if (Array.isArray(value)) {
    return value.flatMap((item, index) =>
      collectReferenceLocations({
        value: item,
        reference,
        path: [...path, String(index)],
      }),
    );
  }

  if (typeof value === 'object' && value !== null) {
    return Object.entries(value).flatMap(([key, nestedValue]) =>
      collectReferenceLocations({
        value: nestedValue,
        reference,
        path: [...path, key],
      }),
    );
  }

  return [];
}

export function findTokenDependencies({
  tokenPath,
  tokenSets,
  themes,
  componentContracts,
}: {
  tokenPath: string;
  tokenSets: Array<{ tokens: unknown }>;
  themes: Array<{ name: string; tokens: unknown }>;
  componentContracts: Array<{ name: string; contract: unknown }>;
}): DeleteTokenDependency[] {
  const reference = pathToTokenReference(tokenPath);
  const dependencies: DeleteTokenDependency[] = [];

  for (const tokenSet of tokenSets) {
    for (const token of parseTokenArray(tokenSet.tokens)) {
      if (token.path === tokenPath) {
        continue;
      }

      if (token.reference === reference || token.value === reference) {
        dependencies.push({
          kind: 'token',
          label: token.path,
        });
      }
    }
  }

  for (const theme of themes) {
    for (const location of collectReferenceLocations({
      value: theme.tokens,
      reference,
    })) {
      dependencies.push({
        kind: 'theme',
        label: `${theme.name} · ${location}`,
      });
    }
  }

  for (const component of componentContracts) {
    const parsedContract = componentContractSchema.safeParse(
      component.contract,
    );

    if (!parsedContract.success) {
      continue;
    }

    for (const binding of parsedContract.data.tokenBindings) {
      if (binding.tokenPath === tokenPath) {
        dependencies.push({
          kind: 'component',
          label: `${component.name} · ${binding.key}`,
        });
      }
    }
  }

  return dependencies;
}

export function removeTokenByPath({
  tokens,
  tokenPath,
}: {
  tokens: DesignToken[];
  tokenPath: string;
}): DeleteTokenResult {
  if (!tokens.some((token) => token.path === tokenPath)) {
    return {
      status: 'error',
      error: 'tokenNotFound',
    };
  }

  return {
    status: 'success',
    tokens: tokens.filter((token) => token.path !== tokenPath),
  };
}
