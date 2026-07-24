import { z } from 'zod';
import { appLocaleSchema } from '@/domain/i18n';

export const deleteAccountSchema = z.object({
  confirmationEmail: z.string().trim().toLowerCase().email(),
  currentPassword: z.string().min(1),
  locale: appLocaleSchema,
});

export type DeleteAccountInput = z.infer<typeof deleteAccountSchema>;
