'use server';

import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import { type DesignToken } from '@/domain/design-system';
import { defaultAppLocale, isAppLocale } from '@/domain/i18n';

import {
  getEditableTokenSetForUser,
  parseStoredTokenSetTokens,
  saveValidatedTokenSetTokens,
} from './token-set-save.service';
import type {
  UpdatePrimitiveColorTokenActionState,
  UpdatePrimitiveColorTokenField,
} from './update-primitive-color-token.state';
import {
  updatePrimitiveColorTokenSchema,
  type UpdatePrimitiveColorTokenValidationMessageKey,
} from './primitive-color-token.schema';

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

  const tokenSetResult = await getEditableTokenSetForUser({
    userId: session.user.id,
    projectSlug,
    tokenSetType: 'color',
  });

  if (tokenSetResult.status === 'error') {
    return {
      status: 'error',
      fieldErrors: {},
      formError: tokenSetResult.error,
      values,
    };
  }

  const parsedTokensResult = parseStoredTokenSetTokens(
    tokenSetResult.tokenSet.tokens,
  );

  if (parsedTokensResult.status === 'error') {
    return {
      status: 'error',
      fieldErrors: {},
      formError: parsedTokensResult.error,
      values,
    };
  }

  const tokenIndex = parsedTokensResult.tokens.findIndex(
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

  const token = parsedTokensResult.tokens[tokenIndex];

  if (!token || !isPrimitiveColorToken(token)) {
    return {
      status: 'error',
      fieldErrors: {},
      formError: 'notPrimitiveColorToken',
      values,
    };
  }

  const nextTokens = parsedTokensResult.tokens.map((currentToken, index) =>
    index === tokenIndex
      ? {
          ...currentToken,
          value: parsed.data.value,
        }
      : currentToken,
  );

  const saveResult = await saveValidatedTokenSetTokens({
    tokenSetId: tokenSetResult.tokenSet.id,
    tokens: nextTokens,
  });

  if (saveResult.status === 'error') {
    return {
      status: 'error',
      fieldErrors: {},
      formError: saveResult.error,
      values,
    };
  }

  revalidatePath(`/${locale}/app/projects/${projectSlug}/tokens`);

  return {
    status: 'success',
    fieldErrors: {},
    formError: null,
    values: {
      value: parsed.data.value,
    },
  };
}
