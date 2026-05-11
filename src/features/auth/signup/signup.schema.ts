import { z } from 'zod';

export const signupValidationMessageKeys = [
  'nameMinLength',
  'nameTooLong',
  'emailInvalid',
  'passwordMinLength',
  'passwordTooLong',
] as const;

export type SignupValidationMessageKey =
  (typeof signupValidationMessageKeys)[number];

export const signupSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: 'nameMinLength' })
    .max(80, { message: 'nameTooLong' }),
  email: z.string().trim().toLowerCase().email({ message: 'emailInvalid' }),
  password: z
    .string()
    .min(12, { message: 'passwordMinLength' })
    .max(72, { message: 'passwordTooLong' }),
});

export type SignupInput = z.infer<typeof signupSchema>;
