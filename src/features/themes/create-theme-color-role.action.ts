'use server';

import { auth } from '@/auth';
import { createThemeColorRoleForUser } from '@/server/design-system/theme-mutations';
import { createThemeColorRoleSchema } from './create-theme-color-role.schema';
import type { CreateThemeColorRoleActionState } from './create-theme-color-role.state';
import { revalidateThemeConsumers } from './revalidate-theme-consumers';

function getFormStringValue(formData: FormData, key: string): string {
  const value = formData.get(key);

  return typeof value === 'string' ? value : '';
}

export async function createThemeColorRoleAction(
  _previousState: CreateThemeColorRoleActionState,
  formData: FormData,
): Promise<CreateThemeColorRoleActionState> {
  const parsedPayload = createThemeColorRoleSchema.safeParse({
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

  const createResult = await createThemeColorRoleForUser({
    userId: session.user.id,
    projectSlug: parsedPayload.data.projectSlug,
    themeId: parsedPayload.data.themeId,
    roleKey: parsedPayload.data.roleKey,
    tokenPath: parsedPayload.data.tokenPath,
  });

  if (createResult.status === 'error') {
    return {
      status: 'error',
      formError: createResult.error,
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
