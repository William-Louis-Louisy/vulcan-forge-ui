'use server';

import { auth } from '@/auth';
import {
  type RenameTokenField,
  type RenameTokenActionState,
} from './rename-token.state';
import {
  renameTokenSchema,
  type RenameTokenValidationMessageKey,
} from './token-rename.schema';
import {
  parseStoredTokenSetTokens,
  getEditableTokenSetForUser,
  saveValidatedTokenSetTokens,
} from './token-set-save.service';
import { revalidatePath } from 'next/cache';
import { isTokenSetType } from './tokens-editor.utils';
import { defaultAppLocale, isAppLocale } from '@/domain/i18n';
import { renameTokenAndMigrateReferences } from './rename-token.utils';

function getFormStringValue(formData: FormData, key: string): string {
  const value = formData.get(key);

  return typeof value === 'string' ? value : '';
}

function getActionLocale(formData: FormData) {
  const rawLocale = getFormStringValue(formData, 'locale');

  return isAppLocale(rawLocale) ? rawLocale : defaultAppLocale;
}

function normalizeFieldErrors(
  fieldErrors: Record<string, string[] | undefined>,
): RenameTokenActionState['fieldErrors'] {
  const normalizedErrors: Partial<
    Record<RenameTokenField, RenameTokenValidationMessageKey[]>
  > = {};

  if (fieldErrors.nextTokenPath?.length) {
    normalizedErrors.nextTokenPath =
      fieldErrors.nextTokenPath as RenameTokenValidationMessageKey[];
  }

  return normalizedErrors;
}

export async function renameTokenAction(
  _previousState: RenameTokenActionState,
  formData: FormData,
): Promise<RenameTokenActionState> {
  const locale = getActionLocale(formData);
  const projectSlug = getFormStringValue(formData, 'projectSlug');
  const tokenSetType = getFormStringValue(formData, 'tokenSetType');
  const currentTokenPath = getFormStringValue(formData, 'currentTokenPath');

  const values = {
    nextTokenPath: getFormStringValue(formData, 'nextTokenPath'),
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

  const parsed = renameTokenSchema.safeParse(values);

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

  const renameResult = renameTokenAndMigrateReferences({
    tokens: parsedTokensResult.tokens,
    currentTokenPath,
    nextTokenPath: parsed.data.nextTokenPath,
  });

  if (renameResult.status === 'error') {
    return {
      status: 'error',
      fieldErrors: {},
      formError: renameResult.error,
      values,
    };
  }

  const saveResult = await saveValidatedTokenSetTokens({
    tokenSetId: tokenSetResult.tokenSet.id,
    tokens: renameResult.tokens,
  });

  if (saveResult.status === 'error') {
    return {
      status: 'error',
      fieldErrors: {},
      formError: saveResult.error,
      values,
    };
  }

  revalidatePath(`/${locale}/app/design-systems/${projectSlug}/tokens`);

  return {
    status: 'success',
    fieldErrors: {},
    formError: null,
    values: parsed.data,
  };
}
