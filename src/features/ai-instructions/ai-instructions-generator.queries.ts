import {
  defaultAiInstructionProfileContent,
  parseAiInstructionProfileContent,
  type AiInstructionProfileContent,
  type AiInstructionsInput,
} from '@/domain/ai-instructions';
import type { AppLocale } from '@/domain/i18n';
import { getDesignSystemProjectConsumerSnapshotForUser } from '@/server/design-system/project-source';

export type AiInstructionsGeneratorInput = Omit<
  AiInstructionsInput,
  'locale' | 'fallbackLocale' | 'strictness' | 'sections'
>;

export type AiInstructionsGeneratorPageData = {
  projectSlug: string;
  fallbackLocale: AppLocale;
  savedProfile: AiInstructionProfileContent;
  aiInstructionsInput: AiInstructionsGeneratorInput;
};

export async function getAiInstructionsGeneratorPageData({
  userId,
  projectSlug,
}: {
  userId: string;
  projectSlug: string;
}): Promise<AiInstructionsGeneratorPageData | null> {
  const snapshot = await getDesignSystemProjectConsumerSnapshotForUser({
    userId,
    projectSlug,
  });

  if (!snapshot) {
    return null;
  }

  const { source } = snapshot;
  const fallbackLocale =
    (snapshot.localeSettings?.aiInstructionLocale as AppLocale | undefined) ??
    source.project.defaultLocale;

  return {
    projectSlug: source.project.slug,
    fallbackLocale,
    savedProfile:
      snapshot.aiInstructionProfileContent !== null
        ? parseAiInstructionProfileContent(snapshot.aiInstructionProfileContent)
        : {
            ...defaultAiInstructionProfileContent,
            locale: fallbackLocale,
          },
    aiInstructionsInput: {
      project: {
        name: source.project.name,
        description: source.project.description,
        defaultLocale: source.project.defaultLocale,
        supportedLocales: source.project.supportedLocales,
      },
      brand: source.brand,
      tokens: source.tokens,
      components: source.components.map((component) => component.contract),
    },
  };
}
