import { randomUUID } from 'node:crypto';
import { prisma } from '@/server/db/prisma';
import { EMAIL_VERIFICATION_TOKEN_TTL_MS } from './email-verification.constants';
import {
  createEmailVerificationToken,
  hashEmailVerificationToken,
} from './email-verification-token';

export type EmailVerificationTokenStatus =
  | 'alreadyVerified'
  | 'confirm'
  | 'expired'
  | 'invalid';

export type ConsumeEmailVerificationResult = {
  status: Exclude<EmailVerificationTokenStatus, 'confirm'> | 'verified';
  userId: string | null;
};

export type InspectEmailVerificationResult = {
  expiresAt: Date | null;
  status: EmailVerificationTokenStatus;
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
  const id = randomUUID();

  const challenge = await prisma.emailVerificationToken.upsert({
    where: {
      userId,
    },
    create: {
      createdAt: now,
      expiresAt,
      id,
      tokenHash,
      userId,
    },
    update: {
      createdAt: now,
      expiresAt,
      id,
      tokenHash,
    },
    select: {
      id: true,
    },
  });

  return {
    expiresAt,
    id: challenge.id,
    token,
    userId,
  };
}

export async function revokeEmailVerificationChallenge({
  id,
  userId,
}: {
  id: string;
  userId: string;
}) {
  await prisma.emailVerificationToken.deleteMany({
    where: {
      id,
      userId,
    },
  });
}

export async function inspectEmailVerificationToken({
  now = new Date(),
  token,
}: {
  now?: Date;
  token: string;
}): Promise<InspectEmailVerificationResult> {
  const tokenHash = hashEmailVerificationToken(token);

  if (!tokenHash) {
    return {
      expiresAt: null,
      status: 'invalid',
      userId: null,
    };
  }

  const challenge = await prisma.emailVerificationToken.findUnique({
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
      expiresAt: null,
      status: 'invalid',
      userId: null,
    };
  }

  if (challenge.user.emailVerifiedAt) {
    return {
      expiresAt: challenge.expiresAt,
      status: 'alreadyVerified',
      userId: challenge.userId,
    };
  }

  if (challenge.expiresAt <= now) {
    return {
      expiresAt: challenge.expiresAt,
      status: 'expired',
      userId: challenge.userId,
    };
  }

  return {
    expiresAt: challenge.expiresAt,
    status: 'confirm',
    userId: challenge.userId,
  };
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
