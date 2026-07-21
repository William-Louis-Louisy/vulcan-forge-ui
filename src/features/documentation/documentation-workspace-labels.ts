import type { AppLocale } from '@/domain/i18n';

export type DocumentationWorkspaceLabels = {
  pageTitle: string;
  format: string;
  markdown: string;
  markdownDescription: string;
  generate: string;
  generated: string;
  rendered: string;
  source: string;
  characterCount: string;
  previewModes: string;
  diagnostics: string;
  diagnosticsDescription: string;
  translationFallbacks: string;
  sourceIssues: string;
  noSourceIssues: string;
};

const labels = {
  en: {
    pageTitle: 'Documentation',
    format: 'Format',
    markdown: 'Markdown',
    markdownDescription: 'Plain .md — readable on GitHub.',
    generate: 'Generate',
    generated: 'Documentation preview generated.',
    rendered: 'Rendered',
    source: 'Source',
    characterCount: '{count} characters',
    previewModes: 'Documentation preview mode',
    diagnostics: 'Generation diagnostics',
    diagnosticsDescription:
      'Review source completeness and localized fallback usage.',
    translationFallbacks: 'Translation fallbacks',
    sourceIssues: 'Source data issues',
    noSourceIssues: 'No source data issue detected.',
  },
  fr: {
    pageTitle: 'Documentation',
    format: 'Format',
    markdown: 'Markdown',
    markdownDescription: 'Fichier .md simple — lisible sur GitHub.',
    generate: 'Générer',
    generated: 'Prévisualisation de la documentation générée.',
    rendered: 'Rendu',
    source: 'Source',
    characterCount: '{count} caractères',
    previewModes: 'Mode de prévisualisation de la documentation',
    diagnostics: 'Diagnostics de génération',
    diagnosticsDescription:
      'Vérifiez la complétude des sources et les fallbacks de traduction.',
    translationFallbacks: 'Fallbacks de traduction',
    sourceIssues: 'Problèmes des données source',
    noSourceIssues: 'Aucun problème de données source détecté.',
  },
} satisfies Record<AppLocale, DocumentationWorkspaceLabels>;

export function getDocumentationWorkspaceLabels(
  locale: AppLocale,
): DocumentationWorkspaceLabels {
  return labels[locale];
}

export function formatDocumentationCharacterCount(
  label: string,
  count: number,
): string {
  return label.replace('{count}', count.toLocaleString());
}
