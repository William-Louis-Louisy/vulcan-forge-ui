import { prisma } from '@/server/db/prisma';
import type { AppLocale } from '@/domain/i18n';
import type { ComponentContractType } from '@/domain/design-system';
import type {
  ThemeMode,
  ThemeEditorTheme,
} from '@/features/themes/themes-editor.utils';

export type AccessibilityCenterTokenSetData = {
  id: string;
  type: string;
  name: string;
  tokens: unknown;
};

export type AccessibilityCenterComponentContractData = {
  id: string;
  type: ComponentContractType;
  name: string;
  contract: unknown;
  updatedAt: Date;
};

export type AccessibilityCenterPageData = {
  project: {
    id: string;
    name: string;
    slug: string;
    defaultLocale: AppLocale;
    supportedLocales: AppLocale[];
  };
  colorTokenSet: AccessibilityCenterTokenSetData | null;
  tokenSets: AccessibilityCenterTokenSetData[];
  themes: ThemeEditorTheme[];
  componentContracts: AccessibilityCenterComponentContractData[];
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
      defaultLocale: true,
      supportedLocales: true,
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

  const tokenSets = project.tokenSets.map((tokenSet) => ({
    id: tokenSet.id,
    type: tokenSet.type,
    name: tokenSet.name,
    tokens: tokenSet.tokens,
  }));

  return {
    project: {
      id: project.id,
      name: project.name,
      slug: project.slug,
      defaultLocale: project.defaultLocale as AppLocale,
      supportedLocales: project.supportedLocales as AppLocale[],
    },
    themes: project.themes.map((theme) => ({
      id: theme.id,
      mode: theme.mode as ThemeMode,
      name: theme.name,
      tokens: theme.tokens,
      updatedAt: theme.updatedAt,
    })),
    colorTokenSet:
      tokenSets.find((tokenSet) => tokenSet.type === 'color') ?? null,
    tokenSets,
    componentContracts: project.componentContracts.map((componentContract) => ({
      id: componentContract.id,
      type: componentContract.type as ComponentContractType,
      name: componentContract.name,
      contract: componentContract.contract,
      updatedAt: componentContract.updatedAt,
    })),
    latestAccessibilityReport: project.accessibilityReports[0] ?? null,
  };
}
