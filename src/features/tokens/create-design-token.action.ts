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
import {
  createTokenDictionary,
  normalizeTypographySpacingReferences,
  normalizeTypographyTokenValue,
  type DesignTokenType,
} from '@/domain/design-system';
import { createDesignToken } from './create-design-token.utils';
import type { CreateDesignTokenActionState } from './create-design-token.state';

function getFormStringValue(formData: FormData, key: string): string {
  const value = formData.get(key);

  return typeof value === 'string' ? value : '';
}

function getActionLocale(formData: FormData) {
  const rawLocale = getFormStringValue(formData, 'locale');

  return isAppLocale(rawLocale) ? rawLocale : defaultAppLocale;
}

function getDesignTokenType(formData: FormData): DesignTokenType | null {
  const type = getFormStringValue(formData, 'type');

  return isTokenSetType(type) ? type : null;
}

export async function createDesignTokenAction(
  _previousState: CreateDesignTokenActionState,
  formData: FormData,
): Promise<CreateDesignTokenActionState> {
  const locale = getActionLocale(formData);
  const projectSlug = getFormStringValue(formData, 'projectSlug');
  const type = getDesignTokenType(formData);

  const values = {
    path: getFormStringValue(formData, 'path'),
    value: getFormStringValue(formData, 'value'),
    descriptionEn: getFormStringValue(formData, 'descriptionEn'),
    descriptionFr: getFormStringValue(formData, 'descriptionFr'),
  };

  if (!type) {
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

  const tokenSetResult = await getEditableTokenSetForUser({
    userId: session.user.id,
    projectSlug,
    tokenSetType: type,
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

  let valueToCreate = values.value;

  if (type === 'typography') {
    const normalizedTypographyValue = normalizeTypographyTokenValue({
      value: values.value,
    });

    if (!normalizedTypographyValue) {
      return {
        status: 'error',
        fieldErrors: {
          value: ['tokenTypographyValueInvalid'],
        },
        formError: null,
        values,
      };
    }

    const normalizedTypographyReferences =
      normalizeTypographySpacingReferences({
        value: normalizedTypographyValue,
        dictionary: createTokenDictionary(tokenSetResult.projectTokens),
      });

    if (normalizedTypographyReferences.status === 'error') {
      return {
        status: 'error',
        fieldErrors: {
          value: ['tokenTypographyValueInvalid'],
        },
        formError: null,
        values,
      };
    }

    valueToCreate = JSON.stringify(normalizedTypographyReferences.value);
  }

  const createResult = createDesignToken({
    tokens: parsedTokensResult.tokens,
    type,
    path: values.path,
    value: valueToCreate,
    descriptionEn: values.descriptionEn,
    descriptionFr: values.descriptionFr,
  });

  if (createResult.status === 'error') {
    if (createResult.error === 'tokenPathAlreadyExists') {
      return {
        status: 'error',
        fieldErrors: {},
        formError: 'tokenPathAlreadyExists',
        values,
      };
    }

    if (
      createResult.error === 'tokenPathRequired' ||
      createResult.error === 'tokenPathInvalid'
    ) {
      return {
        status: 'error',
        fieldErrors: {
          path: [createResult.error],
        },
        formError: null,
        values,
      };
    }

    return {
      status: 'error',
      fieldErrors: {
        value: [createResult.error],
      },
      formError: null,
      values,
    };
  }

  const saveResult = await saveValidatedTokenSetTokens({
    tokenSetId: tokenSetResult.tokenSet.id,
    tokens: createResult.tokens,
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
    values,
  };
}
