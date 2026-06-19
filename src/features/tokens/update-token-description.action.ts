'use server';

import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import { isTokenSetType } from './tokens-editor.utils';
import type { DesignToken } from '@/domain/design-system';
import { defaultAppLocale, isAppLocale } from '@/domain/i18n';
import type {
  UpdateTokenDescriptionActionState,
  UpdateTokenDescriptionField,
} from './update-token-description.state';
import {
  updateTokenDescriptionSchema,
  type UpdateTokenDescriptionValidationMessageKey,
} from './token-description.schema';
import {
  getEditableTokenSetForUser,
  parseStoredTokenSetTokens,
  saveValidatedTokenSetTokens,
} from './token-set-save.service';

type TokenDescription = NonNullable<DesignToken['description']>;

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

function createTokenDescription({
  descriptionEn,
  descriptionFr,
}: {
  descriptionEn: string;
  descriptionFr: string;
}): TokenDescription | undefined {
  const description: TokenDescription = {};

  const trimmedDescriptionEn = descriptionEn.trim();
  const trimmedDescriptionFr = descriptionFr.trim();

  if (trimmedDescriptionEn.length > 0) {
    description.en = trimmedDescriptionEn;
  }

  if (trimmedDescriptionFr.length > 0) {
    description.fr = trimmedDescriptionFr;
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

  const nextDescription = createTokenDescription(parsed.data);

  const nextTokens: DesignToken[] = parsedTokensResult.tokens.map(
    (token, index) => {
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
    },
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
