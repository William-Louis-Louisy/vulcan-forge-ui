import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  compare: vi.fn(),
  consumeRateLimit: vi.fn(),
  findUser: vi.fn(),
  recordEvent: vi.fn(),
  resetRateLimit: vi.fn(),
}));

vi.mock('bcryptjs', () => ({
  default: {
    compare: mocks.compare,
  },
}));

vi.mock('@/server/db/prisma', () => ({
  prisma: {
    user: {
      findUnique: mocks.findUser,
    },
  },
}));

vi.mock('./auth-rate-limit', () => ({
  consumeAuthRateLimit: mocks.consumeRateLimit,
  resetAuthAccountRateLimit: mocks.resetRateLimit,
}));

vi.mock('./auth-security-events', () => ({
  recordAuthSecurityEvent: mocks.recordEvent,
}));

import { RateLimitedCredentialsError } from './auth-errors';
import { authorizeCredentials } from './credentials-authorizer';

const allowedRateLimit = {
  allowed: true,
  accountFingerprint: 'account-fingerprint',
  context: {
    ipFingerprint: 'ip-fingerprint',
    requestId: 'request-id',
  },
  retryAfterSeconds: 0,
};

beforeEach(() => {
  vi.clearAllMocks();
  mocks.consumeRateLimit.mockResolvedValue(allowedRateLimit);
  mocks.resetRateLimit.mockResolvedValue(undefined);
});

describe('authorizeCredentials', () => {
  it('performs a dummy password comparison when the account does not exist', async () => {
    mocks.findUser.mockResolvedValue(null);
    mocks.compare.mockResolvedValue(false);

    const result = await authorizeCredentials(
      {
        email: 'missing@example.com',
        password: 'candidate-password',
      },
      new Request('https://example.com/api/auth/callback/credentials'),
    );

    expect(result).toBeNull();
    expect(mocks.compare).toHaveBeenCalledWith(
      'candidate-password',
      expect.stringMatching(/^\$2b\$12\$/),
    );
  });

  it('rejects rate-limited attempts before database and password work', async () => {
    mocks.consumeRateLimit.mockResolvedValue({
      ...allowedRateLimit,
      allowed: false,
      retryAfterSeconds: 120,
    });

    await expect(
      authorizeCredentials(
        {
          email: 'user@example.com',
          password: 'candidate-password',
        },
        new Request('https://example.com/api/auth/callback/credentials'),
      ),
    ).rejects.toBeInstanceOf(RateLimitedCredentialsError);

    expect(mocks.findUser).not.toHaveBeenCalled();
    expect(mocks.compare).not.toHaveBeenCalled();
  });

  it('returns the authenticated user and resets the account bucket', async () => {
    mocks.findUser.mockResolvedValue({
      id: 'user-1',
      name: 'William',
      email: 'user@example.com',
      passwordHash: 'stored-hash',
      preferences: {
        locale: 'fr',
      },
    });
    mocks.compare.mockResolvedValue(true);

    const result = await authorizeCredentials(
      {
        email: 'USER@example.com',
        password: 'candidate-password',
      },
      new Request('https://example.com/api/auth/callback/credentials'),
    );

    expect(result).toEqual({
      id: 'user-1',
      name: 'William',
      email: 'user@example.com',
      locale: 'fr',
    });
    expect(mocks.resetRateLimit).toHaveBeenCalledWith({
      accountIdentifier: 'user@example.com',
      operation: 'login',
    });
  });
});
