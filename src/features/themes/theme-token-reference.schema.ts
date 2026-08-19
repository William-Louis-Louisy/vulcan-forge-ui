import { z } from 'zod';
import { appLocaleSchema } from '@/domain/i18n';
import { themeRoleKeySchema } from '@/domain/design-system';

export const updateThemeTokenReferenceSchema = z.object({
  locale: appLocaleSchema,
  projectSlug: z.string().min(1),
  themeId: z.string().min(1),
  roleKey: themeRoleKeySchema,
  tokenPath: z.string().min(1),
});

export type UpdateThemeTokenReferenceInput = z.infer<
  typeof updateThemeTokenReferenceSchema
>;
