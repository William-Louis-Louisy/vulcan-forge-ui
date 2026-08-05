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

export async function createEmailVerificationChallenge({
  now = new Date(),
  userId,
}: {
  now?: Date;
  userId: string;
}) {
  const { token, tokenHash } = createEmailVerificationToken();
  const expiresAt = new Date(now.getTime() + EMAIL_VERIFICATION_TOKEN_TTL_MS);

  const challenge = await prisma.$transaction(async (tx) => {
    await tx.emailVerificationToken.deleteMany({
      where: {
        userId,
      },
    });

    return tx.emailVerificationToken.create({
      data: {
        expiresAt,
        tokenHash,
        userId,
      },
      select: {
        id: true,
      },
    });
  });

  return {
    expiresAt,
    id: challenge.id,
    token,
  };
}

export async function revokeEmailVerificationChallenge(id: string) {
  await prisma.emailVerificationToken.deleteMany({
    where: {
      id,
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
