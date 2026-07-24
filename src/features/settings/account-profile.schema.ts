import { z } from 'zod';
import { appLocaleSchema } from '@/domain/i18n';

export const accountProfileValidationMessageKeys = [
  'nameMinLength',
  'nameTooLong',
  'emailInvalid',
] as const;

export type AccountProfileValidationMessageKey =
  (typeof accountProfileValidationMessageKeys)[number];

export const accountProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: 'nameMinLength' })
    .max(80, { message: 'nameTooLong' }),
  email: z.string().trim().toLowerCase().email({ message: 'emailInvalid' }),
  currentPassword: z.string(),
  locale: appLocaleSchema,
});

export type AccountProfileInput = z.infer<typeof accountProfileSchema>;
