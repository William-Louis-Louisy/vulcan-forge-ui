import { beforeEach, describe, expect, it, vi } from 'vitest';

import { initialUpdateAccountProfileActionState } from './update-account-profile.state';
import { updateAccountProfileAction } from './update-account-profile.action';

const mocks = vi.hoisted(() => ({
  auth: vi.fn(),
  compare: vi.fn(),
  findUnique: vi.fn(),
  revalidatePath: vi.fn(),
  signOut: vi.fn(),
  update: vi.fn(),
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

vi.mock('bcryptjs', () => ({
  default: {
    compare: mocks.compare,
  },
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
    expect(mocks.compare).not.toHaveBeenCalled();
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

  it('updates the email and signs out after password verification', async () => {
    mocks.findUnique
      .mockResolvedValueOnce({
        email: 'william@example.com',
        passwordHash: 'hash',
      })
      .mockResolvedValueOnce(null);
    mocks.compare.mockResolvedValue(true);
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

    expect(mocks.compare).toHaveBeenCalledWith('correct-password', 'hash');
    expect(mocks.signOut).toHaveBeenCalledWith({
      redirectTo: '/fr/login?emailUpdated=1',
    });
    expect(result.status).toBe('success');
  });

  it('rejects an email already used by another account', async () => {
    mocks.findUnique
      .mockResolvedValueOnce({
        email: 'william@example.com',
        passwordHash: 'hash',
      })
      .mockResolvedValueOnce({ id: 'user-2' });
    mocks.compare.mockResolvedValue(true);

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
