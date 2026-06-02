'use server';

import { auth } from '@/auth';
import {
  documentationProfileContentSchema,
  type DocumentationProfileContent,
} from './documentation-profile.schema';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/server/db/prisma';
import type { Prisma } from '@/generated/prisma/client';
import { defaultAppLocale, isAppLocale } from '@/domain/i18n';
import type { SaveDocumentationProfileActionState } from './save-documentation-profile.state';

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

function toInputJsonValue(
  value: DocumentationProfileContent,
): Prisma.InputJsonValue {
  return value as Prisma.InputJsonValue;
}

export async function saveDocumentationProfileAction(
  _previousState: SaveDocumentationProfileActionState,
  formData: FormData,
): Promise<SaveDocumentationProfileActionState> {
  const locale = getActionLocale(formData);
  const projectSlug = getFormStringValue(formData, 'projectSlug');
  const rawProfile = getFormStringValue(formData, 'profile');

  const session = await auth();

  if (!session?.user?.id) {
    return {
      status: 'error',
      formError: 'unauthorized',
      savedProfile: null,
    };
  }

  const parsedPayload = parseJsonPayload(rawProfile);
  const parsedProfile =
    documentationProfileContentSchema.safeParse(parsedPayload);

  if (!parsedProfile.success) {
    return {
      status: 'error',
      formError: 'invalidPayload',
      savedProfile: null,
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
      savedProfile: null,
    };
  }

  try {
    await prisma.documentationProfile.upsert({
      where: {
        projectId: project.id,
      },
      create: {
        projectId: project.id,
        format: parsedProfile.data.format,
        content: toInputJsonValue(parsedProfile.data),
      },
      update: {
        format: parsedProfile.data.format,
        content: toInputJsonValue(parsedProfile.data),
      },
    });

    revalidatePath(
      `/${locale}/app/design-systems/${projectSlug}/documentation`,
    );

    return {
      status: 'success',
      formError: null,
      savedProfile: parsedProfile.data,
    };
  } catch {
    return {
      status: 'error',
      formError: 'unexpected',
      savedProfile: null,
    };
  }
}
