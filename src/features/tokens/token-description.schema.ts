import { z } from 'zod';

export const updateTokenDescriptionValidationMessageKeys = [
  'descriptionTooLong',
] as const;

export type UpdateTokenDescriptionValidationMessageKey =
  (typeof updateTokenDescriptionValidationMessageKeys)[number];

export const updateTokenDescriptionSchema = z.object({
  descriptionEn: z.string().trim().max(240, { message: 'descriptionTooLong' }),
  descriptionFr: z.string().trim().max(240, { message: 'descriptionTooLong' }),
});

export type UpdateTokenDescriptionInput = z.infer<
  typeof updateTokenDescriptionSchema
>;
