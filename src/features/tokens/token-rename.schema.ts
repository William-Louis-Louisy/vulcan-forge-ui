import { z } from 'zod';

export const renameTokenSchema = z.object({
  nextTokenPath: z
    .string()
    .trim()
    .min(1, { message: 'tokenPathRequired' })
    .regex(/^[a-zA-Z0-9._-]+$/, {
      message: 'tokenPathInvalid',
    }),
});

export type RenameTokenInput = z.infer<typeof renameTokenSchema>;

export type RenameTokenValidationMessageKey =
  | 'tokenPathRequired'
  | 'tokenPathInvalid';
