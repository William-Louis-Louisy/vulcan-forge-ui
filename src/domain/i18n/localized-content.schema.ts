import { z } from 'zod';
import { appLocales } from './locales';

export const appLocaleSchema = z.enum(appLocales);

export const localizedStringSchema = z
  .object({
    en: z.string().trim().optional(),
    fr: z.string().trim().optional(),
  })
  .refine((value) => Boolean(value.en || value.fr), {
    message: 'At least one locale must be provided.',
  });

export type LocalizedStringInput = z.infer<typeof localizedStringSchema>;
