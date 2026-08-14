import { createGeneratedAccessibilitySummary } from '@/domain/accessibility';
import type {
  DocumentationProfileContent,
  MarkdownDocumentationInput,
  MarkdownDocumentationTheme,
} from '@/domain/documentation';
import {
  defaultDocumentationProfileContent,
  parseDocumentationProfileContent,
} from '@/domain/documentation';
import type { AppLocale } from '@/domain/i18n';
import { getDesignSystemProjectConsumerSnapshotForUser } from '@/server/design-system/project-source';

export type DocumentationGeneratorInput = Omit<
  MarkdownDocumentationInput,
  'locale' | 'fallbackLocale' | 'sections'
>;

export type DocumentationGeneratorPageData = {
  projectSlug: string;
  fallbackLocale: AppLocale;
  savedProfile: DocumentationProfileContent;
  documentationInput: DocumentationGeneratorInput;
};

export async function getDocumentationGeneratorPageData({
  userId,
  projectSlug,
}: {
  userId: string;
  projectSlug: string;
}): Promise<DocumentationGeneratorPageData | null> {
  const snapshot = await getDesignSystemProjectConsumerSnapshotForUser({
    userId,
    projectSlug,
  });

  if (!snapshot) {
    return null;
  }

  const { source } = snapshot;
  const fallbackLocale =
    (snapshot.localeSettings?.documentationLocale as AppLocale | undefined) ??
    source.project.defaultLocale;
  const accessibility = createGeneratedAccessibilitySummary(source);
  const themes: MarkdownDocumentationTheme[] = source.themes.map((theme) => ({
    mode: theme.mode,
    name: theme.name,
    tokens: theme.tokens,
  }));

  return {
    savedProfile:
      snapshot.documentationProfileContent !== null
        ? parseDocumentationProfileContent(snapshot.documentationProfileContent)
        : {
            ...defaultDocumentationProfileContent,
            locale: fallbackLocale,
          },
    projectSlug: source.project.slug,
    fallbackLocale,
    documentationInput: {
      project: {
        name: source.project.name,
        description: source.project.description,
        defaultLocale: source.project.defaultLocale,
        supportedLocales: source.project.supportedLocales,
      },
      brand: source.brand,
      tokens: source.tokens,
      themes,
      components: source.components.map((component) => component.contract),
      accessibility,
    },
  };
}
