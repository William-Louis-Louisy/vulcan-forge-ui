import { z } from 'zod';
import { brandVisualStyles } from '@/domain/design-system';
import { appLocaleSchema } from '@/domain/i18n';

export const designSystemPlatforms = ['web', 'mobile'] as const;

export const visualDirections = brandVisualStyles;

export const createDesignSystemValidationMessageKeys = [
  'nameMinLength',
  'nameTooLong',
  'descriptionTooLong',
  'platformRequired',
  'defaultLocaleInvalid',
  'supportedLocaleRequired',
  'defaultLocaleMustBeSupported',
  'visualDirectionRequired',
  'accessibilityTargetInvalid',
] as const;

export type CreateDesignSystemValidationMessageKey =
  (typeof createDesignSystemValidationMessageKeys)[number];

export const accessibilityTargets = ['wcag_aa', 'wcag_aaa'] as const;

export const createDesignSystemSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, { message: 'nameMinLength' })
      .max(80, { message: 'nameTooLong' }),

    description: z
      .string()
      .trim()
      .max(240, { message: 'descriptionTooLong' })
      .optional()
      .transform((value) => (value && value.length > 0 ? value : null)),

    platforms: z
      .array(z.enum(designSystemPlatforms))
      .min(1, { message: 'platformRequired' }),

    defaultLocale: appLocaleSchema,

    supportedLocales: z
      .array(appLocaleSchema)
      .min(1, { message: 'supportedLocaleRequired' }),

    visualDirection: z.enum(visualDirections, {
      message: 'visualDirectionRequired',
    }),

    accessibilityTarget: z.enum(accessibilityTargets, {
      message: 'accessibilityTargetInvalid',
    }),
  })
  .superRefine((value, context) => {
    if (!value.supportedLocales.includes(value.defaultLocale)) {
      context.addIssue({
        code: 'custom',
        path: ['defaultLocale'],
        message: 'defaultLocaleMustBeSupported',
      });
    }
  });

export type CreateDesignSystemInput = z.infer<typeof createDesignSystemSchema>;
