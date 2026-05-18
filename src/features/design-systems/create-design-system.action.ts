'use server';

import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/server/db/prisma';
import { isAppLocale, defaultAppLocale } from '@/domain/i18n';
import { createDesignSystemSlug } from './design-system-slug';
import {
  createDesignSystemSchema,
  type CreateDesignSystemValidationMessageKey,
} from './create-design-system.schema';
import type { CreateDesignSystemActionState } from './create-design-system.state';

type CreateDesignSystemFieldErrors =
  CreateDesignSystemActionState['fieldErrors'];

function getFormStringValue(formData: FormData, key: string): string {
  const value = formData.get(key);

  return typeof value === 'string' ? value : '';
}

function normalizeFieldErrors(
  fieldErrors: Record<string, string[] | undefined>,
): CreateDesignSystemFieldErrors {
  const normalizedErrors: CreateDesignSystemFieldErrors = {};

  if (fieldErrors.name?.length) {
    normalizedErrors.name =
      fieldErrors.name as CreateDesignSystemValidationMessageKey[];
  }

  if (fieldErrors.description?.length) {
    normalizedErrors.description =
      fieldErrors.description as CreateDesignSystemValidationMessageKey[];
  }

  if (fieldErrors.defaultLocale?.length) {
    normalizedErrors.defaultLocale =
      fieldErrors.defaultLocale as CreateDesignSystemValidationMessageKey[];
  }

  if (fieldErrors.platforms?.length) {
    normalizedErrors.platforms =
      fieldErrors.platforms as CreateDesignSystemValidationMessageKey[];
  }

  if (fieldErrors.supportedLocales?.length) {
    normalizedErrors.supportedLocales =
      fieldErrors.supportedLocales as CreateDesignSystemValidationMessageKey[];
  }

  if (fieldErrors.visualDirection?.length) {
    normalizedErrors.visualDirection =
      fieldErrors.visualDirection as CreateDesignSystemValidationMessageKey[];
  }

  if (fieldErrors.accessibilityTarget?.length) {
    normalizedErrors.accessibilityTarget =
      fieldErrors.accessibilityTarget as CreateDesignSystemValidationMessageKey[];
  }

  return normalizedErrors;
}

function getActionLocale(formData: FormData) {
  const rawLocale = getFormStringValue(formData, 'locale');

  return isAppLocale(rawLocale) ? rawLocale : defaultAppLocale;
}

export async function createDesignSystemAction(
  _previousState: CreateDesignSystemActionState,
  formData: FormData,
): Promise<CreateDesignSystemActionState> {
  const locale = getActionLocale(formData);
  const session = await auth();

  const values = {
    name: getFormStringValue(formData, 'name'),
    description: getFormStringValue(formData, 'description'),
    platforms: formData
      .getAll('platforms')
      .filter((value): value is string => typeof value === 'string'),
    defaultLocale: getFormStringValue(formData, 'defaultLocale'),
    supportedLocales: formData
      .getAll('supportedLocales')
      .filter((value): value is string => typeof value === 'string'),
    visualDirection: getFormStringValue(formData, 'visualDirection'),
    accessibilityTarget: getFormStringValue(formData, 'accessibilityTarget'),
  };

  if (!session?.user?.id) {
    return {
      status: 'error',
      fieldErrors: {},
      formError: 'unauthorized',
      values,
    };
  }

  const parsed = createDesignSystemSchema.safeParse(values);

  if (!parsed.success) {
    return {
      status: 'error',
      fieldErrors: normalizeFieldErrors(parsed.error.flatten().fieldErrors),
      formError: null,
      values,
    };
  }

  const membership = await prisma.workspaceMember.findFirst({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      createdAt: 'asc',
    },
    select: {
      workspaceId: true,
    },
  });

  if (!membership) {
    return {
      status: 'error',
      fieldErrors: {},
      formError: 'missingWorkspace',
      values,
    };
  }

  const slug = createDesignSystemSlug(parsed.data.name);

  const existingDesignSystem = await prisma.designSystem.findUnique({
    where: {
      workspaceId_slug: {
        workspaceId: membership.workspaceId,
        slug,
      },
    },
    select: {
      id: true,
    },
  });

  if (existingDesignSystem) {
    return {
      status: 'error',
      fieldErrors: {},
      formError: 'slugAlreadyUsed',
      values,
    };
  }

  try {
    await prisma.designSystem.create({
      data: {
        workspaceId: membership.workspaceId,
        name: parsed.data.name,
        slug,
        description: parsed.data.description,
        platforms: parsed.data.platforms,
        defaultLocale: parsed.data.defaultLocale,
        supportedLocales: parsed.data.supportedLocales,
        visualDirection: parsed.data.visualDirection,
        accessibilityTarget: parsed.data.accessibilityTarget,
      },
      select: {
        id: true,
      },
    });
  } catch {
    return {
      status: 'error',
      fieldErrors: {},
      formError: 'unexpected',
      values,
    };
  }

  redirect(`/${locale}/app/design-systems`);
}
