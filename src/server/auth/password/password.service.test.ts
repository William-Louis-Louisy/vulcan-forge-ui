import bcrypt from 'bcryptjs';
import { isArgon2idAvailable } from './password-argon2';
import { DUMMY_ARGON2ID_PASSWORD_HASH } from './password.constants';
import {
  PasswordCompromisedError,
  PasswordCompromiseCheckUnavailableError,
} from './password.errors';
import {
  assertPasswordIsAcceptable,
  hashPassword,
  verifyPassword,
} from './password.service';

describe('password service', () => {
  it('uses the Node.js Argon2id implementation available in the supported runtime', () => {
    expect(isArgon2idAvailable()).toBe(true);
  });

  it('validates the deterministic dummy hash used for missing accounts', async () => {
    await expect(
      verifyPassword(
        'VulcanForgeUI dummy password value',
        DUMMY_ARGON2ID_PASSWORD_HASH,
      ),
    ).resolves.toEqual({
      needsRehash: false,
      scheme: 'argon2id',
      valid: true,
    });
    await expect(
      verifyPassword(
        'another candidate password',
        DUMMY_ARGON2ID_PASSWORD_HASH,
      ),
    ).resolves.toEqual({
      needsRehash: false,
      scheme: 'argon2id',
      valid: false,
    });
  });

  it('creates salted Argon2id hashes and verifies the complete password', async () => {
    const password = `${'a'.repeat(72)}x`;
    const firstHash = await hashPassword(password);
    const secondHash = await hashPassword(password);

    expect(firstHash).toMatch(/^\$vulcan\$argon2id\$v=1\$/);
    expect(secondHash).not.toBe(firstHash);
    await expect(verifyPassword(password, firstHash)).resolves.toEqual({
      needsRehash: false,
      scheme: 'argon2id',
      valid: true,
    });
    await expect(
      verifyPassword(`${'a'.repeat(72)}y`, firstHash),
    ).resolves.toEqual({
      needsRehash: false,
      scheme: 'argon2id',
      valid: false,
    });
  });

  it('normalizes new Argon2id passwords to NFC', async () => {
    const decomposed = `phrase secrète ${'e\u0301'.repeat(4)}`;
    const composed = decomposed.normalize('NFC');
    const hash = await hashPassword(decomposed);

    await expect(verifyPassword(composed, hash)).resolves.toEqual({
      needsRehash: false,
      scheme: 'argon2id',
      valid: true,
    });
  });

  it('verifies legacy bcrypt hashes without changing their historical input semantics', async () => {
    const legacyPassword = `${'a'.repeat(72)}x`;
    const legacyHash = await bcrypt.hash(legacyPassword, 4);

    await expect(verifyPassword(legacyPassword, legacyHash)).resolves.toEqual({
      needsRehash: true,
      scheme: 'bcrypt',
      valid: true,
    });

    // bcrypt only considers the first 72 UTF-8 bytes. Successful legacy login
    // therefore triggers an Argon2id rehash of the complete submitted password.
    await expect(
      verifyPassword(`${'a'.repeat(72)}y`, legacyHash),
    ).resolves.toEqual({
      needsRehash: true,
      scheme: 'bcrypt',
      valid: true,
    });
  });

  it('returns an unknown scheme for malformed or unsupported hashes', async () => {
    await expect(
      verifyPassword('a sufficiently long password', '$unsupported$hash'),
    ).resolves.toEqual({
      needsRehash: false,
      scheme: 'unknown',
      valid: false,
    });
  });

  it('accepts a new password only after the compromise check passes', async () => {
    const password = 'a sufficiently long original password';
    const fetchImpl = vi.fn(
      async (_input: RequestInfo | URL, _init?: RequestInit) =>
        new Response(`${'A'.repeat(35)}:0\r\n`),
    );

    await expect(
      assertPasswordIsAcceptable(password, {
        compromiseCheck: { fetchImpl },
      }),
    ).resolves.toBe(password);
  });

  it('rejects compromised passwords and unavailable blocklist checks', async () => {
    const compromisedPassword = 'a sufficiently long compromised password';
    const { createHash } = await import('node:crypto');
    const sha1 = createHash('sha1')
      .update(compromisedPassword, 'utf8')
      .digest('hex')
      .toUpperCase();
    const compromisedFetch = vi.fn(
      async (_input: RequestInfo | URL, _init?: RequestInit) =>
        new Response(`${sha1.slice(5)}:12\r\n`),
    );
    const unavailableFetch = vi.fn(
      async (_input: RequestInfo | URL, _init?: RequestInit) =>
        new Response('unavailable', { status: 503 }),
    );

    await expect(
      assertPasswordIsAcceptable(compromisedPassword, {
        compromiseCheck: { fetchImpl: compromisedFetch },
      }),
    ).rejects.toBeInstanceOf(PasswordCompromisedError);
    await expect(
      assertPasswordIsAcceptable('another sufficiently long password', {
        compromiseCheck: { fetchImpl: unavailableFetch },
      }),
    ).rejects.toBeInstanceOf(PasswordCompromiseCheckUnavailableError);
  });
});
