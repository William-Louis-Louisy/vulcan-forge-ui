import { z } from 'zod';

export const requestPasswordRecoverySchema = z.object({
  email: z.string().trim().toLowerCase().email({ message: 'emailInvalid' }),
});

export type RequestPasswordRecoveryValidationMessageKey = 'emailInvalid';
