import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  findUser: vi.fn(),
  updateUsers: vi.fn(),
}));

vi.mock('@/server/db/prisma', () => ({
  prisma: {
    user: {
      findUnique: mocks.findUser,
      updateMany: mocks.updateUsers,
    },
  },
}));

import {
  isAuthSessionVersionCurrent,
  revokeAllAuthSessions,
} from './session-version';

describe('session versioning', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('accepts only the current persisted authentication version', async () => {
    mocks.findUser.mockResolvedValue({ authVersion: 3 });

    await expect(
      isAuthSessionVersionCurrent({ authVersion: 3, userId: 'user-1' }),
    ).resolves.toBe(true);
    await expect(
      isAuthSessionVersionCurrent({ authVersion: 2, userId: 'user-1' }),
    ).resolves.toBe(false);
  });

  it('fails closed when the user is missing or persistence is unavailable', async () => {
    mocks.findUser.mockResolvedValueOnce(null);
    await expect(
      isAuthSessionVersionCurrent({ authVersion: 0, userId: 'missing' }),
    ).resolves.toBe(false);

    mocks.findUser.mockRejectedValueOnce(new Error('database unavailable'));
    await expect(
      isAuthSessionVersionCurrent({ authVersion: 0, userId: 'user-1' }),
    ).resolves.toBe(false);
  });

  it('revokes every issued session by incrementing the persisted version', async () => {
    mocks.updateUsers.mockResolvedValue({ count: 1 });

    await expect(revokeAllAuthSessions({ userId: 'user-1' })).resolves.toBe(
      true,
    );
    expect(mocks.updateUsers).toHaveBeenCalledWith({
      where: {
        id: 'user-1',
      },
      data: {
        authVersion: {
          increment: 1,
        },
      },
    });
  });

  it('does not report a successful global revocation when the account is missing', async () => {
    mocks.updateUsers.mockResolvedValue({ count: 0 });

    await expect(revokeAllAuthSessions({ userId: 'missing' })).resolves.toBe(
      false,
    );
  });
});
