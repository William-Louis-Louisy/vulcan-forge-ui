import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  consumeToken: vi.fn(),
  recordEvent: vi.fn(),
}));

vi.mock('@/server/auth/auth-security-events', () => ({
  recordAuthSecurityEvent: mocks.recordEvent,
}));

vi.mock('@/server/auth/email-verification/email-verification.service', () => ({
  consumeEmailVerificationToken: mocks.consumeToken,
}));

import { POST } from './route';

describe('email verification confirmation route', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.consumeToken.mockResolvedValue({
      status: 'verified',
      userId: 'user-1',
    });
  });

  it('consumes the prepared token only after a same-origin POST', async () => {
    const response = await POST(
      new NextRequest(
        'https://app.example.com/api/auth/verify-email?locale=fr',
        {
          method: 'POST',
          headers: {
            Cookie: 'vulcan_email_verification_confirmation=opaque-value',
            Origin: 'https://app.example.com',
          },
        },
      ),
    );

    expect(mocks.consumeToken).toHaveBeenCalledWith({
      token: 'opaque-value',
    });
    expect(response.headers.get('Location')).toBe(
      'https://app.example.com/fr/verify-email?status=verified',
    );
    expect(response.headers.get('Set-Cookie')).toContain('Max-Age=0');
    expect(mocks.recordEvent).toHaveBeenCalledWith(
      'auth.email_verification.verified',
      { userId: 'user-1' },
    );
  });

  it('rejects cross-origin confirmation without consuming the token', async () => {
    const response = await POST(
      new NextRequest(
        'https://app.example.com/api/auth/verify-email?locale=en',
        {
          method: 'POST',
          headers: {
            Cookie: 'vulcan_email_verification_confirmation=opaque-value',
            Origin: 'https://attacker.example.com',
          },
        },
      ),
    );

    expect(mocks.consumeToken).not.toHaveBeenCalled();
    expect(response.headers.get('Location')).toBe(
      'https://app.example.com/en/verify-email?status=invalid',
    );
  });

  it('uses a bounded invalid state when token consumption fails', async () => {
    mocks.consumeToken.mockRejectedValue(new Error('database unavailable'));

    const response = await POST(
      new NextRequest(
        'https://app.example.com/api/auth/verify-email?locale=en',
        {
          method: 'POST',
          headers: {
            Cookie: 'vulcan_email_verification_confirmation=opaque-value',
            Origin: 'https://app.example.com',
          },
        },
      ),
    );

    expect(response.headers.get('Location')).toBe(
      'https://app.example.com/en/verify-email?status=invalid',
    );
    expect(mocks.recordEvent).toHaveBeenCalledWith(
      'auth.email_verification.unexpected_error',
      { reason: 'token_consumption' },
    );
  });
});
