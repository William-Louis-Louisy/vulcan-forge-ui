'use server';

import { after } from 'next/server';
import { headers } from 'next/headers';
import { defaultAppLocale } from '@/domain/i18n';
import { consumeAuthRateLimit } from '@/server/auth/auth-rate-limit';
import { recordAuthSecurityEvent } from '@/server/auth/auth-security-events';
import { prisma } from '@/server/db/prisma';
import { sendPasswordRecoveryChallenge } from '@/server/auth/password-recovery/send-password-recovery.service';
import { requestPasswordRecoverySchema } from './request-password-recovery.schema';
import type { RequestPasswordRecoveryActionState } from './request-password-recovery.state';

function getFormStringValue(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === 'string' ? value : '';
}

function createSubmittedState(): RequestPasswordRecoveryActionState {
  return {
    fieldErrors: {},
    status: 'submitted',
    values: {
      email: '',
    },
  };
}

export async function requestPasswordRecoveryAction(
  _previousState: RequestPasswordRecoveryActionState,
  formData: FormData,
): Promise<RequestPasswordRecoveryActionState> {
  const email = getFormStringValue(formData, 'email');
  const parsed = requestPasswordRecoverySchema.safeParse({ email });

  if (!parsed.success) {
    return {
      fieldErrors: {
        email: ['emailInvalid'],
      },
      status: 'error',
      values: { email },
    };
  }

  const requestHeaders = await headers();
  let rateLimit: Awaited<ReturnType<typeof consumeAuthRateLimit>>;

  try {
    rateLimit = await consumeAuthRateLimit({
      accountIdentifier: parsed.data.email,
      headers: requestHeaders,
      operation: 'passwordRecoveryRequest',
    });
  } catch {
    recordAuthSecurityEvent('auth.password_recovery.unexpected_error', {
      reason: 'request_rate_limit',
    });
    return createSubmittedState();
  }

  recordAuthSecurityEvent('auth.password_recovery.requested', {
    accountFingerprint: rateLimit.accountFingerprint,
    ipFingerprint: rateLimit.context.ipFingerprint,
    requestId: rateLimit.context.requestId,
  });

  if (!rateLimit.allowed) {
    recordAuthSecurityEvent('auth.password_recovery.rate_limited', {
      accountFingerprint: rateLimit.accountFingerprint,
      ipFingerprint: rateLimit.context.ipFingerprint,
      requestId: rateLimit.context.requestId,
      retryAfterSeconds: rateLimit.retryAfterSeconds,
    });
    return createSubmittedState();
  }

  after(async () => {
    try {
      const user = await prisma.user.findUnique({
        where: {
          email: parsed.data.email,
        },
        select: {
          email: true,
          id: true,
          preferences: {
            select: {
              locale: true,
            },
          },
        },
      });

      if (!user) {
        return;
      }

      await sendPasswordRecoveryChallenge({
        email: user.email,
        locale: user.preferences?.locale ?? defaultAppLocale,
        userId: user.id,
      });
    } catch {
      recordAuthSecurityEvent('auth.password_recovery.unexpected_error', {
        accountFingerprint: rateLimit.accountFingerprint,
        reason: 'request_delivery',
        requestId: rateLimit.context.requestId,
      });
    }
  });

  return createSubmittedState();
}
