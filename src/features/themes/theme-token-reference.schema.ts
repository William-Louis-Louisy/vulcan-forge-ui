import { z } from 'zod';
import { appLocaleSchema } from '@/domain/i18n';
import { themeColorKeys } from './themes-editor.utils';

export const updateThemeTokenReferenceSchema = z.object({
  locale: appLocaleSchema,
  projectSlug: z.string().min(1),
  themeId: z.string().min(1),
  colorKey: z.enum(themeColorKeys),
  tokenPath: z.string().min(1),
});

export type UpdateThemeTokenReferenceInput = z.infer<
  typeof updateThemeTokenReferenceSchema
>;
