import { z } from 'zod';

export const loginValidationMessageKeys = [
  'emailInvalid',
  'passwordRequired',
] as const;

export type LoginValidationMessageKey =
  (typeof loginValidationMessageKeys)[number];

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email({ message: 'emailInvalid' }),
  password: z.string().min(1, { message: 'passwordRequired' }),
});

export type LoginInput = z.infer<typeof loginSchema>;
