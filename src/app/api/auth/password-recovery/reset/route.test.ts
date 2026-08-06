import type * as NextServer from 'next/server';
import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PasswordCompromisedError } from '@/server/auth/password/password.errors';

const mocks = vi.hoisted(() => ({
  after: vi.fn(),
  applyRecovery: vi.fn(),
  assertAcceptable: vi.fn(),
  consumeRateLimit: vi.fn(),
  hashPassword: vi.fn(),
  recordEvent: vi.fn(),
  sendNotification: vi.fn(),
}));

vi.mock('next/server', async (importOriginal) => {
  const actual = await importOriginal<typeof NextServer>();

  return {
    ...actual,
    after: mocks.after,
  };
});

vi.mock('@/server/auth/auth-rate-limit', () => ({
  consumeAuthRateLimit: mocks.consumeRateLimit,
}));

vi.mock('@/server/auth/auth-security-events', () => ({
  recordAuthSecurityEvent: mocks.recordEvent,
}));

vi.mock('@/server/auth/password/password.service', () => ({
  assertPasswordIsAcceptable: mocks.assertAcceptable,
  hashPassword: mocks.hashPassword,
}));

vi.mock('@/server/auth/password-recovery/password-recovery.service', () => ({
  applyPasswordRecovery: mocks.applyRecovery,
}));

vi.mock(
  '@/server/auth/password-recovery/send-password-recovery.service',
  () => ({
    sendPasswordChangedNotification: mocks.sendNotification,
  }),
);

import { POST } from './route';

function createRequest({
  origin = 'https://app.example.com',
  password = 'A sufficiently long password',
  passwordConfirmation = password,
}: {
  origin?: string;
  password?: string;
  passwordConfirmation?: string;
} = {}) {
  return new NextRequest(
    'https://app.example.com/api/auth/password-recovery/reset',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: 'vulcan_password_recovery_confirmation=opaque-token',
        Origin: origin,
      },
      body: JSON.stringify({ password, passwordConfirmation }),
    },
  );
}

describe('password recovery reset route', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.after.mockImplementation((callback: () => unknown) => callback());
    mocks.consumeRateLimit.mockResolvedValue({
      allowed: true,
      accountFingerprint: 'token-fingerprint',
      context: {
        ipFingerprint: null,
        requestId: 'request-1',
      },
      retryAfterSeconds: 0,
    });
    mocks.assertAcceptable.mockResolvedValue('A sufficiently long password');
    mocks.hashPassword.mockResolvedValue('argon2id-hash');
    mocks.applyRecovery.mockResolvedValue({
      email: 'william@example.com',
      locale: 'fr',
      status: 'reset',
      userId: 'user-1',
    });
    mocks.sendNotification.mockResolvedValue(undefined);
  });

  it('changes the password and clears the prepared token', async () => {
    const response = await POST(createRequest());

    await expect(response.json()).resolves.toEqual({ status: 'reset' });
    expect(mocks.applyRecovery).toHaveBeenCalledWith({
      passwordHash: 'argon2id-hash',
      token: 'opaque-token',
    });
    expect(response.headers.get('Set-Cookie')).toContain('Max-Age=0');
    expect(mocks.sendNotification).toHaveBeenCalledWith({
      email: 'william@example.com',
      locale: 'fr',
      userId: 'user-1',
    });
  });

  it('rejects cross-origin reset submissions', async () => {
    const response = await POST(
      createRequest({ origin: 'https://attacker.example.com' }),
    );

    await expect(response.json()).resolves.toEqual({ status: 'invalid' });
    expect(mocks.applyRecovery).not.toHaveBeenCalled();
  });

  it('returns bounded password validation errors', async () => {
    const response = await POST(
      createRequest({
        password: 'short',
        passwordConfirmation: 'short',
      }),
    );

    await expect(response.json()).resolves.toMatchObject({
      fieldErrors: { password: ['passwordMinLength'] },
      status: 'error',
    });
    expect(mocks.assertAcceptable).not.toHaveBeenCalled();
  });

  it('rejects a compromised replacement password without consuming the token', async () => {
    mocks.assertAcceptable.mockRejectedValue(new PasswordCompromisedError(42));

    const response = await POST(createRequest());

    await expect(response.json()).resolves.toEqual({
      fieldErrors: { password: ['passwordCompromised'] },
      status: 'error',
    });
    expect(mocks.applyRecovery).not.toHaveBeenCalled();
  });

  it('keeps a valid challenge available when reset attempts are rate limited', async () => {
    mocks.consumeRateLimit.mockResolvedValue({
      allowed: false,
      accountFingerprint: 'token-fingerprint',
      context: {
        ipFingerprint: null,
        requestId: 'request-1',
      },
      retryAfterSeconds: 60,
    });

    const response = await POST(createRequest());

    await expect(response.json()).resolves.toEqual({
      status: 'rateLimited',
    });
    expect(response.headers.get('Set-Cookie')).toBeNull();
    expect(mocks.applyRecovery).not.toHaveBeenCalled();
  });
});
