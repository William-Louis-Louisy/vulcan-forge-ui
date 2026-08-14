'use server';

// Visual design-system status only. The authenticated server action persists project data; it does not handle auth tokens.
import { auth } from '@/auth';
import { designTokenStatusSchema } from '@/domain/design-system';
import { defaultAppLocale, isAppLocale } from '@/domain/i18n';
import { revalidatePath } from 'next/cache';
import {
  getEditableTokenSetForUser,
  parseStoredTokenSetTokens,
  saveValidatedTokenSetTokens,
} from './token-set-save.service';
import { isTokenSetType } from './tokens-editor.utils';
import type { UpdateTokenStatusActionState } from './update-token-status.state';
import { updateTokenStatus } from './update-token-status.utils';

function getFormStringValue(formData: FormData, key: string): string {
  const value = formData.get(key);

  return typeof value === 'string' ? value : '';
}

function getActionLocale(formData: FormData) {
  const rawLocale = getFormStringValue(formData, 'locale');

  return isAppLocale(rawLocale) ? rawLocale : defaultAppLocale;
}

export async function updateTokenStatusAction(
  _previousState: UpdateTokenStatusActionState,
  formData: FormData,
): Promise<UpdateTokenStatusActionState> {
  const locale = getActionLocale(formData);
  const projectSlug = getFormStringValue(formData, 'projectSlug');
  const tokenSetType = getFormStringValue(formData, 'tokenSetType');
  const tokenPath = getFormStringValue(formData, 'tokenPath');
  const values = {
    tokenStatus: getFormStringValue(formData, 'tokenStatus'),
  };

  if (!isTokenSetType(tokenSetType)) {
    return {
      status: 'error',
      fieldErrors: {},
      formError: 'tokenSetNotFound',
      values,
    };
  }

  const parsedStatus = designTokenStatusSchema.safeParse(values.tokenStatus);

  if (!parsedStatus.success) {
    return {
      status: 'error',
      fieldErrors: {
        tokenStatus: ['invalidStatus'],
      },
      formError: null,
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

  const updateResult = updateTokenStatus({
    tokens: parsedTokensResult.tokens,
    tokenPath,
    nextStatus: parsedStatus.data,
  });

  if (updateResult.status === 'error') {
    return {
      status: 'error',
      fieldErrors: {},
      formError: updateResult.error,
      values,
    };
  }

  const saveResult = await saveValidatedTokenSetTokens({
    tokenSetId: tokenSetResult.tokenSet.id,
    tokens: updateResult.tokens,
  });

  if (saveResult.status === 'error') {
    return {
      status: 'error',
      fieldErrors: {},
      formError: saveResult.error,
      values,
    };
  }

  revalidatePath(`/${locale}/app/projects/${projectSlug}`);

  for (const section of [
    'tokens',
    'components',
    'accessibility',
    'documentation',
    'exports',
    'ai-instructions',
  ]) {
    revalidatePath(`/${locale}/app/projects/${projectSlug}/${section}`);
  }

  return {
    status: 'success',
    fieldErrors: {},
    formError: null,
    values: {
      tokenStatus: parsedStatus.data,
    },
  };
}
