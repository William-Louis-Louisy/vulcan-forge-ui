import {
  createDesignSystemProjectSource,
  type ComponentContractType,
  type DesignSystemProjectSource,
  type ThemeMode,
} from '@/domain/design-system';
import type { AppLocale } from '@/domain/i18n';
import { prisma } from '@/server/db/prisma';

export async function getDesignSystemProjectSourceForUser({
  userId,
  projectSlug,
}: {
  userId: string;
  projectSlug: string;
}): Promise<DesignSystemProjectSource | null> {
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
      description: true,
      defaultLocale: true,
      supportedLocales: true,
      brandProfile: {
        select: {
          visualStyle: true,
          uiDensity: true,
          inspirationKeywords: true,
          localizedContent: true,
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
      themes: {
        orderBy: {
          mode: 'asc',
        },
        select: {
          id: true,
          mode: true,
          name: true,
          tokens: true,
          updatedAt: true,
        },
      },
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
    },
  });

  if (!project) {
    return null;
  }

  return createDesignSystemProjectSource({
    project: {
      id: project.id,
      name: project.name,
      slug: project.slug,
      description: project.description,
      defaultLocale: project.defaultLocale as AppLocale,
      supportedLocales: project.supportedLocales as AppLocale[],
    },
    brandProfile: project.brandProfile,
    tokenSets: project.tokenSets,
    themes: project.themes.map((theme) => ({
      ...theme,
      mode: theme.mode as ThemeMode,
    })),
    componentContracts: project.componentContracts.map((componentContract) => ({
      ...componentContract,
      type: componentContract.type as ComponentContractType,
    })),
  });
}
