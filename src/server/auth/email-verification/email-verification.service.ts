import { randomUUID } from 'node:crypto';
import { Prisma } from '@/generated/prisma/client';
import { prisma } from '@/server/db/prisma';
import { EMAIL_VERIFICATION_TOKEN_TTL_MS } from './email-verification.constants';
import {
  createEmailVerificationToken,
  hashEmailVerificationToken,
} from './email-verification-token';

export type ConsumeEmailVerificationResult = {
  status: 'alreadyVerified' | 'expired' | 'invalid' | 'verified';
  userId: string | null;
};

type EmailVerificationChallengeSnapshot = {
  createdAt: Date;
  expiresAt: Date;
  id: string;
  tokenHash: string;
};

export type CreatedEmailVerificationChallenge = {
  expiresAt: Date;
  id: string;
  previousChallenge: EmailVerificationChallengeSnapshot | null;
  token: string;
  userId: string;
};

export async function createEmailVerificationChallenge({
  now = new Date(),
  userId,
}: {
  now?: Date;
  userId: string;
}): Promise<CreatedEmailVerificationChallenge> {
  const { token, tokenHash } = createEmailVerificationToken();
  const expiresAt = new Date(now.getTime() + EMAIL_VERIFICATION_TOKEN_TTL_MS);
  const id = randomUUID();

  const replacement = await prisma.$transaction(async (tx) => {
    await tx.$queryRaw(Prisma.sql`
      SELECT pg_advisory_xact_lock(hashtextextended(${userId}, 0))
    `);

    const previousChallenge = await tx.emailVerificationToken.findUnique({
      where: {
        userId,
      },
      select: {
        createdAt: true,
        expiresAt: true,
        id: true,
        tokenHash: true,
      },
    });

    const challenge = previousChallenge
      ? await tx.emailVerificationToken.update({
          where: {
            userId,
          },
          data: {
            createdAt: now,
            expiresAt,
            id,
            tokenHash,
          },
          select: {
            id: true,
          },
        })
      : await tx.emailVerificationToken.create({
          data: {
            createdAt: now,
            expiresAt,
            id,
            tokenHash,
            userId,
          },
          select: {
            id: true,
          },
        });

    return {
      id: challenge.id,
      previousChallenge,
    };
  });

  return {
    expiresAt,
    id: replacement.id,
    previousChallenge: replacement.previousChallenge,
    token,
    userId,
  };
}

export async function rollbackEmailVerificationChallenge(
  challenge: CreatedEmailVerificationChallenge,
) {
  if (!challenge.previousChallenge) {
    await prisma.emailVerificationToken.deleteMany({
      where: {
        id: challenge.id,
        userId: challenge.userId,
      },
    });
    return;
  }

  await prisma.emailVerificationToken.updateMany({
    where: {
      id: challenge.id,
      userId: challenge.userId,
    },
    data: {
      createdAt: challenge.previousChallenge.createdAt,
      expiresAt: challenge.previousChallenge.expiresAt,
      id: challenge.previousChallenge.id,
      tokenHash: challenge.previousChallenge.tokenHash,
    },
  });
}

export async function consumeEmailVerificationToken({
  now = new Date(),
  token,
}: {
  now?: Date;
  token: string;
}): Promise<ConsumeEmailVerificationResult> {
  const tokenHash = hashEmailVerificationToken(token);

  if (!tokenHash) {
    return {
      status: 'invalid',
      userId: null,
    };
  }

  return prisma.$transaction(async (tx) => {
    const challenge = await tx.emailVerificationToken.findUnique({
      where: {
        tokenHash,
      },
      select: {
        expiresAt: true,
        userId: true,
        user: {
          select: {
            emailVerifiedAt: true,
          },
        },
      },
    });

    if (!challenge) {
      return {
        status: 'invalid' as const,
        userId: null,
      };
    }

    if (challenge.expiresAt <= now) {
      await tx.emailVerificationToken.deleteMany({
        where: {
          tokenHash,
        },
      });

      return {
        status: 'expired' as const,
        userId: challenge.userId,
      };
    }

    if (challenge.user.emailVerifiedAt) {
      await tx.emailVerificationToken.deleteMany({
        where: {
          userId: challenge.userId,
        },
      });

      return {
        status: 'alreadyVerified' as const,
        userId: challenge.userId,
      };
    }

    const consumed = await tx.emailVerificationToken.deleteMany({
      where: {
        tokenHash,
      },
    });

    if (consumed.count !== 1) {
      return {
        status: 'invalid' as const,
        userId: null,
      };
    }

    const verified = await tx.user.updateMany({
      where: {
        emailVerifiedAt: null,
        id: challenge.userId,
      },
      data: {
        emailVerifiedAt: now,
      },
    });

    await tx.emailVerificationToken.deleteMany({
      where: {
        userId: challenge.userId,
      },
    });

    return {
      status:
        verified.count === 1
          ? ('verified' as const)
          : ('alreadyVerified' as const),
      userId: challenge.userId,
    };
  });
}
