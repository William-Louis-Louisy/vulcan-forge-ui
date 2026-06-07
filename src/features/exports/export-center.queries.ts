import { z } from 'zod';
import {
  designTokenSchema,
  componentContractSchema,
  type DesignToken,
  type ComponentContract,
} from '@/domain/design-system';
import { prisma } from '@/server/db/prisma';
import type { AppLocale } from '@/domain/i18n';
import type { ExportLogFormat } from './export-center.utils';
import {
  parseDocumentationProfileContent,
  defaultDocumentationProfileContent,
  type DocumentationProfileContent,
} from '@/features/documentation/documentation-profile.schema';
import type { CssVariablesExportTheme } from '@/domain/exports';
import {
  parseAiInstructionProfileContent,
  defaultAiInstructionProfileContent,
  type AiInstructionProfileContent,
} from '@/features/ai-instructions/ai-instruction-profile.schema';
import type { ThemeMode } from '@/features/themes/themes-editor.utils';
import type { MarkdownDocumentationInput } from '@/domain/documentation';
import { createAccessibilityCenterReport } from '@/features/accessibility/accessibility-center.utils';

const designTokenArraySchema = z.array(designTokenSchema);

export type ExportCenterLog = {
  id: string;
  format: ExportLogFormat;
  locale: AppLocale | null;
  status: 'success' | 'failed';
  errorMessage: string | null;
  createdAt: string;
};

export type ExportCenterInput = {
  project: MarkdownDocumentationInput['project'];
  tokens: DesignToken[];
  themes: CssVariablesExportTheme[];
  components: ComponentContract[];
  accessibility: MarkdownDocumentationInput['accessibility'];
};

export type ExportCenterPageData = {
  projectSlug: string;
  fallbackLocale: AppLocale;
  documentationProfile: DocumentationProfileContent;
  aiInstructionProfile: AiInstructionProfileContent;
  exportLogs: ExportCenterLog[];
  exportCenterInput: ExportCenterInput;
};

function parseTokenSetTokens(tokens: unknown): DesignToken[] {
  const parsedTokens = designTokenArraySchema.safeParse(tokens);

  return parsedTokens.success ? parsedTokens.data : [];
}

function parseComponentContract(contract: unknown): ComponentContract | null {
  const parsedContract = componentContractSchema.safeParse(contract);

  return parsedContract.success ? parsedContract.data : null;
}

function asThemeTokens(tokens: unknown): CssVariablesExportTheme['tokens'] {
  return typeof tokens === 'object' && tokens !== null && !Array.isArray(tokens)
    ? (tokens as CssVariablesExportTheme['tokens'])
    : {};
}

function normalizeDocumentationProfile({
  profile,
  supportedLocales,
  fallbackLocale,
}: {
  profile: DocumentationProfileContent;
  supportedLocales: AppLocale[];
  fallbackLocale: AppLocale;
}): DocumentationProfileContent {
  return supportedLocales.includes(profile.locale)
    ? profile
    : {
        ...profile,
        locale: fallbackLocale,
      };
}

function normalizeAiInstructionProfile({
  profile,
  supportedLocales,
  fallbackLocale,
}: {
  profile: AiInstructionProfileContent;
  supportedLocales: AppLocale[];
  fallbackLocale: AppLocale;
}): AiInstructionProfileContent {
  return supportedLocales.includes(profile.locale)
    ? profile
    : {
        ...profile,
        locale: fallbackLocale,
      };
}

export async function getExportCenterPageData({
  userId,
  projectSlug,
}: {
  userId: string;
  projectSlug: string;
}): Promise<ExportCenterPageData | null> {
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
      exportLogs: {
        orderBy: {
          createdAt: 'desc',
        },
        take: 8,
        select: {
          id: true,
          format: true,
          locale: true,
          status: true,
          errorMessage: true,
          createdAt: true,
        },
      },
      documentationProfile: {
        select: {
          content: true,
        },
      },
      aiInstructionProfile: {
        select: {
          content: true,
        },
      },
      localeSettings: {
        select: {
          documentationLocale: true,
        },
      },
      tokenSets: {
        orderBy: {
          type: 'asc',
        },
        select: {
          type: true,
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
          contract: true,
        },
      },
    },
  });

  if (!project) {
    return null;
  }

  const supportedLocales = project.supportedLocales as AppLocale[];

  const fallbackLocale =
    (project.localeSettings?.documentationLocale as AppLocale | undefined) ??
    (project.defaultLocale as AppLocale);

  const tokens = project.tokenSets.flatMap((tokenSet) =>
    parseTokenSetTokens(tokenSet.tokens),
  );

  const themes: CssVariablesExportTheme[] = project.themes.map((theme) => ({
    mode: theme.mode as CssVariablesExportTheme['mode'],
    name: theme.name,
    tokens: asThemeTokens(theme.tokens),
  }));

  const accessibilityThemes = project.themes.map((theme) => ({
    id: theme.id,
    mode: theme.mode as ThemeMode,
    name: theme.name,
    tokens: theme.tokens,
    updatedAt: theme.updatedAt,
  }));

  const components = project.componentContracts
    .map((componentContract) =>
      parseComponentContract(componentContract.contract),
    )
    .filter((contract): contract is ComponentContract => contract !== null);

  const colorTokenSet = project.tokenSets.find(
    (tokenSet) => tokenSet.type === 'color',
  );

  const accessibilityReport = colorTokenSet
    ? createAccessibilityCenterReport({
        colorTokenSetTokens: colorTokenSet.tokens,
        themes: accessibilityThemes,
      })
    : null;

  const documentationProfile = normalizeDocumentationProfile({
    supportedLocales,
    fallbackLocale,
    profile: project.documentationProfile
      ? parseDocumentationProfileContent(project.documentationProfile.content)
      : {
          ...defaultDocumentationProfileContent,
          locale: fallbackLocale,
        },
  });

  const aiInstructionProfile = normalizeAiInstructionProfile({
    supportedLocales,
    fallbackLocale,
    profile: project.aiInstructionProfile
      ? parseAiInstructionProfileContent(project.aiInstructionProfile.content)
      : {
          ...defaultAiInstructionProfileContent,
          locale: fallbackLocale,
        },
  });

  return {
    projectSlug: project.slug,
    fallbackLocale,
    documentationProfile,
    aiInstructionProfile,
    exportLogs: project.exportLogs.map((exportLog) => ({
      id: exportLog.id,
      format: exportLog.format as ExportLogFormat,
      locale: exportLog.locale as AppLocale | null,
      status: exportLog.status,
      errorMessage: exportLog.errorMessage,
      createdAt: exportLog.createdAt.toISOString(),
    })),
    exportCenterInput: {
      project: {
        name: project.name,
        description: project.description,
        defaultLocale: project.defaultLocale as AppLocale,
        supportedLocales,
      },
      tokens,
      themes,
      components,
      accessibility: accessibilityReport
        ? {
            score: accessibilityReport.score,
            status: accessibilityReport.status,
            contrastPairs: accessibilityReport.contrastPairs.map((pair) => ({
              pairId: pair.pairId,
              themeName: pair.themeName,
              status: pair.status,
              ratio: pair.ratio,
            })),
          }
        : null,
    },
  };
}
