'use server';

import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/server/db/prisma';
import type { Prisma } from '@/generated/prisma/client';
import {
  componentContractSchema,
  componentContractTypeSchema,
  getLegacyComponentCategory,
  mvpComponentContractSeeds,
} from '@/domain/design-system';
import { defaultAppLocale, isAppLocale } from '@/domain/i18n';
import type {
  CreateComponentContractActionState,
  DeleteComponentContractActionState,
} from './component-contract-crud.state';

function getFormStringValue(formData: FormData, key: string): string {
  const value = formData.get(key);

  return typeof value === 'string' ? value : '';
}

function getActionLocale(formData: FormData) {
  const rawLocale = getFormStringValue(formData, 'locale');

  return isAppLocale(rawLocale) ? rawLocale : defaultAppLocale;
}

function toInputJsonValue(value: unknown): Prisma.InputJsonValue {
  return value as Prisma.InputJsonValue;
}

async function findAuthorizedProjectId({
  userId,
  projectSlug,
}: {
  userId: string;
  projectSlug: string;
}) {
  const project = await prisma.designSystemProject.findFirst({
    where: {
      slug: projectSlug,
      workspace: {
        members: {
          some: {
            userId,
          },
        },
      },
    },
    select: {
      id: true,
    },
  });

  return project?.id ?? null;
}

export async function createComponentContractAction(
  _previousState: CreateComponentContractActionState,
  formData: FormData,
): Promise<CreateComponentContractActionState> {
  const locale = getActionLocale(formData);
  const projectSlug = getFormStringValue(formData, 'projectSlug');
  const parsedType = componentContractTypeSchema.safeParse(
    getFormStringValue(formData, 'componentType'),
  );
  const session = await auth();

  if (!session?.user?.id) {
    return {
      status: 'error',
      error: 'unauthorized',
      componentType: null,
    };
  }

  if (!projectSlug || !parsedType.success) {
    return {
      status: 'error',
      error: 'invalidPayload',
      componentType: null,
    };
  }

  const projectId = await findAuthorizedProjectId({
    userId: session.user.id,
    projectSlug,
  });

  if (!projectId) {
    return {
      status: 'error',
      error: 'projectNotFound',
      componentType: null,
    };
  }

  const seed = mvpComponentContractSeeds.find(
    (candidate) => candidate.type === parsedType.data,
  );
  const parsedContract = componentContractSchema.safeParse(seed);

  if (!parsedContract.success) {
    return {
      status: 'error',
      error: 'unexpected',
      componentType: null,
    };
  }

  const existingComponent = await prisma.componentContract.findUnique({
    where: {
      projectId_key: {
        projectId,
        key: parsedType.data,
      },
    },
    select: {
      id: true,
    },
  });

  if (existingComponent) {
    return {
      status: 'error',
      error: 'componentAlreadyExists',
      componentType: null,
    };
  }

  try {
    await prisma.componentContract.create({
      data: {
        projectId,
        key: parsedContract.data.type,
        templateKey: parsedContract.data.type,
        category: getLegacyComponentCategory(parsedContract.data.type),
        contractVersion: 1,
        type: parsedContract.data.type,
        name: parsedContract.data.name,
        contract: toInputJsonValue(parsedContract.data),
      },
    });

    revalidatePath(`/${locale}/app/projects/${projectSlug}/components`);

    return {
      status: 'success',
      error: null,
      componentType: parsedContract.data.type,
    };
  } catch {
    return {
      status: 'error',
      error: 'unexpected',
      componentType: null,
    };
  }
}

export async function deleteComponentContractAction(
  _previousState: DeleteComponentContractActionState,
  formData: FormData,
): Promise<DeleteComponentContractActionState> {
  const locale = getActionLocale(formData);
  const projectSlug = getFormStringValue(formData, 'projectSlug');
  const parsedType = componentContractTypeSchema.safeParse(
    getFormStringValue(formData, 'componentType'),
  );
  const session = await auth();

  if (!session?.user?.id) {
    return {
      status: 'error',
      error: 'unauthorized',
    };
  }

  if (!projectSlug || !parsedType.success) {
    return {
      status: 'error',
      error: 'invalidPayload',
    };
  }

  const projectId = await findAuthorizedProjectId({
    userId: session.user.id,
    projectSlug,
  });

  if (!projectId) {
    return {
      status: 'error',
      error: 'projectNotFound',
    };
  }

  try {
    const deleted = await prisma.componentContract.deleteMany({
      where: {
        projectId,
        key: parsedType.data,
      },
    });

    if (deleted.count === 0) {
      return {
        status: 'error',
        error: 'componentNotFound',
      };
    }

    revalidatePath(`/${locale}/app/projects/${projectSlug}/components`);

    return {
      status: 'success',
      error: null,
    };
  } catch {
    return {
      status: 'error',
      error: 'unexpected',
    };
  }
}
