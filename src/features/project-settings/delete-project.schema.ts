import { z } from 'zod';

import { routing } from '@/i18n/routing';

export const deleteProjectSchema = z.object({
  confirmationName: z.string().min(1),
  locale: z.enum(routing.locales),
  projectId: z.string().trim().min(1),
  projectSlug: z.string().trim().min(1),
});

export type DeleteProjectInput = z.infer<typeof deleteProjectSchema>;
