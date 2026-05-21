import { prisma } from '@/server/db/prisma';
import type { TokenSetType } from './tokens-editor.utils';

export type TokensEditorTokenSet = {
  id: string;
  type: TokenSetType;
  name: string;
  tokens: unknown;
  updatedAt: Date;
};

export type TokensEditorPageData = {
  project: {
    id: string;
    name: string;
    slug: string;
  };
  tokenSets: TokensEditorTokenSet[];
};

export async function getTokensEditorPageData({
  userId,
  projectSlug,
}: {
  userId: string;
  projectSlug: string;
}): Promise<TokensEditorPageData | null> {
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
      name: true,
      slug: true,
      tokenSets: {
        select: {
          id: true,
          type: true,
          name: true,
          tokens: true,
          updatedAt: true,
        },
      },
    },
  });

  if (!project) {
    return null;
  }

  return {
    project: {
      id: project.id,
      name: project.name,
      slug: project.slug,
    },
    tokenSets: project.tokenSets.map((tokenSet) => ({
      id: tokenSet.id,
      type: tokenSet.type as TokenSetType,
      name: tokenSet.name,
      tokens: tokenSet.tokens,
      updatedAt: tokenSet.updatedAt,
    })),
  };
}
