import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  consumeToken: vi.fn(),
  inspectToken: vi.fn(),
  recordEvent: vi.fn(),
}));

vi.mock('@/server/auth/auth-security-events', () => ({
  recordAuthSecurityEvent: mocks.recordEvent,
}));

vi.mock('@/server/auth/email-verification/email-verification.service', () => ({
  consumeEmailVerificationToken: mocks.consumeToken,
  inspectEmailVerificationToken: mocks.inspectToken,
}));

import { GET, POST } from './route';

describe('email verification route', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.inspectToken.mockResolvedValue({
      expiresAt: new Date('2099-01-01T00:00:00.000Z'),
      status: 'confirm',
      userId: 'user-1',
    });
    mocks.consumeToken.mockResolvedValue({
      status: 'verified',
      userId: 'user-1',
    });
  });

  it('inspects an email link without consuming it on GET', async () => {
    const response = await GET(
      new NextRequest(
        'https://app.example.com/api/auth/verify-email?locale=fr&token=opaque-value',
      ),
    );

    expect(mocks.inspectToken).toHaveBeenCalledWith({
      token: 'opaque-value',
    });
    expect(mocks.consumeToken).not.toHaveBeenCalled();
    expect(response.status).toBe(303);
    expect(response.headers.get('Location')).toBe(
      'https://app.example.com/fr/verify-email?status=confirm',
    );
    expect(response.headers.get('Location')).not.toContain('opaque-value');
    expect(response.headers.get('Set-Cookie')).toContain(
      'vulcan_email_verification_confirmation=opaque-value',
    );
    expect(response.headers.get('Set-Cookie')).toContain('HttpOnly');
    expect(response.headers.get('Cache-Control')).toBe('no-store, max-age=0');
    expect(response.headers.get('Pragma')).toBe('no-cache');
    expect(response.headers.get('Referrer-Policy')).toBe('no-referrer');
    expect(mocks.recordEvent).toHaveBeenCalledWith(
      'auth.email_verification.link_opened',
      { userId: 'user-1' },
    );
  });

  it('consumes the pending token only after a same-origin POST', async () => {
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

  it('uses a bounded invalid state when token inspection fails', async () => {
    mocks.inspectToken.mockRejectedValue(new Error('database unavailable'));

    const response = await GET(
      new NextRequest(
        'https://app.example.com/api/auth/verify-email?locale=unknown&token=opaque-value',
      ),
    );

    expect(response.headers.get('Location')).toBe(
      'https://app.example.com/en/verify-email?status=invalid',
    );
    expect(mocks.recordEvent).toHaveBeenCalledWith(
      'auth.email_verification.unexpected_error',
      { reason: 'token_inspection' },
    );
  });
});
