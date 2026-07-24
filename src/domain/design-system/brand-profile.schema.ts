import { z } from 'zod';
import { localizedStringSchema } from '@/domain/i18n';

export const brandVisualStyles = [
  'minimal',
  'premium',
  'editorial',
  'technical',
  'playful',
  'bold',
  'neutral',
  'custom',
] as const;

export const brandUiDensities = ['compact', 'cozy', 'comfortable'] as const;

export const brandVisualStyleSchema = z.enum(brandVisualStyles);
export const brandUiDensitySchema = z.enum(brandUiDensities);

export const brandTerminologyEntrySchema = z.object({
  preferred: localizedStringSchema,
  avoid: z.array(localizedStringSchema).max(12).default([]),
});

export const brandProfileLocalizedContentSchema = z.object({
  tagline: localizedStringSchema.optional(),
  shortDescription: localizedStringSchema.optional(),
  personality: localizedStringSchema.optional(),
  audience: localizedStringSchema.optional(),
  toneOfVoice: localizedStringSchema.optional(),
  terminology: z.array(brandTerminologyEntrySchema).max(20).default([]),
  editorialRules: z.array(localizedStringSchema).max(20).default([]),
});

export const brandProfileSchema = z.object({
  visualStyle: brandVisualStyleSchema,
  uiDensity: brandUiDensitySchema,
  inspirationKeywords: z
    .array(z.string().trim().min(1).max(40))
    .max(12)
    .default([]),
  localizedContent: brandProfileLocalizedContentSchema,
});

export type BrandVisualStyle = z.infer<typeof brandVisualStyleSchema>;
export type BrandUiDensity = z.infer<typeof brandUiDensitySchema>;
export type BrandTerminologyEntry = z.infer<typeof brandTerminologyEntrySchema>;
export type BrandProfileLocalizedContent = z.infer<
  typeof brandProfileLocalizedContentSchema
>;
export type BrandProfile = z.infer<typeof brandProfileSchema>;
