import { z } from 'zod';
import { appLocaleSchema } from '@/domain/i18n';
import type {
  AiInstructionsSection,
  AiInstructionsStrictness,
} from './ai-instructions';

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

export const aiInstructionProfileContentSchema = z.object({
  locale: appLocaleSchema,
  strictness: z.enum(aiInstructionsStrictnessLevels),
  sections: z.array(z.enum(aiInstructionsSections)),
});

export type AiInstructionProfileContent = z.infer<
  typeof aiInstructionProfileContentSchema
>;

export const defaultAiInstructionProfileContent: AiInstructionProfileContent = {
  locale: 'en',
  strictness: 'strict',
  sections: [
    'tokenRules',
    'componentRules',
    'accessibilityRules',
    'forbiddenPatterns',
  ],
};

export function parseAiInstructionProfileContent(
  content: unknown,
): AiInstructionProfileContent {
  const parsedContent = aiInstructionProfileContentSchema.safeParse(content);

  return parsedContent.success
    ? parsedContent.data
    : defaultAiInstructionProfileContent;
}
