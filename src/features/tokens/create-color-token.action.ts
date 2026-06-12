'use server';

import { auth } from '@/auth';
import {
  parseStoredTokenSetTokens,
  getEditableTokenSetForUser,
  saveValidatedTokenSetTokens,
} from './token-set-save.service';
import {
  type CreateColorTokenField,
  type CreateColorTokenActionState,
} from './create-color-token.state';
import {
  createColorTokenSchema,
  type CreateColorTokenValidationMessageKey,
} from './create-color-token.schema';
import { revalidatePath } from 'next/cache';
import { defaultAppLocale, isAppLocale } from '@/domain/i18n';
import { createColorToken } from './create-color-token.utils';

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
): CreateColorTokenActionState['fieldErrors'] {
  const normalizedErrors: Partial<
    Record<CreateColorTokenField, CreateColorTokenValidationMessageKey[]>
  > = {};

  if (fieldErrors.path?.length) {
    normalizedErrors.path =
      fieldErrors.path as CreateColorTokenValidationMessageKey[];
  }

  if (fieldErrors.value?.length) {
    normalizedErrors.value =
      fieldErrors.value as CreateColorTokenValidationMessageKey[];
  }

  if (fieldErrors.referencePath?.length) {
    normalizedErrors.referencePath =
      fieldErrors.referencePath as CreateColorTokenValidationMessageKey[];
  }

  return normalizedErrors;
}

export async function createColorTokenAction(
  _previousState: CreateColorTokenActionState,
  formData: FormData,
): Promise<CreateColorTokenActionState> {
  const locale = getActionLocale(formData);
  const projectSlug = getFormStringValue(formData, 'projectSlug');
  const rawKind = getFormStringValue(formData, 'kind');

  const values: CreateColorTokenActionState['values'] = {
    kind: rawKind === 'semantic' ? 'semantic' : 'primitive',
    path: getFormStringValue(formData, 'path'),
    value: getFormStringValue(formData, 'value'),
    referencePath: getFormStringValue(formData, 'referencePath'),
    descriptionEn: getFormStringValue(formData, 'descriptionEn'),
    descriptionFr: getFormStringValue(formData, 'descriptionFr'),
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

  const parsed = createColorTokenSchema.safeParse(values);

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

  const createResult = createColorToken({
    tokens: parsedTokensResult.tokens,
    kind: parsed.data.kind,
    path: parsed.data.path,
    value: parsed.data.value,
    referencePath: parsed.data.referencePath ?? '',
    descriptionEn: parsed.data.descriptionEn ?? '',
    descriptionFr: parsed.data.descriptionFr ?? '',
  });

  if (createResult.status === 'error') {
    return {
      status: 'error',
      fieldErrors: {},
      formError: createResult.error,
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

  revalidatePath(`/${locale}/app/design-systems/${projectSlug}/tokens`);

  return {
    status: 'success',
    fieldErrors: {},
    formError: null,
    values: {
      kind: parsed.data.kind,
      path: parsed.data.path,
      value: parsed.data.value,
      referencePath: parsed.data.referencePath ?? '',
      descriptionEn: parsed.data.descriptionEn ?? '',
      descriptionFr: parsed.data.descriptionFr ?? '',
    },
  };
}
