'use server';

import { auth } from '@/auth';
import {
  parseStoredTokenSetTokens,
  getEditableTokenSetForUser,
  saveValidatedTokenSetTokens,
} from './token-set-save.service';
import { revalidatePath } from 'next/cache';
import { isTokenSetType } from './tokens-editor.utils';
import { defaultAppLocale, isAppLocale } from '@/domain/i18n';
import { validateTokenValueForType } from './token-value-validation.utils';
import type { UpdateDesignTokenValueActionState } from './update-design-token-value.state';
import {
  createTokenDictionary,
  normalizeTypographySpacingReferences,
  normalizeTypographyTokenValue,
} from '@/domain/design-system';

function getFormStringValue(formData: FormData, key: string): string {
  const value = formData.get(key);

  return typeof value === 'string' ? value : '';
}

function getActionLocale(formData: FormData) {
  const rawLocale = getFormStringValue(formData, 'locale');

  return isAppLocale(rawLocale) ? rawLocale : defaultAppLocale;
}

function createProjectTokenDictionary(
  tokenSets: Array<{
    tokens: unknown;
  }>,
) {
  const projectTokens = tokenSets.flatMap((tokenSet) => {
    const parsedTokensResult = parseStoredTokenSetTokens(tokenSet.tokens);

    return parsedTokensResult.status === 'success'
      ? parsedTokensResult.tokens
      : [];
  });

  return createTokenDictionary(projectTokens);
}

export async function updateDesignTokenValueAction(
  _previousState: UpdateDesignTokenValueActionState,
  formData: FormData,
): Promise<UpdateDesignTokenValueActionState> {
  const locale = getActionLocale(formData);
  const projectSlug = getFormStringValue(formData, 'projectSlug');
  const tokenSetType = getFormStringValue(formData, 'tokenSetType');
  const tokenPath = getFormStringValue(formData, 'tokenPath');

  const values = {
    value: getFormStringValue(formData, 'value'),
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

  const valueError = validateTokenValueForType({
    type: tokenSetType,
    value: values.value,
  });

  if (valueError) {
    return {
      status: 'error',
      fieldErrors: {
        value: [valueError],
      },
      formError: null,
      values,
    };
  }

  const tokenSetResult = await getEditableTokenSetForUser({
    userId: session.user.id,
    projectSlug,
    tokenSetType,
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

  const normalizedTypographyValue =
    tokenSetType === 'typography'
      ? normalizeTypographyTokenValue({ value: values.value })
      : null;

  if (tokenSetType === 'typography' && normalizedTypographyValue === null) {
    return {
      status: 'error',
      fieldErrors: {
        value: ['tokenTypographyValueInvalid'],
      },
      formError: null,
      values,
    };
  }

  const normalizedTypographyReferences = normalizedTypographyValue
    ? normalizeTypographySpacingReferences({
        value: normalizedTypographyValue,
        dictionary: createProjectTokenDictionary(
          tokenSetResult.projectTokenSets,
        ),
      })
    : null;

  if (normalizedTypographyReferences?.status === 'error') {
    return {
      status: 'error',
      fieldErrors: {
        value: ['tokenTypographyValueInvalid'],
      },
      formError: null,
      values,
    };
  }

  const storedValue =
    normalizedTypographyReferences?.status === 'success'
      ? normalizedTypographyReferences.value
      : values.value.trim();

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

  if (!token || token.type !== tokenSetType) {
    return {
      status: 'error',
      fieldErrors: {},
      formError: 'tokenTypeMismatch',
      values,
    };
  }

  const nextTokens = parsedTokensResult.tokens.map((currentToken, index) =>
    index === tokenIndex
      ? {
          ...currentToken,
          value: storedValue,
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
      value: values.value.trim(),
    },
  };
}
