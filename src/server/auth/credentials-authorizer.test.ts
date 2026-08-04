import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PasswordPolicyError } from './password/password.errors';

const mocks = vi.hoisted(() => ({
  consumeRateLimit: vi.fn(),
  findUser: vi.fn(),
  hashPassword: vi.fn(),
  recordEvent: vi.fn(),
  resetRateLimit: vi.fn(),
  updateMany: vi.fn(),
  verifyPassword: vi.fn(),
}));

vi.mock('@/server/db/prisma', () => ({
  prisma: {
    user: {
      findUnique: mocks.findUser,
      updateMany: mocks.updateMany,
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

vi.mock('./password/password.service', () => ({
  hashPassword: mocks.hashPassword,
  verifyPassword: mocks.verifyPassword,
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

const user = {
  id: 'user-1',
  name: 'William',
  email: 'user@example.com',
  passwordHash: 'stored-hash',
  preferences: {
    locale: 'fr',
  },
};

beforeEach(() => {
  vi.clearAllMocks();
  mocks.consumeRateLimit.mockResolvedValue(allowedRateLimit);
  mocks.resetRateLimit.mockResolvedValue(undefined);
  mocks.updateMany.mockResolvedValue({ count: 1 });
  mocks.hashPassword.mockResolvedValue('argon2id-hash');
  mocks.verifyPassword.mockResolvedValue({
    needsRehash: false,
    scheme: 'argon2id',
    valid: true,
  });
});

describe('authorizeCredentials', () => {
  it('performs an Argon2id dummy verification when the account does not exist', async () => {
    mocks.findUser.mockResolvedValue(null);
    mocks.verifyPassword.mockResolvedValue({
      needsRehash: false,
      scheme: 'argon2id',
      valid: false,
    });

    const result = await authorizeCredentials(
      {
        email: 'missing@example.com',
        password: 'candidate-password',
      },
      new Request('https://example.com/api/auth/callback/credentials'),
    );

    expect(result).toBeNull();
    expect(mocks.verifyPassword).toHaveBeenCalledWith(
      'candidate-password',
      expect.stringMatching(/^\$vulcan\$argon2id\$v=1\$/),
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
    expect(mocks.verifyPassword).not.toHaveBeenCalled();
  });

  it('returns the authenticated user and resets the account bucket', async () => {
    mocks.findUser.mockResolvedValue(user);

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
    expect(mocks.verifyPassword).toHaveBeenCalledWith(
      'candidate-password',
      'stored-hash',
    );
    expect(mocks.resetRateLimit).toHaveBeenCalledWith({
      accountIdentifier: 'user@example.com',
      operation: 'login',
    });
  });

  it('migrates a valid legacy bcrypt hash with a conditional update', async () => {
    mocks.findUser.mockResolvedValue(user);
    mocks.verifyPassword.mockResolvedValue({
      needsRehash: true,
      scheme: 'bcrypt',
      valid: true,
    });

    const result = await authorizeCredentials(
      {
        email: 'user@example.com',
        password: 'candidate-password',
      },
      new Request('https://example.com/api/auth/callback/credentials'),
    );

    expect(result?.id).toBe('user-1');
    expect(mocks.hashPassword).toHaveBeenCalledWith('candidate-password');
    expect(mocks.updateMany).toHaveBeenCalledWith({
      where: {
        id: 'user-1',
        passwordHash: 'stored-hash',
      },
      data: {
        passwordHash: 'argon2id-hash',
      },
    });
    expect(mocks.recordEvent).toHaveBeenCalledWith(
      'auth.password.rehash_succeeded',
      expect.objectContaining({
        sourceScheme: 'bcrypt',
        userId: 'user-1',
      }),
    );
  });

  it('does not block login when a legacy password is ineligible for rehashing', async () => {
    mocks.findUser.mockResolvedValue(user);
    mocks.verifyPassword.mockResolvedValue({
      needsRehash: true,
      scheme: 'bcrypt',
      valid: true,
    });
    mocks.hashPassword.mockRejectedValue(new PasswordPolicyError('too_short'));

    const result = await authorizeCredentials(
      {
        email: 'user@example.com',
        password: 'short-legacy',
      },
      new Request('https://example.com/api/auth/callback/credentials'),
    );

    expect(result?.id).toBe('user-1');
    expect(mocks.updateMany).not.toHaveBeenCalled();
    expect(mocks.recordEvent).toHaveBeenCalledWith(
      'auth.password.rehash_skipped',
      expect.objectContaining({ reason: 'policy_ineligible' }),
    );
  });

  it('adds dummy work for an unknown stored hash before rejecting credentials', async () => {
    mocks.findUser.mockResolvedValue(user);
    mocks.verifyPassword
      .mockResolvedValueOnce({
        needsRehash: false,
        scheme: 'unknown',
        valid: false,
      })
      .mockResolvedValueOnce({
        needsRehash: false,
        scheme: 'argon2id',
        valid: false,
      });

    const result = await authorizeCredentials(
      {
        email: 'user@example.com',
        password: 'candidate-password',
      },
      new Request('https://example.com/api/auth/callback/credentials'),
    );

    expect(result).toBeNull();
    expect(mocks.verifyPassword).toHaveBeenCalledTimes(2);
    expect(mocks.verifyPassword.mock.calls[1]?.[1]).toMatch(
      /^\$vulcan\$argon2id\$v=1\$/,
    );
  });
});
