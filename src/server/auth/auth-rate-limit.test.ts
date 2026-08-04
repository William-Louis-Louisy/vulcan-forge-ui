import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const prismaMocks = vi.hoisted(() => ({
  deleteBucket: vi.fn(),
  deleteExpiredBuckets: vi.fn(),
  queryRaw: vi.fn(),
}));

vi.mock('@/server/db/prisma', () => ({
  prisma: {
    $queryRaw: prismaMocks.queryRaw,
    authRateLimitBucket: {
      delete: prismaMocks.deleteBucket,
      deleteMany: prismaMocks.deleteExpiredBuckets,
    },
  },
}));

import { AuthRateLimitUnavailableError } from './auth-errors';
import {
  consumeAuthRateLimit,
  resetAuthAccountRateLimit,
} from './auth-rate-limit';

beforeEach(() => {
  vi.stubEnv('AUTH_RATE_LIMIT_SECRET', 'test-rate-limit-secret');
  vi.stubEnv('AUTH_TRUST_PROXY_HEADERS', 'true');
  vi.stubEnv('AUTH_RATE_LIMIT_FAIL_OPEN', 'false');
  prismaMocks.deleteBucket.mockResolvedValue({});
  prismaMocks.deleteExpiredBuckets.mockResolvedValue({ count: 0 });
});

afterEach(() => {
  vi.clearAllMocks();
  vi.unstubAllEnvs();
});

describe('consumeAuthRateLimit', () => {
  it('allows attempts while both account and IP buckets remain below their limits', async () => {
    const resetAt = new Date(Date.now() + 60_000);
    prismaMocks.queryRaw
      .mockResolvedValueOnce([{ attempts: 1, resetAt }])
      .mockResolvedValueOnce([{ attempts: 1, resetAt }]);

    const result = await consumeAuthRateLimit({
      accountIdentifier: 'User@example.com',
      headers: new Headers({ 'x-forwarded-for': '203.0.113.10' }),
      operation: 'login',
    });

    expect(result.allowed).toBe(true);
    expect(result.retryAfterSeconds).toBe(0);
    expect(result.context.ipFingerprint).not.toBeNull();
    expect(prismaMocks.queryRaw).toHaveBeenCalledTimes(2);
  });

  it('blocks an account bucket after the temporary window limit is exceeded', async () => {
    const resetAt = new Date(Date.now() + 120_000);
    prismaMocks.queryRaw
      .mockResolvedValueOnce([{ attempts: 9, resetAt }])
      .mockResolvedValueOnce([{ attempts: 1, resetAt }]);

    const result = await consumeAuthRateLimit({
      accountIdentifier: 'user@example.com',
      headers: new Headers({ 'x-forwarded-for': '203.0.113.10' }),
      operation: 'login',
    });

    expect(result.allowed).toBe(false);
    expect(result.retryAfterSeconds).toBeGreaterThan(0);
  });

  it('fails closed when persistence is unavailable by default', async () => {
    prismaMocks.queryRaw.mockRejectedValue(new Error('database unavailable'));

    await expect(
      consumeAuthRateLimit({
        accountIdentifier: 'user@example.com',
        headers: new Headers(),
        operation: 'login',
      }),
    ).rejects.toBeInstanceOf(AuthRateLimitUnavailableError);
  });

  it('can fail open only when the operational override is explicit', async () => {
    vi.stubEnv('AUTH_RATE_LIMIT_FAIL_OPEN', 'true');
    prismaMocks.queryRaw.mockRejectedValue(new Error('database unavailable'));

    const result = await consumeAuthRateLimit({
      accountIdentifier: 'user@example.com',
      headers: new Headers(),
      operation: 'login',
    });

    expect(result.allowed).toBe(true);
  });
});

describe('resetAuthAccountRateLimit', () => {
  it('treats a missing bucket as an already reset account', async () => {
    prismaMocks.deleteBucket.mockRejectedValue({ code: 'P2025' });

    await expect(
      resetAuthAccountRateLimit({
        accountIdentifier: 'user@example.com',
        operation: 'login',
      }),
    ).resolves.toBeUndefined();
  });
});
