export type PasswordPolicyViolation =
  | 'invalid_unicode'
  | 'too_long'
  | 'too_short';

export class PasswordPolicyError extends Error {
  readonly violation: PasswordPolicyViolation;

  constructor(violation: PasswordPolicyViolation) {
    super(`Password policy violation: ${violation}`);
    this.name = 'PasswordPolicyError';
    this.violation = violation;
  }
}

export class PasswordCompromisedError extends Error {
  readonly occurrenceCount: number;

  constructor(occurrenceCount: number) {
    super('The password appears in the compromised-password blocklist.');
    this.name = 'PasswordCompromisedError';
    this.occurrenceCount = occurrenceCount;
  }
}

export class PasswordCompromiseCheckUnavailableError extends Error {
  constructor(message = 'The compromised-password check is unavailable.') {
    super(message);
    this.name = 'PasswordCompromiseCheckUnavailableError';
  }
}

export class PasswordHashingUnavailableError extends Error {
  constructor() {
    super('Argon2id is unavailable in the current Node.js runtime.');
    this.name = 'PasswordHashingUnavailableError';
  }
}
