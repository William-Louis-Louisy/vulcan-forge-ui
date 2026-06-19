'use server';

import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/server/db/prisma';
import type { Prisma } from '@/generated/prisma/client';
import { pathToTokenReference } from '@/domain/design-system';
import { createThemeColorTokenOptions } from './themes-editor.utils';
import { updateThemeTokenReferenceSchema } from './theme-token-reference.schema';
import type { UpdateThemeTokenReferenceActionState } from './update-theme-token-reference.state';

function getFormStringValue(formData: FormData, key: string): string {
  const value = formData.get(key);

  return typeof value === 'string' ? value : '';
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function cloneJsonObject(value: unknown): Prisma.InputJsonObject {
  if (!isRecord(value)) {
    return {};
  }

  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonObject;
}

function mergeThemeTokenReference({
  tokens,
  colorKey,
  tokenPath,
}: {
  tokens: unknown;
  colorKey: string;
  tokenPath: string;
}): Prisma.InputJsonObject {
  const nextTokens = cloneJsonObject(tokens);
  const currentColorTokens = isRecord(nextTokens.color)
    ? (JSON.parse(JSON.stringify(nextTokens.color)) as Prisma.InputJsonObject)
    : {};

  return {
    ...nextTokens,
    color: {
      ...currentColorTokens,
      [colorKey]: pathToTokenReference(tokenPath),
    },
  };
}

export async function updateThemeTokenReferenceAction(
  _previousState: UpdateThemeTokenReferenceActionState,
  formData: FormData,
): Promise<UpdateThemeTokenReferenceActionState> {
  const parsedPayload = updateThemeTokenReferenceSchema.safeParse({
    locale: getFormStringValue(formData, 'locale'),
    projectSlug: getFormStringValue(formData, 'projectSlug'),
    themeId: getFormStringValue(formData, 'themeId'),
    colorKey: getFormStringValue(formData, 'colorKey'),
    tokenPath: getFormStringValue(formData, 'tokenPath'),
  });

  if (!parsedPayload.success) {
    return {
      status: 'error',
      formError: 'invalidPayload',
    };
  }

  const session = await auth();

  if (!session?.user?.id) {
    return {
      status: 'error',
      formError: 'unauthorized',
    };
  }

  const theme = await prisma.theme.findFirst({
    where: {
      id: parsedPayload.data.themeId,
      project: {
        slug: parsedPayload.data.projectSlug,
        workspace: {
          members: {
            some: {
              userId: session.user.id,
            },
          },
        },
      },
    },
    select: {
      id: true,
      tokens: true,
      project: {
        select: {
          tokenSets: {
            where: {
              type: 'color',
            },
            select: {
              tokens: true,
            },
            take: 1,
          },
        },
      },
    },
  });

  if (!theme) {
    return {
      status: 'error',
      formError: 'themeNotFound',
    };
  }

  const colorTokenOptions = createThemeColorTokenOptions(
    theme.project.tokenSets[0]?.tokens ?? [],
  );

  const selectedTokenExists = colorTokenOptions.some(
    (option) => option.path === parsedPayload.data.tokenPath,
  );

  if (!selectedTokenExists) {
    return {
      status: 'error',
      formError: 'invalidTokenReference',
    };
  }

  try {
    await prisma.theme.update({
      where: {
        id: theme.id,
      },
      data: {
        tokens: mergeThemeTokenReference({
          tokens: theme.tokens,
          colorKey: parsedPayload.data.colorKey,
          tokenPath: parsedPayload.data.tokenPath,
        }),
      },
    });

    revalidatePath(
      `/${parsedPayload.data.locale}/app/projects/${parsedPayload.data.projectSlug}/themes`,
    );

    revalidatePath(
      `/${parsedPayload.data.locale}/app/projects/${parsedPayload.data.projectSlug}/exports`,
    );

    return {
      status: 'success',
      formError: null,
    };
  } catch {
    return {
      status: 'error',
      formError: 'unexpected',
    };
  }
}
