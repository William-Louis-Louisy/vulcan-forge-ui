import { z } from 'zod';
import { appLocaleSchema } from '@/domain/i18n';
import type { MarkdownDocumentationSection } from './markdown-documentation';

export const documentationSections = [
  'overview',
  'tokens',
  'themes',
  'components',
  'accessibility',
] as const satisfies readonly MarkdownDocumentationSection[];

export const documentationFormatSchema = z.enum(['markdown']);

export type DocumentationFormat = z.infer<typeof documentationFormatSchema>;

export const documentationProfileContentSchema = z.object({
  locale: appLocaleSchema,
  sections: z.array(z.enum(documentationSections)).min(1),
  format: documentationFormatSchema,
});

export type DocumentationProfileContent = z.infer<
  typeof documentationProfileContentSchema
>;

export const defaultDocumentationProfileContent: DocumentationProfileContent = {
  locale: 'en',
  sections: ['overview', 'tokens', 'themes', 'components', 'accessibility'],
  format: 'markdown',
};

export function parseDocumentationProfileContent(
  content: unknown,
): DocumentationProfileContent {
  const parsedContent = documentationProfileContentSchema.safeParse(content);

  return parsedContent.success
    ? parsedContent.data
    : defaultDocumentationProfileContent;
}
