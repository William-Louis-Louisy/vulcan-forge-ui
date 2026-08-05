'use server';

import { auth, signOut } from '@/auth';
import { prisma } from '@/server/db/prisma';
import { verifyPassword } from '@/server/auth/password/password.service';
import { deleteAccountSchema } from './delete-account.schema';
import type { DeleteAccountActionState } from './delete-account.state';

function getFormStringValue(formData: FormData, key: string): string {
  const value = formData.get(key);

  return typeof value === 'string' ? value : '';
}

export async function deleteAccountAction(
  _previousState: DeleteAccountActionState,
  formData: FormData,
): Promise<DeleteAccountActionState> {
  const parsedPayload = deleteAccountSchema.safeParse({
    confirmationEmail: getFormStringValue(formData, 'confirmationEmail'),
    currentPassword: getFormStringValue(formData, 'currentPassword'),
    locale: getFormStringValue(formData, 'locale'),
  });

  if (!parsedPayload.success) {
    return {
      status: 'error',
      fieldErrors: {},
      formError: 'invalidPayload',
    };
  }

  const session = await auth();

  if (!session?.user?.id) {
    return {
      status: 'error',
      fieldErrors: {},
      formError: 'unauthorized',
    };
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        email: true,
        passwordHash: true,
      },
    });

    if (!user) {
      return {
        status: 'error',
        fieldErrors: {},
        formError: 'accountNotFound',
      };
    }

    if (parsedPayload.data.confirmationEmail !== user.email) {
      return {
        status: 'error',
        fieldErrors: {
          confirmationEmail: ['confirmationEmailMismatch'],
        },
        formError: 'confirmationEmailMismatch',
      };
    }

    const verification = await verifyPassword(
      parsedPayload.data.currentPassword,
      user.passwordHash,
    );

    if (!verification.valid) {
      return {
        status: 'error',
        fieldErrors: {
          currentPassword: ['currentPasswordIncorrect'],
        },
        formError: 'currentPasswordIncorrect',
      };
    }

    await prisma.user.delete({
      where: {
        id: session.user.id,
      },
    });
  } catch {
    return {
      status: 'error',
      fieldErrors: {},
      formError: 'unexpected',
    };
  }

  await signOut({
    redirectTo: `/${parsedPayload.data.locale}?accountDeleted=1`,
  });

  return {
    status: 'idle',
    fieldErrors: {},
    formError: null,
  };
}
