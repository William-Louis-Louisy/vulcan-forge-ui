import type { AppLocale } from '@/domain/i18n';
import type { MarkdownDocumentationSection } from '@/domain/documentation';

export const documentationSections = [
  'overview',
  'tokens',
  'themes',
  'components',
  'accessibility',
] as const satisfies readonly MarkdownDocumentationSection[];

export type DocumentationSectionSelection = Record<
  MarkdownDocumentationSection,
  boolean
>;

export function createDefaultDocumentationSectionSelection(): DocumentationSectionSelection {
  return {
    overview: true,
    tokens: true,
    themes: true,
    components: true,
    accessibility: true,
  };
}

export function getSelectedDocumentationSections(
  selection: DocumentationSectionSelection,
): MarkdownDocumentationSection[] {
  return documentationSections.filter((section) => selection[section]);
}

export function getDocumentationFileName({
  projectSlug,
  locale,
}: {
  projectSlug: string;
  locale: AppLocale;
}): string {
  return `${projectSlug}-documentation-${locale}.md`;
}
