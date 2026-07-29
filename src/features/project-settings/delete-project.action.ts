'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { auth } from '@/auth';
import { prisma } from '@/server/db/prisma';
import { deleteProjectSchema } from './delete-project.schema';
import {
  initialDeleteProjectActionState,
  type DeleteProjectActionState,
} from './delete-project.state';

function getFormStringValue(formData: FormData, key: string): string {
  const value = formData.get(key);

  return typeof value === 'string' ? value : '';
}

export async function deleteProjectAction(
  _previousState: DeleteProjectActionState,
  formData: FormData,
): Promise<DeleteProjectActionState> {
  const parsedPayload = deleteProjectSchema.safeParse({
    confirmationName: getFormStringValue(formData, 'confirmationName'),
    locale: getFormStringValue(formData, 'locale'),
    projectId: getFormStringValue(formData, 'projectId'),
    projectSlug: getFormStringValue(formData, 'projectSlug'),
  });

  if (!parsedPayload.success) {
    return {
      status: 'error',
      fieldErrors: {},
      formError: 'invalidPayload',
    };
  }

  const session = await auth();

  if (!session?.user?.id) {
    return {
      status: 'error',
      fieldErrors: {},
      formError: 'unauthorized',
    };
  }

  try {
    const project = await prisma.designSystemProject.findFirst({
      where: {
        id: parsedPayload.data.projectId,
        slug: parsedPayload.data.projectSlug,
        workspace: {
          ownerId: session.user.id,
        },
      },
      select: {
        id: true,
        name: true,
      },
    });

    if (!project) {
      return {
        status: 'error',
        fieldErrors: {},
        formError: 'forbiddenOrNotFound',
      };
    }

    if (parsedPayload.data.confirmationName !== project.name) {
      return {
        status: 'error',
        fieldErrors: {
          confirmationName: ['confirmationNameMismatch'],
        },
        formError: 'confirmationNameMismatch',
      };
    }

    await prisma.designSystemProject.delete({
      where: {
        id: project.id,
      },
    });
  } catch {
    return {
      status: 'error',
      fieldErrors: {},
      formError: 'unexpected',
    };
  }

  revalidatePath(`/${parsedPayload.data.locale}/app`);
  redirect(`/${parsedPayload.data.locale}/app?projectDeleted=1`);

  return initialDeleteProjectActionState;
}
