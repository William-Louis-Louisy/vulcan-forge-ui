import type { Prisma } from '@/generated/prisma/client';
import {
  createThemeColorRole,
  createThemeColorTokenOptions,
  type CreateThemeColorRoleError,
} from '@/domain/design-system';
import { prisma } from '@/server/db/prisma';

export type CreateThemeColorRoleForUserError =
  | 'themeNotFound'
  | 'invalidTokenReference'
  | CreateThemeColorRoleError
  | 'unexpected';

export type CreateThemeColorRoleForUserResult =
  | {
      status: 'success';
      roleKey: string;
      tokenReference: string;
    }
  | {
      status: 'error';
      error: CreateThemeColorRoleForUserError;
    };

function toSerializedInputJsonValue(value: unknown): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
}

export async function createThemeColorRoleForUser({
  userId,
  projectSlug,
  themeId,
  roleKey,
  tokenPath,
}: {
  userId: string;
  projectSlug: string;
  themeId: string;
  roleKey: string;
  tokenPath: string;
}): Promise<CreateThemeColorRoleForUserResult> {
  const theme = await prisma.theme.findFirst({
    where: {
      id: themeId,
      project: {
        slug: projectSlug,
        workspace: {
          members: {
            some: {
              userId,
            },
          },
        },
      },
    },
    select: {
      id: true,
      tokens: true,
      project: {
        select: {
          tokenSets: {
            where: {
              type: 'color',
            },
            select: {
              tokens: true,
            },
            take: 1,
          },
        },
      },
    },
  });

  if (!theme) {
    return {
      status: 'error',
      error: 'themeNotFound',
    };
  }

  const colorTokenOptions = createThemeColorTokenOptions(
    theme.project.tokenSets[0]?.tokens ?? [],
  );
  const selectedTokenExists = colorTokenOptions.some(
    (option) => option.path === tokenPath.trim(),
  );

  if (!selectedTokenExists) {
    return {
      status: 'error',
      error: 'invalidTokenReference',
    };
  }

  const roleCreation = createThemeColorRole({
    tokens: theme.tokens,
    roleKey,
    tokenPath,
  });

  if (roleCreation.status === 'error') {
    return roleCreation;
  }

  try {
    await prisma.theme.update({
      where: {
        id: theme.id,
      },
      data: {
        tokens: toSerializedInputJsonValue(roleCreation.tokens),
      },
      select: {
        id: true,
      },
    });

    return {
      status: 'success',
      roleKey: roleCreation.roleKey,
      tokenReference: roleCreation.tokenReference,
    };
  } catch {
    return {
      status: 'error',
      error: 'unexpected',
    };
  }
}
