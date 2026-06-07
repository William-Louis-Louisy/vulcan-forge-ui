import { prisma } from '@/server/db/prisma';
import type {
  ThemeMode,
  ThemeEditorTheme,
} from '@/features/themes/themes-editor.utils';

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
  themes: ThemeEditorTheme[];
  latestAccessibilityReport: {
    id: string;
    status: 'pass' | 'warning' | 'fail';
    score: number;
    issues: unknown;
    createdAt: Date;
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
      themes: {
        select: {
          id: true,
          mode: true,
          name: true,
          tokens: true,
          updatedAt: true,
        },
      },
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
      accessibilityReports: {
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          id: true,
          status: true,
          score: true,
          issues: true,
          createdAt: true,
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
    themes: project.themes.map((theme) => ({
      id: theme.id,
      mode: theme.mode as ThemeMode,
      name: theme.name,
      tokens: theme.tokens,
      updatedAt: theme.updatedAt,
    })),
    colorTokenSet: project.tokenSets[0] ?? null,
    latestAccessibilityReport: project.accessibilityReports[0] ?? null,
  };
}
