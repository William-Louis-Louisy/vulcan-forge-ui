import type { AppLocale } from '@/domain/i18n';
import type { ComponentContractType } from '@/domain/design-system';
import type { ExportLogFormat } from '@/features/exports/export-center.utils';
import type { ThemeMode } from '@/features/themes/themes-editor.utils';
import type { TokenSetType } from '@/features/tokens/tokens-editor.utils';
import { prisma } from '@/server/db/prisma';

export type ProjectOverviewPageData = {
  project: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    platforms: Array<'web' | 'mobile'>;
    defaultLocale: AppLocale;
    supportedLocales: AppLocale[];
    visualDirection: string | null;
    accessibilityTarget: 'wcag_aa' | 'wcag_aaa';
    updatedAt: Date;
  };
  tokenSets: Array<{
    id: string;
    type: TokenSetType;
    name: string;
    tokens: unknown;
    updatedAt: Date;
  }>;
  themes: Array<{
    id: string;
    mode: ThemeMode;
    name: string;
    tokens: unknown;
    updatedAt: Date;
  }>;
  componentContracts: Array<{
    id: string;
    type: ComponentContractType;
    name: string;
    contract: unknown;
    updatedAt: Date;
  }>;
  latestAccessibilityReport: {
    id: string;
    status: 'pass' | 'warning' | 'fail';
    score: number;
    createdAt: Date;
  } | null;
  exportLogs: Array<{
    id: string;
    format: ExportLogFormat;
    locale: AppLocale | null;
    status: 'success' | 'failed';
    createdAt: Date;
  }>;
  documentationProfileUpdatedAt: Date | null;
  aiInstructionProfileUpdatedAt: Date | null;
};

export async function getProjectOverviewPageData({
  userId,
  projectSlug,
}: {
  userId: string;
  projectSlug: string;
}): Promise<ProjectOverviewPageData | null> {
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
      platforms: true,
      defaultLocale: true,
      supportedLocales: true,
      visualDirection: true,
      accessibilityTarget: true,
      updatedAt: true,
      tokenSets: {
        orderBy: {
          type: 'asc',
        },
        select: {
          id: true,
          type: true,
          name: true,
          tokens: true,
          updatedAt: true,
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
      accessibilityReports: {
        orderBy: {
          createdAt: 'desc',
        },
        take: 1,
        select: {
          id: true,
          status: true,
          score: true,
          createdAt: true,
        },
      },
      exportLogs: {
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          id: true,
          format: true,
          locale: true,
          status: true,
          createdAt: true,
        },
      },
      documentationProfile: {
        select: {
          updatedAt: true,
        },
      },
      aiInstructionProfile: {
        select: {
          updatedAt: true,
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
      description: project.description,
      platforms: project.platforms as Array<'web' | 'mobile'>,
      defaultLocale: project.defaultLocale as AppLocale,
      supportedLocales: project.supportedLocales as AppLocale[],
      visualDirection: project.visualDirection,
      accessibilityTarget: project.accessibilityTarget as
        | 'wcag_aa'
        | 'wcag_aaa',
      updatedAt: project.updatedAt,
    },
    tokenSets: project.tokenSets.map((tokenSet) => ({
      id: tokenSet.id,
      type: tokenSet.type as TokenSetType,
      name: tokenSet.name,
      tokens: tokenSet.tokens,
      updatedAt: tokenSet.updatedAt,
    })),
    themes: project.themes.map((theme) => ({
      id: theme.id,
      mode: theme.mode as ThemeMode,
      name: theme.name,
      tokens: theme.tokens,
      updatedAt: theme.updatedAt,
    })),
    componentContracts: project.componentContracts.map((componentContract) => ({
      id: componentContract.id,
      type: componentContract.type as ComponentContractType,
      name: componentContract.name,
      contract: componentContract.contract,
      updatedAt: componentContract.updatedAt,
    })),
    latestAccessibilityReport: project.accessibilityReports[0] ?? null,
    exportLogs: project.exportLogs.map((exportLog) => ({
      id: exportLog.id,
      format: exportLog.format as ExportLogFormat,
      locale: exportLog.locale as AppLocale | null,
      status: exportLog.status,
      createdAt: exportLog.createdAt,
    })),
    documentationProfileUpdatedAt:
      project.documentationProfile?.updatedAt ?? null,
    aiInstructionProfileUpdatedAt:
      project.aiInstructionProfile?.updatedAt ?? null,
  };
}
