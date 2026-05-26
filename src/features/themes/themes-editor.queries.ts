import { prisma } from '@/server/db/prisma';
import type { ThemeEditorTheme, ThemeMode } from './themes-editor.utils';

export type ThemesEditorPageData = {
  project: {
    id: string;
    name: string;
    slug: string;
  };
  themes: ThemeEditorTheme[];
  colorTokenSet: {
    id: string;
    tokens: unknown;
  } | null;
};

export async function getThemesEditorPageData({
  userId,
  projectSlug,
}: {
  userId: string;
  projectSlug: string;
}): Promise<ThemesEditorPageData | null> {
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
  };
}
