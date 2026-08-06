import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  inspectToken: vi.fn(),
  recordEvent: vi.fn(),
}));

vi.mock('@/server/auth/auth-security-events', () => ({
  recordAuthSecurityEvent: mocks.recordEvent,
}));

vi.mock('@/server/auth/email-verification/email-verification.service', () => ({
  inspectEmailVerificationToken: mocks.inspectToken,
}));

import { POST } from './route';

function createPrepareRequest({
  origin = 'https://app.example.com',
  token = 'opaque-value',
}: {
  origin?: string;
  token?: string;
} = {}) {
  return new NextRequest(
    'https://app.example.com/api/auth/verify-email/prepare',
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

describe('email verification preparation route', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.inspectToken.mockResolvedValue({
      expiresAt: new Date('2099-01-01T00:00:00.000Z'),
      status: 'confirm',
      userId: 'user-1',
    });
  });

  it('inspects a same-origin body token and stores it in a scoped cookie', async () => {
    const response = await POST(createPrepareRequest());
    const body = (await response.json()) as { status: string };
    const confirmationCookie = response.headers.get('Set-Cookie');

    expect(mocks.inspectToken).toHaveBeenCalledWith({
      token: 'opaque-value',
    });
    expect(body).toEqual({ status: 'confirm' });
    expect(confirmationCookie).toContain(
      'vulcan_email_verification_confirmation=opaque-value',
    );
    expect(confirmationCookie).toContain('HttpOnly');
    expect(confirmationCookie).toContain('SameSite=lax');
    expect(confirmationCookie).toContain('Path=/api/auth/verify-email');
    expect(response.headers.get('Cache-Control')).toBe('no-store, max-age=0');
    expect(mocks.recordEvent).toHaveBeenCalledWith(
      'auth.email_verification.link_opened',
      { userId: 'user-1' },
    );
  });

  it('rejects a cross-origin preparation request without inspecting the token', async () => {
    const response = await POST(
      createPrepareRequest({ origin: 'https://attacker.example.com' }),
    );

    expect(mocks.inspectToken).not.toHaveBeenCalled();
    await expect(response.json()).resolves.toEqual({ status: 'invalid' });
    expect(response.headers.get('Set-Cookie')).toContain('Max-Age=0');
  });

  it('rejects an oversized token before database work', async () => {
    const response = await POST(
      createPrepareRequest({ token: 'a'.repeat(129) }),
    );

    expect(mocks.inspectToken).not.toHaveBeenCalled();
    await expect(response.json()).resolves.toEqual({ status: 'invalid' });
  });

  it('uses a bounded invalid state when token inspection fails', async () => {
    mocks.inspectToken.mockRejectedValue(new Error('database unavailable'));

    const response = await POST(createPrepareRequest());

    await expect(response.json()).resolves.toEqual({ status: 'invalid' });
    expect(mocks.recordEvent).toHaveBeenCalledWith(
      'auth.email_verification.unexpected_error',
      { reason: 'token_inspection' },
    );
  });
});
