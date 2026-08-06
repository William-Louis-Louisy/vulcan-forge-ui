import { randomUUID } from 'node:crypto';
import { prisma } from '@/server/db/prisma';
import { PASSWORD_RECOVERY_TOKEN_TTL_MS } from './password-recovery.constants';
import {
  createPasswordRecoveryToken,
  hashPasswordRecoveryToken,
} from './password-recovery-token';

export type PasswordRecoveryTokenStatus = 'confirm' | 'expired' | 'invalid';

export type InspectPasswordRecoveryResult = {
  expiresAt: Date | null;
  status: PasswordRecoveryTokenStatus;
  userId: string | null;
};

export type ApplyPasswordRecoveryResult =
  | {
      email: string;
      locale: 'en' | 'fr';
      status: 'reset';
      userId: string;
    }
  | {
      email: null;
      locale: null;
      status: 'expired' | 'invalid';
      userId: string | null;
    };

export async function createPasswordRecoveryChallenge({
  now = new Date(),
  userId,
}: {
  now?: Date;
  userId: string;
}) {
  const { token, tokenHash } = createPasswordRecoveryToken();
  const expiresAt = new Date(now.getTime() + PASSWORD_RECOVERY_TOKEN_TTL_MS);
  const id = randomUUID();

  const challenge = await prisma.passwordResetToken.upsert({
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

export async function revokePasswordRecoveryChallenge({
  id,
  userId,
}: {
  id: string;
  userId: string;
}) {
  await prisma.passwordResetToken.deleteMany({
    where: {
      id,
      userId,
    },
  });
}

export async function inspectPasswordRecoveryToken({
  now = new Date(),
  token,
}: {
  now?: Date;
  token: string;
}): Promise<InspectPasswordRecoveryResult> {
  const tokenHash = hashPasswordRecoveryToken(token);

  if (!tokenHash) {
    return {
      expiresAt: null,
      status: 'invalid',
      userId: null,
    };
  }

  const challenge = await prisma.passwordResetToken.findUnique({
    where: {
      tokenHash,
    },
    select: {
      expiresAt: true,
      userId: true,
    },
  });

  if (!challenge) {
    return {
      expiresAt: null,
      status: 'invalid',
      userId: null,
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

export async function applyPasswordRecovery({
  now = new Date(),
  passwordHash,
  token,
}: {
  now?: Date;
  passwordHash: string;
  token: string;
}): Promise<ApplyPasswordRecoveryResult> {
  const tokenHash = hashPasswordRecoveryToken(token);

  if (!tokenHash) {
    return {
      email: null,
      locale: null,
      status: 'invalid',
      userId: null,
    };
  }

  return prisma.$transaction(async (tx) => {
    const challenge = await tx.passwordResetToken.findUnique({
      where: {
        tokenHash,
      },
      select: {
        expiresAt: true,
        userId: true,
      },
    });

    if (!challenge) {
      return {
        email: null,
        locale: null,
        status: 'invalid' as const,
        userId: null,
      };
    }

    if (challenge.expiresAt <= now) {
      await tx.passwordResetToken.deleteMany({
        where: {
          tokenHash,
        },
      });

      return {
        email: null,
        locale: null,
        status: 'expired' as const,
        userId: challenge.userId,
      };
    }

    const consumed = await tx.passwordResetToken.deleteMany({
      where: {
        tokenHash,
      },
    });

    if (consumed.count !== 1) {
      return {
        email: null,
        locale: null,
        status: 'invalid' as const,
        userId: null,
      };
    }

    const user = await tx.user.update({
      where: {
        id: challenge.userId,
      },
      data: {
        authVersion: {
          increment: 1,
        },
        passwordHash,
      },
      select: {
        email: true,
        id: true,
        preferences: {
          select: {
            locale: true,
          },
        },
      },
    });

    await tx.passwordResetToken.deleteMany({
      where: {
        userId: challenge.userId,
      },
    });

    return {
      email: user.email,
      locale: user.preferences?.locale ?? 'en',
      status: 'reset' as const,
      userId: user.id,
    };
  });
}
