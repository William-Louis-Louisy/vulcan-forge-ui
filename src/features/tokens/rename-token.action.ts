'use server';

import { auth } from '@/auth';
import {
  type RenameTokenField,
  type RenameTokenActionState,
} from './rename-token.state';
import {
  renameTokenSchema,
  type RenameTokenValidationMessageKey,
} from './token-rename.schema';
import { parseStoredTokenSetTokens } from './token-set-save.service';
import { revalidatePath } from 'next/cache';
import { isTokenSetType } from './tokens-editor.utils';
import { defaultAppLocale, isAppLocale } from '@/domain/i18n';
import {
  renameTokenAcrossProject,
  type ProjectTokenSetForRename,
} from './rename-token.utils';
import { prisma } from '@/server/db/prisma';
import type { Prisma } from '@/generated/prisma/client';

function getFormStringValue(formData: FormData, key: string): string {
  const value = formData.get(key);

  return typeof value === 'string' ? value : '';
}

function getActionLocale(formData: FormData) {
  const rawLocale = getFormStringValue(formData, 'locale');

  return isAppLocale(rawLocale) ? rawLocale : defaultAppLocale;
}

function normalizeFieldErrors(
  fieldErrors: Record<string, string[] | undefined>,
): RenameTokenActionState['fieldErrors'] {
  const normalizedErrors: Partial<
    Record<RenameTokenField, RenameTokenValidationMessageKey[]>
  > = {};

  if (fieldErrors.nextTokenPath?.length) {
    normalizedErrors.nextTokenPath =
      fieldErrors.nextTokenPath as RenameTokenValidationMessageKey[];
  }

  return normalizedErrors;
}

function toInputJsonValue(value: unknown): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
}

export async function renameTokenAction(
  _previousState: RenameTokenActionState,
  formData: FormData,
): Promise<RenameTokenActionState> {
  const locale = getActionLocale(formData);
  const projectSlug = getFormStringValue(formData, 'projectSlug');
  const tokenSetType = getFormStringValue(formData, 'tokenSetType');
  const currentTokenPath = getFormStringValue(formData, 'currentTokenPath');

  const values = {
    nextTokenPath: getFormStringValue(formData, 'nextTokenPath'),
  };

  if (!isTokenSetType(tokenSetType)) {
    return {
      status: 'error',
      fieldErrors: {},
      formError: 'tokenSetNotFound',
      values,
    };
  }

  const session = await auth();

  if (!session?.user?.id) {
    return {
      status: 'error',
      fieldErrors: {},
      formError: 'unauthorized',
      values,
    };
  }

  const parsed = renameTokenSchema.safeParse(values);

  if (!parsed.success) {
    return {
      status: 'error',
      fieldErrors: normalizeFieldErrors(parsed.error.flatten().fieldErrors),
      formError: null,
      values,
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
      id: true,
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
          tokens: true,
        },
      },
      componentContracts: {
        select: {
          id: true,
          contract: true,
        },
      },
    },
  });

  if (!project) {
    return {
      status: 'error',
      fieldErrors: {},
      formError: 'projectNotFound',
      values,
    };
  }

  const targetTokenSet = project.tokenSets.find(
    (tokenSet) => tokenSet.type === tokenSetType,
  );

  if (!targetTokenSet) {
    return {
      status: 'error',
      fieldErrors: {},
      formError: 'tokenSetNotFound',
      values,
    };
  }

  const parsedTokenSets: ProjectTokenSetForRename[] = [];

  for (const tokenSet of project.tokenSets) {
    const parsedTokensResult = parseStoredTokenSetTokens(tokenSet.tokens);

    if (parsedTokensResult.status === 'error') {
      return {
        status: 'error',
        fieldErrors: {},
        formError: parsedTokensResult.error,
        values,
      };
    }

    parsedTokenSets.push({
      id: tokenSet.id,
      tokens: parsedTokensResult.tokens,
    });
  }

  const renameResult = renameTokenAcrossProject({
    tokenSets: parsedTokenSets,
    targetTokenSetId: targetTokenSet.id,
    themes: project.themes,
    componentContracts: project.componentContracts,
    currentTokenPath,
    nextTokenPath: parsed.data.nextTokenPath,
  });

  if (renameResult.status === 'error') {
    return {
      status: 'error',
      fieldErrors: {},
      formError: renameResult.error,
      values,
    };
  }

  try {
    await prisma.$transaction([
      ...renameResult.tokenSetUpdates.map((tokenSet) =>
        prisma.tokenSet.update({
          where: {
            id: tokenSet.id,
          },
          data: {
            tokens: toInputJsonValue(tokenSet.tokens),
          },
        }),
      ),
      ...renameResult.themeUpdates.map((theme) =>
        prisma.theme.update({
          where: {
            id: theme.id,
          },
          data: {
            tokens: toInputJsonValue(theme.tokens),
          },
        }),
      ),
      ...renameResult.componentUpdates.map((component) =>
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
      fieldErrors: {},
      formError: 'unexpected',
      values,
    };
  }

  revalidatePath(`/${locale}/app`);
  revalidatePath(`/${locale}/app/projects/${projectSlug}`);

  for (const section of [
    'tokens',
    'themes',
    'components',
    'accessibility',
    'documentation',
    'exports',
    'ai-instructions',
  ]) {
    revalidatePath(`/${locale}/app/projects/${projectSlug}/${section}`);
  }

  return {
    status: 'success',
    fieldErrors: {},
    formError: null,
    values: parsed.data,
  };
}
