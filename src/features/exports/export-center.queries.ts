import {
  defaultAiInstructionProfileContent,
  parseAiInstructionProfileContent,
  type AiInstructionProfileContent,
} from '@/domain/ai-instructions';
import { createGeneratedAccessibilitySummary } from '@/domain/accessibility';
import type {
  BrandProfile,
  ComponentContract,
  DesignToken,
} from '@/domain/design-system';
import {
  defaultDocumentationProfileContent,
  parseDocumentationProfileContent,
  type DocumentationProfileContent,
  type MarkdownDocumentationInput,
} from '@/domain/documentation';
import type { CssVariablesExportTheme } from '@/domain/exports';
import type { AppLocale } from '@/domain/i18n';
import { getDesignSystemProjectConsumerSnapshotForUser } from '@/server/design-system/project-source';
import type { ExportLogFormat } from './export-center.utils';

export type ExportCenterLog = {
  id: string;
  format: ExportLogFormat;
  locale: AppLocale | null;
  status: 'success' | 'failed';
  errorMessage: string | null;
  createdAt: string;
};

export type ExportCenterInput = {
  project: MarkdownDocumentationInput['project'] & {
    brand: BrandProfile | null;
  };
  brand: BrandProfile | null;
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
  const snapshot = await getDesignSystemProjectConsumerSnapshotForUser({
    userId,
    projectSlug,
  });

  if (!snapshot) {
    return null;
  }

  const { source } = snapshot;
  const supportedLocales = source.project.supportedLocales;
  const fallbackLocale =
    (snapshot.localeSettings?.documentationLocale as AppLocale | undefined) ??
    source.project.defaultLocale;
  const documentationProfile = normalizeDocumentationProfile({
    supportedLocales,
    fallbackLocale,
    profile:
      snapshot.documentationProfileContent !== null
        ? parseDocumentationProfileContent(snapshot.documentationProfileContent)
        : {
            ...defaultDocumentationProfileContent,
            locale: fallbackLocale,
          },
  });
  const aiInstructionProfile = normalizeAiInstructionProfile({
    supportedLocales,
    fallbackLocale,
    profile:
      snapshot.aiInstructionProfileContent !== null
        ? parseAiInstructionProfileContent(snapshot.aiInstructionProfileContent)
        : {
            ...defaultAiInstructionProfileContent,
            locale: fallbackLocale,
          },
  });
  const accessibility = createGeneratedAccessibilitySummary(source);
  const themes: CssVariablesExportTheme[] = source.themes.map((theme) => ({
    mode: theme.mode,
    name: theme.name,
    tokens: theme.tokens,
  }));

  return {
    projectSlug: source.project.slug,
    fallbackLocale,
    documentationProfile,
    aiInstructionProfile,
    exportLogs: snapshot.exportLogs.map((exportLog) => ({
      id: exportLog.id,
      format: exportLog.format as ExportLogFormat,
      locale: exportLog.locale as AppLocale | null,
      status: exportLog.status as ExportCenterLog['status'],
      errorMessage: exportLog.errorMessage,
      createdAt: exportLog.createdAt.toISOString(),
    })),
    exportCenterInput: {
      project: {
        name: source.project.name,
        description: source.project.description,
        defaultLocale: source.project.defaultLocale,
        supportedLocales,
        brand: source.brand,
      },
      brand: source.brand,
      tokens: source.tokens,
      themes,
      components: source.components.map((component) => component.contract),
      accessibility,
    },
  };
}
