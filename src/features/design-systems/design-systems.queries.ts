import { prisma } from '@/server/db/prisma';

export type DesignSystemListItem = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  updatedAt: Date;
  platforms: string[];
  supportedLocales: string[];
  tokenSets: {
    type: 'color' | 'spacing' | 'radius' | 'typography' | 'motion';
    tokens: unknown;
  }[];
  themes: {
    mode: string;
    tokens: unknown;
  }[];
};

export type DesignSystemsPageData = {
  workspace: {
    id: string;
    name: string;
    slug: string;
    defaultLocale: string;
    supportedLocales: string[];
    memberCount: number;
    members: {
      id: string;
      name: string | null;
      email: string;
      role: string;
    }[];
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
          settings: {
            select: {
              defaultLocale: true,
              supportedLocales: true,
            },
          },
          members: {
            orderBy: {
              createdAt: 'asc',
            },
            select: {
              id: true,
              role: true,
              user: {
                select: {
                  name: true,
                  email: true,
                },
              },
            },
          },
          _count: {
            select: {
              members: true,
            },
          },
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
              tokenSets: {
                where: {
                  type: 'color',
                },
                select: {
                  type: true,
                  tokens: true,
                },
              },
              themes: {
                orderBy: {
                  createdAt: 'asc',
                },
                select: {
                  mode: true,
                  tokens: true,
                },
              },
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
      defaultLocale: membership.workspace.settings?.defaultLocale ?? 'en',
      supportedLocales: membership.workspace.settings?.supportedLocales ?? [
        'en',
        'fr',
      ],
      memberCount: membership.workspace._count.members,
      members: membership.workspace.members.map((member) => ({
        id: member.id,
        name: member.user.name,
        email: member.user.email,
        role: member.role,
      })),
    },
    designSystems: membership.workspace.designSystemProjects,
  };
}
