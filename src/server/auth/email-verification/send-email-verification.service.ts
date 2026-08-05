import type { AppLocale } from '@/domain/i18n';
import {
  consumeAuthRateLimit,
  type AuthRateLimitOperation,
} from '@/server/auth/auth-rate-limit';
import { recordAuthSecurityEvent } from '@/server/auth/auth-security-events';
import {
  EmailVerificationConfigurationError,
  EmailVerificationDeliveryError,
} from './email-verification.errors';
import { sendEmailVerificationEmail } from './email-verification-email';
import {
  createEmailVerificationChallenge,
  rollbackEmailVerificationChallenge,
} from './email-verification.service';

const emailVerificationOperation =
  'emailVerification' satisfies AuthRateLimitOperation;

export type SendEmailVerificationChallengeResult =
  | {
      status: 'deliveryUnavailable';
      retryAfterSeconds: 0;
    }
  | {
      status: 'rateLimited';
      retryAfterSeconds: number;
    }
  | {
      status: 'sent';
      retryAfterSeconds: 0;
    };

export async function sendEmailVerificationChallenge({
  email,
  headers,
  locale,
  userId,
}: {
  email: string;
  headers: Pick<Headers, 'get'>;
  locale: AppLocale;
  userId: string;
}): Promise<SendEmailVerificationChallengeResult> {
  const rateLimit = await consumeAuthRateLimit({
    accountIdentifier: email,
    headers,
    operation: emailVerificationOperation,
  });

  if (!rateLimit.allowed) {
    recordAuthSecurityEvent('auth.email_verification.rate_limited', {
      accountFingerprint: rateLimit.accountFingerprint,
      ipFingerprint: rateLimit.context.ipFingerprint,
      requestId: rateLimit.context.requestId,
      retryAfterSeconds: rateLimit.retryAfterSeconds,
      userId,
    });

    return {
      status: 'rateLimited',
      retryAfterSeconds: rateLimit.retryAfterSeconds,
    };
  }

  const challenge = await createEmailVerificationChallenge({ userId });

  try {
    await sendEmailVerificationEmail({
      email,
      idempotencyKey: `email-verification/${challenge.id}`,
      locale,
      token: challenge.token,
    });
  } catch (error) {
    let rollbackFailed = false;

    try {
      await rollbackEmailVerificationChallenge(challenge);
    } catch {
      rollbackFailed = true;
    }

    recordAuthSecurityEvent('auth.email_verification.delivery_failed', {
      accountFingerprint: rateLimit.accountFingerprint,
      configurationError: error instanceof EmailVerificationConfigurationError,
      ipFingerprint: rateLimit.context.ipFingerprint,
      requestId: rateLimit.context.requestId,
      rollbackFailed,
      userId,
    });

    if (
      error instanceof EmailVerificationConfigurationError ||
      error instanceof EmailVerificationDeliveryError
    ) {
      return {
        status: 'deliveryUnavailable',
        retryAfterSeconds: 0,
      };
    }

    throw error;
  }

  recordAuthSecurityEvent('auth.email_verification.sent', {
    accountFingerprint: rateLimit.accountFingerprint,
    expiresAt: challenge.expiresAt.toISOString(),
    ipFingerprint: rateLimit.context.ipFingerprint,
    requestId: rateLimit.context.requestId,
    userId,
  });

  return {
    status: 'sent',
    retryAfterSeconds: 0,
  };
}
