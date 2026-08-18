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

export type DetachTokenReferencesResult = {
  value: unknown;
  removedCount: number;
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

type RemoveJsonReferenceResult = {
  value: unknown;
  removedCount: number;
  shouldRemove: boolean;
};

function removeJsonReference({
  value,
  reference,
}: {
  value: unknown;
  reference: string;
}): RemoveJsonReferenceResult {
  if (value === reference) {
    return {
      value: null,
      removedCount: 1,
      shouldRemove: true,
    };
  }

  if (Array.isArray(value)) {
    let removedCount = 0;
    const nextValue = value.flatMap((item) => {
      const result = removeJsonReference({
        value: item,
        reference,
      });

      removedCount += result.removedCount;

      return result.shouldRemove ? [] : [result.value];
    });

    return {
      value: nextValue,
      removedCount,
      shouldRemove: false,
    };
  }

  if (typeof value === 'object' && value !== null) {
    let removedCount = 0;
    const nextValue = Object.fromEntries(
      Object.entries(value).flatMap(([key, nestedValue]) => {
        const result = removeJsonReference({
          value: nestedValue,
          reference,
        });

        removedCount += result.removedCount;

        return result.shouldRemove ? [] : [[key, result.value]];
      }),
    );

    return {
      value: nextValue,
      removedCount,
      shouldRemove: false,
    };
  }

  return {
    value,
    removedCount: 0,
    shouldRemove: false,
  };
}

export function detachThemeTokenReferences({
  tokens,
  tokenPath,
}: {
  tokens: unknown;
  tokenPath: string;
}): DetachTokenReferencesResult {
  const result = removeJsonReference({
    value: tokens,
    reference: pathToTokenReference(tokenPath),
  });

  return {
    value: result.shouldRemove ? {} : result.value,
    removedCount: result.removedCount,
  };
}

export function detachComponentTokenBindings({
  contract,
  tokenPath,
}: {
  contract: unknown;
  tokenPath: string;
}): DetachTokenReferencesResult {
  const parsedContract = componentContractSchema.safeParse(contract);

  if (!parsedContract.success) {
    return {
      value: contract,
      removedCount: 0,
    };
  }

  const nextTokenBindings = parsedContract.data.tokenBindings.filter(
    (binding) => binding.tokenPath !== tokenPath,
  );
  const removedCount =
    parsedContract.data.tokenBindings.length - nextTokenBindings.length;

  if (removedCount === 0) {
    return {
      value: contract,
      removedCount: 0,
    };
  }

  return {
    value: {
      ...parsedContract.data,
      tokenBindings: nextTokenBindings,
    },
    removedCount,
  };
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

      if (
        token.reference === reference ||
        collectReferenceLocations({ value: token.value, reference }).length > 0
      ) {
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
