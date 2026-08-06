// @vitest-environment node

import type { PrismaClient } from '@/generated/prisma/client';
import type {
  applyPasswordRecovery as ApplyPasswordRecovery,
  createPasswordRecoveryChallenge as CreatePasswordRecoveryChallenge,
  inspectPasswordRecoveryToken as InspectPasswordRecoveryToken,
} from './password-recovery.service';
import type { isAuthSessionVersionCurrent as IsAuthSessionVersionCurrent } from '../session-version';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';

const runDatabaseTests =
  process.env.RUN_AUTH_DATABASE_TESTS === 'true' &&
  Boolean(process.env.DATABASE_URL);

let prisma: PrismaClient;
let applyPasswordRecovery: typeof ApplyPasswordRecovery;
let createPasswordRecoveryChallenge: typeof CreatePasswordRecoveryChallenge;
let inspectPasswordRecoveryToken: typeof InspectPasswordRecoveryToken;
let isAuthSessionVersionCurrent: typeof IsAuthSessionVersionCurrent;

const testEmailSuffix = '@password-recovery.integration.test';

async function createTestUser(localPart: string) {
  return prisma.user.create({
    data: {
      email: localPart + testEmailSuffix,
      name: 'Password recovery test user',
      passwordHash: 'old-integration-test-hash',
      preferences: {
        create: {
          locale: 'fr',
        },
      },
    },
    select: {
      authVersion: true,
      id: true,
    },
  });
}

describe.skipIf(!runDatabaseTests)(
  'password recovery PostgreSQL integration',
  () => {
    beforeAll(async () => {
      const prismaModule = await import('@/server/db/prisma');
      const serviceModule = await import('./password-recovery.service');
      const sessionVersionModule = await import('../session-version');

      prisma = prismaModule.prisma;
      applyPasswordRecovery = serviceModule.applyPasswordRecovery;
      createPasswordRecoveryChallenge =
        serviceModule.createPasswordRecoveryChallenge;
      inspectPasswordRecoveryToken = serviceModule.inspectPasswordRecoveryToken;
      isAuthSessionVersionCurrent =
        sessionVersionModule.isAuthSessionVersionCurrent;
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

    it('stores only the token hash and inspects without consuming it', async () => {
      const user = await createTestUser('inspect');
      const challenge = await createPasswordRecoveryChallenge({
        userId: user.id,
      });
      const persisted = await prisma.passwordResetToken.findFirstOrThrow({
        where: {
          userId: user.id,
        },
      });

      expect(persisted.tokenHash).not.toBe(challenge.token);
      expect(persisted.tokenHash).toHaveLength(64);
      await expect(
        inspectPasswordRecoveryToken({ token: challenge.token }),
      ).resolves.toEqual({
        expiresAt: challenge.expiresAt,
        status: 'confirm',
        userId: user.id,
      });
      await expect(
        prisma.passwordResetToken.count({ where: { userId: user.id } }),
      ).resolves.toBe(1);
    });

    it('atomically changes the password, increments auth version and consumes the challenge', async () => {
      const user = await createTestUser('reset');
      const challenge = await createPasswordRecoveryChallenge({
        userId: user.id,
      });

      await expect(
        isAuthSessionVersionCurrent({
          authVersion: user.authVersion,
          userId: user.id,
        }),
      ).resolves.toBe(true);
      await expect(
        applyPasswordRecovery({
          passwordHash: 'new-integration-test-hash',
          token: challenge.token,
        }),
      ).resolves.toEqual({
        email: 'reset' + testEmailSuffix,
        locale: 'fr',
        status: 'reset',
        userId: user.id,
      });

      const updated = await prisma.user.findUniqueOrThrow({
        where: { id: user.id },
        select: { authVersion: true, passwordHash: true },
      });

      expect(updated).toEqual({
        authVersion: user.authVersion + 1,
        passwordHash: 'new-integration-test-hash',
      });
      await expect(
        isAuthSessionVersionCurrent({
          authVersion: user.authVersion,
          userId: user.id,
        }),
      ).resolves.toBe(false);
      await expect(
        isAuthSessionVersionCurrent({
          authVersion: updated.authVersion,
          userId: user.id,
        }),
      ).resolves.toBe(true);
      await expect(
        applyPasswordRecovery({
          passwordHash: 'another-hash',
          token: challenge.token,
        }),
      ).resolves.toEqual({
        email: null,
        locale: null,
        status: 'invalid',
        userId: null,
      });
    });

    it('rejects and removes an expired challenge', async () => {
      const user = await createTestUser('expired');
      const now = new Date();
      const challenge = await createPasswordRecoveryChallenge({
        now: new Date(now.getTime() - 31 * 60_000),
        userId: user.id,
      });

      await expect(
        applyPasswordRecovery({
          now,
          passwordHash: 'new-hash',
          token: challenge.token,
        }),
      ).resolves.toEqual({
        email: null,
        locale: null,
        status: 'expired',
        userId: user.id,
      });
      await expect(
        prisma.passwordResetToken.count({ where: { userId: user.id } }),
      ).resolves.toBe(0);
    });

    it('atomically keeps only the latest concurrent challenge', async () => {
      const user = await createTestUser('concurrent-challenges');
      const challenges = await Promise.all([
        createPasswordRecoveryChallenge({ userId: user.id }),
        createPasswordRecoveryChallenge({ userId: user.id }),
      ]);
      const results = await Promise.all(
        challenges.map((challenge) =>
          applyPasswordRecovery({
            passwordHash: 'hash-' + challenge.id,
            token: challenge.token,
          }),
        ),
      );

      expect(
        results.filter((result) => result.status === 'reset'),
      ).toHaveLength(1);
      expect(
        results.filter((result) => result.status === 'invalid'),
      ).toHaveLength(1);
    });

    it('allows only one concurrent consumer to reset the password', async () => {
      const user = await createTestUser('concurrent-consumers');
      const challenge = await createPasswordRecoveryChallenge({
        userId: user.id,
      });
      const results = await Promise.all([
        applyPasswordRecovery({
          passwordHash: 'new-hash-a',
          token: challenge.token,
        }),
        applyPasswordRecovery({
          passwordHash: 'new-hash-b',
          token: challenge.token,
        }),
      ]);

      expect(
        results.filter((result) => result.status === 'reset'),
      ).toHaveLength(1);
      expect(
        results.filter((result) => result.status === 'invalid'),
      ).toHaveLength(1);
    });
  },
);
