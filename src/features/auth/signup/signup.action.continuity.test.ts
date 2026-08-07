import { beforeEach, describe, expect, it, vi } from 'vitest';
import { signupAction } from './signup.action';
import { initialSignupActionState } from './signup.state';

const mocks = vi.hoisted(() => ({
  assertPasswordIsAcceptable: vi.fn(),
  consumeRateLimit: vi.fn(),
  createUser: vi.fn(),
  createWorkspace: vi.fn(),
  hashPassword: vi.fn(),
  recordEvent: vi.fn(),
  resetRateLimit: vi.fn(),
  sendVerification: vi.fn(),
  signIn: vi.fn(),
  transaction: vi.fn(),
}));

vi.mock('next/headers', () => ({
  headers: vi.fn(async () => new Headers()),
}));

vi.mock('@/auth', () => ({
  signIn: mocks.signIn,
}));

vi.mock('@/server/db/prisma', () => ({
  prisma: {
    $transaction: mocks.transaction,
  },
}));

vi.mock('@/server/auth/auth-rate-limit', () => ({
  consumeAuthRateLimit: mocks.consumeRateLimit,
  resetAuthAccountRateLimit: mocks.resetRateLimit,
}));

vi.mock('@/server/auth/auth-security-events', () => ({
  recordAuthSecurityEvent: mocks.recordEvent,
}));

vi.mock(
  '@/server/auth/email-verification/send-email-verification.service',
  () => ({
    sendEmailVerificationChallenge: mocks.sendVerification,
  }),
);

vi.mock('@/server/auth/password/password.service', () => ({
  assertPasswordIsAcceptable: mocks.assertPasswordIsAcceptable,
  hashPassword: mocks.hashPassword,
}));

function createSignupFormData({
  locale,
  returnTo,
}: {
  locale: 'en' | 'fr';
  returnTo: string;
}) {
  const formData = new FormData();
  formData.set('locale', locale);
  formData.set('returnTo', returnTo);
  formData.set('name', 'William');
  formData.set('email', 'william@example.com');
  formData.set('password', 'strong-password-123');
  formData.set('passwordConfirmation', 'strong-password-123');
  return formData;
}

beforeEach(() => {
  vi.clearAllMocks();
  mocks.consumeRateLimit.mockResolvedValue({
    allowed: true,
    accountFingerprint: 'account-fingerprint',
    context: {
      ipFingerprint: 'ip-fingerprint',
      requestId: 'request-id',
    },
    retryAfterSeconds: 0,
  });
  mocks.assertPasswordIsAcceptable.mockResolvedValue('strong-password-123');
  mocks.hashPassword.mockResolvedValue('password-hash');
  mocks.resetRateLimit.mockResolvedValue(undefined);
  mocks.sendVerification.mockResolvedValue({
    retryAfterSeconds: 0,
    status: 'sent',
  });
  mocks.createUser.mockResolvedValue({ id: 'user-1', name: 'William' });
  mocks.createWorkspace.mockResolvedValue({ id: 'workspace-1' });
  mocks.transaction.mockImplementation(
    async (
      callback: (transaction: {
        user: { create: typeof mocks.createUser };
        workspace: { create: typeof mocks.createWorkspace };
      }) => Promise<string>,
    ) =>
      callback({
        user: { create: mocks.createUser },
        workspace: { create: mocks.createWorkspace },
      }),
  );
});

describe('signupAction journey continuity', () => {
  it('creates a localized French workspace and preserves a safe destination', async () => {
    const returnTo = '/fr/app/projects/project-1/tokens?set=color';

    await signupAction(
      initialSignupActionState,
      createSignupFormData({ locale: 'fr', returnTo }),
    );

    expect(mocks.createWorkspace).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          name: 'Espace de travail de William',
        }),
      }),
    );
    expect(mocks.signIn).toHaveBeenCalledWith('credentials', {
      email: 'william@example.com',
      password: 'strong-password-123',
      redirectTo: returnTo,
    });
  });

  it('creates an English workspace and rejects an external destination', async () => {
    await signupAction(
      initialSignupActionState,
      createSignupFormData({
        locale: 'en',
        returnTo: 'https://example.com/en/app',
      }),
    );

    expect(mocks.createWorkspace).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          name: "William's workspace",
        }),
      }),
    );
    expect(mocks.signIn).toHaveBeenCalledWith(
      'credentials',
      expect.objectContaining({
        redirectTo: '/en/app',
      }),
    );
  });
});
