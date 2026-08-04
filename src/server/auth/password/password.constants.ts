export const PASSWORD_MIN_CODE_POINTS = 15;
export const PASSWORD_MAX_CODE_POINTS = 128;

export const ARGON2ID_FORMAT_VERSION = 1;

export const ARGON2ID_CURRENT_PARAMETERS = {
  memory: 19_456,
  passes: 2,
  parallelism: 1,
  tagLength: 32,
  saltLength: 16,
} as const;

export const ARGON2ID_ACCEPTED_BOUNDS = {
  memory: {
    min: 8_192,
    max: 262_144,
  },
  passes: {
    min: 1,
    max: 10,
  },
  parallelism: {
    min: 1,
    max: 8,
  },
  tagLength: {
    min: 16,
    max: 64,
  },
  saltLength: {
    min: 16,
    max: 64,
  },
} as const;

export const PWNED_PASSWORDS_RANGE_URL =
  'https://api.pwnedpasswords.com/range';
export const PWNED_PASSWORDS_TIMEOUT_MS = 4_000;
export const PWNED_PASSWORDS_MAX_RESPONSE_BYTES = 256_000;
export const PWNED_PASSWORDS_USER_AGENT = 'VulcanForgeUI-PasswordSecurity';
