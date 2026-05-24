'use server';

import { z } from 'zod';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/server/db/prisma';
import type { Prisma } from '@/generated/prisma/client';
import { defaultAppLocale, isAppLocale } from '@/domain/i18n';
import { designTokenSchema, type DesignToken } from '@/domain/design-system';
import { isHexColorValue, pathToTokenReference } from './tokens-editor.utils';
import type {
  UpdateSemanticColorTokenActionState,
  UpdateSemanticColorTokenField,
} from './update-semantic-color-token.state';
import {
  updateSemanticColorTokenSchema,
  type UpdateSemanticColorTokenValidationMessageKey,
} from './semantic-color-token.schema';

const designTokenArraySchema = z.array(designTokenSchema);

function getFormStringValue(formData: FormData, key: string): string {
  const value = formData.get(key);

  return typeof value === 'string' ? value : '';
}

function normalizeFieldErrors(
  fieldErrors: Record<string, string[] | undefined>,
): UpdateSemanticColorTokenActionState['fieldErrors'] {
  const normalizedErrors: Partial<
    Record<
      UpdateSemanticColorTokenField,
      UpdateSemanticColorTokenValidationMessageKey[]
    >
  > = {};

  if (fieldErrors.referencePath?.length) {
    normalizedErrors.referencePath =
      fieldErrors.referencePath as UpdateSemanticColorTokenValidationMessageKey[];
  }

  return normalizedErrors;
}

function getActionLocale(formData: FormData) {
  const rawLocale = getFormStringValue(formData, 'locale');

  return isAppLocale(rawLocale) ? rawLocale : defaultAppLocale;
}

function toInputJsonValue(value: unknown): Prisma.InputJsonValue {
  return value as Prisma.InputJsonValue;
}

function isSemanticColorToken(token: DesignToken) {
  return token.type === 'color' && token.path.startsWith('color.semantic.');
}

function isPrimitiveColorToken(token: DesignToken) {
  return (
    token.type === 'color' &&
    token.path.startsWith('color.primitive.') &&
    typeof token.value === 'string' &&
    isHexColorValue(token.value)
  );
}

export async function updateSemanticColorTokenAction(
  _previousState: UpdateSemanticColorTokenActionState,
  formData: FormData,
): Promise<UpdateSemanticColorTokenActionState> {
  const locale = getActionLocale(formData);
  const projectSlug = getFormStringValue(formData, 'projectSlug');
  const tokenPath = getFormStringValue(formData, 'tokenPath');

  const values = {
    referencePath: getFormStringValue(formData, 'referencePath'),
  };

  const session = await auth();

  if (!session?.user?.id) {
    return {
      status: 'error',
      fieldErrors: {},
      formError: 'unauthorized',
      values,
    };
  }

  const parsed = updateSemanticColorTokenSchema.safeParse(values);

  if (!parsed.success) {
    return {
      status: 'error',
      fieldErrors: normalizeFieldErrors(parsed.error.flatten().fieldErrors),
      formError: null,
      values,
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
      fieldErrors: {},
      formError: 'projectNotFound',
      values,
    };
  }

  const colorTokenSet = await prisma.tokenSet.findFirst({
    where: {
      projectId: project.id,
      type: 'color',
    },
    select: {
      id: true,
      tokens: true,
    },
  });

  if (!colorTokenSet) {
    return {
      status: 'error',
      fieldErrors: {},
      formError: 'tokenSetNotFound',
      values,
    };
  }

  const parsedTokens = designTokenArraySchema.safeParse(colorTokenSet.tokens);

  if (!parsedTokens.success) {
    return {
      status: 'error',
      fieldErrors: {},
      formError: 'tokenSetMalformed',
      values,
    };
  }

  const semanticTokenIndex = parsedTokens.data.findIndex(
    (token) => token.path === tokenPath,
  );

  if (semanticTokenIndex < 0) {
    return {
      status: 'error',
      fieldErrors: {},
      formError: 'tokenNotFound',
      values,
    };
  }

  const semanticToken = parsedTokens.data[semanticTokenIndex];

  if (!semanticToken || !isSemanticColorToken(semanticToken)) {
    return {
      status: 'error',
      fieldErrors: {},
      formError: 'notSemanticColorToken',
      values,
    };
  }

  const primitiveToken = parsedTokens.data.find(
    (token) => token.path === parsed.data.referencePath,
  );

  if (!primitiveToken) {
    return {
      status: 'error',
      fieldErrors: {},
      formError: 'aliasNotFound',
      values,
    };
  }

  if (!isPrimitiveColorToken(primitiveToken)) {
    return {
      status: 'error',
      fieldErrors: {},
      formError: 'aliasInvalid',
      values,
    };
  }

  const nextReference = pathToTokenReference(parsed.data.referencePath);

  const nextTokens = parsedTokens.data.map((token, index) =>
    index === semanticTokenIndex
      ? {
          ...token,
          value: nextReference,
          reference: nextReference,
        }
      : token,
  );

  try {
    await prisma.tokenSet.update({
      where: {
        id: colorTokenSet.id,
      },
      data: {
        tokens: toInputJsonValue(nextTokens),
      },
      select: {
        id: true,
      },
    });

    revalidatePath(`/${locale}/app/design-systems/${projectSlug}/tokens`);

    return {
      status: 'success',
      fieldErrors: {},
      formError: null,
      values: parsed.data,
    };
  } catch {
    return {
      status: 'error',
      fieldErrors: {},
      formError: 'unexpected',
      values,
    };
  }
}
