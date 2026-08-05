import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  findUser: vi.fn(),
  rawAuth: vi.fn(),
  signIn: vi.fn(),
  signOut: vi.fn(),
}));

vi.mock('next-auth', () => ({
  default: vi.fn(() => ({
    auth: mocks.rawAuth,
    handlers: {},
    signIn: mocks.signIn,
    signOut: mocks.signOut,
  })),
}));

vi.mock('next-auth/providers/credentials', () => ({
  default: vi.fn((configuration) => configuration),
}));

vi.mock('@/server/auth/credentials-authorizer', () => ({
  authorizeCredentials: vi.fn(),
}));

vi.mock('@/server/db/prisma', () => ({
  prisma: {
    user: {
      findUnique: mocks.findUser,
    },
  },
}));

import { auth, authForEmailVerification } from './auth';

const pendingSession = {
  expires: '2099-01-01T00:00:00.000Z',
  user: {
    email: 'william@example.com',
    id: 'user-1',
    locale: 'en',
    name: 'William',
  },
};

describe('verified authentication boundary', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns no verified session when no account is authenticated', async () => {
    mocks.rawAuth.mockResolvedValue(null);

    await expect(auth()).resolves.toBeNull();
    expect(mocks.findUser).not.toHaveBeenCalled();
  });

  it('rejects an authenticated account whose email is not verified', async () => {
    mocks.rawAuth.mockResolvedValue(pendingSession);
    mocks.findUser.mockResolvedValue({ emailVerifiedAt: null });

    await expect(auth()).resolves.toBeNull();
    expect(mocks.findUser).toHaveBeenCalledWith({
      where: { id: 'user-1' },
      select: { emailVerifiedAt: true },
    });
  });

  it('returns the session while the current email remains verified', async () => {
    mocks.rawAuth.mockResolvedValue(pendingSession);
    mocks.findUser.mockResolvedValue({ emailVerifiedAt: new Date() });

    await expect(auth()).resolves.toBe(pendingSession);
  });

  it('exposes the raw session only for the pending-verification journey', async () => {
    mocks.rawAuth.mockResolvedValue(pendingSession);

    await expect(authForEmailVerification()).resolves.toBe(pendingSession);
    expect(mocks.findUser).not.toHaveBeenCalled();
  });
});
