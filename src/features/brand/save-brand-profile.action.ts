'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';

import { auth } from '@/auth';
import { brandProfileSchema } from '@/domain/design-system';
import { resolveLocalizedStringWithFallback } from '@/domain/i18n';
import type { Prisma } from '@/generated/prisma/client';
import { prisma } from '@/server/db/prisma';
import type { SaveBrandProfileActionState } from './save-brand-profile.state';

const saveBrandProfilePayloadSchema = z.object({
  productName: z.string().trim().min(2).max(80),
  profile: brandProfileSchema,
});

function getFormStringValue(formData: FormData, key: string): string {
  const value = formData.get(key);

  return typeof value === 'string' ? value : '';
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

export async function saveBrandProfileAction(
  _previousState: SaveBrandProfileActionState,
  formData: FormData,
): Promise<SaveBrandProfileActionState> {
  const projectSlug = getFormStringValue(formData, 'projectSlug');
  const rawPayload = getFormStringValue(formData, 'payload');
  const session = await auth();

  if (!session?.user?.id) {
    return {
      status: 'error',
      formError: 'unauthorized',
      savedProductName: null,
      savedProfile: null,
    };
  }

  const parsedPayload = saveBrandProfilePayloadSchema.safeParse(
    parseJsonPayload(rawPayload),
  );

  if (!parsedPayload.success) {
    return {
      status: 'error',
      formError: 'invalidPayload',
      savedProductName: null,
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
      defaultLocale: true,
    },
  });

  if (!project) {
    return {
      status: 'error',
      formError: 'projectNotFound',
      savedProductName: null,
      savedProfile: null,
    };
  }

  const { productName, profile } = parsedPayload.data;
  const shortDescription = resolveLocalizedStringWithFallback({
    localizedString: profile.localizedContent.shortDescription ?? {},
    locale: project.defaultLocale,
    fallbackLocale: project.defaultLocale,
  }).value;

  try {
    await prisma.$transaction([
      prisma.designSystemProject.update({
        where: {
          id: project.id,
        },
        data: {
          name: productName,
          description: shortDescription || null,
        },
      }),
      prisma.brandProfile.upsert({
        where: {
          projectId: project.id,
        },
        create: {
          projectId: project.id,
          visualStyle: profile.visualStyle,
          uiDensity: profile.uiDensity,
          inspirationKeywords: profile.inspirationKeywords,
          localizedContent: toInputJsonValue(profile.localizedContent),
        },
        update: {
          visualStyle: profile.visualStyle,
          uiDensity: profile.uiDensity,
          inspirationKeywords: profile.inspirationKeywords,
          localizedContent: toInputJsonValue(profile.localizedContent),
        },
      }),
    ]);

    revalidatePath('/[locale]/app', 'page');
    revalidatePath('/[locale]/app/projects/[projectSlug]', 'page');
    revalidatePath('/[locale]/app/projects/[projectSlug]/brand', 'page');
    revalidatePath(
      '/[locale]/app/projects/[projectSlug]/documentation',
      'page',
    );
    revalidatePath(
      '/[locale]/app/projects/[projectSlug]/ai-instructions',
      'page',
    );
    revalidatePath('/[locale]/app/projects/[projectSlug]/exports', 'page');

    return {
      status: 'success',
      formError: null,
      savedProductName: productName,
      savedProfile: profile,
    };
  } catch {
    return {
      status: 'error',
      formError: 'unexpected',
      savedProductName: null,
      savedProfile: null,
    };
  }
}
