'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import { defaultAppLocale, isAppLocale } from '@/domain/i18n';
import { isTokenSetType } from './tokens-editor.utils';
import {
  getEditableTokenMutationProjectForUser,
  parseStoredTokenSetTokens,
  saveDesignSystemTokenMutation,
} from '@/server/design-system/token-mutations';
import {
  detachComponentTokenBindings,
  detachThemeTokenReferences,
  findTokenDependencies,
  removeTokenByPath,
} from './delete-token.utils';
import type { DeleteTokenActionState } from './delete-token.state';

function getFormStringValue(formData: FormData, key: string): string {
  const value = formData.get(key);

  return typeof value === 'string' ? value : '';
}

function getActionLocale(formData: FormData) {
  const rawLocale = getFormStringValue(formData, 'locale');

  return isAppLocale(rawLocale) ? rawLocale : defaultAppLocale;
}

export async function deleteTokenAction(
  _previousState: DeleteTokenActionState,
  formData: FormData,
): Promise<DeleteTokenActionState> {
  const locale = getActionLocale(formData);
  const projectSlug = getFormStringValue(formData, 'projectSlug');
  const tokenSetType = getFormStringValue(formData, 'tokenSetType');
  const tokenPath = getFormStringValue(formData, 'tokenPath');

  if (!isTokenSetType(tokenSetType)) {
    return {
      status: 'error',
      formError: 'tokenSetNotFound',
      dependencies: [],
      deletedTokenPath: null,
    };
  }

  const session = await auth();

  if (!session?.user?.id) {
    return {
      status: 'error',
      formError: 'unauthorized',
      dependencies: [],
      deletedTokenPath: null,
    };
  }

  const projectResult = await getEditableTokenMutationProjectForUser({
    userId: session.user.id,
    projectSlug,
  });

  if (projectResult.status === 'error') {
    return {
      status: 'error',
      formError: projectResult.error,
      dependencies: [],
      deletedTokenPath: null,
    };
  }

  const project = projectResult.project;
  const tokenSet = project.tokenSets.find(
    (candidate) => candidate.type === tokenSetType,
  );

  if (!tokenSet) {
    return {
      status: 'error',
      formError: 'tokenSetNotFound',
      dependencies: [],
      deletedTokenPath: null,
    };
  }

  const parsedTokensResult = parseStoredTokenSetTokens(tokenSet.tokens);

  if (parsedTokensResult.status === 'error') {
    return {
      status: 'error',
      formError: parsedTokensResult.error,
      dependencies: [],
      deletedTokenPath: null,
    };
  }

  const removeResult = removeTokenByPath({
    tokens: parsedTokensResult.tokens,
    tokenPath,
  });

  if (removeResult.status === 'error') {
    return {
      status: 'error',
      formError: removeResult.error,
      dependencies: [],
      deletedTokenPath: null,
    };
  }

  const dependencies = findTokenDependencies({
    tokenPath,
    tokenSets: project.tokenSets,
    themes: project.themes,
    componentContracts: project.componentContracts,
  });
  const blockingDependencies = dependencies.filter(
    (dependency) => dependency.kind === 'token',
  );

  if (blockingDependencies.length > 0) {
    return {
      status: 'error',
      formError: 'tokenInUse',
      dependencies: blockingDependencies,
      deletedTokenPath: null,
    };
  }

  const themeUpdates = project.themes.flatMap((theme) => {
    const result = detachThemeTokenReferences({
      tokens: theme.tokens,
      tokenPath,
    });

    return result.removedCount > 0
      ? [
          {
            id: theme.id,
            tokens: result.value,
          },
        ]
      : [];
  });
  const componentUpdates = project.componentContracts.flatMap((component) => {
    const result = detachComponentTokenBindings({
      contract: component.contract,
      tokenPath,
    });

    return result.removedCount > 0
      ? [
          {
            id: component.id,
            contract: result.value,
          },
        ]
      : [];
  });

  const saveResult = await saveDesignSystemTokenMutation({
    tokenSetUpdates: [
      {
        id: tokenSet.id,
        tokens: removeResult.tokens,
      },
    ],
    themeUpdates,
    componentUpdates,
  });

  if (saveResult.status === 'error') {
    return {
      status: 'error',
      formError: saveResult.error,
      dependencies: [],
      deletedTokenPath: null,
    };
  }

  for (const section of [
    'tokens',
    'themes',
    'components',
    'accessibility',
    'exports',
  ]) {
    revalidatePath(`/${locale}/app/projects/${projectSlug}/${section}`);
  }

  return {
    status: 'success',
    formError: null,
    dependencies: [],
    deletedTokenPath: tokenPath,
  };
}
