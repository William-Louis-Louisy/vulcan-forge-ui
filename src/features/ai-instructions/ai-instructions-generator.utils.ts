import {
  aiInstructionsSections,
  aiInstructionsStrictnessLevels,
  type AiInstructionsSection,
  type AiInstructionsStrictness,
} from '@/domain/ai-instructions';
import type { AppLocale } from '@/domain/i18n';

export {
  aiInstructionsSections,
  aiInstructionsStrictnessLevels,
} from '@/domain/ai-instructions';

export type AiInstructionsSectionSelection = Record<
  AiInstructionsSection,
  boolean
>;

export function createDefaultAiInstructionsSectionSelection(): AiInstructionsSectionSelection {
  return {
    tokenRules: true,
    componentRules: true,
    accessibilityRules: true,
    forbiddenPatterns: true,
  };
}

export function getSelectedAiInstructionsSections(
  selection: AiInstructionsSectionSelection,
): AiInstructionsSection[] {
  return aiInstructionsSections.filter((section) => selection[section]);
}

export function getAiInstructionsFileName({
  projectSlug,
  locale,
}: {
  projectSlug: string;
  locale: AppLocale;
}): string {
  return `${projectSlug}-ai-instructions-${locale}.md`;
}
