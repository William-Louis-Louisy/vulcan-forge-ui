import { z } from 'zod';
import { localizedStringSchema } from '@/domain/i18n';

export const visualDirectionSchema = z.enum([
  'minimal',
  'editorial',
  'playful',
  'enterprise',
]);

export const brandProfileLocalizedContentSchema = z.object({
  name: localizedStringSchema,
  description: localizedStringSchema.optional(),
  toneOfVoice: localizedStringSchema.optional(),
  designPrinciples: z.array(localizedStringSchema).default([]),
});

export const brandProfileSchema = z.object({
  visualDirection: visualDirectionSchema,
  localizedContent: brandProfileLocalizedContentSchema,
});

export type VisualDirection = z.infer<typeof visualDirectionSchema>;
export type BrandProfileLocalizedContent = z.infer<
  typeof brandProfileLocalizedContentSchema
>;
export type BrandProfile = z.infer<typeof brandProfileSchema>;
