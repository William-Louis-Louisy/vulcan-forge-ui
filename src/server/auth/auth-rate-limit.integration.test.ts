// @vitest-environment node

import type { PrismaClient } from '@/generated/prisma/client';
import type {
  consumeAuthRateLimit as ConsumeAuthRateLimit,
  resetAuthAccountRateLimit as ResetAuthAccountRateLimit,
} from './auth-rate-limit';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';

const runDatabaseTests =
  process.env.RUN_AUTH_DATABASE_TESTS === 'true' &&
  Boolean(process.env.DATABASE_URL);

let prisma: PrismaClient;
let consumeAuthRateLimit: typeof ConsumeAuthRateLimit;
let resetAuthAccountRateLimit: typeof ResetAuthAccountRateLimit;

describe.skipIf(!runDatabaseTests)(
  'authentication rate limit PostgreSQL integration',
  () => {
    beforeAll(async () => {
      process.env.AUTH_RATE_LIMIT_SECRET = 'integration-rate-limit-secret';
      process.env.AUTH_TRUST_PROXY_HEADERS = 'false';
      process.env.AUTH_RATE_LIMIT_FAIL_OPEN = 'false';

      const prismaModule = await import('@/server/db/prisma');
      const rateLimitModule = await import('./auth-rate-limit');

      prisma = prismaModule.prisma;
      consumeAuthRateLimit = rateLimitModule.consumeAuthRateLimit;
      resetAuthAccountRateLimit = rateLimitModule.resetAuthAccountRateLimit;
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
