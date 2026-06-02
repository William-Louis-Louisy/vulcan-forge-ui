import type {
  AiInstructionsSection,
  AiInstructionsStrictness,
} from '@/domain/ai-instructions';
import type { AppLocale } from '@/domain/i18n';

export const aiInstructionsSections = [
  'tokenRules',
  'componentRules',
  'accessibilityRules',
  'forbiddenPatterns',
] as const satisfies readonly AiInstructionsSection[];

export const aiInstructionsStrictnessLevels = [
  'balanced',
  'strict',
  'veryStrict',
] as const satisfies readonly AiInstructionsStrictness[];

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
