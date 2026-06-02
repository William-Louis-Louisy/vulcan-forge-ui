import {
  resolveLocalizedStringWithFallback,
  type AppLocale,
} from '@/domain/i18n';
import type { ComponentContract, DesignToken } from '@/domain/design-system';

export type AiInstructionsStrictness = 'balanced' | 'strict' | 'veryStrict';

export type AiInstructionsSection =
  | 'tokenRules'
  | 'componentRules'
  | 'accessibilityRules'
  | 'forbiddenPatterns';

export type AiInstructionsMissingTranslation = {
  path: string;
  requestedLocale: AppLocale;
  fallbackLocale: AppLocale;
};

export type AiInstructionsProject = {
  name: string;
  description: string | null;
  defaultLocale: AppLocale;
  supportedLocales: readonly AppLocale[];
};

export type AiInstructionsInput = {
  locale: AppLocale;
  fallbackLocale?: AppLocale;
  strictness: AiInstructionsStrictness;
  sections?: readonly AiInstructionsSection[];
  project: AiInstructionsProject;
  tokens: readonly DesignToken[];
  components: readonly ComponentContract[];
};

export type AiInstructionsResult = {
  fileName: string;
  content: string;
  missingTranslations: AiInstructionsMissingTranslation[];
};

const defaultSections: AiInstructionsSection[] = [
  'tokenRules',
  'componentRules',
  'accessibilityRules',
  'forbiddenPatterns',
];

const labels = {
  en: {
    fileTitle: 'AI instructions',
    generatedNotice:
      'These instructions are generated from the design system model. Follow them strictly.',
    project: 'Project',
    locale: 'Locale',
    strictness: 'Strictness',
    tokenRules: 'Token rules',
    componentRules: 'Component rules',
    accessibilityRules: 'Accessibility rules',
    forbiddenPatterns: 'Forbidden patterns',
    antiHallucinationRules: 'Anti-hallucination rules',
    missingTranslations: 'Missing translations',
    none: 'None',
    tokenUsageIntro:
      'Use design tokens as the source of truth. Do not invent visual values.',
    componentUsageIntro:
      'Use only documented components and documented component variants.',
    accessibilityIntro:
      'Respect the documented accessibility rules for every component.',
    forbiddenIntro: 'Never use the following forbidden patterns.',
    missingTranslationDescription:
      'Some localized content used a fallback language while generating this file.',
    strictnessDescriptions: {
      balanced:
        'Prefer documented decisions, but allow careful implementation choices when the model is incomplete.',
      strict:
        'Do not invent tokens, components, variants or accessibility behavior. Ask for clarification when required.',
      veryStrict:
        'Use only explicit model data. If something is missing, stop and report the missing design-system information.',
    },
    antiHallucination: {
      useOnlyTokens:
        'Use only tokens listed in this file or explicitly available in the project model.',
      noHardcodedValues:
        'Do not hardcode colors, spacing, radius, typography or motion values when a token exists.',
      noInventedComponents:
        'Do not invent component APIs, variants, states, slots or accessibility behavior.',
      fallbackInstruction:
        'When required information is missing, state the missing information instead of guessing.',
      respectLocale:
        'Respect the requested locale and do not mix languages inside user-facing copy.',
    },
    tokenStatus: {
      draft: 'draft',
      ready: 'ready',
      deprecated: 'deprecated',
    },
    componentStatus: {
      draft: 'draft',
      ready: 'ready',
      deprecated: 'deprecated',
    },
  },
  fr: {
    fileTitle: 'Instructions IA',
    generatedNotice:
      'Ces instructions sont générées depuis le modèle du design system. Respectez-les strictement.',
    project: 'Projet',
    locale: 'Locale',
    strictness: 'Niveau de strictness',
    tokenRules: 'Règles de tokens',
    componentRules: 'Règles de composants',
    accessibilityRules: 'Règles d’accessibilité',
    forbiddenPatterns: 'Patterns interdits',
    antiHallucinationRules: 'Règles anti-hallucination',
    missingTranslations: 'Traductions manquantes',
    none: 'Aucun',
    tokenUsageIntro:
      'Utilisez les design tokens comme source de vérité. N’inventez pas de valeurs visuelles.',
    componentUsageIntro:
      'Utilisez uniquement les composants documentés et leurs variantes documentées.',
    accessibilityIntro:
      'Respectez les règles d’accessibilité documentées pour chaque composant.',
    forbiddenIntro: 'N’utilisez jamais les patterns interdits suivants.',
    missingTranslationDescription:
      'Certains contenus localisés ont utilisé une langue de fallback pendant la génération.',
    strictnessDescriptions: {
      balanced:
        'Privilégiez les décisions documentées, tout en autorisant des choix prudents lorsque le modèle est incomplet.',
      strict:
        'N’inventez aucun token, composant, variant ou comportement d’accessibilité. Demandez une clarification si nécessaire.',
      veryStrict:
        'Utilisez uniquement les données explicites du modèle. Si une information manque, arrêtez-vous et signalez-la.',
    },
    antiHallucination: {
      useOnlyTokens:
        'Utilisez uniquement les tokens listés dans ce fichier ou explicitement présents dans le modèle projet.',
      noHardcodedValues:
        'Ne hardcodez pas les couleurs, espacements, radius, typographies ou animations lorsqu’un token existe.',
      noInventedComponents:
        'N’inventez pas d’API composant, de variants, d’états, de slots ou de comportement d’accessibilité.',
      fallbackInstruction:
        'Lorsqu’une information manque, indiquez l’information manquante au lieu de deviner.',
      respectLocale:
        'Respectez la locale demandée et ne mélangez pas les langues dans les textes visibles.',
    },
    tokenStatus: {
      draft: 'brouillon',
      ready: 'prêt',
      deprecated: 'déprécié',
    },
    componentStatus: {
      draft: 'brouillon',
      ready: 'prêt',
      deprecated: 'déprécié',
    },
  },
} as const;

function toKebabCase(value: string): string {
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function createAiInstructionsFileName({
  projectName,
  locale,
}: {
  projectName: string;
  locale: AppLocale;
}): string {
  return `${toKebabCase(projectName) || 'design-system'}-ai-instructions-${locale}.md`;
}

function stringifyTokenValue(value: DesignToken['value']): string {
  return String(value);
}

function normalizeLocalizedString(localizedString: {
  en?: string | undefined;
  fr?: string | undefined;
}): Partial<Record<AppLocale, string>> {
  const normalizedLocalizedString: Partial<Record<AppLocale, string>> = {};

  if (typeof localizedString.en === 'string') {
    normalizedLocalizedString.en = localizedString.en;
  }

  if (typeof localizedString.fr === 'string') {
    normalizedLocalizedString.fr = localizedString.fr;
  }

  return normalizedLocalizedString;
}

function resolveInstructionText({
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
  missingTranslations: AiInstructionsMissingTranslation[];
}): string {
  const resolved = resolveLocalizedStringWithFallback({
    localizedString: normalizeLocalizedString(localizedString),
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

function renderHeader(input: AiInstructionsInput): string {
  const t = labels[input.locale];

  return [
    `# ${input.project.name} — ${t.fileTitle}`,
    '',
    `> ${t.generatedNotice}`,
    '',
    `- **${t.project}:** ${input.project.name}`,
    `- **${t.locale}:** ${input.locale}`,
    `- **${t.strictness}:** ${input.strictness}`,
    `- **${t.strictness}:** ${t.strictnessDescriptions[input.strictness]}`,
  ].join('\n');
}

function renderAntiHallucinationRules(locale: AppLocale): string {
  const t = labels[locale];

  return [
    `## ${t.antiHallucinationRules}`,
    '',
    `- ${t.antiHallucination.useOnlyTokens}`,
    `- ${t.antiHallucination.noHardcodedValues}`,
    `- ${t.antiHallucination.noInventedComponents}`,
    `- ${t.antiHallucination.fallbackInstruction}`,
    `- ${t.antiHallucination.respectLocale}`,
  ].join('\n');
}

function renderTokenRules({
  tokens,
  locale,
}: {
  tokens: readonly DesignToken[];
  locale: AppLocale;
}): string {
  const t = labels[locale];

  const tokenRules = tokens
    .filter((token) => token.status !== 'deprecated')
    .map((token) => {
      const reference = token.reference ? ` → ${token.reference}` : '';

      return `- \`${token.path}\` (${token.type}, ${t.tokenStatus[token.status]}) = \`${stringifyTokenValue(token.value)}\`${reference}`;
    });

  return [
    `## ${t.tokenRules}`,
    '',
    t.tokenUsageIntro,
    '',
    tokenRules.length > 0 ? tokenRules.join('\n') : t.none,
  ].join('\n');
}

function renderComponentRules({
  components,
  locale,
  fallbackLocale,
  missingTranslations,
}: {
  components: readonly ComponentContract[];
  locale: AppLocale;
  fallbackLocale: AppLocale;
  missingTranslations: AiInstructionsMissingTranslation[];
}): string {
  const t = labels[locale];

  const sections = components.map((component) => {
    const purpose = resolveInstructionText({
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

    return [
      `### ${component.name}`,
      '',
      `- **Status:** ${t.componentStatus[component.status]}`,
      `- **Purpose:** ${purpose}`,
      `- **Anatomy:** ${anatomy}`,
      `- **Variants:** ${variants}`,
      `- **States:** ${states}`,
    ].join('\n');
  });

  return [
    `## ${t.componentRules}`,
    '',
    t.componentUsageIntro,
    '',
    sections.length > 0 ? sections.join('\n\n') : t.none,
  ].join('\n');
}

function renderAccessibilityRules({
  components,
  locale,
  fallbackLocale,
  missingTranslations,
}: {
  components: readonly ComponentContract[];
  locale: AppLocale;
  fallbackLocale: AppLocale;
  missingTranslations: AiInstructionsMissingTranslation[];
}): string {
  const t = labels[locale];

  const rules = components.flatMap((component) =>
    component.accessibility.map((rule) => {
      const description = resolveInstructionText({
        path: `components.${component.type}.accessibility.${rule.key}`,
        localizedString: rule.description,
        locale,
        fallbackLocale,
        missingTranslations,
      });

      return `- **${component.name}.${rule.key}** (${rule.severity}) — ${description}`;
    }),
  );

  return [
    `## ${t.accessibilityRules}`,
    '',
    t.accessibilityIntro,
    '',
    rules.length > 0 ? rules.join('\n') : t.none,
  ].join('\n');
}

function renderForbiddenPatterns({
  components,
  locale,
  fallbackLocale,
  missingTranslations,
}: {
  components: readonly ComponentContract[];
  locale: AppLocale;
  fallbackLocale: AppLocale;
  missingTranslations: AiInstructionsMissingTranslation[];
}): string {
  const t = labels[locale];

  const rules = components.flatMap((component) =>
    component.forbiddenPatterns.map((pattern, index) => {
      const description = resolveInstructionText({
        path: `components.${component.type}.forbiddenPatterns.${index}`,
        localizedString: pattern,
        locale,
        fallbackLocale,
        missingTranslations,
      });

      return `- **${component.name}:** ${description}`;
    }),
  );

  return [
    `## ${t.forbiddenPatterns}`,
    '',
    t.forbiddenIntro,
    '',
    rules.length > 0 ? rules.join('\n') : t.none,
  ].join('\n');
}

function renderMissingTranslations({
  missingTranslations,
  locale,
}: {
  missingTranslations: readonly AiInstructionsMissingTranslation[];
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

export function generateAiInstructions(
  input: AiInstructionsInput,
): AiInstructionsResult {
  const selectedSections = input.sections ?? defaultSections;
  const fallbackLocale = input.fallbackLocale ?? input.project.defaultLocale;
  const missingTranslations: AiInstructionsMissingTranslation[] = [];

  const sections = [
    renderHeader(input),
    renderAntiHallucinationRules(input.locale),
  ];

  if (selectedSections.includes('tokenRules')) {
    sections.push(
      renderTokenRules({
        tokens: input.tokens,
        locale: input.locale,
      }),
    );
  }

  if (selectedSections.includes('componentRules')) {
    sections.push(
      renderComponentRules({
        components: input.components,
        locale: input.locale,
        fallbackLocale,
        missingTranslations,
      }),
    );
  }

  if (selectedSections.includes('accessibilityRules')) {
    sections.push(
      renderAccessibilityRules({
        components: input.components,
        locale: input.locale,
        fallbackLocale,
        missingTranslations,
      }),
    );
  }

  if (selectedSections.includes('forbiddenPatterns')) {
    sections.push(
      renderForbiddenPatterns({
        components: input.components,
        locale: input.locale,
        fallbackLocale,
        missingTranslations,
      }),
    );
  }

  const missingTranslationsSection = renderMissingTranslations({
    missingTranslations,
    locale: input.locale,
  });

  if (missingTranslationsSection) {
    sections.push(missingTranslationsSection);
  }

  return {
    fileName: createAiInstructionsFileName({
      projectName: input.project.name,
      locale: input.locale,
    }),
    content: sections.filter(Boolean).join('\n\n').trim(),
    missingTranslations,
  };
}
