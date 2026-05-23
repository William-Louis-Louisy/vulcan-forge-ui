'use server';

import { z } from 'zod';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/server/db/prisma';
import { isTokenSetType } from './tokens-editor.utils';
import type { Prisma } from '@/generated/prisma/client';
import { designTokenSchema } from '@/domain/design-system';
import { defaultAppLocale, isAppLocale } from '@/domain/i18n';
import type {
  UpdateTokenDescriptionActionState,
  UpdateTokenDescriptionField,
} from './update-token-description.state';
import {
  updateTokenDescriptionSchema,
  type UpdateTokenDescriptionValidationMessageKey,
} from './token-description.schema';

const designTokenArraySchema = z.array(designTokenSchema);

function getFormStringValue(formData: FormData, key: string): string {
  const value = formData.get(key);

  return typeof value === 'string' ? value : '';
}

function normalizeFieldErrors(
  fieldErrors: Record<string, string[] | undefined>,
): UpdateTokenDescriptionActionState['fieldErrors'] {
  const normalizedErrors: Partial<
    Record<
      UpdateTokenDescriptionField,
      UpdateTokenDescriptionValidationMessageKey[]
    >
  > = {};

  if (fieldErrors.descriptionEn?.length) {
    normalizedErrors.descriptionEn =
      fieldErrors.descriptionEn as UpdateTokenDescriptionValidationMessageKey[];
  }

  if (fieldErrors.descriptionFr?.length) {
    normalizedErrors.descriptionFr =
      fieldErrors.descriptionFr as UpdateTokenDescriptionValidationMessageKey[];
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

function createTokenDescription({
  descriptionEn,
  descriptionFr,
}: {
  descriptionEn: string;
  descriptionFr: string;
}) {
  const description: {
    en?: string;
    fr?: string;
  } = {};

  if (descriptionEn.trim().length > 0) {
    description.en = descriptionEn.trim();
  }

  if (descriptionFr.trim().length > 0) {
    description.fr = descriptionFr.trim();
  }

  return Object.keys(description).length > 0 ? description : undefined;
}

export async function updateTokenDescriptionAction(
  _previousState: UpdateTokenDescriptionActionState,
  formData: FormData,
): Promise<UpdateTokenDescriptionActionState> {
  const locale = getActionLocale(formData);
  const projectSlug = getFormStringValue(formData, 'projectSlug');
  const tokenSetType = getFormStringValue(formData, 'tokenSetType');
  const tokenPath = getFormStringValue(formData, 'tokenPath');

  const values = {
    descriptionEn: getFormStringValue(formData, 'descriptionEn'),
    descriptionFr: getFormStringValue(formData, 'descriptionFr'),
  };

  if (!isTokenSetType(tokenSetType)) {
    return {
      status: 'error',
      fieldErrors: {},
      formError: 'tokenSetNotFound',
      values,
    };
  }

  const session = await auth();

  if (!session?.user?.id) {
    return {
      status: 'error',
      fieldErrors: {},
      formError: 'unauthorized',
      values,
    };
  }

  const parsed = updateTokenDescriptionSchema.safeParse(values);

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

  const tokenSet = await prisma.tokenSet.findFirst({
    where: {
      projectId: project.id,
      type: tokenSetType,
    },
    select: {
      id: true,
      tokens: true,
    },
  });

  if (!tokenSet) {
    return {
      status: 'error',
      fieldErrors: {},
      formError: 'tokenSetNotFound',
      values,
    };
  }

  const parsedTokens = designTokenArraySchema.safeParse(tokenSet.tokens);

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

  const nextDescription = createTokenDescription(parsed.data);

  const nextTokens = parsedTokens.data.map((token, index) => {
    if (index !== tokenIndex) {
      return token;
    }

    if (!nextDescription) {
      const { description: _description, ...tokenWithoutDescription } = token;
      return tokenWithoutDescription;
    }

    return {
      ...token,
      description: nextDescription,
    };
  });

  try {
    await prisma.tokenSet.update({
      where: {
        id: tokenSet.id,
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
