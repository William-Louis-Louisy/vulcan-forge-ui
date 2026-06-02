import { z } from 'zod';
import {
  aiInstructionsSections,
  aiInstructionsStrictnessLevels,
} from './ai-instructions-generator.utils';
import { appLocaleSchema } from '@/domain/i18n';

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
