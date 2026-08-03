import { CredentialsSignin } from '@auth/core/errors';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  consumeRateLimit: vi.fn(),
  createUser: vi.fn(),
  createWorkspace: vi.fn(),
  hashPassword: vi.fn(),
  recordEvent: vi.fn(),
  resetRateLimit: vi.fn(),
  signIn: vi.fn(),
  transaction: vi.fn(),
}));

vi.mock('bcryptjs', () => ({
  default: {
    hash: mocks.hashPassword,
  },
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

import { signupAction } from './signup.action';
import { initialSignupActionState } from './signup.state';

const allowedRateLimit = {
  allowed: true,
  accountFingerprint: 'account-fingerprint',
  context: {
    ipFingerprint: 'ip-fingerprint',
    requestId: 'request-id',
  },
  retryAfterSeconds: 0,
};

function createSignupFormData() {
  const formData = new FormData();
  formData.set('locale', 'en');
  formData.set('name', 'William');
  formData.set('email', 'william@example.com');
  formData.set('password', 'strong-password-123');
  formData.set('passwordConfirmation', 'strong-password-123');
  return formData;
}

beforeEach(() => {
  vi.clearAllMocks();
  mocks.consumeRateLimit.mockResolvedValue(allowedRateLimit);
  mocks.hashPassword.mockResolvedValue('password-hash');
  mocks.resetRateLimit.mockResolvedValue(undefined);
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

describe('signupAction', () => {
  it('returns a cooldown state before password and database work', async () => {
    mocks.consumeRateLimit.mockResolvedValue({
      ...allowedRateLimit,
      allowed: false,
      retryAfterSeconds: 120,
    });

    const result = await signupAction(
      initialSignupActionState,
      createSignupFormData(),
    );

    expect(result.formError).toBe('rateLimited');
    expect(mocks.hashPassword).not.toHaveBeenCalled();
    expect(mocks.transaction).not.toHaveBeenCalled();
  });

  it('maps a concurrent unique-email race to a neutral signup state', async () => {
    mocks.transaction.mockRejectedValue({ code: 'P2002' });

    const result = await signupAction(
      initialSignupActionState,
      createSignupFormData(),
    );

    expect(result.formError).toBe('signupUnavailable');
    expect(mocks.signIn).not.toHaveBeenCalled();
  });

  it('provides a recoverable state when account creation commits but sign-in fails', async () => {
    mocks.signIn.mockRejectedValue(new CredentialsSignin());

    const result = await signupAction(
      initialSignupActionState,
      createSignupFormData(),
    );

    expect(result.formError).toBe('accountCreatedSignInFailed');
    expect(mocks.resetRateLimit).toHaveBeenCalledWith({
      accountIdentifier: 'william@example.com',
      operation: 'signup',
    });
    expect(mocks.recordEvent).toHaveBeenCalledWith(
      'auth.signup.sign_in_failed',
      expect.objectContaining({ userId: 'user-1' }),
    );
  });
});
