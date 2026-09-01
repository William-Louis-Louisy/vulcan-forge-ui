// Visual design-system tokens only: colors, spacing, radius, typography and motion.
import { componentContractSchema } from '../component-contract.schema';
import {
  componentContractV2Schema,
  parseStoredComponentContractV2,
} from '../component-contract-v2.schema';
import type { DesignToken } from '../design-token.schema';
import { pathToTokenReference } from '../token-resolution';
import { replaceDesignSystemReference } from './json-reference-migration';

export type RenameTokenResult =
  | {
      status: 'success';
      tokens: DesignToken[];
      migratedReferencesCount: number;
    }
  | {
      status: 'error';
      error: 'tokenNotFound' | 'tokenPathAlreadyExists';
    };

export type ProjectTokenSetForRename = {
  id: string;
  tokens: DesignToken[];
};

export type ProjectThemeForRename = {
  id: string;
  tokens: unknown;
};

export type ProjectComponentForRename = {
  id: string;
  contract: unknown;
  key?: string;
  name?: string;
  templateKey?: string;
  category?: string;
  contractVersion?: number;
};

export type RenameTokenAcrossProjectResult =
  | {
      status: 'success';
      tokenSetUpdates: Array<{
        id: string;
        tokens: DesignToken[];
      }>;
      themeUpdates: Array<{
        id: string;
        tokens: unknown;
      }>;
      componentUpdates: Array<{
        id: string;
        contract: unknown;
      }>;
      migratedReferencesCount: number;
    }
  | {
      status: 'error';
      error: 'tokenNotFound' | 'tokenPathAlreadyExists';
    };

function migrateTokenReferences({
  tokens,
  currentReference,
  nextReference,
}: {
  tokens: DesignToken[];
  currentReference: string;
  nextReference: string;
}) {
  let migratedReferencesCount = 0;

  const nextTokens = tokens.map((token) => {
    const valueMigration = replaceDesignSystemReference({
      value: token.value,
      currentReference,
      nextReference,
    });
    const shouldMigrateReference = token.reference === currentReference;

    migratedReferencesCount += valueMigration.migratedReferencesCount;

    if (shouldMigrateReference) {
      migratedReferencesCount += 1;
    }

    if (
      valueMigration.migratedReferencesCount === 0 &&
      !shouldMigrateReference
    ) {
      return token;
    }

    return {
      ...token,
      value: valueMigration.value as DesignToken['value'],
      ...(shouldMigrateReference ? { reference: nextReference } : {}),
    };
  });

  return {
    tokens: nextTokens,
    migratedReferencesCount,
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function replaceComponentDesignValueTokenPath({
  value,
  currentTokenPath,
  nextTokenPath,
}: {
  value: unknown;
  currentTokenPath: string;
  nextTokenPath: string;
}): { value: unknown; migratedReferencesCount: number } {
  if (Array.isArray(value)) {
    let migratedReferencesCount = 0;
    const nextValue = value.map((item) => {
      const migration = replaceComponentDesignValueTokenPath({
        value: item,
        currentTokenPath,
        nextTokenPath,
      });

      migratedReferencesCount += migration.migratedReferencesCount;
      return migration.value;
    });

    return { value: nextValue, migratedReferencesCount };
  }

  if (!isRecord(value)) {
    return { value, migratedReferencesCount: 0 };
  }

  if (
    value.source === 'token' &&
    typeof value.path === 'string' &&
    value.path === currentTokenPath
  ) {
    return {
      value: {
        ...value,
        path: nextTokenPath,
      },
      migratedReferencesCount: 1,
    };
  }

  let migratedReferencesCount = 0;
  const nextValue = Object.fromEntries(
    Object.entries(value).map(([key, nestedValue]) => {
      const migration = replaceComponentDesignValueTokenPath({
        value: nestedValue,
        currentTokenPath,
        nextTokenPath,
      });

      migratedReferencesCount += migration.migratedReferencesCount;
      return [key, migration.value];
    }),
  );

  return { value: nextValue, migratedReferencesCount };
}

function migrateLegacyComponentTokenPath({
  contract,
  currentTokenPath,
  nextTokenPath,
}: {
  contract: unknown;
  currentTokenPath: string;
  nextTokenPath: string;
}): { contract: unknown; migratedReferencesCount: number } | null {
  const parsedContract = componentContractSchema.safeParse(contract);

  if (!parsedContract.success) {
    return null;
  }

  let migratedReferencesCount = 0;
  const tokenBindings = parsedContract.data.tokenBindings.map((binding) => {
    if (binding.tokenPath !== currentTokenPath) {
      return binding;
    }

    migratedReferencesCount += 1;
    return {
      ...binding,
      tokenPath: nextTokenPath,
    };
  });

  return {
    contract: {
      ...parsedContract.data,
      tokenBindings,
    },
    migratedReferencesCount,
  };
}

function migrateV2ComponentTokenPath({
  component,
  currentTokenPath,
  nextTokenPath,
}: {
  component: ProjectComponentForRename;
  currentTokenPath: string;
  nextTokenPath: string;
}): { contract: unknown; migratedReferencesCount: number } | null {
  if (
    component.contractVersion !== 2 ||
    component.key === undefined ||
    component.name === undefined ||
    component.templateKey === undefined ||
    component.category === undefined
  ) {
    return null;
  }

  try {
    const contract = parseStoredComponentContractV2({
      contractVersion: component.contractVersion,
      key: component.key,
      name: component.name,
      templateKey: component.templateKey,
      category: component.category,
      contract: component.contract,
    });
    const designValueMigration = replaceComponentDesignValueTokenPath({
      value: contract,
      currentTokenPath,
      nextTokenPath,
    });
    const reparsedContract = componentContractV2Schema.parse(
      designValueMigration.value,
    );
    let tokenBindingMigrationCount = 0;
    const tokenBindings = reparsedContract.tokenBindings.map((binding) => {
      if (binding.tokenPath !== currentTokenPath) {
        return binding;
      }

      tokenBindingMigrationCount += 1;
      return {
        ...binding,
        tokenPath: nextTokenPath,
      };
    });

    return {
      contract: componentContractV2Schema.parse({
        ...reparsedContract,
        tokenBindings,
      }),
      migratedReferencesCount:
        designValueMigration.migratedReferencesCount +
        tokenBindingMigrationCount,
    };
  } catch {
    return null;
  }
}

export function renameTokenAndMigrateReferences({
  tokens,
  currentTokenPath,
  nextTokenPath,
}: {
  tokens: DesignToken[];
  currentTokenPath: string;
  nextTokenPath: string;
}): RenameTokenResult {
  const trimmedNextTokenPath = nextTokenPath.trim();

  const tokenToRename = tokens.find((token) => token.path === currentTokenPath);

  if (!tokenToRename) {
    return {
      status: 'error',
      error: 'tokenNotFound',
    };
  }

  const pathAlreadyExists = tokens.some(
    (token) =>
      token.path === trimmedNextTokenPath && token.path !== currentTokenPath,
  );

  if (pathAlreadyExists) {
    return {
      status: 'error',
      error: 'tokenPathAlreadyExists',
    };
  }

  const currentReference = pathToTokenReference(currentTokenPath);
  const nextReference = pathToTokenReference(trimmedNextTokenPath);
  const renamedTokens = tokens.map((token) =>
    token.path === currentTokenPath
      ? {
          ...token,
          path: trimmedNextTokenPath,
        }
      : token,
  );
  const migration = migrateTokenReferences({
    tokens: renamedTokens,
    currentReference,
    nextReference,
  });

  return {
    status: 'success',
    tokens: migration.tokens,
    migratedReferencesCount: migration.migratedReferencesCount,
  };
}

export function renameTokenAcrossProject({
  tokenSets,
  targetTokenSetId,
  themes,
  componentContracts,
  currentTokenPath,
  nextTokenPath,
}: {
  tokenSets: ProjectTokenSetForRename[];
  targetTokenSetId: string;
  themes: ProjectThemeForRename[];
  componentContracts: ProjectComponentForRename[];
  currentTokenPath: string;
  nextTokenPath: string;
}): RenameTokenAcrossProjectResult {
  const trimmedNextTokenPath = nextTokenPath.trim();
  const targetTokenSet = tokenSets.find(
    (tokenSet) => tokenSet.id === targetTokenSetId,
  );

  if (
    !targetTokenSet?.tokens.some((token) => token.path === currentTokenPath)
  ) {
    return {
      status: 'error',
      error: 'tokenNotFound',
    };
  }

  const pathAlreadyExists = tokenSets.some((tokenSet) =>
    tokenSet.tokens.some(
      (token) =>
        token.path === trimmedNextTokenPath &&
        !(tokenSet.id === targetTokenSetId && token.path === currentTokenPath),
    ),
  );

  if (pathAlreadyExists) {
    return {
      status: 'error',
      error: 'tokenPathAlreadyExists',
    };
  }

  const currentReference = pathToTokenReference(currentTokenPath);
  const nextReference = pathToTokenReference(trimmedNextTokenPath);
  let migratedReferencesCount = 0;

  const tokenSetUpdates = tokenSets.flatMap((tokenSet) => {
    const renamedTokens =
      tokenSet.id === targetTokenSetId
        ? tokenSet.tokens.map((token) =>
            token.path === currentTokenPath
              ? {
                  ...token,
                  path: trimmedNextTokenPath,
                }
              : token,
          )
        : tokenSet.tokens;
    const migration = migrateTokenReferences({
      tokens: renamedTokens,
      currentReference,
      nextReference,
    });
    const didRenameTarget = tokenSet.id === targetTokenSetId;

    migratedReferencesCount += migration.migratedReferencesCount;

    if (!didRenameTarget && migration.migratedReferencesCount === 0) {
      return [];
    }

    return [
      {
        id: tokenSet.id,
        tokens: migration.tokens,
      },
    ];
  });

  const themeUpdates = themes.flatMap((theme) => {
    const migration = replaceDesignSystemReference({
      value: theme.tokens,
      currentReference,
      nextReference,
    });

    migratedReferencesCount += migration.migratedReferencesCount;

    return migration.migratedReferencesCount > 0
      ? [
          {
            id: theme.id,
            tokens: migration.value,
          },
        ]
      : [];
  });

  const componentUpdates = componentContracts.flatMap((component) => {
    const migration =
      migrateV2ComponentTokenPath({
        component,
        currentTokenPath,
        nextTokenPath: trimmedNextTokenPath,
      }) ??
      migrateLegacyComponentTokenPath({
        contract: component.contract,
        currentTokenPath,
        nextTokenPath: trimmedNextTokenPath,
      });

    if (!migration) {
      return [];
    }

    migratedReferencesCount += migration.migratedReferencesCount;

    return migration.migratedReferencesCount > 0
      ? [
          {
            id: component.id,
            contract: migration.contract,
          },
        ]
      : [];
  });

  return {
    status: 'success',
    tokenSetUpdates,
    themeUpdates,
    componentUpdates,
    migratedReferencesCount,
  };
}
