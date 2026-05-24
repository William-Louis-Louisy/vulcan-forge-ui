import { z } from 'zod';

export const semanticColorReferencePathPattern =
  /^color\.primitive\.[a-zA-Z0-9._-]+$/;

export const updateSemanticColorTokenValidationMessageKeys = [
  'semanticAliasRequired',
  'semanticAliasInvalid',
] as const;

export type UpdateSemanticColorTokenValidationMessageKey =
  (typeof updateSemanticColorTokenValidationMessageKeys)[number];

export const updateSemanticColorTokenSchema = z.object({
  referencePath: z
    .string()
    .trim()
    .min(1, { message: 'semanticAliasRequired' })
    .regex(semanticColorReferencePathPattern, {
      message: 'semanticAliasInvalid',
    }),
});

export type UpdateSemanticColorTokenInput = z.infer<
  typeof updateSemanticColorTokenSchema
>;
