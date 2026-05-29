'use server';

import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/server/db/prisma';
import type { Prisma } from '@/generated/prisma/client';
import { defaultAppLocale, isAppLocale } from '@/domain/i18n';
import type { UpdateComponentContractActionState } from './update-component-contract.state';
import {
  componentContractSchema,
  componentContractTypeSchema,
} from '@/domain/design-system';

function getFormStringValue(formData: FormData, key: string): string {
  const value = formData.get(key);

  return typeof value === 'string' ? value : '';
}

function getActionLocale(formData: FormData) {
  const rawLocale = getFormStringValue(formData, 'locale');

  return isAppLocale(rawLocale) ? rawLocale : defaultAppLocale;
}

function parseJsonPayload(value: string): unknown {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function toInputJsonValue(value: unknown): Prisma.InputJsonValue {
  return value as Prisma.InputJsonValue;
}

export async function updateComponentContractAction(
  _previousState: UpdateComponentContractActionState,
  formData: FormData,
): Promise<UpdateComponentContractActionState> {
  const locale = getActionLocale(formData);
  const projectSlug = getFormStringValue(formData, 'projectSlug');
  const rawType = getFormStringValue(formData, 'componentType');
  const rawContract = getFormStringValue(formData, 'contract');

  const session = await auth();

  if (!session?.user?.id) {
    return {
      status: 'error',
      formError: 'unauthorized',
      savedContract: null,
    };
  }

  const parsedType = componentContractTypeSchema.safeParse(rawType);

  if (!parsedType.success) {
    return {
      status: 'error',
      formError: 'invalidPayload',
      savedContract: null,
    };
  }

  const parsedPayload = parseJsonPayload(rawContract);

  if (!parsedPayload) {
    return {
      status: 'error',
      formError: 'invalidPayload',
      savedContract: null,
    };
  }

  const parsedContract = componentContractSchema.safeParse(parsedPayload);

  if (!parsedContract.success || parsedContract.data.type !== parsedType.data) {
    return {
      status: 'error',
      formError: 'invalidContract',
      savedContract: null,
    };
  }

  const project = await prisma.designSystemProject.findFirst({
    where: {
      slug: projectSlug,
      workspace: {
        members: {
          some: {
            userId: session.user.id,
          },
        },
      },
    },
    select: {
      id: true,
    },
  });

  if (!project) {
    return {
      status: 'error',
      formError: 'projectNotFound',
      savedContract: null,
    };
  }

  try {
    const updatedContract = await prisma.componentContract.update({
      where: {
        projectId_type: {
          projectId: project.id,
          type: parsedType.data,
        },
      },
      data: {
        name: parsedContract.data.name,
        contract: toInputJsonValue(parsedContract.data),
      },
      select: {
        contract: true,
      },
    });

    const reparsedContract = componentContractSchema.safeParse(
      updatedContract.contract,
    );

    if (!reparsedContract.success) {
      return {
        status: 'error',
        formError: 'unexpected',
        savedContract: null,
      };
    }

    revalidatePath(`/${locale}/app/design-systems/${projectSlug}/components`);

    return {
      status: 'success',
      formError: null,
      savedContract: reparsedContract.data,
    };
  } catch {
    return {
      status: 'error',
      formError: 'componentContractNotFound',
      savedContract: null,
    };
  }
}
