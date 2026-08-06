'use server';

import { headers } from 'next/headers';
import { authForEmailVerification } from '@/auth';
import { defaultAppLocale, isAppLocale } from '@/domain/i18n';
import { recordAuthSecurityEvent } from '@/server/auth/auth-security-events';
import { prisma } from '@/server/db/prisma';
import { sendEmailVerificationChallenge } from '@/server/auth/email-verification/send-email-verification.service';
import type { ResendEmailVerificationActionState } from './resend-email-verification.state';

function getFormStringValue(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === 'string' ? value : '';
}

export async function resendEmailVerificationAction(
  _previousState: ResendEmailVerificationActionState,
  formData: FormData,
): Promise<ResendEmailVerificationActionState> {
  const session = await authForEmailVerification();

  if (!session?.user?.id) {
    return {
      status: 'unauthorized',
    };
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      email: true,
      emailVerifiedAt: true,
      preferences: {
        select: {
          locale: true,
        },
      },
    },
  });

  if (!user) {
    return {
      status: 'unauthorized',
    };
  }

  if (user.emailVerifiedAt) {
    return {
      status: 'alreadyVerified',
    };
  }

  const requestedLocale = getFormStringValue(formData, 'locale');
  const locale = isAppLocale(requestedLocale)
    ? requestedLocale
    : (user.preferences?.locale ?? defaultAppLocale);

  try {
    const result = await sendEmailVerificationChallenge({
      email: user.email,
      headers: await headers(),
      locale,
      userId: session.user.id,
    });

    return {
      status: result.status,
    };
  } catch {
    recordAuthSecurityEvent('auth.email_verification.unexpected_error', {
      reason: 'resend_action',
      userId: session.user.id,
    });

    return {
      status: 'unexpected',
    };
  }
}
