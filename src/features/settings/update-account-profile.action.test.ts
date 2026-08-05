import { beforeEach, describe, expect, it, vi } from 'vitest';

import { initialUpdateAccountProfileActionState } from './update-account-profile.state';
import { updateAccountProfileAction } from './update-account-profile.action';

const mocks = vi.hoisted(() => ({
  auth: vi.fn(),
  findUnique: vi.fn(),
  revalidatePath: vi.fn(),
  signOut: vi.fn(),
  update: vi.fn(),
  verifyPassword: vi.fn(),
}));

vi.mock('@/auth', () => ({
  auth: mocks.auth,
  signOut: mocks.signOut,
}));

vi.mock('@/server/db/prisma', () => ({
  prisma: {
    user: {
      findUnique: mocks.findUnique,
      update: mocks.update,
    },
  },
}));

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

  it('updates the email and signs out after Argon2id verification', async () => {
    mocks.findUnique
      .mockResolvedValueOnce({
        email: 'william@example.com',
        passwordHash: 'hash',
      })
      .mockResolvedValueOnce(null);
    mocks.signOut.mockResolvedValue(undefined);

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
    expect(mocks.signOut).toHaveBeenCalledWith({
      redirectTo: '/fr/login?emailUpdated=1',
    });
    expect(result.status).toBe('success');
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
