import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  consumeToken: vi.fn(),
  recordEvent: vi.fn(),
}));

vi.mock('@/server/auth/auth-security-events', () => ({
  recordAuthSecurityEvent: mocks.recordEvent,
}));

vi.mock(
  '@/server/auth/email-verification/email-verification.service',
  () => ({
    consumeEmailVerificationToken: mocks.consumeToken,
  }),
);

import { GET } from './route';

describe('email verification route', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.consumeToken.mockResolvedValue({
      status: 'verified',
      userId: 'user-1',
    });
  });

  it('consumes the token and redirects without retaining it', async () => {
    const response = await GET(
      new Request(
        'https://app.example.com/api/auth/verify-email?locale=fr&token=opaque-value',
      ),
    );

    expect(mocks.consumeToken).toHaveBeenCalledWith({
      token: 'opaque-value',
    });
    expect(response.status).toBe(303);
    expect(response.headers.get('Location')).toBe(
      'https://app.example.com/fr/verify-email?status=verified',
    );
    expect(response.headers.get('Location')).not.toContain('opaque-value');
    expect(response.headers.get('Cache-Control')).toBe(
      'no-store, max-age=0',
    );
    expect(response.headers.get('Pragma')).toBe('no-cache');
    expect(response.headers.get('Referrer-Policy')).toBe('no-referrer');
    expect(mocks.recordEvent).toHaveBeenCalledWith(
      'auth.email_verification.verified',
      { userId: 'user-1' },
    );
  });

  it('uses a bounded invalid state when token consumption fails', async () => {
    mocks.consumeToken.mockRejectedValue(new Error('database unavailable'));

    const response = await GET(
      new Request(
        'https://app.example.com/api/auth/verify-email?locale=unknown&token=opaque-value',
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
