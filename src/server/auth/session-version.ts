import { prisma } from '@/server/db/prisma';

export async function isAuthSessionVersionCurrent({
  authVersion,
  userId,
}: {
  authVersion: number;
  userId: string;
}) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        authVersion: true,
      },
    });

    return Boolean(user && user.authVersion === authVersion);
  } catch {
    return false;
  }
}

export async function revokeAllAuthSessions({ userId }: { userId: string }) {
  const result = await prisma.user.updateMany({
    where: {
      id: userId,
    },
    data: {
      authVersion: {
        increment: 1,
      },
    },
  });

  return result.count === 1;
}
