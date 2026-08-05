import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  authForEmailVerification: vi.fn(),
  findUser: vi.fn(),
  recordEvent: vi.fn(),
  sendVerification: vi.fn(),
}));

vi.mock('next/headers', () => ({
  headers: vi.fn(async () => new Headers()),
}));

vi.mock('@/auth', () => ({
  authForEmailVerification: mocks.authForEmailVerification,
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
  '@/server/auth/email-verification/send-email-verification.service',
  () => ({
    sendEmailVerificationChallenge: mocks.sendVerification,
  }),
);

import { resendEmailVerificationAction } from './resend-email-verification.action';
import { initialResendEmailVerificationActionState } from './resend-email-verification.state';

function createFormData(locale = 'fr') {
  const formData = new FormData();
  formData.set('locale', locale);
  return formData;
}

describe('resendEmailVerificationAction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.authForEmailVerification.mockResolvedValue({
      user: { id: 'user-1' },
    });
    mocks.findUser.mockResolvedValue({
      email: 'william@example.com',
      emailVerifiedAt: null,
      preferences: {
        locale: 'en',
      },
    });
    mocks.sendVerification.mockResolvedValue({
      retryAfterSeconds: 0,
      status: 'sent',
    });
  });

  it('requires an authenticated account', async () => {
    mocks.authForEmailVerification.mockResolvedValue(null);

    await expect(
      resendEmailVerificationAction(
        initialResendEmailVerificationActionState,
        createFormData(),
      ),
    ).resolves.toEqual({ status: 'unauthorized' });
    expect(mocks.findUser).not.toHaveBeenCalled();
  });

  it('does not send another message for a verified account', async () => {
    mocks.findUser.mockResolvedValue({
      email: 'william@example.com',
      emailVerifiedAt: new Date(),
      preferences: {
        locale: 'en',
      },
    });

    await expect(
      resendEmailVerificationAction(
        initialResendEmailVerificationActionState,
        createFormData(),
      ),
    ).resolves.toEqual({ status: 'alreadyVerified' });
    expect(mocks.sendVerification).not.toHaveBeenCalled();
  });

  it('uses the requested locale and maps delivery status', async () => {
    await expect(
      resendEmailVerificationAction(
        initialResendEmailVerificationActionState,
        createFormData('fr'),
      ),
    ).resolves.toEqual({ status: 'sent' });
    expect(mocks.sendVerification).toHaveBeenCalledWith({
      email: 'william@example.com',
      headers: expect.any(Headers),
      locale: 'fr',
      userId: 'user-1',
    });
  });

  it('returns an unexpected state when delivery infrastructure throws', async () => {
    mocks.sendVerification.mockRejectedValue(new Error('database unavailable'));

    await expect(
      resendEmailVerificationAction(
        initialResendEmailVerificationActionState,
        createFormData(),
      ),
    ).resolves.toEqual({ status: 'unexpected' });
    expect(mocks.recordEvent).toHaveBeenCalledWith(
      'auth.email_verification.unexpected_error',
      {
        reason: 'resend_action',
        userId: 'user-1',
      },
    );
  });
});
