// @vitest-environment node

import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';

const runDatabaseTests =
  process.env.RUN_AUTH_DATABASE_TESTS === 'true' &&
  Boolean(process.env.DATABASE_URL);

type PrismaModule = typeof import('@/server/db/prisma');
type RateLimitModule = typeof import('./auth-rate-limit');

let prisma: PrismaModule['prisma'];
let consumeAuthRateLimit: RateLimitModule['consumeAuthRateLimit'];
let resetAuthAccountRateLimit: RateLimitModule['resetAuthAccountRateLimit'];

describe.skipIf(!runDatabaseTests)(
  'authentication rate limit PostgreSQL integration',
  () => {
    beforeAll(async () => {
      process.env.AUTH_RATE_LIMIT_SECRET = 'integration-rate-limit-secret';
      process.env.AUTH_TRUST_PROXY_HEADERS = 'false';
      process.env.AUTH_RATE_LIMIT_FAIL_OPEN = 'false';

      ({ prisma } = await import('@/server/db/prisma'));
      ({ consumeAuthRateLimit, resetAuthAccountRateLimit } = await import(
        './auth-rate-limit'
      ));
    });

    beforeEach(async () => {
      await prisma.authRateLimitBucket.deleteMany();
    });

    afterAll(async () => {
      await prisma.authRateLimitBucket.deleteMany();
      await prisma.$disconnect();
    });

    it('atomically enforces the account limit under concurrent requests', async () => {
      const accountIdentifier = 'concurrent@example.com';
      const attempts = await Promise.all(
        Array.from({ length: 12 }, () =>
          consumeAuthRateLimit({
            accountIdentifier,
            headers: new Headers(),
            operation: 'login',
          }),
        ),
      );

      expect(attempts.filter((attempt) => attempt.allowed)).toHaveLength(8);
      expect(attempts.filter((attempt) => !attempt.allowed)).toHaveLength(4);

      const buckets = await prisma.authRateLimitBucket.findMany();

      expect(buckets).toHaveLength(1);
      expect(buckets[0]?.attempts).toBe(12);
      expect(buckets[0]?.key).not.toContain(accountIdentifier);
    });

    it('starts a new fixed window after the stored bucket expires', async () => {
      const accountIdentifier = 'expired-window@example.com';

      await consumeAuthRateLimit({
        accountIdentifier,
        headers: new Headers(),
        operation: 'login',
      });

      await prisma.authRateLimitBucket.updateMany({
        data: {
          resetAt: new Date(Date.now() - 1_000),
        },
      });

      const result = await consumeAuthRateLimit({
        accountIdentifier,
        headers: new Headers(),
        operation: 'login',
      });
      const bucket = await prisma.authRateLimitBucket.findFirstOrThrow();

      expect(result.allowed).toBe(true);
      expect(bucket.attempts).toBe(1);
      expect(bucket.resetAt.getTime()).toBeGreaterThan(Date.now());
    });

    it('removes the account bucket after successful authentication', async () => {
      const accountIdentifier = 'successful@example.com';

      await consumeAuthRateLimit({
        accountIdentifier,
        headers: new Headers(),
        operation: 'login',
      });

      await resetAuthAccountRateLimit({
        accountIdentifier,
        operation: 'login',
      });

      await expect(prisma.authRateLimitBucket.count()).resolves.toBe(0);
    });
  },
);
