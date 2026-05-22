'use server';

import { z } from 'zod';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/server/db/prisma';
import type { Prisma } from '@/generated/prisma/client';
import { defaultAppLocale, isAppLocale } from '@/domain/i18n';
import { designTokenSchema, type DesignToken } from '@/domain/design-system';
import type {
  UpdatePrimitiveColorTokenActionState,
  UpdatePrimitiveColorTokenField,
} from './update-primitive-color-token.state';
import {
  updatePrimitiveColorTokenSchema,
  type UpdatePrimitiveColorTokenValidationMessageKey,
} from './primitive-color-token.schema';

const designTokenArraySchema = z.array(designTokenSchema);

function getFormStringValue(formData: FormData, key: string): string {
  const value = formData.get(key);

  return typeof value === 'string' ? value : '';
}

function normalizeFieldErrors(
  fieldErrors: Record<string, string[] | undefined>,
): UpdatePrimitiveColorTokenActionState['fieldErrors'] {
  const normalizedErrors: Partial<
    Record<
      UpdatePrimitiveColorTokenField,
      UpdatePrimitiveColorTokenValidationMessageKey[]
    >
  > = {};

  if (fieldErrors.value?.length) {
    normalizedErrors.value =
      fieldErrors.value as UpdatePrimitiveColorTokenValidationMessageKey[];
  }

  return normalizedErrors;
}

function getActionLocale(formData: FormData) {
  const rawLocale = getFormStringValue(formData, 'locale');

  return isAppLocale(rawLocale) ? rawLocale : defaultAppLocale;
}

function isPrimitiveColorToken(token: DesignToken) {
  return (
    token.type === 'color' &&
    token.path.startsWith('color.primitive.') &&
    !token.reference
  );
}

function toInputJsonValue(value: unknown): Prisma.InputJsonValue {
  return value as Prisma.InputJsonValue;
}

export async function updatePrimitiveColorTokenAction(
  _previousState: UpdatePrimitiveColorTokenActionState,
  formData: FormData,
): Promise<UpdatePrimitiveColorTokenActionState> {
  const locale = getActionLocale(formData);
  const projectSlug = getFormStringValue(formData, 'projectSlug');
  const tokenPath = getFormStringValue(formData, 'tokenPath');

  const values = {
    value: getFormStringValue(formData, 'value'),
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

  const parsed = updatePrimitiveColorTokenSchema.safeParse(values);

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
      tokenSets: {
        where: {
          type: 'color',
        },
        select: {
          id: true,
          tokens: true,
        },
        take: 1,
      },
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

  const colorTokenSet = project.tokenSets[0];

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

  const tokenIndex = parsedTokens.data.findIndex(
    (token) => token.path === tokenPath,
  );

  if (tokenIndex < 0) {
    return {
      status: 'error',
      fieldErrors: {},
      formError: 'tokenNotFound',
      values,
    };
  }

  const token = parsedTokens.data[tokenIndex];

  if (!token || !isPrimitiveColorToken(token)) {
    return {
      status: 'error',
      fieldErrors: {},
      formError: 'notPrimitiveColorToken',
      values,
    };
  }

  const nextTokens = parsedTokens.data.map((currentToken, index) =>
    index === tokenIndex
      ? {
          ...currentToken,
          value: parsed.data.value,
        }
      : currentToken,
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
      values: {
        value: parsed.data.value,
      },
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
