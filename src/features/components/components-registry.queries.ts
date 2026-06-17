import { prisma } from '@/server/db/prisma';
import type { ComponentContractType } from '@/domain/design-system';

export type ComponentsRegistryPageData = {
  project: {
    id: string;
    name: string;
    slug: string;
  };
  componentContracts: Array<{
    id: string;
    type: ComponentContractType;
    name: string;
    contract: unknown;
    updatedAt: Date;
  }>;
  tokenSets: Array<{
    id: string;
    type: string;
    name: string;
    tokens: unknown;
  }>;
};
export async function getComponentsRegistryPageData({
  userId,
  projectSlug,
}: {
  userId: string;
  projectSlug: string;
}): Promise<ComponentsRegistryPageData | null> {
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
      componentContracts: {
        orderBy: {
          type: 'asc',
        },
        select: {
          id: true,
          type: true,
          name: true,
          contract: true,
          updatedAt: true,
        },
      },
      tokenSets: {
        orderBy: {
          type: 'asc',
        },
        select: {
          id: true,
          type: true,
          name: true,
          tokens: true,
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
    componentContracts: project.componentContracts.map((componentContract) => ({
      id: componentContract.id,
      type: componentContract.type as ComponentContractType,
      name: componentContract.name,
      contract: componentContract.contract,
      updatedAt: componentContract.updatedAt,
    })),
    tokenSets: project.tokenSets.map((tokenSet) => ({
      id: tokenSet.id,
      type: tokenSet.type,
      name: tokenSet.name,
      tokens: tokenSet.tokens,
    })),
  };
}
