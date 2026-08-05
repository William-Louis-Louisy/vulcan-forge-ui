import {
  PASSWORD_MAX_CODE_POINTS,
  PASSWORD_MIN_CODE_POINTS,
} from './password.constants';
import { PasswordPolicyError } from './password.errors';

function containsLoneSurrogate(value: string) {
  for (let index = 0; index < value.length; index += 1) {
    const codeUnit = value.charCodeAt(index);

    if (codeUnit >= 0xd800 && codeUnit <= 0xdbff) {
      const nextCodeUnit = value.charCodeAt(index + 1);

      if (
        !Number.isInteger(nextCodeUnit) ||
        nextCodeUnit < 0xdc00 ||
        nextCodeUnit > 0xdfff
      ) {
        return true;
      }

      index += 1;
      continue;
    }

    if (codeUnit >= 0xdc00 && codeUnit <= 0xdfff) {
      return true;
    }
  }

  return false;
}

export function normalizePassword(password: string) {
  if (containsLoneSurrogate(password)) {
    throw new PasswordPolicyError('invalid_unicode');
  }

  return password.normalize('NFC');
}

export function countPasswordCodePoints(password: string) {
  return Array.from(password).length;
}

export function assertPasswordMeetsPolicy(password: string) {
  const normalizedPassword = normalizePassword(password);
  const length = countPasswordCodePoints(normalizedPassword);

  if (length < PASSWORD_MIN_CODE_POINTS) {
    throw new PasswordPolicyError('too_short');
  }

  if (length > PASSWORD_MAX_CODE_POINTS) {
    throw new PasswordPolicyError('too_long');
  }

  return normalizedPassword;
}
