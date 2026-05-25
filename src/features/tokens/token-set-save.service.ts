import { z } from 'zod';
import { prisma } from '@/server/db/prisma';
import type { Prisma } from '@/generated/prisma/client';
import type { TokenSetType } from './tokens-editor.utils';
import { designTokenSchema, type DesignToken } from '@/domain/design-system';

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

function toInputJsonValue(value: unknown): Prisma.InputJsonValue {
  return value as Prisma.InputJsonValue;
}

export async function getEditableTokenSetForUser({
  userId,
  projectSlug,
  tokenSetType,
}: {
  userId: string;
  projectSlug: string;
  tokenSetType: TokenSetType;
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
      id: true,
    },
  });

  if (!project) {
    return {
      status: 'error',
      error: 'projectNotFound',
    };
  }

  const tokenSet = await prisma.tokenSet.findFirst({
    where: {
      projectId: project.id,
      type: tokenSetType,
    },
    select: {
      id: true,
      tokens: true,
    },
  });

  if (!tokenSet) {
    return {
      status: 'error',
      error: 'tokenSetNotFound',
    };
  }

  return {
    status: 'success',
    tokenSet,
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
