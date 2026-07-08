import { z } from 'zod';
import { localizedStringSchema } from '@/domain/i18n';
import { designTokenTypeSchema } from './design-token.schema';

export const componentContractTypeSchema = z.enum([
  'button',
  'textField',
  'card',
  'alert',
  'dialog',
]);

export const componentContractStatusSchema = z.enum([
  'draft',
  'ready',
  'deprecated',
]);

export const componentVariantSchema = z.object({
  key: z.string().trim().min(1, { message: 'variantKeyRequired' }),
  label: localizedStringSchema,
  description: localizedStringSchema.optional(),
});

export const componentStateSchema = z.object({
  key: z.string().trim().min(1, { message: 'stateKeyRequired' }),
  label: localizedStringSchema,
  description: localizedStringSchema.optional(),
});

export const componentSizeSchema = z.object({
  key: z.string().trim().min(1, { message: 'sizeKeyRequired' }),
  label: localizedStringSchema,
  description: localizedStringSchema.optional(),
});

export const componentTokenBindingSchema = z.object({
  key: z.string().trim().min(1, { message: 'tokenBindingKeyRequired' }),
  tokenType: designTokenTypeSchema,
  tokenPath: z
    .string()
    .trim()
    .min(1, { message: 'tokenBindingTokenPathRequired' })
    .regex(/^[a-zA-Z0-9._-]+$/, {
      message: 'tokenPathInvalid',
    }),
  description: localizedStringSchema.optional(),
});

export const componentAccessibilityRuleSchema = z.object({
  key: z.string().trim().min(1, { message: 'accessibilityRuleKeyRequired' }),
  description: localizedStringSchema,
  severity: z.enum(['info', 'warning', 'critical']),
});

export const componentContractSchema = z.object({
  type: componentContractTypeSchema,
  name: z.string().trim().min(1, { message: 'componentNameRequired' }),
  purpose: localizedStringSchema,
  usageGuidelines: localizedStringSchema.optional(),
  contentGuidelines: localizedStringSchema.optional(),
  status: componentContractStatusSchema.default('draft'),
  anatomy: z.array(z.string().trim().min(1)).default([]),
  variants: z.array(componentVariantSchema).default([]),
  sizes: z.array(componentSizeSchema).default([]),
  states: z.array(componentStateSchema).default([]),
  tokenBindings: z.array(componentTokenBindingSchema).default([]),
  accessibility: z.array(componentAccessibilityRuleSchema).default([]),
  forbiddenPatterns: z.array(localizedStringSchema).default([]),
});

export type ComponentSize = z.infer<typeof componentSizeSchema>;
export type ComponentContract = z.infer<typeof componentContractSchema>;
export type ComponentContractType = z.infer<typeof componentContractTypeSchema>;
export type ComponentTokenBinding = z.infer<typeof componentTokenBindingSchema>;
