'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import { prisma } from '@/server/db/prisma';
import { defaultAppLocale, isAppLocale } from '@/domain/i18n';
import { isTokenSetType } from './tokens-editor.utils';
import {
  parseStoredTokenSetTokens,
  saveValidatedTokenSetTokens,
} from './token-set-save.service';
import { findTokenDependencies, removeTokenByPath } from './delete-token.utils';
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

  const project = await prisma.designSystemProject.findFirst({
    where: {
      slug: projectSlug,
      workspace: {
        members: {
          some: {
            userId: session.user.id,
          },
        },
      },
    },
    select: {
      tokenSets: {
        select: {
          id: true,
          type: true,
          tokens: true,
        },
      },
      themes: {
        select: {
          name: true,
          tokens: true,
        },
      },
      componentContracts: {
        select: {
          name: true,
          contract: true,
        },
      },
    },
  });

  if (!project) {
    return {
      status: 'error',
      formError: 'projectNotFound',
      dependencies: [],
      deletedTokenPath: null,
    };
  }

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

  if (dependencies.length > 0) {
    return {
      status: 'error',
      formError: 'tokenInUse',
      dependencies,
      deletedTokenPath: null,
    };
  }

  const saveResult = await saveValidatedTokenSetTokens({
    tokenSetId: tokenSet.id,
    tokens: removeResult.tokens,
  });

  if (saveResult.status === 'error') {
    return {
      status: 'error',
      formError: saveResult.error,
      dependencies: [],
      deletedTokenPath: null,
    };
  }

  revalidatePath(`/${locale}/app/projects/${projectSlug}/tokens`);

  return {
    status: 'success',
    formError: null,
    dependencies: [],
    deletedTokenPath: tokenPath,
  };
}
