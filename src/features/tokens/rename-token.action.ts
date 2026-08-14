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
import { revalidatePath } from 'next/cache';
import { isTokenSetType } from './tokens-editor.utils';
import { defaultAppLocale, isAppLocale } from '@/domain/i18n';
import {
  renameTokenAcrossProject,
  type ProjectTokenSetForRename,
} from './rename-token.utils';
import {
  getEditableTokenMutationProjectForUser,
  parseStoredTokenSetTokens,
  saveDesignSystemTokenMutation,
} from '@/server/design-system/token-mutations';

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

  const projectResult = await getEditableTokenMutationProjectForUser({
    userId: session.user.id,
    projectSlug,
  });

  if (projectResult.status === 'error') {
    return {
      status: 'error',
      fieldErrors: {},
      formError: projectResult.error,
      values,
    };
  }

  const project = projectResult.project;
  const targetTokenSet = project.tokenSets.find(
    (tokenSet) => tokenSet.type === tokenSetType,
  );

  if (!targetTokenSet) {
    return {
      status: 'error',
      fieldErrors: {},
      formError: 'tokenSetNotFound',
      values,
    };
  }

  const parsedTokenSets: ProjectTokenSetForRename[] = [];

  for (const tokenSet of project.tokenSets) {
    const parsedTokensResult = parseStoredTokenSetTokens(tokenSet.tokens);

    if (parsedTokensResult.status === 'error') {
      return {
        status: 'error',
        fieldErrors: {},
        formError: parsedTokensResult.error,
        values,
      };
    }

    parsedTokenSets.push({
      id: tokenSet.id,
      tokens: parsedTokensResult.tokens,
    });
  }

  const renameResult = renameTokenAcrossProject({
    tokenSets: parsedTokenSets,
    targetTokenSetId: targetTokenSet.id,
    themes: project.themes,
    componentContracts: project.componentContracts,
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

  const saveResult = await saveDesignSystemTokenMutation({
    tokenSetUpdates: renameResult.tokenSetUpdates,
    themeUpdates: renameResult.themeUpdates,
    componentUpdates: renameResult.componentUpdates,
  });

  if (saveResult.status === 'error') {
    return {
      status: 'error',
      fieldErrors: {},
      formError: saveResult.error,
      values,
    };
  }

  revalidatePath(`/${locale}/app`);
  revalidatePath(`/${locale}/app/projects/${projectSlug}`);

  for (const section of [
    'tokens',
    'themes',
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
    values: parsed.data,
  };
}
