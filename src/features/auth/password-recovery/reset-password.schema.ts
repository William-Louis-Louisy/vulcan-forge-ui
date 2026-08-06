import { z } from 'zod';
import { PasswordPolicyError } from '@/server/auth/password/password.errors';
import {
  assertPasswordMeetsPolicy,
  normalizePassword,
} from '@/server/auth/password/password-normalization';

export const resetPasswordValidationMessageKeys = [
  'passwordInvalidUnicode',
  'passwordMinLength',
  'passwordTooLong',
  'passwordCompromised',
  'passwordConfirmationMismatch',
] as const;

export type ResetPasswordValidationMessageKey =
  (typeof resetPasswordValidationMessageKeys)[number];

function getPolicyMessage(error: PasswordPolicyError) {
  const messageByViolation = {
    invalid_unicode: 'passwordInvalidUnicode',
    too_long: 'passwordTooLong',
    too_short: 'passwordMinLength',
  } as const satisfies Record<
    PasswordPolicyError['violation'],
    ResetPasswordValidationMessageKey
  >;

  return messageByViolation[error.violation];
}

export const resetPasswordSchema = z
  .object({
    password: z.string(),
    passwordConfirmation: z.string(),
  })
  .superRefine((values, context) => {
    let password: string | null = null;
    let confirmation: string | null = null;

    try {
      password = assertPasswordMeetsPolicy(values.password);
    } catch (error) {
      if (error instanceof PasswordPolicyError) {
        context.addIssue({
          code: 'custom',
          path: ['password'],
          message: getPolicyMessage(error),
        });
      } else {
        throw error;
      }
    }

    try {
      confirmation = normalizePassword(values.passwordConfirmation);
    } catch (error) {
      if (error instanceof PasswordPolicyError) {
        context.addIssue({
          code: 'custom',
          path: ['passwordConfirmation'],
          message: getPolicyMessage(error),
        });
      } else {
        throw error;
      }
    }

    if (
      password !== null &&
      confirmation !== null &&
      password !== confirmation
    ) {
      context.addIssue({
        code: 'custom',
        path: ['passwordConfirmation'],
        message: 'passwordConfirmationMismatch',
      });
    }
  })
  .transform(({ passwordConfirmation: _confirmation, ...values }) => ({
    password: normalizePassword(values.password),
  }));
