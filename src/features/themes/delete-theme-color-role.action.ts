'use server';

import { auth } from '@/auth';
import { deleteThemeColorRoleForUser } from '@/server/design-system/theme-mutations';
import { deleteThemeColorRoleSchema } from './delete-theme-color-role.schema';
import type { DeleteThemeColorRoleActionState } from './delete-theme-color-role.state';
import { revalidateThemeConsumers } from './revalidate-theme-consumers';

function getFormStringValue(formData: FormData, key: string): string {
  const value = formData.get(key);

  return typeof value === 'string' ? value : '';
}

export async function deleteThemeColorRoleAction(
  _previousState: DeleteThemeColorRoleActionState,
  formData: FormData,
): Promise<DeleteThemeColorRoleActionState> {
  const parsedPayload = deleteThemeColorRoleSchema.safeParse({
    locale: getFormStringValue(formData, 'locale'),
    projectSlug: getFormStringValue(formData, 'projectSlug'),
    themeId: getFormStringValue(formData, 'themeId'),
    roleKey: getFormStringValue(formData, 'roleKey'),
  });

  if (!parsedPayload.success) {
    return {
      status: 'error',
      formError: 'invalidPayload',
      deletedRoleKey: null,
    };
  }

  const session = await auth();

  if (!session?.user?.id) {
    return {
      status: 'error',
      formError: 'unauthorized',
      deletedRoleKey: null,
    };
  }

  const deleteResult = await deleteThemeColorRoleForUser({
    userId: session.user.id,
    projectSlug: parsedPayload.data.projectSlug,
    themeId: parsedPayload.data.themeId,
    roleKey: parsedPayload.data.roleKey,
  });

  if (deleteResult.status === 'error') {
    return {
      status: 'error',
      formError: deleteResult.error,
      deletedRoleKey: null,
    };
  }

  revalidateThemeConsumers({
    locale: parsedPayload.data.locale,
    projectSlug: parsedPayload.data.projectSlug,
  });

  return {
    status: 'success',
    formError: null,
    deletedRoleKey: deleteResult.roleKey,
  };
}
