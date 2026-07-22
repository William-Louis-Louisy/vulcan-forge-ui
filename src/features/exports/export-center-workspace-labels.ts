import type { AppLocale } from '@/domain/i18n';

export type ExportCenterWorkspaceLabels = {
  pageTitle: string;
  allFormatsAvailable: string;
  generatedFromModel: string;
  ready: string;
  needsReview: string;
  preview: string;
  selected: string;
  codePreview: string;
  includeDeprecated: string;
  includeDeprecatedDescription: string;
  outputDetails: string;
  fileSize: string;
  characterCount: string;
  currentLocale: string;
  noLocale: string;
  web: string;
  sharedPackages: string;
  documentation: string;
  artificialIntelligence: string;
  recentExportLog: string;
  recentExportDescription: string;
  status: string;
  file: string;
  generatedAt: string;
  locale: string;
  noRecentExports: string;
  diagnosticsSummary: string;
  diagnosticsCount: string;
};

const labels = {
  en: {
    pageTitle: 'Exports',
    allFormatsAvailable: 'All formats available',
    generatedFromModel:
      'Six MVP formats generated from the same model. Re-export after token, theme or content changes.',
    ready: 'Ready',
    needsReview: 'Needs review',
    preview: 'Preview',
    selected: 'Selected',
    codePreview: 'Code preview',
    includeDeprecated: 'Legacy compatibility',
    includeDeprecatedDescription:
      'Include deprecated tokens for migrations and legacy consumers.',
    outputDetails: 'Output details',
    fileSize: 'File size',
    characterCount: 'Characters',
    currentLocale: 'Saved locale',
    noLocale: 'Language-neutral',
    web: 'Web',
    sharedPackages: 'Shared packages',
    documentation: 'Docs',
    artificialIntelligence: 'AI',
    recentExportLog: 'Recent export log',
    recentExportDescription:
      'The latest copy and download attempts recorded for this project.',
    status: 'Status',
    file: 'File',
    generatedAt: 'Generated',
    locale: 'Locale',
    noRecentExports: 'No export has been recorded for this project yet.',
    diagnosticsSummary: 'Generation diagnostics',
    diagnosticsCount: '{count} items to review',
  },
  fr: {
    pageTitle: 'Exports',
    allFormatsAvailable: 'Tous les formats sont disponibles',
    generatedFromModel:
      'Six formats MVP générés depuis le même modèle. Régénérez-les après une modification des tokens, thèmes ou contenus.',
    ready: 'Prêt',
    needsReview: 'À vérifier',
    preview: 'Prévisualiser',
    selected: 'Sélectionné',
    codePreview: 'Aperçu du code',
    includeDeprecated: 'Compatibilité historique',
    includeDeprecatedDescription:
      'Inclure les tokens dépréciés pour les migrations et les consommateurs historiques.',
    outputDetails: 'Détails du fichier',
    fileSize: 'Taille',
    characterCount: 'Caractères',
    currentLocale: 'Langue enregistrée',
    noLocale: 'Indépendant de la langue',
    web: 'Web',
    sharedPackages: 'Packages partagés',
    documentation: 'Documentation',
    artificialIntelligence: 'IA',
    recentExportLog: 'Journal des exports récents',
    recentExportDescription:
      'Les dernières copies et téléchargements enregistrés pour ce projet.',
    status: 'Statut',
    file: 'Fichier',
    generatedAt: 'Généré',
    locale: 'Langue',
    noRecentExports: 'Aucun export n’a encore été enregistré pour ce projet.',
    diagnosticsSummary: 'Diagnostics de génération',
    diagnosticsCount: '{count} éléments à vérifier',
  },
} satisfies Record<AppLocale, ExportCenterWorkspaceLabels>;

export function getExportCenterWorkspaceLabels(
  locale: AppLocale,
): ExportCenterWorkspaceLabels {
  return labels[locale];
}

export function formatExportFileSize(
  content: string,
  locale: AppLocale,
): string {
  const byteLength = new TextEncoder().encode(content).length;

  if (byteLength < 1024) {
    return `${byteLength.toLocaleString(locale)} B`;
  }

  const kiloBytes = byteLength / 1024;

  return `${kiloBytes.toLocaleString(locale, {
    maximumFractionDigits: 1,
    minimumFractionDigits: 1,
  })} KB`;
}

export function formatExportCharacterCount(
  content: string,
  locale: AppLocale,
): string {
  return content.length.toLocaleString(locale);
}

export function formatDiagnosticsCount(label: string, count: number): string {
  return label.replace('{count}', String(count));
}
