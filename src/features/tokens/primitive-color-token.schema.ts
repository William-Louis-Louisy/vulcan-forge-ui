import { z } from 'zod';

export const primitiveColorHexPattern =
  /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;

export const updatePrimitiveColorTokenValidationMessageKeys = [
  'primitiveColorRequired',
  'primitiveColorHexInvalid',
] as const;

export type UpdatePrimitiveColorTokenValidationMessageKey =
  (typeof updatePrimitiveColorTokenValidationMessageKeys)[number];

export const updatePrimitiveColorTokenSchema = z.object({
  value: z
    .string()
    .trim()
    .min(1, { message: 'primitiveColorRequired' })
    .regex(primitiveColorHexPattern, {
      message: 'primitiveColorHexInvalid',
    }),
});

export type UpdatePrimitiveColorTokenInput = z.infer<
  typeof updatePrimitiveColorTokenSchema
>;
