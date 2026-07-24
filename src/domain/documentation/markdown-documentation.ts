import {
  resolveLocalizedStringWithFallback,
  type AppLocale,
} from '@/domain/i18n';
import type {
  BrandProfile,
  ComponentContract,
  DesignToken,
} from '@/domain/design-system';

export type MarkdownDocumentationSection =
  | 'overview'
  | 'tokens'
  | 'themes'
  | 'components'
  | 'accessibility';

export type MarkdownDocumentationTheme = {
  mode: 'light' | 'dark';
  name: string;
  tokens: Record<string, unknown>;
};

export type MarkdownDocumentationAccessibilityContrastPair = {
  pairId: string;
  themeName: string;
  status: string;
  ratio: number | null;
};

export type MarkdownDocumentationProject = {
  name: string;
  description: string | null;
  defaultLocale: AppLocale;
  supportedLocales: readonly AppLocale[];
};

export type MarkdownDocumentationMissingTranslation = {
  path: string;
  requestedLocale: AppLocale;
  fallbackLocale: AppLocale;
};

export type MarkdownDocumentationInput = {
  locale: AppLocale;
  fallbackLocale?: AppLocale;
  sections?: readonly MarkdownDocumentationSection[];
  project: MarkdownDocumentationProject;
  brand: BrandProfile | null;
  tokens: readonly DesignToken[];
  themes: readonly MarkdownDocumentationTheme[];
  components: readonly ComponentContract[];
  accessibility: {
    score: number;
    status: 'healthy' | 'needsAttention' | 'critical';
    contrastPairs: readonly MarkdownDocumentationAccessibilityContrastPair[];
  } | null;
};

export type MarkdownDocumentationResult = {
  markdown: string;
  missingTranslations: MarkdownDocumentationMissingTranslation[];
};

const defaultSections: MarkdownDocumentationSection[] = [
  'overview',
  'tokens',
  'themes',
  'components',
  'accessibility',
];

const labels = {
  en: {
    generatedDocumentation: 'Generated design system documentation',
    overview: 'Overview',
    projectName: 'Project name',
    description: 'Description',
    defaultLocale: 'Default locale',
    supportedLocales: 'Supported locales',
    brand: 'Brand profile',
    tagline: 'Tagline',
    personality: 'Personality',
    audience: 'Audience',
    toneOfVoice: 'Tone of voice',
    visualStyle: 'Visual style',
    uiDensity: 'UI density',
    inspirationKeywords: 'Inspiration keywords',
    terminology: 'Terminology',
    editorialRules: 'Editorial rules',
    preferredTerm: 'Prefer',
    avoidedTerms: 'Avoid',
    tokens: 'Tokens',
    tokenPath: 'Path',
    tokenType: 'Type',
    tokenValue: 'Value',
    tokenDescription: 'Description',
    noDescription: 'No description provided.',
    themes: 'Themes',
    themeMode: 'Mode',
    themeName: 'Name',
    themeTokenCount: 'Token count',
    components: 'Components',
    componentPurpose: 'Purpose',
    componentStatus: 'Status',
    componentAnatomy: 'Anatomy',
    componentVariants: 'Variants',
    componentStates: 'States',
    componentAccessibility: 'Accessibility',
    componentForbiddenPatterns: 'Forbidden patterns',
    accessibility: 'Accessibility',
    accessibilityScore: 'Score',
    accessibilityStatus: 'Status',
    contrastPairs: 'Contrast pairs',
    contrastPair: 'Pair',
    contrastStatus: 'Status',
    contrastRatio: 'Ratio',
    missingTranslations: 'Missing translations',
    missingTranslationDescription:
      'Some localized content used a fallback language.',
    none: 'None',
  },
  fr: {
    generatedDocumentation: 'Documentation de design system générée',
    overview: 'Vue d’ensemble',
    projectName: 'Nom du projet',
    description: 'Description',
    defaultLocale: 'Locale par défaut',
    supportedLocales: 'Locales supportées',
    brand: 'Profil de marque',
    tagline: 'Tagline',
    personality: 'Personnalité',
    audience: 'Audience',
    toneOfVoice: 'Ton de voix',
    visualStyle: 'Style visuel',
    uiDensity: 'Densité UI',
    inspirationKeywords: 'Mots-clés d’inspiration',
    terminology: 'Terminologie',
    editorialRules: 'Règles éditoriales',
    preferredTerm: 'Privilégier',
    avoidedTerms: 'Éviter',
    tokens: 'Tokens',
    tokenPath: 'Chemin',
    tokenType: 'Type',
    tokenValue: 'Valeur',
    tokenDescription: 'Description',
    noDescription: 'Aucune description fournie.',
    themes: 'Thèmes',
    themeMode: 'Mode',
    themeName: 'Nom',
    themeTokenCount: 'Nombre de tokens',
    components: 'Composants',
    componentPurpose: 'Purpose',
    componentStatus: 'Statut',
    componentAnatomy: 'Anatomie',
    componentVariants: 'Variantes',
    componentStates: 'États',
    componentAccessibility: 'Accessibilité',
    componentForbiddenPatterns: 'Patterns interdits',
    accessibility: 'Accessibilité',
    accessibilityScore: 'Score',
    accessibilityStatus: 'Statut',
    contrastPairs: 'Paires de contraste',
    contrastPair: 'Paire',
    contrastStatus: 'Statut',
    contrastRatio: 'Ratio',
    missingTranslations: 'Traductions manquantes',
    missingTranslationDescription:
      'Certains contenus localisés utilisent une langue de fallback.',
    none: 'Aucun',
  },
} as const;

function escapeMarkdown(value: string): string {
  return value.replaceAll('|', '\\|').trim();
}

function createMarkdownTable(headers: string[], rows: string[][]): string {
  return [
    `| ${headers.map(escapeMarkdown).join(' | ')} |`,
    `| ${headers.map(() => '---').join(' | ')} |`,
    ...rows.map(
      (row) => `| ${row.map((cell) => escapeMarkdown(cell)).join(' | ')} |`,
    ),
  ].join('\n');
}

function stringifyTokenValue(value: DesignToken['value']): string {
  if (typeof value === 'string') {
    return value;
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }

  return JSON.stringify(value);
}

function countThemeTokens(tokens: Record<string, unknown>): number {
  return Object.keys(tokens).length;
}

function resolveDocumentationString({
  path,
  localizedString,
  locale,
  fallbackLocale,
  missingTranslations,
}: {
  path: string;
  localizedString: { en?: string | undefined; fr?: string | undefined };
  locale: AppLocale;
  fallbackLocale: AppLocale;
  missingTranslations: MarkdownDocumentationMissingTranslation[];
}): string {
  const normalizedLocalizedString: Partial<Record<AppLocale, string>> = {};

  if (typeof localizedString.en === 'string') {
    normalizedLocalizedString.en = localizedString.en;
  }

  if (typeof localizedString.fr === 'string') {
    normalizedLocalizedString.fr = localizedString.fr;
  }

  const resolved = resolveLocalizedStringWithFallback({
    localizedString: normalizedLocalizedString,
    locale,
    fallbackLocale,
  });

  if (resolved.usedFallback) {
    missingTranslations.push({
      path,
      requestedLocale: locale,
      fallbackLocale: resolved.resolvedLocale ?? resolved.fallbackLocale,
    });
  }

  return resolved.value;
}

function renderOverviewSection({
  project,
  brand,
  locale,
  fallbackLocale,
  missingTranslations,
}: {
  project: MarkdownDocumentationProject;
  brand: BrandProfile | null;
  locale: AppLocale;
  fallbackLocale: AppLocale;
  missingTranslations: MarkdownDocumentationMissingTranslation[];
}): string {
  const t = labels[locale];
  const brandSection = renderBrandSection({
    brand,
    locale,
    fallbackLocale,
    missingTranslations,
  });

  return [
    `## ${t.overview}`,
    '',
    createMarkdownTable(
      [t.projectName, t.description, t.defaultLocale, t.supportedLocales],
      [
        [
          project.name,
          project.description ?? t.noDescription,
          project.defaultLocale,
          project.supportedLocales.join(', '),
        ],
      ],
    ),
    brandSection,
  ]
    .filter(Boolean)
    .join('\n\n');
}

function renderBrandSection({
  brand,
  locale,
  fallbackLocale,
  missingTranslations,
}: {
  brand: BrandProfile | null;
  locale: AppLocale;
  fallbackLocale: AppLocale;
  missingTranslations: MarkdownDocumentationMissingTranslation[];
}) {
  const t = labels[locale];

  if (!brand) {
    return '';
  }

  const localizedFields = [
    ['tagline', t.tagline],
    ['shortDescription', t.description],
    ['personality', t.personality],
    ['audience', t.audience],
    ['toneOfVoice', t.toneOfVoice],
  ] as const;
  const localizedRows = localizedFields
    .map(([field, label]) => {
      const localizedString = brand.localizedContent[field];

      if (!localizedString) {
        return null;
      }

      const value = resolveDocumentationString({
        path: `brand.${field}`,
        localizedString,
        locale,
        fallbackLocale,
        missingTranslations,
      });

      return value ? `- **${label}:** ${value}` : null;
    })
    .filter((row): row is string => Boolean(row));
  const terminologyRows = brand.localizedContent.terminology.map(
    (entry, index) => {
      const preferred = resolveDocumentationString({
        path: `brand.terminology.${index}.preferred`,
        localizedString: entry.preferred,
        locale,
        fallbackLocale,
        missingTranslations,
      });
      const avoid = entry.avoid
        .map((term, termIndex) =>
          resolveDocumentationString({
            path: `brand.terminology.${index}.avoid.${termIndex}`,
            localizedString: term,
            locale,
            fallbackLocale,
            missingTranslations,
          }),
        )
        .filter(Boolean)
        .join(', ');

      return `- **${t.preferredTerm}:** ${preferred}${avoid ? ` · **${t.avoidedTerms}:** ${avoid}` : ''}`;
    },
  );
  const editorialRows = brand.localizedContent.editorialRules.map(
    (rule, index) =>
      `- ${resolveDocumentationString({
        path: `brand.editorialRules.${index}`,
        localizedString: rule,
        locale,
        fallbackLocale,
        missingTranslations,
      })}`,
  );

  return [
    `### ${t.brand}`,
    '',
    `- **${t.visualStyle}:** ${brand.visualStyle}`,
    `- **${t.uiDensity}:** ${brand.uiDensity}`,
    brand.inspirationKeywords.length > 0
      ? `- **${t.inspirationKeywords}:** ${brand.inspirationKeywords.join(', ')}`
      : '',
    ...localizedRows,
    terminologyRows.length > 0 ? `#### ${t.terminology}` : '',
    terminologyRows.length > 0 ? terminologyRows.join('\n') : '',
    editorialRows.length > 0 ? `#### ${t.editorialRules}` : '',
    editorialRows.length > 0 ? editorialRows.join('\n') : '',
  ]
    .filter(Boolean)
    .join('\n');
}

function renderTokensSection({
  tokens,
  locale,
  fallbackLocale,
  missingTranslations,
}: {
  tokens: readonly DesignToken[];
  locale: AppLocale;
  fallbackLocale: AppLocale;
  missingTranslations: MarkdownDocumentationMissingTranslation[];
}): string {
  const t = labels[locale];

  return [
    `## ${t.tokens}`,
    '',
    createMarkdownTable(
      [t.tokenPath, t.tokenType, t.tokenValue, t.tokenDescription],
      tokens.map((token) => [
        token.path,
        token.type,
        stringifyTokenValue(token.value),
        token.description
          ? resolveDocumentationString({
              path: `tokens.${token.path}.description`,
              localizedString: token.description,
              locale,
              fallbackLocale,
              missingTranslations,
            })
          : t.noDescription,
      ]),
    ),
  ].join('\n');
}

function renderThemesSection({
  themes,
  locale,
}: {
  themes: readonly MarkdownDocumentationTheme[];
  locale: AppLocale;
}): string {
  const t = labels[locale];

  return [
    `## ${t.themes}`,
    '',
    createMarkdownTable(
      [t.themeMode, t.themeName, t.themeTokenCount],
      themes.map((theme) => [
        theme.mode,
        theme.name,
        String(countThemeTokens(theme.tokens)),
      ]),
    ),
  ].join('\n');
}

function renderComponentsSection({
  components,
  locale,
  fallbackLocale,
  missingTranslations,
}: {
  components: readonly ComponentContract[];
  locale: AppLocale;
  fallbackLocale: AppLocale;
  missingTranslations: MarkdownDocumentationMissingTranslation[];
}): string {
  const t = labels[locale];

  return [
    `## ${t.components}`,
    '',
    ...components.map((component) => {
      const purpose = resolveDocumentationString({
        path: `components.${component.type}.purpose`,
        localizedString: component.purpose,
        locale,
        fallbackLocale,
        missingTranslations,
      });

      const variants =
        component.variants.map((variant) => variant.key).join(', ') || t.none;
      const states =
        component.states.map((state) => state.key).join(', ') || t.none;
      const anatomy = component.anatomy.join(', ') || t.none;
      const accessibility =
        component.accessibility
          .map((rule) => {
            const description = resolveDocumentationString({
              path: `components.${component.type}.accessibility.${rule.key}`,
              localizedString: rule.description,
              locale,
              fallbackLocale,
              missingTranslations,
            });

            return `- **${rule.key}** (${rule.severity}) — ${description}`;
          })
          .join('\n') || t.none;

      const forbiddenPatterns =
        component.forbiddenPatterns
          .map((pattern, index) => {
            const description = resolveDocumentationString({
              path: `components.${component.type}.forbiddenPatterns.${index}`,
              localizedString: pattern,
              locale,
              fallbackLocale,
              missingTranslations,
            });

            return `- ${description}`;
          })
          .join('\n') || t.none;

      return [
        `### ${component.name}`,
        '',
        `- **${t.componentStatus}:** ${component.status}`,
        `- **${t.componentPurpose}:** ${purpose}`,
        `- **${t.componentAnatomy}:** ${anatomy}`,
        `- **${t.componentVariants}:** ${variants}`,
        `- **${t.componentStates}:** ${states}`,
        '',
        `#### ${t.componentAccessibility}`,
        '',
        accessibility,
        '',
        `#### ${t.componentForbiddenPatterns}`,
        '',
        forbiddenPatterns,
      ].join('\n');
    }),
  ].join('\n');
}

function renderAccessibilitySection({
  accessibility,
  locale,
}: {
  accessibility: MarkdownDocumentationInput['accessibility'];
  locale: AppLocale;
}): string {
  const t = labels[locale];

  if (!accessibility) {
    return [`## ${t.accessibility}`, '', t.none].join('\n');
  }

  return [
    `## ${t.accessibility}`,
    '',
    `- **${t.accessibilityScore}:** ${accessibility.score}/100`,
    `- **${t.accessibilityStatus}:** ${accessibility.status}`,
    '',
    `### ${t.contrastPairs}`,
    '',
    createMarkdownTable(
      [t.contrastPair, t.contrastStatus, t.contrastRatio],
      accessibility.contrastPairs.map((pair) => [
        pair.themeName ? `${pair.themeName} · ${pair.pairId}` : pair.pairId,
        pair.status,
        pair.ratio !== null ? `${pair.ratio.toFixed(2)}:1` : t.none,
      ]),
    ),
  ].join('\n');
}

function renderMissingTranslationsSection({
  missingTranslations,
  locale,
}: {
  missingTranslations: MarkdownDocumentationMissingTranslation[];
  locale: AppLocale;
}): string {
  const t = labels[locale];

  if (missingTranslations.length === 0) {
    return '';
  }

  return [
    `## ${t.missingTranslations}`,
    '',
    t.missingTranslationDescription,
    '',
    ...missingTranslations.map(
      (missingTranslation) =>
        `- \`${missingTranslation.path}\`: ${missingTranslation.requestedLocale} → ${missingTranslation.fallbackLocale}`,
    ),
  ].join('\n');
}

export function generateMarkdownDocumentation(
  input: MarkdownDocumentationInput,
): MarkdownDocumentationResult {
  const selectedSections = input.sections ?? defaultSections;
  const fallbackLocale = input.fallbackLocale ?? input.project.defaultLocale;
  const missingTranslations: MarkdownDocumentationMissingTranslation[] = [];

  const sections = [
    `# ${input.project.name}`,
    '',
    `> ${labels[input.locale].generatedDocumentation}`,
  ];

  if (selectedSections.includes('overview')) {
    sections.push(
      renderOverviewSection({
        project: input.project,
        brand: input.brand,
        locale: input.locale,
        fallbackLocale,
        missingTranslations,
      }),
    );
  }

  if (selectedSections.includes('tokens')) {
    sections.push(
      renderTokensSection({
        tokens: input.tokens,
        locale: input.locale,
        fallbackLocale,
        missingTranslations,
      }),
    );
  }

  if (selectedSections.includes('themes')) {
    sections.push(
      renderThemesSection({
        themes: input.themes,
        locale: input.locale,
      }),
    );
  }

  if (selectedSections.includes('components')) {
    sections.push(
      renderComponentsSection({
        components: input.components,
        locale: input.locale,
        fallbackLocale,
        missingTranslations,
      }),
    );
  }

  if (selectedSections.includes('accessibility')) {
    sections.push(
      renderAccessibilitySection({
        accessibility: input.accessibility,
        locale: input.locale,
      }),
    );
  }

  const missingTranslationsSection = renderMissingTranslationsSection({
    missingTranslations,
    locale: input.locale,
  });

  if (missingTranslationsSection) {
    sections.push(missingTranslationsSection);
  }

  return {
    markdown: sections.filter(Boolean).join('\n\n').trim(),
    missingTranslations,
  };
}
