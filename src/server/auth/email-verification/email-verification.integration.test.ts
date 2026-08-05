// @vitest-environment node

import type { PrismaClient } from '@/generated/prisma/client';
import type {
  consumeEmailVerificationToken as ConsumeEmailVerificationToken,
  createEmailVerificationChallenge as CreateEmailVerificationChallenge,
  revokeEmailVerificationChallenge as RevokeEmailVerificationChallenge,
} from './email-verification.service';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';

const runDatabaseTests =
  process.env.RUN_AUTH_DATABASE_TESTS === 'true' &&
  Boolean(process.env.DATABASE_URL);

let prisma: PrismaClient;
let consumeEmailVerificationToken: typeof ConsumeEmailVerificationToken;
let createEmailVerificationChallenge: typeof CreateEmailVerificationChallenge;
let revokeEmailVerificationChallenge: typeof RevokeEmailVerificationChallenge;

const testEmailSuffix = '@email-verification.integration.test';

async function createTestUser(localPart: string) {
  return prisma.user.create({
    data: {
      email: `${localPart}${testEmailSuffix}`,
      name: 'Verification test user',
      passwordHash: 'integration-test-hash',
    },
    select: {
      id: true,
    },
  });
}

describe.skipIf(!runDatabaseTests)(
  'email verification PostgreSQL integration',
  () => {
    beforeAll(async () => {
      const prismaModule = await import('@/server/db/prisma');
      const serviceModule = await import('./email-verification.service');

      prisma = prismaModule.prisma;
      consumeEmailVerificationToken =
        serviceModule.consumeEmailVerificationToken;
      createEmailVerificationChallenge =
        serviceModule.createEmailVerificationChallenge;
      revokeEmailVerificationChallenge =
        serviceModule.revokeEmailVerificationChallenge;
    });

    beforeEach(async () => {
      await prisma.user.deleteMany({
        where: {
          email: {
            endsWith: testEmailSuffix,
          },
        },
      });
    });

    afterAll(async () => {
      await prisma.user.deleteMany({
        where: {
          email: {
            endsWith: testEmailSuffix,
          },
        },
      });
      await prisma.$disconnect();
    });

    it('stores only the token hash and verifies the user once', async () => {
      const user = await createTestUser('single-use');
      const challenge = await createEmailVerificationChallenge({
        userId: user.id,
      });
      const persisted = await prisma.emailVerificationToken.findFirstOrThrow({
        where: {
          userId: user.id,
        },
      });

      expect(persisted.tokenHash).not.toBe(challenge.token);
      expect(persisted.tokenHash).toHaveLength(64);

      await expect(
        consumeEmailVerificationToken({ token: challenge.token }),
      ).resolves.toEqual({
        status: 'verified',
        userId: user.id,
      });
      await expect(
        consumeEmailVerificationToken({ token: challenge.token }),
      ).resolves.toEqual({
        status: 'invalid',
        userId: null,
      });

      const verifiedUser = await prisma.user.findUniqueOrThrow({
        where: {
          id: user.id,
        },
        select: {
          emailVerifiedAt: true,
        },
      });

      expect(verifiedUser.emailVerifiedAt).toBeInstanceOf(Date);
      await expect(
        prisma.emailVerificationToken.count({
          where: {
            userId: user.id,
          },
        }),
      ).resolves.toBe(0);
    });

    it('rejects and removes an expired challenge', async () => {
      const user = await createTestUser('expired');
      const now = new Date();
      const challenge = await createEmailVerificationChallenge({
        now: new Date(now.getTime() - 31 * 60_000),
        userId: user.id,
      });

      await expect(
        consumeEmailVerificationToken({ now, token: challenge.token }),
      ).resolves.toEqual({
        status: 'expired',
        userId: user.id,
      });
      await expect(
        prisma.emailVerificationToken.count({
          where: {
            userId: user.id,
          },
        }),
      ).resolves.toBe(0);
    });

    it('revokes an undelivered replacement and invalidates both links', async () => {
      const user = await createTestUser('delivery-revocation');
      const previousChallenge = await createEmailVerificationChallenge({
        userId: user.id,
      });
      const failedReplacement = await createEmailVerificationChallenge({
        userId: user.id,
      });

      await revokeEmailVerificationChallenge({
        id: failedReplacement.id,
        userId: failedReplacement.userId,
      });

      await expect(
        consumeEmailVerificationToken({ token: previousChallenge.token }),
      ).resolves.toEqual({
        status: 'invalid',
        userId: null,
      });
      await expect(
        consumeEmailVerificationToken({ token: failedReplacement.token }),
      ).resolves.toEqual({
        status: 'invalid',
        userId: null,
      });
      await expect(
        prisma.emailVerificationToken.count({
          where: {
            userId: user.id,
          },
        }),
      ).resolves.toBe(0);
    });

    it('atomically keeps only the latest concurrent challenge', async () => {
      const user = await createTestUser('concurrent-challenges');
      const challenges = await Promise.all([
        createEmailVerificationChallenge({ userId: user.id }),
        createEmailVerificationChallenge({ userId: user.id }),
      ]);
      const persisted = await prisma.emailVerificationToken.findUniqueOrThrow({
        where: {
          userId: user.id,
        },
        select: {
          id: true,
        },
      });

      expect(challenges.map((challenge) => challenge.id)).toContain(
        persisted.id,
      );
      await expect(
        prisma.emailVerificationToken.count({
          where: {
            userId: user.id,
          },
        }),
      ).resolves.toBe(1);

      const results = await Promise.all(
        challenges.map((challenge) =>
          consumeEmailVerificationToken({ token: challenge.token }),
        ),
      );

      expect(
        results.filter((result) => result.status === 'verified'),
      ).toHaveLength(1);
      expect(
        results.filter((result) => result.status === 'invalid'),
      ).toHaveLength(1);
    });

    it('allows only one concurrent token consumer to verify the account', async () => {
      const user = await createTestUser('concurrent-consumers');
      const challenge = await createEmailVerificationChallenge({
        userId: user.id,
      });
      const results = await Promise.all([
        consumeEmailVerificationToken({ token: challenge.token }),
        consumeEmailVerificationToken({ token: challenge.token }),
      ]);

      expect(
        results.filter((result) => result.status === 'verified'),
      ).toHaveLength(1);
      expect(
        results.filter((result) => result.status === 'invalid'),
      ).toHaveLength(1);
    });
  },
);
