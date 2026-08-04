import { beforeEach, describe, expect, it, vi } from 'vitest';

import { deleteAccountAction } from './delete-account.action';
import { initialDeleteAccountActionState } from './delete-account.state';

const mocks = vi.hoisted(() => ({
  auth: vi.fn(),
  deleteUser: vi.fn(),
  findUnique: vi.fn(),
  signOut: vi.fn(),
  verifyPassword: vi.fn(),
}));

vi.mock('@/auth', () => ({
  auth: mocks.auth,
  signOut: mocks.signOut,
}));

vi.mock('@/server/db/prisma', () => ({
  prisma: {
    user: {
      delete: mocks.deleteUser,
      findUnique: mocks.findUnique,
    },
  },
}));

vi.mock('@/server/auth/password/password.service', () => ({
  verifyPassword: mocks.verifyPassword,
}));

function createFormData(values: {
  confirmationEmail: string;
  currentPassword: string;
  locale?: string;
}) {
  const formData = new FormData();
  formData.set('confirmationEmail', values.confirmationEmail);
  formData.set('currentPassword', values.currentPassword);
  formData.set('locale', values.locale ?? 'en');
  return formData;
}

describe('deleteAccountAction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.auth.mockResolvedValue({ user: { id: 'user-1' } });
    mocks.findUnique.mockResolvedValue({
      email: 'william@example.com',
      passwordHash: 'hash',
    });
    mocks.deleteUser.mockResolvedValue({});
    mocks.signOut.mockResolvedValue(undefined);
    mocks.verifyPassword.mockResolvedValue({
      needsRehash: false,
      scheme: 'argon2id',
      valid: true,
    });
  });

  it('rejects a confirmation email that does not match the account', async () => {
    const result = await deleteAccountAction(
      initialDeleteAccountActionState,
      createFormData({
        confirmationEmail: 'other@example.com',
        currentPassword: 'correct-password',
      }),
    );

    expect(result.formError).toBe('confirmationEmailMismatch');
    expect(mocks.verifyPassword).not.toHaveBeenCalled();
    expect(mocks.deleteUser).not.toHaveBeenCalled();
  });

  it('rejects an incorrect current password', async () => {
    mocks.verifyPassword.mockResolvedValue({
      needsRehash: false,
      scheme: 'argon2id',
      valid: false,
    });

    const result = await deleteAccountAction(
      initialDeleteAccountActionState,
      createFormData({
        confirmationEmail: 'william@example.com',
        currentPassword: 'wrong-password',
      }),
    );

    expect(result.formError).toBe('currentPasswordIncorrect');
    expect(mocks.deleteUser).not.toHaveBeenCalled();
  });

  it('deletes the authenticated user after modern password verification', async () => {
    await deleteAccountAction(
      initialDeleteAccountActionState,
      createFormData({
        confirmationEmail: 'william@example.com',
        currentPassword: 'correct-password',
        locale: 'fr',
      }),
    );

    expect(mocks.verifyPassword).toHaveBeenCalledWith(
      'correct-password',
      'hash',
    );
    expect(mocks.deleteUser).toHaveBeenCalledWith({
      where: { id: 'user-1' },
    });
    expect(mocks.signOut).toHaveBeenCalledWith({
      redirectTo: '/fr?accountDeleted=1',
    });
  });
});
