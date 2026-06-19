'use server';

import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import type { DesignToken } from '@/domain/design-system';
import { defaultAppLocale, isAppLocale } from '@/domain/i18n';
import { isHexColorValue, pathToTokenReference } from './tokens-editor.utils';
import {
  getEditableTokenSetForUser,
  parseStoredTokenSetTokens,
  saveValidatedTokenSetTokens,
} from './token-set-save.service';
import type {
  UpdateSemanticColorTokenActionState,
  UpdateSemanticColorTokenField,
} from './update-semantic-color-token.state';
import {
  updateSemanticColorTokenSchema,
  type UpdateSemanticColorTokenValidationMessageKey,
} from './semantic-color-token.schema';

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

  const semanticTokenIndex = parsedTokensResult.tokens.findIndex(
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

  const semanticToken = parsedTokensResult.tokens[semanticTokenIndex];

  if (!semanticToken || !isSemanticColorToken(semanticToken)) {
    return {
      status: 'error',
      fieldErrors: {},
      formError: 'notSemanticColorToken',
      values,
    };
  }

  const primitiveToken = parsedTokensResult.tokens.find(
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

  const nextTokens: DesignToken[] = parsedTokensResult.tokens.map(
    (token, index) =>
      index === semanticTokenIndex
        ? {
            ...token,
            value: nextReference,
            reference: nextReference,
          }
        : token,
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
    values: parsed.data,
  };
}
