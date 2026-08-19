import type { Prisma } from '@/generated/prisma/client';
import {
  createThemeColorRole,
  createThemeColorTokenOptions,
  deleteThemeColorRole,
  updateThemeColorRoleReference,
  type CreateThemeColorRoleError,
  type DeleteThemeColorRoleError,
  type UpdateThemeColorRoleReferenceError,
} from '@/domain/design-system';
import { prisma } from '@/server/db/prisma';

export type CreateThemeColorRoleForUserError =
  | 'themeNotFound'
  | 'invalidTokenReference'
  | CreateThemeColorRoleError
  | 'unexpected';

export type DeleteThemeColorRoleForUserError =
  | 'themeNotFound'
  | DeleteThemeColorRoleError
  | 'unexpected';

export type UpdateThemeColorRoleReferenceForUserError =
  | 'themeNotFound'
  | 'invalidTokenReference'
  | UpdateThemeColorRoleReferenceError
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

export type DeleteThemeColorRoleForUserResult =
  | {
      status: 'success';
      roleKey: string;
    }
  | {
      status: 'error';
      error: DeleteThemeColorRoleForUserError;
    };

export type UpdateThemeColorRoleReferenceForUserResult =
  | {
      status: 'success';
      roleKey: string;
      tokenReference: string;
    }
  | {
      status: 'error';
      error: UpdateThemeColorRoleReferenceForUserError;
    };

function toSerializedInputJsonValue(value: unknown): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
}

async function getEditableThemeForUser({
  userId,
  projectSlug,
  themeId,
}: {
  userId: string;
  projectSlug: string;
  themeId: string;
}) {
  return prisma.theme.findFirst({
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
}

function hasResolvedColorTokenPath({
  storedTokens,
  tokenPath,
}: {
  storedTokens: unknown;
  tokenPath: string;
}): boolean {
  const colorTokenOptions = createThemeColorTokenOptions(storedTokens);

  return colorTokenOptions.some((option) => option.path === tokenPath.trim());
}

async function persistThemeTokens({
  themeId,
  tokens,
}: {
  themeId: string;
  tokens: unknown;
}): Promise<boolean> {
  try {
    await prisma.theme.update({
      where: {
        id: themeId,
      },
      data: {
        tokens: toSerializedInputJsonValue(tokens),
      },
      select: {
        id: true,
      },
    });

    return true;
  } catch {
    return false;
  }
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
  const theme = await getEditableThemeForUser({
    userId,
    projectSlug,
    themeId,
  });

  if (!theme) {
    return {
      status: 'error',
      error: 'themeNotFound',
    };
  }

  if (
    !hasResolvedColorTokenPath({
      storedTokens: theme.project.tokenSets[0]?.tokens ?? [],
      tokenPath,
    })
  ) {
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

  const persisted = await persistThemeTokens({
    themeId: theme.id,
    tokens: roleCreation.tokens,
  });

  if (!persisted) {
    return {
      status: 'error',
      error: 'unexpected',
    };
  }

  return {
    status: 'success',
    roleKey: roleCreation.roleKey,
    tokenReference: roleCreation.tokenReference,
  };
}

export async function deleteThemeColorRoleForUser({
  userId,
  projectSlug,
  themeId,
  roleKey,
}: {
  userId: string;
  projectSlug: string;
  themeId: string;
  roleKey: string;
}): Promise<DeleteThemeColorRoleForUserResult> {
  const theme = await getEditableThemeForUser({
    userId,
    projectSlug,
    themeId,
  });

  if (!theme) {
    return {
      status: 'error',
      error: 'themeNotFound',
    };
  }

  const roleDeletion = deleteThemeColorRole({
    tokens: theme.tokens,
    roleKey,
  });

  if (roleDeletion.status === 'error') {
    return roleDeletion;
  }

  const persisted = await persistThemeTokens({
    themeId: theme.id,
    tokens: roleDeletion.tokens,
  });

  if (!persisted) {
    return {
      status: 'error',
      error: 'unexpected',
    };
  }

  return {
    status: 'success',
    roleKey: roleDeletion.roleKey,
  };
}

export async function updateThemeColorRoleReferenceForUser({
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
}): Promise<UpdateThemeColorRoleReferenceForUserResult> {
  const theme = await getEditableThemeForUser({
    userId,
    projectSlug,
    themeId,
  });

  if (!theme) {
    return {
      status: 'error',
      error: 'themeNotFound',
    };
  }

  if (
    !hasResolvedColorTokenPath({
      storedTokens: theme.project.tokenSets[0]?.tokens ?? [],
      tokenPath,
    })
  ) {
    return {
      status: 'error',
      error: 'invalidTokenReference',
    };
  }

  const roleUpdate = updateThemeColorRoleReference({
    tokens: theme.tokens,
    roleKey,
    tokenPath,
  });

  if (roleUpdate.status === 'error') {
    return roleUpdate;
  }

  const persisted = await persistThemeTokens({
    themeId: theme.id,
    tokens: roleUpdate.tokens,
  });

  if (!persisted) {
    return {
      status: 'error',
      error: 'unexpected',
    };
  }

  return {
    status: 'success',
    roleKey: roleUpdate.roleKey,
    tokenReference: roleUpdate.tokenReference,
  };
}
