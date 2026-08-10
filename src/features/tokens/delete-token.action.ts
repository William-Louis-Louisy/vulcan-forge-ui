'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import { prisma } from '@/server/db/prisma';
import type { Prisma } from '@/generated/prisma/client';
import { defaultAppLocale, isAppLocale } from '@/domain/i18n';
import { isTokenSetType } from './tokens-editor.utils';
import { parseStoredTokenSetTokens } from './token-set-save.service';
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

function toInputJsonValue(value: unknown): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
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
          id: true,
          name: true,
          tokens: true,
        },
      },
      componentContracts: {
        select: {
          id: true,
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

  try {
    await prisma.$transaction([
      prisma.tokenSet.update({
        where: {
          id: tokenSet.id,
        },
        data: {
          tokens: toInputJsonValue(removeResult.tokens),
        },
      }),
      ...themeUpdates.map((theme) =>
        prisma.theme.update({
          where: {
            id: theme.id,
          },
          data: {
            tokens: toInputJsonValue(theme.tokens),
          },
        }),
      ),
      ...componentUpdates.map((component) =>
        prisma.componentContract.update({
          where: {
            id: component.id,
          },
          data: {
            contract: toInputJsonValue(component.contract),
          },
        }),
      ),
    ]);
  } catch {
    return {
      status: 'error',
      formError: 'unexpected',
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
