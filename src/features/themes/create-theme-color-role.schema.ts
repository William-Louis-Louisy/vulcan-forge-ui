import { z } from 'zod';
import { appLocaleSchema } from '@/domain/i18n';

export const createThemeColorRoleSchema = z.object({
  locale: appLocaleSchema,
  projectSlug: z.string().min(1),
  themeId: z.string().min(1),
  roleKey: z.string().min(1),
  tokenPath: z.string().min(1),
});

export type CreateThemeColorRoleInput = z.infer<
  typeof createThemeColorRoleSchema
>;
