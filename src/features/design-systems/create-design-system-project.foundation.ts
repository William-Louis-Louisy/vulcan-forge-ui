import type {
  AppLocale,
  AccessibilityTarget,
  DesignSystemPlatform,
} from '@/generated/prisma/client';
import type { Prisma } from '@/generated/prisma/client';
import { getMvpSeedTemplates } from '@/domain/design-system';

function toInputJsonValue(value: unknown): Prisma.InputJsonValue {
  return value as Prisma.InputJsonValue;
}

export type CreateDesignSystemProjectFoundationInput = {
  name: string;
  description: string | null;
  platforms: DesignSystemPlatform[];
  defaultLocale: AppLocale;
  supportedLocales: AppLocale[];
  visualDirection: string;
  accessibilityTarget: AccessibilityTarget;
};

export function buildDesignSystemProjectFoundation(
  input: CreateDesignSystemProjectFoundationInput,
) {
  const seedTemplates = getMvpSeedTemplates();
  return {
    localeSettings: {
      create: {
        defaultLocale: input.defaultLocale,
        supportedLocales: input.supportedLocales,
      },
    },
    brandProfile: {
      create: {
        name: input.name,
        description: input.description,
        visualDirection: input.visualDirection,
      },
    },
    tokenSets: {
      create: seedTemplates.tokenSets.map((tokenSet) => ({
        type: tokenSet.type,
        name: tokenSet.name,
        tokens: toInputJsonValue(tokenSet.tokens),
      })),
    },
    themes: {
      create: seedTemplates.themes.map((theme) => ({
        mode: theme.mode,
        name: theme.name,
        tokens: toInputJsonValue(theme.tokens),
      })),
    },
    componentContracts: {
      create: seedTemplates.componentContracts.map((componentContract) => ({
        type: componentContract.type,
        name: componentContract.name,
        contract: toInputJsonValue(componentContract),
      })),
    },
    documentationProfile: {
      create: {
        format: 'markdown',
        content: createDocumentationProfileContent(input),
      },
    },
    aiInstructionProfile: {
      create: {
        content: createAiInstructionProfileContent(input),
      },
    },
  };
}

function createDocumentationProfileContent(
  input: CreateDesignSystemProjectFoundationInput,
) {
  return {
    title: input.name,
    description: input.description,
    sections: [
      'Overview',
      'Foundations',
      'Tokens',
      'Themes',
      'Components',
      'Accessibility',
      'Exports',
    ],
  } satisfies Prisma.InputJsonValue;
}

function createAiInstructionProfileContent(
  input: CreateDesignSystemProjectFoundationInput,
) {
  return {
    projectName: input.name,
    rules: [
      'Always use semantic tokens before primitive values.',
      'Respect the selected accessibility target.',
      'Do not invent component variants that are not documented in ComponentContract records.',
      'When generating UI, preserve supported locales and avoid hardcoded visible text.',
    ],
  } satisfies Prisma.InputJsonValue;
}
