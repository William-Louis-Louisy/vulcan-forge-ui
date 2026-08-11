import {
  componentContractSchema,
  pathToTokenReference,
  type DesignToken,
} from '@/domain/design-system';

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

type JsonReferenceMigrationResult = {
  value: unknown;
  migratedReferencesCount: number;
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

function replaceJsonReference({
  value,
  currentReference,
  nextReference,
}: {
  value: unknown;
  currentReference: string;
  nextReference: string;
}): JsonReferenceMigrationResult {
  if (value === currentReference) {
    return {
      value: nextReference,
      migratedReferencesCount: 1,
    };
  }

  if (Array.isArray(value)) {
    let migratedReferencesCount = 0;
    const nextValue = value.map((item) => {
      const result = replaceJsonReference({
        value: item,
        currentReference,
        nextReference,
      });

      migratedReferencesCount += result.migratedReferencesCount;
      return result.value;
    });

    return {
      value: nextValue,
      migratedReferencesCount,
    };
  }

  if (typeof value === 'object' && value !== null) {
    let migratedReferencesCount = 0;
    const nextValue = Object.fromEntries(
      Object.entries(value).map(([key, nestedValue]) => {
        const result = replaceJsonReference({
          value: nestedValue,
          currentReference,
          nextReference,
        });

        migratedReferencesCount += result.migratedReferencesCount;
        return [key, result.value];
      }),
    );

    return {
      value: nextValue,
      migratedReferencesCount,
    };
  }

  return {
    value,
    migratedReferencesCount: 0,
  };
}

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
    const valueMigration = replaceJsonReference({
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
        !(
          tokenSet.id === targetTokenSetId &&
          token.path === currentTokenPath
        ),
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
    const migration = replaceJsonReference({
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
    const parsedContract = componentContractSchema.safeParse(component.contract);

    if (!parsedContract.success) {
      return [];
    }

    let componentMigrationCount = 0;
    const tokenBindings = parsedContract.data.tokenBindings.map((binding) => {
      if (binding.tokenPath !== currentTokenPath) {
        return binding;
      }

      componentMigrationCount += 1;
      return {
        ...binding,
        tokenPath: trimmedNextTokenPath,
      };
    });

    migratedReferencesCount += componentMigrationCount;

    return componentMigrationCount > 0
      ? [
          {
            id: component.id,
            contract: {
              ...parsedContract.data,
              tokenBindings,
            },
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
