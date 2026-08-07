import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  auth: vi.fn(),
  recordEvent: vi.fn(),
  revokeAll: vi.fn(),
  signOut: vi.fn(),
}));

vi.mock('@/auth', () => ({
  auth: mocks.auth,
  signOut: mocks.signOut,
}));

vi.mock('@/server/auth/auth-security-events', () => ({
  recordAuthSecurityEvent: mocks.recordEvent,
}));

vi.mock('@/server/auth/session-version', () => ({
  revokeAllAuthSessions: mocks.revokeAll,
}));

import { logoutAllSessionsAction } from './logout-all-sessions.action';
import { initialLogoutAllSessionsActionState } from './session-security.state';

describe('logoutAllSessionsAction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.signOut.mockResolvedValue(undefined);
  });

  it('increments the account session version and clears the current session', async () => {
    mocks.auth.mockResolvedValue({ user: { id: 'user-1' } });
    mocks.revokeAll.mockResolvedValue(true);

    await expect(
      logoutAllSessionsAction(initialLogoutAllSessionsActionState),
    ).resolves.toEqual(initialLogoutAllSessionsActionState);

    expect(mocks.revokeAll).toHaveBeenCalledWith({ userId: 'user-1' });
    expect(mocks.recordEvent).toHaveBeenCalledWith('auth.session.revoked_all', {
      userId: 'user-1',
    });
    expect(mocks.signOut).toHaveBeenCalledWith({ redirectTo: '/' });
  });

  it('fails visibly and keeps the current session when persistence is unavailable', async () => {
    mocks.auth.mockResolvedValue({ user: { id: 'user-1' } });
    mocks.revokeAll.mockRejectedValue(new Error('database unavailable'));

    await expect(
      logoutAllSessionsAction(initialLogoutAllSessionsActionState),
    ).resolves.toEqual({ formError: 'revocationFailed' });

    expect(mocks.recordEvent).toHaveBeenCalledWith(
      'auth.session.revocation_failed',
      {
        reason: 'persistence_unavailable',
        userId: 'user-1',
      },
    );
    expect(mocks.signOut).not.toHaveBeenCalled();
  });

  it('does not claim success when the authenticated account disappeared concurrently', async () => {
    mocks.auth.mockResolvedValue({ user: { id: 'user-1' } });
    mocks.revokeAll.mockResolvedValue(false);

    await expect(
      logoutAllSessionsAction(initialLogoutAllSessionsActionState),
    ).resolves.toEqual({ formError: 'revocationFailed' });

    expect(mocks.recordEvent).toHaveBeenCalledWith(
      'auth.session.revocation_failed',
      {
        reason: 'account_missing',
        userId: 'user-1',
      },
    );
    expect(mocks.signOut).not.toHaveBeenCalled();
  });

  it('clears a stale local cookie when no valid session is resolved', async () => {
    mocks.auth.mockResolvedValue(null);

    await logoutAllSessionsAction(initialLogoutAllSessionsActionState);

    expect(mocks.revokeAll).not.toHaveBeenCalled();
    expect(mocks.signOut).toHaveBeenCalledWith({ redirectTo: '/' });
  });
});
