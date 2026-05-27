import { prisma } from '@/server/db/prisma';

export type AccessibilityCenterPageData = {
  project: {
    id: string;
    name: string;
    slug: string;
  };
  colorTokenSet: {
    id: string;
    tokens: unknown;
  } | null;
};

export async function getAccessibilityCenterPageData({
  userId,
  projectSlug,
}: {
  userId: string;
  projectSlug: string;
}): Promise<AccessibilityCenterPageData | null> {
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
        where: {
          type: 'color',
        },
        select: {
          id: true,
          tokens: true,
        },
        take: 1,
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
    colorTokenSet: project.tokenSets[0] ?? null,
  };
}
