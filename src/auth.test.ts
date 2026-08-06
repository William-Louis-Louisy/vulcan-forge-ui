import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
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
  default: vi.fn((configuration: unknown) => configuration),
}));

vi.mock('@/server/auth/credentials-authorizer', () => ({
  authorizeCredentials: vi.fn(),
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

describe('authentication boundary', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns no session when no account is authenticated', async () => {
    mocks.rawAuth.mockResolvedValue(null);

    await expect(auth()).resolves.toBeNull();
  });

  it('keeps an authenticated pending-verification account usable', async () => {
    mocks.rawAuth.mockResolvedValue(pendingSession);

    await expect(auth()).resolves.toBe(pendingSession);
  });

  it('exposes the same session through the explicit verification alias', async () => {
    mocks.rawAuth.mockResolvedValue(pendingSession);

    await expect(authForEmailVerification()).resolves.toBe(pendingSession);
  });
});
