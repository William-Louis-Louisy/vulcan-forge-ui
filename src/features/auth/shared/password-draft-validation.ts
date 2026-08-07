import {
  PASSWORD_MAX_CODE_POINTS,
  PASSWORD_MIN_CODE_POINTS,
} from '@/server/auth/password/password.constants';
import {
  countPasswordCodePoints,
  normalizePassword,
} from '@/server/auth/password/password-normalization';
import { PasswordPolicyError } from '@/server/auth/password/password.errors';

export type PasswordDraftIssue =
  | 'passwordInvalidUnicode'
  | 'passwordMinLength'
  | 'passwordTooLong';

export function getPasswordDraftIssue(
  password: string,
): PasswordDraftIssue | null {
  if (!password) {
    return null;
  }

  try {
    const normalizedPassword = normalizePassword(password);
    const codePointCount = countPasswordCodePoints(normalizedPassword);

    if (codePointCount < PASSWORD_MIN_CODE_POINTS) {
      return 'passwordMinLength';
    }

    if (codePointCount > PASSWORD_MAX_CODE_POINTS) {
      return 'passwordTooLong';
    }

    return null;
  } catch (error) {
    if (
      error instanceof PasswordPolicyError &&
      error.violation === 'invalid_unicode'
    ) {
      return 'passwordInvalidUnicode';
    }

    throw error;
  }
}

export function passwordsMatchDraft({
  confirmation,
  password,
}: {
  confirmation: string;
  password: string;
}) {
  if (!confirmation) {
    return true;
  }

  try {
    return normalizePassword(password) === normalizePassword(confirmation);
  } catch (error) {
    if (error instanceof PasswordPolicyError) {
      return false;
    }

    throw error;
  }
}
