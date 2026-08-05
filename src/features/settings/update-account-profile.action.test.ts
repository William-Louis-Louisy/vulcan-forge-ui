import { beforeEach, describe, expect, it, vi } from 'vitest';

import { initialUpdateAccountProfileActionState } from './update-account-profile.state';
import { updateAccountProfileAction } from './update-account-profile.action';

const mocks = vi.hoisted(() => ({
  auth: vi.fn(),
  deleteVerificationTokens: vi.fn(),
  findUnique: vi.fn(),
  recordEvent: vi.fn(),
  revalidatePath: vi.fn(),
  sendVerification: vi.fn(),
  signOut: vi.fn(),
  transaction: vi.fn(),
  update: vi.fn(),
  verifyPassword: vi.fn(),
}));

vi.mock('next/headers', () => ({
  headers: vi.fn(async () => new Headers()),
}));

vi.mock('@/auth', () => ({
  auth: mocks.auth,
  signOut: mocks.signOut,
}));

vi.mock('@/server/auth/auth-security-events', () => ({
  recordAuthSecurityEvent: mocks.recordEvent,
}));

vi.mock('@/server/db/prisma', () => ({
  prisma: {
    $transaction: mocks.transaction,
    emailVerificationToken: {
      deleteMany: mocks.deleteVerificationTokens,
    },
    user: {
      findUnique: mocks.findUnique,
      update: mocks.update,
    },
  },
}));

vi.mock(
  '@/server/auth/email-verification/send-email-verification.service',
  () => ({
    sendEmailVerificationChallenge: mocks.sendVerification,
  }),
);

vi.mock('@/server/auth/password/password.service', () => ({
  verifyPassword: mocks.verifyPassword,
}));

vi.mock('next/cache', () => ({
  revalidatePath: mocks.revalidatePath,
}));

function createFormData(values: {
  name: string;
  email: string;
  currentPassword?: string;
  locale?: string;
}) {
  const formData = new FormData();
  formData.set('name', values.name);
  formData.set('email', values.email);
  formData.set('currentPassword', values.currentPassword ?? '');
  formData.set('locale', values.locale ?? 'en');
  return formData;
}

describe('updateAccountProfileAction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.auth.mockResolvedValue({ user: { id: 'user-1' } });
    mocks.update.mockResolvedValue({});
    mocks.deleteVerificationTokens.mockResolvedValue({ count: 1 });
    mocks.transaction.mockResolvedValue([{}, { count: 1 }]);
    mocks.sendVerification.mockResolvedValue({
      retryAfterSeconds: 0,
      status: 'sent',
    });
    mocks.signOut.mockResolvedValue(undefined);
    mocks.verifyPassword.mockResolvedValue({
      needsRehash: false,
      scheme: 'argon2id',
      valid: true,
    });
  });

  it('updates a display name without requiring a password', async () => {
    mocks.findUnique.mockResolvedValueOnce({
      email: 'william@example.com',
      passwordHash: 'hash',
    });

    const result = await updateAccountProfileAction(
      initialUpdateAccountProfileActionState,
      createFormData({
        name: 'William Updated',
        email: 'william@example.com',
      }),
    );

    expect(result.status).toBe('success');
    expect(mocks.verifyPassword).not.toHaveBeenCalled();
    expect(mocks.update).toHaveBeenCalledWith({
      where: { id: 'user-1' },
      data: {
        name: 'William Updated',
        email: 'william@example.com',
      },
    });
    expect(mocks.transaction).not.toHaveBeenCalled();
    expect(mocks.sendVerification).not.toHaveBeenCalled();
    expect(mocks.signOut).not.toHaveBeenCalled();
  });

  it('requires the current password before changing the email', async () => {
    mocks.findUnique.mockResolvedValueOnce({
      email: 'william@example.com',
      passwordHash: 'hash',
    });

    const result = await updateAccountProfileAction(
      initialUpdateAccountProfileActionState,
      createFormData({
        name: 'William',
        email: 'new@example.com',
      }),
    );

    expect(result.formError).toBe('currentPasswordRequired');
    expect(mocks.update).not.toHaveBeenCalled();
  });

  it('invalidates verification, sends a challenge and signs out after an email change', async () => {
    mocks.findUnique
      .mockResolvedValueOnce({
        email: 'william@example.com',
        passwordHash: 'hash',
      })
      .mockResolvedValueOnce(null);

    const result = await updateAccountProfileAction(
      initialUpdateAccountProfileActionState,
      createFormData({
        name: 'William',
        email: 'new@example.com',
        currentPassword: 'correct-password',
        locale: 'fr',
      }),
    );

    expect(mocks.verifyPassword).toHaveBeenCalledWith(
      'correct-password',
      'hash',
    );
    expect(mocks.update).toHaveBeenCalledWith({
      where: { id: 'user-1' },
      data: {
        name: 'William',
        email: 'new@example.com',
        emailVerifiedAt: null,
      },
    });
    expect(mocks.deleteVerificationTokens).toHaveBeenCalledWith({
      where: { userId: 'user-1' },
    });
    expect(mocks.sendVerification).toHaveBeenCalledWith({
      email: 'new@example.com',
      headers: expect.any(Headers),
      locale: 'fr',
      userId: 'user-1',
    });
    expect(mocks.signOut).toHaveBeenCalledWith({
      redirectTo: '/fr/login?emailUpdated=1',
    });
    expect(result.status).toBe('success');
  });

  it('keeps the completed email change when delivery fails', async () => {
    mocks.findUnique
      .mockResolvedValueOnce({
        email: 'william@example.com',
        passwordHash: 'hash',
      })
      .mockResolvedValueOnce(null);
    mocks.sendVerification.mockRejectedValue(new Error('delivery unavailable'));

    const result = await updateAccountProfileAction(
      initialUpdateAccountProfileActionState,
      createFormData({
        name: 'William',
        email: 'new@example.com',
        currentPassword: 'correct-password',
      }),
    );

    expect(result.status).toBe('success');
    expect(mocks.signOut).toHaveBeenCalled();
    expect(mocks.recordEvent).toHaveBeenCalledWith(
      'auth.email_verification.unexpected_error',
      {
        reason: 'email_change_delivery',
        userId: 'user-1',
      },
    );
  });

  it('rejects an incorrect password from either supported hash scheme', async () => {
    mocks.findUnique.mockResolvedValueOnce({
      email: 'william@example.com',
      passwordHash: 'hash',
    });
    mocks.verifyPassword.mockResolvedValue({
      needsRehash: false,
      scheme: 'argon2id',
      valid: false,
    });

    const result = await updateAccountProfileAction(
      initialUpdateAccountProfileActionState,
      createFormData({
        name: 'William',
        email: 'new@example.com',
        currentPassword: 'wrong-password',
      }),
    );

    expect(result.formError).toBe('currentPasswordIncorrect');
    expect(mocks.update).not.toHaveBeenCalled();
  });

  it('rejects an email already used by another account', async () => {
    mocks.findUnique
      .mockResolvedValueOnce({
        email: 'william@example.com',
        passwordHash: 'hash',
      })
      .mockResolvedValueOnce({ id: 'user-2' });

    const result = await updateAccountProfileAction(
      initialUpdateAccountProfileActionState,
      createFormData({
        name: 'William',
        email: 'used@example.com',
        currentPassword: 'correct-password',
      }),
    );

    expect(result.formError).toBe('emailAlreadyUsed');
    expect(mocks.update).not.toHaveBeenCalled();
  });
});
