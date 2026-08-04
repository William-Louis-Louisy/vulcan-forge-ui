import { createHash } from 'node:crypto';
import { PWNED_PASSWORDS_RANGE_URL } from './password.constants';
import { checkPasswordCompromise } from './password-compromise-check';
import { PasswordCompromiseCheckUnavailableError } from './password.errors';

function getSha1Parts(password: string) {
  const sha1 = createHash('sha1')
    .update(password.normalize('NFC'), 'utf8')
    .digest('hex')
    .toUpperCase();

  return {
    prefix: sha1.slice(0, 5),
    suffix: sha1.slice(5),
  };
}

describe('checkPasswordCompromise', () => {
  it('sends only the SHA-1 prefix and detects the matching suffix', async () => {
    const password = 'A sufficiently long unique password';
    const { prefix, suffix } = getSha1Parts(password);
    const fetchImpl = vi.fn(
      async (_input: RequestInfo | URL, _init?: RequestInit) =>
        new Response(`${'0'.repeat(35)}:0\r\n${suffix}:42\r\n`),
    );

    await expect(
      checkPasswordCompromise(password, { fetchImpl }),
    ).resolves.toEqual({
      compromised: true,
      occurrenceCount: 42,
    });

    const call = fetchImpl.mock.calls[0];

    expect(call).toBeDefined();
    expect(String(call?.[0])).toBe(`${PWNED_PASSWORDS_RANGE_URL}/${prefix}`);
    expect(String(call?.[0])).not.toContain(password);
    expect(call?.[1]).toEqual(
      expect.objectContaining({
        cache: 'no-store',
        headers: {
          'Add-Padding': 'true',
          'User-Agent': 'VulcanForgeUI-PasswordSecurity',
        },
        method: 'GET',
      }),
    );
  });

  it('returns a negative result when the target suffix is absent', async () => {
    const fetchImpl = vi.fn(
      async (_input: RequestInfo | URL, _init?: RequestInit) =>
        new Response(`${'A'.repeat(35)}:3\r\n${'B'.repeat(35)}:0\r\n`),
    );

    await expect(
      checkPasswordCompromise('another sufficiently long password', {
        fetchImpl,
      }),
    ).resolves.toEqual({
      compromised: false,
      occurrenceCount: 0,
    });
  });

  it.each([
    new Response('service unavailable', { status: 503 }),
    new Response('malformed response'),
    new Response(''),
  ])('fails closed for unavailable or malformed responses', async (response) => {
    const fetchImpl = vi.fn(
      async (_input: RequestInfo | URL, _init?: RequestInit) => response,
    );

    await expect(
      checkPasswordCompromise('another sufficiently long password', {
        fetchImpl,
      }),
    ).rejects.toBeInstanceOf(PasswordCompromiseCheckUnavailableError);
  });

  it('fails closed when the request rejects', async () => {
    const fetchImpl = vi.fn(
      async (_input: RequestInfo | URL, _init?: RequestInit) => {
        throw new Error('network unavailable');
      },
    );

    await expect(
      checkPasswordCompromise('another sufficiently long password', {
        fetchImpl,
      }),
    ).rejects.toBeInstanceOf(PasswordCompromiseCheckUnavailableError);
  });
});
