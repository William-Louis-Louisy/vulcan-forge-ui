'use server';

import { z } from 'zod';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import type { Prisma } from '@/generated/prisma/client';
import { prisma } from '@/server/db/prisma';
import { defaultAppLocale, isAppLocale } from '@/domain/i18n';
import {
  componentContractV2Schema,
  componentKeySchema,
  componentVisualOverridesSchema,
  componentVisualPropertiesSchema,
  resolveStoredComponentTemplateContract,
} from '@/domain/design-system';
import type { UpdateButtonVisualCustomizationActionState } from './update-button-visual-customization.state';

const buttonVisualCustomizationPayloadSchema = z
  .object({
    visual: componentVisualPropertiesSchema,
    overrides: componentVisualOverridesSchema,
  })
  .strict();

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
    return JSON.parse(value) as unknown;
  } catch {
    return null;
  }
}

function toInputJsonValue(value: unknown): Prisma.InputJsonValue {
  return value as Prisma.InputJsonValue;
}

export async function updateButtonVisualCustomizationAction(
  _previousState: UpdateButtonVisualCustomizationActionState,
  formData: FormData,
): Promise<UpdateButtonVisualCustomizationActionState> {
  const locale = getActionLocale(formData);
  const projectSlug = getFormStringValue(formData, 'projectSlug');
  const parsedComponentKey = componentKeySchema.safeParse(
    getFormStringValue(formData, 'componentKey'),
  );
  const parsedPayload = buttonVisualCustomizationPayloadSchema.safeParse(
    parseJsonPayload(getFormStringValue(formData, 'visualCustomization')),
  );

  if (!parsedComponentKey.success || !parsedPayload.success) {
    return {
      status: 'error',
      formError: 'invalidPayload',
      savedContract: null,
    };
  }

  const session = await auth();

  if (!session?.user?.id) {
    return {
      status: 'error',
      formError: 'unauthorized',
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
    select: { id: true },
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
    const { template, contract } = resolveStoredComponentTemplateContract({
      contractVersion: storedContract.contractVersion,
      key: storedContract.key,
      name: storedContract.name,
      templateKey: storedContract.templateKey,
      category: storedContract.category,
      contract: storedContract.contract,
    });

    if (template.key !== 'button') {
      return {
        status: 'error',
        formError: 'invalidContract',
        savedContract: null,
      };
    }

    const nextContract = componentContractV2Schema.parse({
      ...contract,
      visual: parsedPayload.data.visual,
      overrides: parsedPayload.data.overrides,
    });

    await prisma.componentContract.update({
      where: {
        projectId_key: {
          projectId: project.id,
          key: storedContract.key,
        },
      },
      data: {
        contractVersion: 2,
        name: nextContract.name,
        templateKey: nextContract.templateKey,
        category: nextContract.category,
        contract: toInputJsonValue(nextContract),
      },
    });

    revalidatePath(`/${locale}/app/projects/${projectSlug}/components`);

    return {
      status: 'success',
      formError: null,
      savedContract: nextContract,
    };
  } catch {
    return {
      status: 'error',
      formError: 'unexpected',
      savedContract: null,
    };
  }
}
