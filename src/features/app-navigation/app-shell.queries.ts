import { prisma } from '@/server/db/prisma';
import type { ThemePreference } from '@/features/settings/user-settings.schema';

export type AppShellProject = {
  name: string;
  slug: string;
};

export type AppShellData = {
  themePreference: ThemePreference;
  workspaceName: string | null;
  projects: AppShellProject[];
};

export async function getAppShellData(userId: string): Promise<AppShellData> {
  const [userPreference, membership] = await Promise.all([
    prisma.userPreference.findUnique({
      where: {
        userId,
      },
      select: {
        themePreference: true,
      },
    }),
    prisma.workspaceMember.findFirst({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'asc',
      },
      select: {
        workspace: {
          select: {
            name: true,
            designSystemProjects: {
              orderBy: [{ updatedAt: 'desc' }, { name: 'asc' }],
              select: {
                name: true,
                slug: true,
              },
            },
          },
        },
      },
    }),
  ]);

  return {
    themePreference: userPreference?.themePreference ?? 'system',
    workspaceName: membership?.workspace.name ?? null,
    projects: membership?.workspace.designSystemProjects ?? [],
  };
}
