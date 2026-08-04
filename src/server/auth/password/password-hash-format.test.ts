import { ARGON2ID_CURRENT_PARAMETERS } from './password.constants';
import {
  argon2idHashNeedsRehash,
  encodeArgon2idHash,
  isLegacyBcryptHash,
  parseArgon2idHash,
} from './password-hash-format';

const currentParameters = {
  memory: ARGON2ID_CURRENT_PARAMETERS.memory,
  parallelism: ARGON2ID_CURRENT_PARAMETERS.parallelism,
  passes: ARGON2ID_CURRENT_PARAMETERS.passes,
  tagLength: ARGON2ID_CURRENT_PARAMETERS.tagLength,
};

describe('versioned Argon2id hash format', () => {
  it('round-trips a current hash', () => {
    const salt = Buffer.alloc(ARGON2ID_CURRENT_PARAMETERS.saltLength, 1);
    const derivedKey = Buffer.alloc(ARGON2ID_CURRENT_PARAMETERS.tagLength, 2);
    const encoded = encodeArgon2idHash({
      derivedKey,
      parameters: currentParameters,
      salt,
    });

    expect(encoded).toMatch(/^\$vulcan\$argon2id\$v=1\$/);
    expect(parseArgon2idHash(encoded)).toEqual({
      derivedKey,
      parameters: currentParameters,
      salt,
      version: 1,
    });
  });

  it('rejects unknown versions, unsafe parameters and malformed encodings', () => {
    const valid = encodeArgon2idHash({
      derivedKey: Buffer.alloc(ARGON2ID_CURRENT_PARAMETERS.tagLength, 2),
      parameters: currentParameters,
      salt: Buffer.alloc(ARGON2ID_CURRENT_PARAMETERS.saltLength, 1),
    });

    expect(parseArgon2idHash(valid.replace('$v=1$', '$v=2$'))).toBeNull();
    expect(parseArgon2idHash(valid.replace('m=19456', 'm=1048576'))).toBeNull();
    expect(parseArgon2idHash(valid.replace(/\$[A-Za-z0-9_-]+$/, '$not+base64'))).toBeNull();
    expect(parseArgon2idHash(`${valid}truncated`)).toBeNull();
  });

  it('marks safe non-current parameters for rehashing', () => {
    const encoded = encodeArgon2idHash({
      derivedKey: Buffer.alloc(ARGON2ID_CURRENT_PARAMETERS.tagLength, 2),
      parameters: {
        ...currentParameters,
        passes: currentParameters.passes + 1,
      },
      salt: Buffer.alloc(ARGON2ID_CURRENT_PARAMETERS.saltLength, 1),
    });
    const parsed = parseArgon2idHash(encoded);

    expect(parsed).not.toBeNull();
    expect(argon2idHashNeedsRehash(parsed!)).toBe(true);
  });

  it('recognizes supported legacy bcrypt prefixes', () => {
    expect(isLegacyBcryptHash('$2a$12$rest')).toBe(true);
    expect(isLegacyBcryptHash('$2b$12$rest')).toBe(true);
    expect(isLegacyBcryptHash('$2y$12$rest')).toBe(true);
    expect(isLegacyBcryptHash('$2x$12$rest')).toBe(false);
    expect(isLegacyBcryptHash('$vulcan$argon2id$rest')).toBe(false);
  });
});
