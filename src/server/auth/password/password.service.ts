import { randomBytes, timingSafeEqual } from 'node:crypto';
import bcrypt from 'bcryptjs';
import { deriveArgon2id } from './password-argon2';
import {
  ARGON2ID_CURRENT_PARAMETERS,
  PASSWORD_MAX_CODE_POINTS,
} from './password.constants';
import {
  checkPasswordCompromise,
  type PasswordCompromiseCheckOptions,
} from './password-compromise-check';
import {
  PasswordCompromisedError,
  PasswordPolicyError,
} from './password.errors';
import {
  argon2idHashNeedsRehash,
  encodeArgon2idHash,
  isLegacyBcryptHash,
  parseArgon2idHash,
} from './password-hash-format';
import {
  assertPasswordMeetsPolicy,
  countPasswordCodePoints,
  normalizePassword,
} from './password-normalization';

export type PasswordHashScheme = 'argon2id' | 'bcrypt' | 'unknown';

export type PasswordVerificationResult = {
  needsRehash: boolean;
  scheme: PasswordHashScheme;
  valid: boolean;
};

export type AssertPasswordIsAcceptableOptions = {
  compromiseCheck?: PasswordCompromiseCheckOptions;
};

function getCurrentArgon2idParameters() {
  return {
    memory: ARGON2ID_CURRENT_PARAMETERS.memory,
    parallelism: ARGON2ID_CURRENT_PARAMETERS.parallelism,
    passes: ARGON2ID_CURRENT_PARAMETERS.passes,
    tagLength: ARGON2ID_CURRENT_PARAMETERS.tagLength,
  };
}

export async function assertPasswordIsAcceptable(
  password: string,
  options: AssertPasswordIsAcceptableOptions = {},
) {
  const normalizedPassword = assertPasswordMeetsPolicy(password);
  const result = await checkPasswordCompromise(
    normalizedPassword,
    options.compromiseCheck,
  );

  if (result.compromised) {
    throw new PasswordCompromisedError(result.occurrenceCount);
  }

  return normalizedPassword;
}

export async function hashPassword(password: string) {
  const normalizedPassword = assertPasswordMeetsPolicy(password);
  const parameters = getCurrentArgon2idParameters();
  const salt = randomBytes(ARGON2ID_CURRENT_PARAMETERS.saltLength);
  const derivedKey = await deriveArgon2id({
    parameters,
    password: normalizedPassword,
    salt,
  });

  return encodeArgon2idHash({
    derivedKey,
    parameters,
    salt,
  });
}

export async function verifyPassword(
  password: string,
  storedHash: string,
): Promise<PasswordVerificationResult> {
  if (isLegacyBcryptHash(storedHash)) {
    try {
      const valid = await bcrypt.compare(password, storedHash);

      return {
        needsRehash: valid,
        scheme: 'bcrypt',
        valid,
      };
    } catch {
      return {
        needsRehash: false,
        scheme: 'unknown',
        valid: false,
      };
    }
  }

  const parsedHash = parseArgon2idHash(storedHash);

  if (!parsedHash) {
    return {
      needsRehash: false,
      scheme: 'unknown',
      valid: false,
    };
  }

  let normalizedPassword: string;

  try {
    normalizedPassword = normalizePassword(password);
  } catch (error) {
    if (error instanceof PasswordPolicyError) {
      return {
        needsRehash: false,
        scheme: 'argon2id',
        valid: false,
      };
    }

    throw error;
  }

  if (countPasswordCodePoints(normalizedPassword) > PASSWORD_MAX_CODE_POINTS) {
    return {
      needsRehash: false,
      scheme: 'argon2id',
      valid: false,
    };
  }

  const derivedKey = await deriveArgon2id({
    parameters: parsedHash.parameters,
    password: normalizedPassword,
    salt: parsedHash.salt,
  });
  const valid =
    derivedKey.length === parsedHash.derivedKey.length &&
    timingSafeEqual(derivedKey, parsedHash.derivedKey);

  return {
    needsRehash: valid && argon2idHashNeedsRehash(parsedHash),
    scheme: 'argon2id',
    valid,
  };
}
