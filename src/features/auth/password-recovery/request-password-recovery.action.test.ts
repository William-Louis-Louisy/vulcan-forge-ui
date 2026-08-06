import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  after: vi.fn(),
  consumeRateLimit: vi.fn(),
  findUser: vi.fn(),
  recordEvent: vi.fn(),
  sendChallenge: vi.fn(),
}));

vi.mock('next/server', () => ({
  after: mocks.after,
}));

vi.mock('next/headers', () => ({
  headers: vi.fn(async () => new Headers()),
}));

vi.mock('@/server/auth/auth-rate-limit', () => ({
  consumeAuthRateLimit: mocks.consumeRateLimit,
}));

vi.mock('@/server/auth/auth-security-events', () => ({
  recordAuthSecurityEvent: mocks.recordEvent,
}));

vi.mock('@/server/db/prisma', () => ({
  prisma: {
    user: {
      findUnique: mocks.findUser,
    },
  },
}));

vi.mock(
  '@/server/auth/password-recovery/send-password-recovery.service',
  () => ({
    sendPasswordRecoveryChallenge: mocks.sendChallenge,
  }),
);

import { requestPasswordRecoveryAction } from './request-password-recovery.action';
import { initialRequestPasswordRecoveryActionState } from './request-password-recovery.state';

function createForm(email: string) {
  const formData = new FormData();
  formData.set('email', email);
  return formData;
}

describe('requestPasswordRecoveryAction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.consumeRateLimit.mockResolvedValue({
      allowed: true,
      accountFingerprint: 'account-fingerprint',
      context: {
        ipFingerprint: null,
        requestId: 'request-1',
      },
      retryAfterSeconds: 0,
    });
    mocks.after.mockImplementation((callback: () => unknown) => callback());
    mocks.findUser.mockResolvedValue(null);
    mocks.sendChallenge.mockResolvedValue({ status: 'sent' });
  });

  it('returns the same submitted state for a nonexistent account', async () => {
    await expect(
      requestPasswordRecoveryAction(
        initialRequestPasswordRecoveryActionState,
        createForm('missing@example.com'),
      ),
    ).resolves.toEqual({
      fieldErrors: {},
      status: 'submitted',
      values: { email: '' },
    });
    expect(mocks.sendChallenge).not.toHaveBeenCalled();
  });

  it('returns the same state while scheduling delivery for an existing account', async () => {
    mocks.findUser.mockResolvedValue({
      email: 'william@example.com',
      id: 'user-1',
      preferences: { locale: 'fr' },
    });

    await expect(
      requestPasswordRecoveryAction(
        initialRequestPasswordRecoveryActionState,
        createForm('William@Example.com'),
      ),
    ).resolves.toEqual({
      fieldErrors: {},
      status: 'submitted',
      values: { email: '' },
    });
    expect(mocks.sendChallenge).toHaveBeenCalledWith({
      email: 'william@example.com',
      locale: 'fr',
      userId: 'user-1',
    });
  });

  it('keeps throttling invisible in the public response', async () => {
    mocks.consumeRateLimit.mockResolvedValue({
      allowed: false,
      accountFingerprint: 'account-fingerprint',
      context: {
        ipFingerprint: null,
        requestId: 'request-1',
      },
      retryAfterSeconds: 60,
    });

    await expect(
      requestPasswordRecoveryAction(
        initialRequestPasswordRecoveryActionState,
        createForm('william@example.com'),
      ),
    ).resolves.toMatchObject({ status: 'submitted' });
    expect(mocks.after).not.toHaveBeenCalled();
  });

  it('returns a field error for malformed email input', async () => {
    await expect(
      requestPasswordRecoveryAction(
        initialRequestPasswordRecoveryActionState,
        createForm('not-an-email'),
      ),
    ).resolves.toMatchObject({
      fieldErrors: { email: ['emailInvalid'] },
      status: 'error',
    });
  });
});
