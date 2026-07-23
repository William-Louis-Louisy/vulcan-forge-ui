'use server';

import bcrypt from 'bcryptjs';
import { revalidatePath } from 'next/cache';

import { auth, signOut } from '@/auth';
import { prisma } from '@/server/db/prisma';
import { accountProfileSchema } from './account-profile.schema';
import type { UpdateAccountProfileActionState } from './update-account-profile.state';

function getFormStringValue(formData: FormData, key: string): string {
  const value = formData.get(key);

  return typeof value === 'string' ? value : '';
}

export async function updateAccountProfileAction(
  _previousState: UpdateAccountProfileActionState,
  formData: FormData,
): Promise<UpdateAccountProfileActionState> {
  const parsedProfile = accountProfileSchema.safeParse({
    name: getFormStringValue(formData, 'name'),
    email: getFormStringValue(formData, 'email'),
    currentPassword: getFormStringValue(formData, 'currentPassword'),
    locale: getFormStringValue(formData, 'locale'),
  });

  if (!parsedProfile.success) {
    return {
      status: 'error',
      fieldErrors: parsedProfile.error.flatten().fieldErrors,
      formError: 'invalidPayload',
      savedProfile: null,
    };
  }

  const session = await auth();

  if (!session?.user?.id) {
    return {
      status: 'error',
      fieldErrors: {},
      formError: 'unauthorized',
      savedProfile: null,
    };
  }

  let emailChanged = false;

  try {
    const currentUser = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        email: true,
        passwordHash: true,
      },
    });

    if (!currentUser) {
      return {
        status: 'error',
        fieldErrors: {},
        formError: 'accountNotFound',
        savedProfile: null,
      };
    }

    emailChanged = currentUser.email !== parsedProfile.data.email;

    if (emailChanged && !parsedProfile.data.currentPassword) {
      return {
        status: 'error',
        fieldErrors: {
          currentPassword: ['currentPasswordRequired'],
        },
        formError: 'currentPasswordRequired',
        savedProfile: null,
      };
    }

    if (emailChanged) {
      const passwordMatches = await bcrypt.compare(
        parsedProfile.data.currentPassword,
        currentUser.passwordHash,
      );

      if (!passwordMatches) {
        return {
          status: 'error',
          fieldErrors: {
            currentPassword: ['currentPasswordIncorrect'],
          },
          formError: 'currentPasswordIncorrect',
          savedProfile: null,
        };
      }

      const existingUser = await prisma.user.findUnique({
        where: {
          email: parsedProfile.data.email,
        },
        select: {
          id: true,
        },
      });

      if (existingUser && existingUser.id !== session.user.id) {
        return {
          status: 'error',
          fieldErrors: {
            email: ['emailAlreadyUsed'],
          },
          formError: 'emailAlreadyUsed',
          savedProfile: null,
        };
      }
    }

    await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        name: parsedProfile.data.name,
        email: parsedProfile.data.email,
      },
    });

    revalidatePath(`/${parsedProfile.data.locale}/app/settings`);
  } catch {
    return {
      status: 'error',
      fieldErrors: {},
      formError: 'unexpected',
      savedProfile: null,
    };
  }

  if (emailChanged) {
    await signOut({
      redirectTo: `/${parsedProfile.data.locale}/login?emailUpdated=1`,
    });
  }

  return {
    status: 'success',
    fieldErrors: {},
    formError: null,
    savedProfile: {
      name: parsedProfile.data.name,
      email: parsedProfile.data.email,
    },
  };
}
