import type { AppLocale } from '@/domain/i18n';

export type AiInstructionsWorkspaceLabels = {
  pageTitle: string;
  preview: string;
  codePreview: string;
  upToDate: string;
  generatedFromModel: string;
  singleLocaleDescription: string;
  diagnostics: string;
  diagnosticsDescription: string;
  sourceQuality: string;
  translations: string;
  noDiagnostics: string;
  currentConfiguration: string;
  selectedSections: (count: number) => string;
  characterCount: (count: number) => string;
};

export function getAiInstructionsWorkspaceLabels(
  locale: AppLocale,
): AiInstructionsWorkspaceLabels {
  const numberFormatter = new Intl.NumberFormat(locale);

  if (locale === 'fr') {
    return {
      pageTitle: 'Instructions IA',
      preview: 'Aperçu',
      codePreview: 'Aperçu des règles',
      upToDate: 'À jour',
      generatedFromModel:
        'Les instructions sont générées depuis le modèle validé. Toute suggestion produite par une IA doit être relue avant utilisation.',
      singleLocaleDescription:
        'C’est la seule langue activée pour ce projet.',
      diagnostics: 'Diagnostics de génération',
      diagnosticsDescription:
        'Vérifiez la complétude des sources et les fallbacks de traduction.',
      sourceQuality: 'Qualité des sources',
      translations: 'Traductions',
      noDiagnostics: 'Aucun problème de génération détecté.',
      currentConfiguration: 'Configuration actuelle',
      selectedSections: (count) =>
        `${numberFormatter.format(count)} section${count > 1 ? 's' : ''}`,
      characterCount: (count) =>
        `${numberFormatter.format(count)} caractère${count > 1 ? 's' : ''}`,
    };
  }

  return {
    pageTitle: 'AI instructions',
    preview: 'Preview',
    codePreview: 'Rules preview',
    upToDate: 'Up to date',
    generatedFromModel:
      'Instructions are generated from the validated model. AI-generated suggestions should always be reviewed before use.',
    singleLocaleDescription:
      'This is the only language enabled for this project.',
    diagnostics: 'Generation diagnostics',
    diagnosticsDescription:
      'Review source completeness and translation fallbacks.',
    sourceQuality: 'Source quality',
    translations: 'Translations',
    noDiagnostics: 'No generation issue detected.',
    currentConfiguration: 'Current configuration',
    selectedSections: (count) =>
      `${numberFormatter.format(count)} section${count === 1 ? '' : 's'}`,
    characterCount: (count) =>
      `${numberFormatter.format(count)} character${count === 1 ? '' : 's'}`,
  };
}
