'use server';

import { auth } from '@/auth';
import { updateThemeColorRoleReferenceForUser } from '@/server/design-system/theme-mutations';
import { revalidateThemeConsumers } from './revalidate-theme-consumers';
import { updateThemeTokenReferenceSchema } from './theme-token-reference.schema';
import type { UpdateThemeTokenReferenceActionState } from './update-theme-token-reference.state';

function getFormStringValue(formData: FormData, key: string): string {
  const value = formData.get(key);

  return typeof value === 'string' ? value : '';
}

export async function updateThemeTokenReferenceAction(
  _previousState: UpdateThemeTokenReferenceActionState,
  formData: FormData,
): Promise<UpdateThemeTokenReferenceActionState> {
  const parsedPayload = updateThemeTokenReferenceSchema.safeParse({
    locale: getFormStringValue(formData, 'locale'),
    projectSlug: getFormStringValue(formData, 'projectSlug'),
    themeId: getFormStringValue(formData, 'themeId'),
    roleKey: getFormStringValue(formData, 'roleKey'),
    tokenPath: getFormStringValue(formData, 'tokenPath'),
  });

  if (!parsedPayload.success) {
    return {
      status: 'error',
      formError: 'invalidPayload',
    };
  }

  const session = await auth();

  if (!session?.user?.id) {
    return {
      status: 'error',
      formError: 'unauthorized',
    };
  }

  const updateResult = await updateThemeColorRoleReferenceForUser({
    userId: session.user.id,
    projectSlug: parsedPayload.data.projectSlug,
    themeId: parsedPayload.data.themeId,
    roleKey: parsedPayload.data.roleKey,
    tokenPath: parsedPayload.data.tokenPath,
  });

  if (updateResult.status === 'error') {
    return {
      status: 'error',
      formError: updateResult.error,
    };
  }

  revalidateThemeConsumers({
    locale: parsedPayload.data.locale,
    projectSlug: parsedPayload.data.projectSlug,
  });

  return {
    status: 'success',
    formError: null,
  };
}
