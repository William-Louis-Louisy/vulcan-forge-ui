import {
  componentContractSchema,
  componentContractV2Schema,
  designTokenSchema,
  parseStoredComponentContractV2,
  pathToTokenReference,
  type DesignToken,
} from '@/domain/design-system';
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

type ComponentTokenReferenceSource = {
  name?: string | undefined;
  contract: unknown;
  key?: string | undefined;
  templateKey?: string | undefined;
  category?: string | undefined;
  contractVersion?: number | undefined;
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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
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

  if (isRecord(value)) {
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

function collectComponentDesignValueLocations({
  value,
  tokenPath,
  path = [],
}: {
  value: unknown;
  tokenPath: string;
  path?: string[];
}): string[] {
  if (Array.isArray(value)) {
    return value.flatMap((item, index) =>
      collectComponentDesignValueLocations({
        value: item,
        tokenPath,
        path: [...path, String(index)],
      }),
    );
  }

  if (!isRecord(value)) {
    return [];
  }

  if (
    value.source === 'token' &&
    typeof value.path === 'string' &&
    value.path === tokenPath
  ) {
    return [path.join('.') || 'root'];
  }

  return Object.entries(value).flatMap(([key, nestedValue]) =>
    collectComponentDesignValueLocations({
      value: nestedValue,
      tokenPath,
      path: [...path, key],
    }),
  );
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

  if (isRecord(value)) {
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

function removeComponentDesignValueTokenPath({
  value,
  tokenPath,
}: {
  value: unknown;
  tokenPath: string;
}): RemoveJsonReferenceResult {
  if (Array.isArray(value)) {
    let removedCount = 0;
    const nextValue = value.flatMap((item) => {
      const result = removeComponentDesignValueTokenPath({
        value: item,
        tokenPath,
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

  if (!isRecord(value)) {
    return {
      value,
      removedCount: 0,
      shouldRemove: false,
    };
  }

  if (
    value.source === 'token' &&
    typeof value.path === 'string' &&
    value.path === tokenPath
  ) {
    return {
      value: null,
      removedCount: 1,
      shouldRemove: true,
    };
  }

  let removedCount = 0;
  const nextValue = Object.fromEntries(
    Object.entries(value).flatMap(([key, nestedValue]) => {
      const result = removeComponentDesignValueTokenPath({
        value: nestedValue,
        tokenPath,
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

function parseStoredV2Component(source: ComponentTokenReferenceSource) {
  if (
    source.contractVersion !== 2 ||
    source.key === undefined ||
    source.name === undefined ||
    source.templateKey === undefined ||
    source.category === undefined
  ) {
    return null;
  }

  try {
    return parseStoredComponentContractV2({
      contractVersion: source.contractVersion,
      key: source.key,
      name: source.name,
      templateKey: source.templateKey,
      category: source.category,
      contract: source.contract,
    });
  } catch {
    return null;
  }
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
  key,
  name,
  templateKey,
  category,
  contractVersion,
}: {
  contract: unknown;
  tokenPath: string;
  key?: string;
  name?: string;
  templateKey?: string;
  category?: string;
  contractVersion?: number;
}): DetachTokenReferencesResult {
  const source = {
    contract,
    key,
    name,
    templateKey,
    category,
    contractVersion,
  };
  const parsedV2Contract = parseStoredV2Component(source);

  if (parsedV2Contract) {
    const designValueResult = removeComponentDesignValueTokenPath({
      value: parsedV2Contract,
      tokenPath,
    });
    const reparsedV2Contract = componentContractV2Schema.safeParse(
      designValueResult.value,
    );

    if (!reparsedV2Contract.success) {
      return {
        value: contract,
        removedCount: 0,
      };
    }

    const nextTokenBindings = reparsedV2Contract.data.tokenBindings.filter(
      (binding) => binding.tokenPath !== tokenPath,
    );
    const removedBindingsCount =
      reparsedV2Contract.data.tokenBindings.length - nextTokenBindings.length;
    const removedCount = designValueResult.removedCount + removedBindingsCount;

    if (removedCount === 0) {
      return {
        value: contract,
        removedCount: 0,
      };
    }

    return {
      value: componentContractV2Schema.parse({
        ...reparsedV2Contract.data,
        tokenBindings: nextTokenBindings,
      }),
      removedCount,
    };
  }

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
  componentContracts: ComponentTokenReferenceSource[];
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
    const parsedV2Contract = parseStoredV2Component(component);

    if (parsedV2Contract) {
      for (const location of collectComponentDesignValueLocations({
        value: parsedV2Contract,
        tokenPath,
      })) {
        dependencies.push({
          kind: 'component',
          label: `${component.name ?? parsedV2Contract.name} · ${location}`,
        });
      }

      for (const binding of parsedV2Contract.tokenBindings) {
        if (binding.tokenPath === tokenPath) {
          dependencies.push({
            kind: 'component',
            label: `${component.name ?? parsedV2Contract.name} · ${binding.key}`,
          });
        }
      }

      continue;
    }

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
          label: `${component.name ?? parsedContract.data.name} · ${binding.key}`,
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
