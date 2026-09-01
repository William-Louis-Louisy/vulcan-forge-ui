import { z } from 'zod';
import type { Prisma } from '@/generated/prisma/client';
import {
  designTokenSchema,
  type DesignToken,
  type DesignTokenType,
} from '@/domain/design-system';
import { prisma } from '@/server/db/prisma';

const designTokenArraySchema = z.array(designTokenSchema);

export type TokenSetSaveError =
  | 'projectNotFound'
  | 'tokenSetNotFound'
  | 'tokenSetMalformed'
  | 'tokenValidationFailed'
  | 'unexpected';

export type EditableTokenSet = {
  id: string;
  tokens: unknown;
};

export type EditableTokenSetResult =
  | {
      status: 'success';
      tokenSet: EditableTokenSet;
      projectTokens: DesignToken[];
    }
  | {
      status: 'error';
      error: Extract<TokenSetSaveError, 'projectNotFound' | 'tokenSetNotFound'>;
    };

export type ParsedTokenSetTokensResult =
  | {
      status: 'success';
      tokens: DesignToken[];
    }
  | {
      status: 'error';
      error: Extract<TokenSetSaveError, 'tokenSetMalformed'>;
    };

export type SaveTokenSetTokensResult =
  | {
      status: 'success';
    }
  | {
      status: 'error';
      error: Extract<TokenSetSaveError, 'tokenValidationFailed' | 'unexpected'>;
    };

export type EditableTokenMutationProject = {
  tokenSets: Array<{
    id: string;
    type: string;
    tokens: unknown;
  }>;
  themes: Array<{
    id: string;
    name: string;
    tokens: unknown;
  }>;
  componentContracts: Array<{
    id: string;
    key: string;
    templateKey: string;
    category: string;
    contractVersion: number;
    name: string;
    contract: unknown;
  }>;
};

export type EditableTokenMutationProjectResult =
  | {
      status: 'success';
      project: EditableTokenMutationProject;
    }
  | {
      status: 'error';
      error: Extract<TokenSetSaveError, 'projectNotFound'>;
    };

export type DesignSystemTokenMutationUpdates = {
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
};

export type SaveDesignSystemTokenMutationResult =
  | {
      status: 'success';
    }
  | {
      status: 'error';
      error: Extract<TokenSetSaveError, 'unexpected'>;
    };

function toInputJsonValue(value: unknown): Prisma.InputJsonValue {
  return value as Prisma.InputJsonValue;
}

function toSerializedInputJsonValue(value: unknown): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
}

function collectValidProjectTokens(
  tokenSets: Array<{
    tokens: unknown;
  }>,
): DesignToken[] {
  return tokenSets.flatMap((tokenSet) => {
    const parsedTokens = designTokenArraySchema.safeParse(tokenSet.tokens);

    return parsedTokens.success ? parsedTokens.data : [];
  });
}

export async function getEditableTokenSetForUser({
  userId,
  projectSlug,
  tokenSetType,
}: {
  userId: string;
  projectSlug: string;
  tokenSetType: DesignTokenType;
}): Promise<EditableTokenSetResult> {
  const project = await prisma.designSystemProject.findFirst({
    where: {
      slug: projectSlug,
      workspace: {
        members: {
          some: {
            userId,
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
    },
  });

  if (!project) {
    return {
      status: 'error',
      error: 'projectNotFound',
    };
  }

  const tokenSet = project.tokenSets.find(
    (candidateTokenSet) => candidateTokenSet.type === tokenSetType,
  );

  if (!tokenSet) {
    return {
      status: 'error',
      error: 'tokenSetNotFound',
    };
  }

  return {
    status: 'success',
    tokenSet: {
      id: tokenSet.id,
      tokens: tokenSet.tokens,
    },
    projectTokens: collectValidProjectTokens(project.tokenSets),
  };
}

export function parseStoredTokenSetTokens(
  tokens: unknown,
): ParsedTokenSetTokensResult {
  const parsedTokens = designTokenArraySchema.safeParse(tokens);

  if (!parsedTokens.success) {
    return {
      status: 'error',
      error: 'tokenSetMalformed',
    };
  }

  return {
    status: 'success',
    tokens: parsedTokens.data,
  };
}

export async function saveValidatedTokenSetTokens({
  tokenSetId,
  tokens,
}: {
  tokenSetId: string;
  tokens: DesignToken[];
}): Promise<SaveTokenSetTokensResult> {
  const parsedTokens = designTokenArraySchema.safeParse(tokens);

  if (!parsedTokens.success) {
    return {
      status: 'error',
      error: 'tokenValidationFailed',
    };
  }

  try {
    await prisma.tokenSet.update({
      where: {
        id: tokenSetId,
      },
      data: {
        tokens: toInputJsonValue(parsedTokens.data),
      },
      select: {
        id: true,
      },
    });

    return {
      status: 'success',
    };
  } catch {
    return {
      status: 'error',
      error: 'unexpected',
    };
  }
}

export async function getEditableTokenMutationProjectForUser({
  userId,
  projectSlug,
}: {
  userId: string;
  projectSlug: string;
}): Promise<EditableTokenMutationProjectResult> {
  const project = await prisma.designSystemProject.findFirst({
    where: {
      slug: projectSlug,
      workspace: {
        members: {
          some: {
            userId,
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
          key: true,
          templateKey: true,
          category: true,
          contractVersion: true,
          name: true,
          contract: true,
        },
      },
    },
  });

  if (!project) {
    return {
      status: 'error',
      error: 'projectNotFound',
    };
  }

  return {
    status: 'success',
    project,
  };
}

export async function saveDesignSystemTokenMutation({
  tokenSetUpdates,
  themeUpdates,
  componentUpdates,
}: DesignSystemTokenMutationUpdates): Promise<SaveDesignSystemTokenMutationResult> {
  try {
    await prisma.$transaction([
      ...tokenSetUpdates.map((tokenSet) =>
        prisma.tokenSet.update({
          where: {
            id: tokenSet.id,
          },
          data: {
            tokens: toSerializedInputJsonValue(tokenSet.tokens),
          },
        }),
      ),
      ...themeUpdates.map((theme) =>
        prisma.theme.update({
          where: {
            id: theme.id,
          },
          data: {
            tokens: toSerializedInputJsonValue(theme.tokens),
          },
        }),
      ),
      ...componentUpdates.map((component) =>
        prisma.componentContract.update({
          where: {
            id: component.id,
          },
          data: {
            contract: toSerializedInputJsonValue(component.contract),
          },
        }),
      ),
    ]);

    return {
      status: 'success',
    };
  } catch {
    return {
      status: 'error',
      error: 'unexpected',
    };
  }
}
