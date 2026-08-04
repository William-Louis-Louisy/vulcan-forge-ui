import { z } from 'zod';
import { PasswordPolicyError } from '@/server/auth/password/password.errors';
import {
  assertPasswordMeetsPolicy,
  normalizePassword,
} from '@/server/auth/password/password-normalization';

export const signupValidationMessageKeys = [
  'nameMinLength',
  'nameTooLong',
  'emailInvalid',
  'passwordInvalidUnicode',
  'passwordMinLength',
  'passwordTooLong',
  'passwordCompromised',
  'passwordConfirmationMismatch',
] as const;

export type SignupValidationMessageKey =
  (typeof signupValidationMessageKeys)[number];

function addPasswordPolicyIssue({
  context,
  error,
  path,
}: {
  context: z.RefinementCtx;
  error: PasswordPolicyError;
  path: ['password'] | ['passwordConfirmation'];
}) {
  const messageByViolation = {
    invalid_unicode: 'passwordInvalidUnicode',
    too_long: 'passwordTooLong',
    too_short: 'passwordMinLength',
  } as const satisfies Record<
    PasswordPolicyError['violation'],
    SignupValidationMessageKey
  >;

  context.addIssue({
    code: 'custom',
    path,
    message: messageByViolation[error.violation],
  });
}

export const signupSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, { message: 'nameMinLength' })
      .max(80, { message: 'nameTooLong' }),
    email: z.string().trim().toLowerCase().email({ message: 'emailInvalid' }),
    password: z.string(),
    passwordConfirmation: z.string(),
  })
  .superRefine((values, context) => {
    let normalizedPassword: string | null = null;
    let normalizedConfirmation: string | null = null;

    try {
      normalizedPassword = assertPasswordMeetsPolicy(values.password);
    } catch (error) {
      if (error instanceof PasswordPolicyError) {
        addPasswordPolicyIssue({
          context,
          error,
          path: ['password'],
        });
      } else {
        throw error;
      }
    }

    try {
      normalizedConfirmation = normalizePassword(values.passwordConfirmation);
    } catch (error) {
      if (error instanceof PasswordPolicyError) {
        addPasswordPolicyIssue({
          context,
          error,
          path: ['passwordConfirmation'],
        });
      } else {
        throw error;
      }
    }

    if (
      normalizedPassword !== null &&
      normalizedConfirmation !== null &&
      normalizedPassword !== normalizedConfirmation
    ) {
      context.addIssue({
        code: 'custom',
        path: ['passwordConfirmation'],
        message: 'passwordConfirmationMismatch',
      });
    }
  })
  .transform(({ passwordConfirmation: _passwordConfirmation, ...values }) => {
    return {
      ...values,
      password: normalizePassword(values.password),
    };
  });

export type SignupInput = z.infer<typeof signupSchema>;
