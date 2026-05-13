import { prisma } from '@/server/db/prisma';

export type DashboardSummary = {
  workspaceName: string | null;
  workspaceSlug: string | null;
  workspaceCount: number;
  role: string | null;
};

export async function getDashboardSummary(
  userId: string,
): Promise<DashboardSummary> {
  const memberships = await prisma.workspaceMember.findMany({
    where: {
      userId,
    },
    select: {
      role: true,
      workspace: {
        select: {
          name: true,
          slug: true,
        },
      },
    },
    orderBy: {
      createdAt: 'asc',
    },
  });

  const primaryMembership = memberships[0];

  return {
    workspaceName: primaryMembership?.workspace.name ?? null,
    workspaceSlug: primaryMembership?.workspace.slug ?? null,
    workspaceCount: memberships.length,
    role: primaryMembership?.role ?? null,
  };
}
