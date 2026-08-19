import { z } from 'zod';
import { appLocaleSchema } from '@/domain/i18n';

export const deleteThemeColorRoleSchema = z.object({
  locale: appLocaleSchema,
  projectSlug: z.string().min(1),
  themeId: z.string().min(1),
  roleKey: z.string().min(1),
});

export type DeleteThemeColorRoleInput = z.infer<
  typeof deleteThemeColorRoleSchema
>;
