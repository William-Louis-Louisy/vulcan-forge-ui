import { beforeEach, describe, expect, it, vi } from 'vitest';

import { deleteProjectAction } from './delete-project.action';
import { initialDeleteProjectActionState } from './delete-project.state';

const mocks = vi.hoisted(() => ({
  auth: vi.fn(),
  deleteProject: vi.fn(),
  findFirst: vi.fn(),
  redirect: vi.fn(),
  revalidatePath: vi.fn(),
}));

vi.mock('@/auth', () => ({
  auth: mocks.auth,
}));

vi.mock('@/server/db/prisma', () => ({
  prisma: {
    designSystemProject: {
      delete: mocks.deleteProject,
      findFirst: mocks.findFirst,
    },
  },
}));

vi.mock('next/cache', () => ({
  revalidatePath: mocks.revalidatePath,
}));

vi.mock('next/navigation', () => ({
  redirect: mocks.redirect,
}));

function createFormData(values?: {
  confirmationName?: string;
  locale?: string;
  projectId?: string;
  projectSlug?: string;
}) {
  const formData = new FormData();
  formData.set('confirmationName', values?.confirmationName ?? 'Aurora');
  formData.set('locale', values?.locale ?? 'en');
  formData.set('projectId', values?.projectId ?? 'project-1');
  formData.set('projectSlug', values?.projectSlug ?? 'aurora');
  return formData;
}

describe('deleteProjectAction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.auth.mockResolvedValue({ user: { id: 'owner-1' } });
    mocks.findFirst.mockResolvedValue({ id: 'project-1', name: 'Aurora' });
    mocks.deleteProject.mockResolvedValue({});
  });

  it('rejects unauthenticated deletion requests', async () => {
    mocks.auth.mockResolvedValue(null);

    const result = await deleteProjectAction(
      initialDeleteProjectActionState,
      createFormData(),
    );

    expect(result.formError).toBe('unauthorized');
    expect(mocks.findFirst).not.toHaveBeenCalled();
    expect(mocks.deleteProject).not.toHaveBeenCalled();
  });

  it('authorizes deletion through workspace ownership', async () => {
    await deleteProjectAction(
      initialDeleteProjectActionState,
      createFormData(),
    );

    expect(mocks.findFirst).toHaveBeenCalledWith({
      where: {
        id: 'project-1',
        slug: 'aurora',
        workspace: {
          ownerId: 'owner-1',
        },
      },
      select: {
        id: true,
        name: true,
      },
    });
  });

  it('rejects members who do not own the project workspace', async () => {
    mocks.findFirst.mockResolvedValue(null);

    const result = await deleteProjectAction(
      initialDeleteProjectActionState,
      createFormData(),
    );

    expect(result.formError).toBe('forbiddenOrNotFound');
    expect(mocks.deleteProject).not.toHaveBeenCalled();
  });

  it('requires the current project name exactly', async () => {
    const result = await deleteProjectAction(
      initialDeleteProjectActionState,
      createFormData({ confirmationName: 'aurora' }),
    );

    expect(result.fieldErrors.confirmationName).toEqual([
      'confirmationNameMismatch',
    ]);
    expect(result.formError).toBe('confirmationNameMismatch');
    expect(mocks.deleteProject).not.toHaveBeenCalled();
  });

  it('deletes the project, revalidates the dashboard and redirects', async () => {
    await deleteProjectAction(
      initialDeleteProjectActionState,
      createFormData({ locale: 'fr' }),
    );

    expect(mocks.deleteProject).toHaveBeenCalledWith({
      where: {
        id: 'project-1',
      },
    });
    expect(mocks.revalidatePath).toHaveBeenCalledWith('/fr/app');
    expect(mocks.redirect).toHaveBeenCalledWith('/fr/app?projectDeleted=1');
  });
});
