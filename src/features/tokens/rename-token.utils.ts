import type { DesignToken } from '@/domain/design-system';
import { pathToTokenReference } from '@/domain/design-system';

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

  let migratedReferencesCount = 0;

  const nextTokens = tokens.map((token) => {
    const renamedToken =
      token.path === currentTokenPath
        ? {
            ...token,
            path: trimmedNextTokenPath,
          }
        : token;

    const shouldMigrateValue = renamedToken.value === currentReference;
    const shouldMigrateReference = renamedToken.reference === currentReference;

    if (!shouldMigrateValue && !shouldMigrateReference) {
      return renamedToken;
    }

    migratedReferencesCount += 1;

    return {
      ...renamedToken,
      value: shouldMigrateValue ? nextReference : renamedToken.value,
      ...(shouldMigrateReference ? { reference: nextReference } : {}),
    };
  });

  return {
    status: 'success',
    tokens: nextTokens,
    migratedReferencesCount,
  };
}
