import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  inspectToken: vi.fn(),
  recordEvent: vi.fn(),
}));

vi.mock('@/server/auth/auth-security-events', () => ({
  recordAuthSecurityEvent: mocks.recordEvent,
}));

vi.mock('@/server/auth/password-recovery/password-recovery.service', () => ({
  inspectPasswordRecoveryToken: mocks.inspectToken,
}));

import { POST } from './route';

function createRequest(origin = 'https://app.example.com', token = 'opaque-token') {
  return new NextRequest(
    'https://app.example.com/api/auth/password-recovery/prepare',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Origin: origin,
      },
      body: JSON.stringify({ token }),
    },
  );
}

describe('password recovery preparation route', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.inspectToken.mockResolvedValue({
      expiresAt: new Date('2099-01-01T00:00:00.000Z'),
      status: 'confirm',
      userId: 'user-1',
    });
  });

  it('stores a valid same-origin token in a scoped HttpOnly cookie', async () => {
    const response = await POST(createRequest());

    await expect(response.json()).resolves.toEqual({ status: 'confirm' });
    expect(mocks.inspectToken).toHaveBeenCalledWith({ token: 'opaque-token' });
    expect(response.headers.get('Set-Cookie')).toContain(
      'vulcan_password_recovery_confirmation=opaque-token',
    );
    expect(response.headers.get('Set-Cookie')).toContain('HttpOnly');
    expect(response.headers.get('Set-Cookie')).toContain(
      'Path=/api/auth/password-recovery',
    );
    expect(mocks.recordEvent).toHaveBeenCalledWith(
      'auth.password_recovery.link_opened',
      { userId: 'user-1' },
    );
  });

  it('rejects a cross-origin request without inspecting the token', async () => {
    const response = await POST(createRequest('https://attacker.example.com'));

    expect(mocks.inspectToken).not.toHaveBeenCalled();
    await expect(response.json()).resolves.toEqual({ status: 'invalid' });
    expect(response.headers.get('Set-Cookie')).toContain('Max-Age=0');
  });

  it('uses a bounded invalid response when inspection fails', async () => {
    mocks.inspectToken.mockRejectedValue(new Error('database unavailable'));

    const response = await POST(createRequest());

    await expect(response.json()).resolves.toEqual({ status: 'invalid' });
    expect(mocks.recordEvent).toHaveBeenCalledWith(
      'auth.password_recovery.unexpected_error',
      { reason: 'token_inspection' },
    );
  });
});
