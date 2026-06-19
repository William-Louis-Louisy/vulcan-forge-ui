'use server';

import { auth } from '@/auth';
import {
  aiInstructionProfileContentSchema,
  type AiInstructionProfileContent,
} from './ai-instruction-profile.schema';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/server/db/prisma';
import type { Prisma } from '@/generated/prisma/client';
import { defaultAppLocale, isAppLocale } from '@/domain/i18n';
import type { SaveAiInstructionProfileActionState } from './save-ai-instruction-profile.state';

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
  value: AiInstructionProfileContent,
): Prisma.InputJsonValue {
  return value as Prisma.InputJsonValue;
}

export async function saveAiInstructionProfileAction(
  _previousState: SaveAiInstructionProfileActionState,
  formData: FormData,
): Promise<SaveAiInstructionProfileActionState> {
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
    aiInstructionProfileContentSchema.safeParse(parsedPayload);

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
    await prisma.aiInstructionProfile.upsert({
      where: {
        projectId: project.id,
      },
      create: {
        projectId: project.id,
        content: toInputJsonValue(parsedProfile.data),
      },
      update: {
        content: toInputJsonValue(parsedProfile.data),
      },
    });

    revalidatePath(`/${locale}/app/projects/${projectSlug}/ai-instructions`);

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
