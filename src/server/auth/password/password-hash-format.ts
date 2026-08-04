import {
  ARGON2ID_ACCEPTED_BOUNDS,
  ARGON2ID_CURRENT_PARAMETERS,
  ARGON2ID_FORMAT_VERSION,
} from './password.constants';

export type Argon2idParameters = {
  memory: number;
  parallelism: number;
  passes: number;
  tagLength: number;
};

export type ParsedArgon2idHash = {
  derivedKey: Buffer;
  parameters: Argon2idParameters;
  salt: Buffer;
  version: number;
};

const ARGON2ID_HASH_PATTERN =
  /^\$vulcan\$argon2id\$v=(\d+)\$m=(\d+),t=(\d+),p=(\d+),l=(\d+)\$([A-Za-z0-9_-]+)\$([A-Za-z0-9_-]+)$/;
const LEGACY_BCRYPT_HASH_PATTERN = /^\$2[aby]\$\d{2}\$/;

function isIntegerInRange(
  value: number,
  range: Readonly<{ max: number; min: number }>,
) {
  return Number.isSafeInteger(value) && value >= range.min && value <= range.max;
}

function decodeCanonicalBase64Url(value: string) {
  if (!value.length) {
    return null;
  }

  const decoded = Buffer.from(value, 'base64url');

  return decoded.toString('base64url') === value ? decoded : null;
}

export function encodeArgon2idHash({
  derivedKey,
  parameters,
  salt,
}: {
  derivedKey: Buffer;
  parameters: Argon2idParameters;
  salt: Buffer;
}) {
  return [
    '',
    'vulcan',
    'argon2id',
    `v=${ARGON2ID_FORMAT_VERSION}`,
    `m=${parameters.memory},t=${parameters.passes},p=${parameters.parallelism},l=${parameters.tagLength}`,
    salt.toString('base64url'),
    derivedKey.toString('base64url'),
  ].join('$');
}

export function parseArgon2idHash(value: string): ParsedArgon2idHash | null {
  const match = ARGON2ID_HASH_PATTERN.exec(value);

  if (!match) {
    return null;
  }

  const [, rawVersion, rawMemory, rawPasses, rawParallelism, rawTagLength] =
    match;
  const rawSalt = match[6];
  const rawDerivedKey = match[7];

  if (
    rawVersion === undefined ||
    rawMemory === undefined ||
    rawPasses === undefined ||
    rawParallelism === undefined ||
    rawTagLength === undefined ||
    rawSalt === undefined ||
    rawDerivedKey === undefined
  ) {
    return null;
  }

  const version = Number(rawVersion);
  const parameters = {
    memory: Number(rawMemory),
    passes: Number(rawPasses),
    parallelism: Number(rawParallelism),
    tagLength: Number(rawTagLength),
  };

  if (
    version !== ARGON2ID_FORMAT_VERSION ||
    !isIntegerInRange(
      parameters.memory,
      ARGON2ID_ACCEPTED_BOUNDS.memory,
    ) ||
    !isIntegerInRange(
      parameters.passes,
      ARGON2ID_ACCEPTED_BOUNDS.passes,
    ) ||
    !isIntegerInRange(
      parameters.parallelism,
      ARGON2ID_ACCEPTED_BOUNDS.parallelism,
    ) ||
    !isIntegerInRange(
      parameters.tagLength,
      ARGON2ID_ACCEPTED_BOUNDS.tagLength,
    ) ||
    parameters.memory < 8 * parameters.parallelism ||
    parameters.memory % (4 * parameters.parallelism) !== 0
  ) {
    return null;
  }

  const salt = decodeCanonicalBase64Url(rawSalt);
  const derivedKey = decodeCanonicalBase64Url(rawDerivedKey);

  if (
    !salt ||
    !derivedKey ||
    !isIntegerInRange(salt.length, ARGON2ID_ACCEPTED_BOUNDS.saltLength) ||
    derivedKey.length !== parameters.tagLength
  ) {
    return null;
  }

  return {
    derivedKey,
    parameters,
    salt,
    version,
  };
}

export function isLegacyBcryptHash(value: string) {
  return LEGACY_BCRYPT_HASH_PATTERN.test(value);
}

export function argon2idHashNeedsRehash(parsedHash: ParsedArgon2idHash) {
  const { parameters, salt } = parsedHash;

  return (
    parameters.memory !== ARGON2ID_CURRENT_PARAMETERS.memory ||
    parameters.passes !== ARGON2ID_CURRENT_PARAMETERS.passes ||
    parameters.parallelism !== ARGON2ID_CURRENT_PARAMETERS.parallelism ||
    parameters.tagLength !== ARGON2ID_CURRENT_PARAMETERS.tagLength ||
    salt.length !== ARGON2ID_CURRENT_PARAMETERS.saltLength
  );
}
