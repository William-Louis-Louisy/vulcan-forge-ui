import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  auth: vi.fn(),
  recordEvent: vi.fn(),
  signOut: vi.fn(),
}));

vi.mock('@/auth', () => ({
  auth: mocks.auth,
  signOut: mocks.signOut,
}));

vi.mock('@/server/auth/auth-security-events', () => ({
  recordAuthSecurityEvent: mocks.recordEvent,
}));

import { logoutAction } from './logout.action';

describe('logoutAction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.signOut.mockResolvedValue(undefined);
  });

  it('records an informational event for an authenticated logout', async () => {
    mocks.auth.mockResolvedValue({
      user: {
        id: 'user-1',
      },
    });

    await logoutAction();

    expect(mocks.recordEvent).toHaveBeenCalledWith('auth.logout.succeeded', {
      userId: 'user-1',
    });
    expect(mocks.signOut).toHaveBeenCalledWith({ redirectTo: '/' });
  });

  it('still clears the local Auth.js session when no valid user is resolved', async () => {
    mocks.auth.mockResolvedValue(null);

    await logoutAction();

    expect(mocks.recordEvent).not.toHaveBeenCalled();
    expect(mocks.signOut).toHaveBeenCalledWith({ redirectTo: '/' });
  });
});
