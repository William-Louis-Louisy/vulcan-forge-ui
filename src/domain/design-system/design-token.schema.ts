import { z } from 'zod';
import { localizedStringSchema } from '@/domain/i18n';

export const designTokenTypeSchema = z.enum([
  'color',
  'spacing',
  'radius',
  'typography',
  'motion',
]);

export const designTokenReferenceSchema = z
  .string()
  .trim()
  .regex(/^\{[a-zA-Z0-9._-]+\}$/, {
    message: 'tokenReferenceInvalid',
  });

export const designTokenValueSchema = z.union([
  z.string().trim().min(1, { message: 'tokenValueRequired' }),
  z.number(),
  z.boolean(),
]);

export const designTokenStatusSchema = z.enum(['draft', 'ready', 'deprecated']);

export const designTokenSchema = z.object({
  path: z
    .string()
    .trim()
    .min(1, { message: 'tokenPathRequired' })
    .regex(/^[a-zA-Z0-9._-]+$/, {
      message: 'tokenPathInvalid',
    }),
  type: designTokenTypeSchema,
  value: designTokenValueSchema,
  description: localizedStringSchema.optional(),
  reference: designTokenReferenceSchema.optional(),
  status: designTokenStatusSchema.default('draft'),
});

export const designTokenSetSchema = z.object({
  type: designTokenTypeSchema,
  name: z.string().trim().min(1, { message: 'tokenSetNameRequired' }),
  tokens: z.array(designTokenSchema).min(1, {
    message: 'tokenSetMustContainTokens',
  }),
});

export type DesignTokenType = z.infer<typeof designTokenTypeSchema>;
export type DesignToken = z.infer<typeof designTokenSchema>;
export type DesignTokenSet = z.infer<typeof designTokenSetSchema>;
