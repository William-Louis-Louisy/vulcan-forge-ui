import { CredentialsSignin } from '@auth/core/errors';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  PasswordCompromisedError,
  PasswordCompromiseCheckUnavailableError,
  PasswordHashingUnavailableError,
} from '@/server/auth/password/password.errors';

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
    expect(mocks.assertPasswordIsAcceptable).not.toHaveBeenCalled();
    expect(mocks.hashPassword).not.toHaveBeenCalled();
    expect(mocks.transaction).not.toHaveBeenCalled();
  });

  it('rejects a compromised password before hashing and persistence', async () => {
    mocks.assertPasswordIsAcceptable.mockRejectedValue(
      new PasswordCompromisedError(42),
    );

    const result = await signupAction(
      initialSignupActionState,
      createSignupFormData(),
    );

    expect(result.fieldErrors.password).toEqual(['passwordCompromised']);
    expect(result.formError).toBeNull();
    expect(mocks.hashPassword).not.toHaveBeenCalled();
    expect(mocks.transaction).not.toHaveBeenCalled();
    expect(mocks.recordEvent).toHaveBeenCalledWith(
      'auth.signup.password_compromised',
      expect.objectContaining({ occurrenceCount: 42 }),
    );
  });

  it('fails closed when the compromised-password check is unavailable', async () => {
    mocks.assertPasswordIsAcceptable.mockRejectedValue(
      new PasswordCompromiseCheckUnavailableError(),
    );

    const result = await signupAction(
      initialSignupActionState,
      createSignupFormData(),
    );

    expect(result.formError).toBe('passwordCheckUnavailable');
    expect(mocks.hashPassword).not.toHaveBeenCalled();
    expect(mocks.transaction).not.toHaveBeenCalled();
  });

  it('surfaces an unavailable Argon2id runtime without creating an account', async () => {
    mocks.hashPassword.mockRejectedValue(new PasswordHashingUnavailableError());

    const result = await signupAction(
      initialSignupActionState,
      createSignupFormData(),
    );

    expect(result.formError).toBe('passwordHashingUnavailable');
    expect(mocks.transaction).not.toHaveBeenCalled();
  });

  it('stores the Argon2id hash returned by the password service', async () => {
    await signupAction(initialSignupActionState, createSignupFormData());

    expect(mocks.assertPasswordIsAcceptable).toHaveBeenCalledWith(
      'strong-password-123',
    );
    expect(mocks.hashPassword).toHaveBeenCalledWith('strong-password-123');
    expect(mocks.createUser).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          passwordHash: 'password-hash',
        }),
      }),
    );
  });

  it('sends a verification challenge and redirects to the workspace', async () => {
    await signupAction(initialSignupActionState, createSignupFormData());

    expect(mocks.sendVerification).toHaveBeenCalledWith({
      email: 'william@example.com',
      headers: expect.any(Headers),
      locale: 'en',
      userId: 'user-1',
    });
    expect(mocks.signIn).toHaveBeenCalledWith('credentials', {
      email: 'william@example.com',
      password: 'strong-password-123',
      redirectTo: '/en/app',
    });
  });

  it('keeps the account usable when initial verification delivery is unavailable', async () => {
    mocks.sendVerification.mockResolvedValue({
      retryAfterSeconds: 0,
      status: 'deliveryUnavailable',
    });

    await signupAction(initialSignupActionState, createSignupFormData());

    expect(mocks.signIn).toHaveBeenCalledWith(
      'credentials',
      expect.objectContaining({
        redirectTo: '/en/app',
      }),
    );
  });

  it('maps a concurrent unique-email race to a neutral signup state', async () => {
    mocks.transaction.mockRejectedValue({ code: 'P2002' });

    const result = await signupAction(
      initialSignupActionState,
      createSignupFormData(),
    );

    expect(result.formError).toBe('signupUnavailable');
    expect(mocks.sendVerification).not.toHaveBeenCalled();
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
