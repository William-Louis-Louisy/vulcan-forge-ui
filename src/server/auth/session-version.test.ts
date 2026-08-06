import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  findUser: vi.fn(),
}));

vi.mock('@/server/db/prisma', () => ({
  prisma: {
    user: {
      findUnique: mocks.findUser,
    },
  },
}));

import { isAuthSessionVersionCurrent } from './session-version';

describe('isAuthSessionVersionCurrent', () => {
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
});
