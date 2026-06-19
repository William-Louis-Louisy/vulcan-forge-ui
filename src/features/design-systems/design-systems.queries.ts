import { prisma } from '@/server/db/prisma';

export type DesignSystemListItem = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  updatedAt: Date;
  platforms: string[];
  supportedLocales: string[];
};

export type DesignSystemsPageData = {
  workspace: {
    id: string;
    name: string;
    slug: string;
  } | null;
  designSystems: DesignSystemListItem[];
};

export async function getDesignSystemsPageData(
  userId: string,
): Promise<DesignSystemsPageData> {
  const membership = await prisma.workspaceMember.findFirst({
    where: {
      userId,
    },
    orderBy: {
      createdAt: 'asc',
    },
    select: {
      workspace: {
        select: {
          id: true,
          name: true,
          slug: true,
          designSystemProjects: {
            orderBy: {
              updatedAt: 'desc',
            },
            select: {
              id: true,
              name: true,
              slug: true,
              description: true,
              updatedAt: true,
              platforms: true,
              supportedLocales: true,
            },
          },
        },
      },
    },
  });

  if (!membership) {
    return {
      workspace: null,
      designSystems: [],
    };
  }

  return {
    workspace: {
      id: membership.workspace.id,
      name: membership.workspace.name,
      slug: membership.workspace.slug,
    },
    designSystems: membership.workspace.designSystemProjects,
  };
}
