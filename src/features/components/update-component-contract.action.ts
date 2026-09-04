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
  componentKeySchema,
  resolveStoredComponentTemplateContract,
} from '@/domain/design-system';
import { mergeLegacySemanticContractIntoV2 } from './component-v2-semantic-compatibility.utils';

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
  const parsedComponentKey = componentKeySchema.safeParse(
    getFormStringValue(formData, 'componentKey'),
  );

  const session = await auth();

  if (!session?.user?.id) {
    return {
      status: 'error',
      formError: 'unauthorized',
      savedContract: null,
    };
  }

  const parsedType = componentContractTypeSchema.safeParse(rawType);

  if (!parsedType.success || !parsedComponentKey.success) {
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

  const storedContract = await prisma.componentContract.findUnique({
    where: {
      projectId_key: {
        projectId: project.id,
        key: parsedComponentKey.data,
      },
    },
    select: {
      key: true,
      name: true,
      templateKey: true,
      category: true,
      contractVersion: true,
      contract: true,
    },
  });

  if (!storedContract) {
    return {
      status: 'error',
      formError: 'componentContractNotFound',
      savedContract: null,
    };
  }

  try {
    if (storedContract.contractVersion === 2) {
      const { template, contract: currentContractV2 } =
        resolveStoredComponentTemplateContract({
          contractVersion: storedContract.contractVersion,
          key: storedContract.key,
          name: storedContract.name,
          templateKey: storedContract.templateKey,
          category: storedContract.category,
          contract: storedContract.contract,
        });

      if (template.legacyType !== parsedType.data) {
        return {
          status: 'error',
          formError: 'invalidContract',
          savedContract: null,
        };
      }

      const nextContractV2 = mergeLegacySemanticContractIntoV2(
        currentContractV2,
        parsedContract.data,
      );

      await prisma.componentContract.update({
        where: {
          projectId_key: {
            projectId: project.id,
            key: storedContract.key,
          },
        },
        data: {
          name: nextContractV2.name,
          contract: toInputJsonValue(nextContractV2),
        },
      });
    } else {
      await prisma.componentContract.update({
        where: {
          projectId_key: {
            projectId: project.id,
            key: storedContract.key,
          },
        },
        data: {
          name: parsedContract.data.name,
          contract: toInputJsonValue(parsedContract.data),
        },
      });
    }

    revalidatePath(`/${locale}/app/projects/${projectSlug}/components`);

    return {
      status: 'success',
      formError: null,
      savedContract: parsedContract.data,
    };
  } catch {
    return {
      status: 'error',
      formError: 'unexpected',
      savedContract: null,
    };
  }
}
