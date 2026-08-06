import type { NextRequest } from 'next/server';
import { after, NextResponse } from 'next/server';
import { consumeAuthRateLimit } from '@/server/auth/auth-rate-limit';
import { recordAuthSecurityEvent } from '@/server/auth/auth-security-events';
import {
  PasswordCompromisedError,
  PasswordCompromiseCheckUnavailableError,
  PasswordHashingUnavailableError,
  PasswordPolicyError,
} from '@/server/auth/password/password.errors';
import {
  assertPasswordIsAcceptable,
  hashPassword,
} from '@/server/auth/password/password.service';
import {
  PASSWORD_RECOVERY_CONFIRMATION_COOKIE,
  PASSWORD_RECOVERY_CONFIRMATION_COOKIE_PATH,
} from '@/server/auth/password-recovery/password-recovery.constants';
import { hashPasswordRecoveryToken } from '@/server/auth/password-recovery/password-recovery-token';
import { applyPasswordRecovery } from '@/server/auth/password-recovery/password-recovery.service';
import { sendPasswordChangedNotification } from '@/server/auth/password-recovery/send-password-recovery.service';
import {
  resetPasswordSchema,
  type ResetPasswordValidationMessageKey,
} from '@/features/auth/password-recovery/reset-password.schema';

const RESET_BODY_MAX_LENGTH = 1_024;

type ResetResponse = {
  fieldErrors?: {
    password?: ResetPasswordValidationMessageKey[];
    passwordConfirmation?: ResetPasswordValidationMessageKey[];
  };
  status:
    | 'error'
    | 'expired'
    | 'invalid'
    | 'passwordCheckUnavailable'
    | 'passwordHashingUnavailable'
    | 'rateLimited'
    | 'reset'
    | 'unexpected';
};

function hasSameOrigin(request: NextRequest) {
  const origin = request.headers.get('origin');

  if (!origin) {
    return false;
  }

  try {
    return new URL(origin).origin === request.nextUrl.origin;
  } catch {
    return false;
  }
}

async function getBody(request: NextRequest) {
  const contentLength = Number(request.headers.get('content-length') ?? '0');

  if (
    !Number.isFinite(contentLength) ||
    contentLength > RESET_BODY_MAX_LENGTH
  ) {
    return null;
  }

  try {
    const rawBody = await request.text();

    if (rawBody.length > RESET_BODY_MAX_LENGTH) {
      return null;
    }

    const body: unknown = JSON.parse(rawBody);

    if (!body || typeof body !== 'object') {
      return null;
    }

    return body;
  } catch {
    return null;
  }
}

function createResponse(payload: ResetResponse, clearCookie = false) {
  const response = NextResponse.json(payload, {
    headers: {
      'Cache-Control': 'no-store, max-age=0',
      Pragma: 'no-cache',
      'Referrer-Policy': 'no-referrer',
    },
  });

  if (clearCookie) {
    response.cookies.set(PASSWORD_RECOVERY_CONFIRMATION_COOKIE, '', {
      httpOnly: true,
      maxAge: 0,
      path: PASSWORD_RECOVERY_CONFIRMATION_COOKIE_PATH,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });
  }

  return response;
}

function getPasswordPolicyMessage(error: PasswordPolicyError) {
  const messageByViolation = {
    invalid_unicode: 'passwordInvalidUnicode',
    too_long: 'passwordTooLong',
    too_short: 'passwordMinLength',
  } as const satisfies Record<
    PasswordPolicyError['violation'],
    ResetPasswordValidationMessageKey
  >;

  return messageByViolation[error.violation];
}

export async function POST(request: NextRequest) {
  const token = request.cookies.get(
    PASSWORD_RECOVERY_CONFIRMATION_COOKIE,
  )?.value;

  if (!hasSameOrigin(request) || !token) {
    recordAuthSecurityEvent('auth.password_recovery.invalid', {
      reason: 'reset_request',
    });
    return createResponse({ status: 'invalid' }, true);
  }

  const body = await getBody(request);
  const parsed = resetPasswordSchema.safeParse(body);

  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;

    const normalizedFieldErrors: NonNullable<ResetResponse['fieldErrors']> = {};

    if (fieldErrors.password?.length) {
      normalizedFieldErrors.password =
        fieldErrors.password as ResetPasswordValidationMessageKey[];
    }

    if (fieldErrors.passwordConfirmation?.length) {
      normalizedFieldErrors.passwordConfirmation =
        fieldErrors.passwordConfirmation as ResetPasswordValidationMessageKey[];
    }

    return createResponse({
      fieldErrors: normalizedFieldErrors,
      status: 'error',
    });
  }

  const tokenHash = hashPasswordRecoveryToken(token);

  if (!tokenHash) {
    return createResponse({ status: 'invalid' }, true);
  }

  let rateLimit: Awaited<ReturnType<typeof consumeAuthRateLimit>>;

  try {
    rateLimit = await consumeAuthRateLimit({
      accountIdentifier: `password-reset:${tokenHash}`,
      headers: request.headers,
      operation: 'passwordResetAttempt',
    });
  } catch {
    recordAuthSecurityEvent('auth.password_recovery.unexpected_error', {
      reason: 'reset_rate_limit',
    });
    return createResponse({ status: 'unexpected' });
  }

  if (!rateLimit.allowed) {
    recordAuthSecurityEvent('auth.password_recovery.rate_limited', {
      accountFingerprint: rateLimit.accountFingerprint,
      ipFingerprint: rateLimit.context.ipFingerprint,
      reason: 'reset_attempt',
      requestId: rateLimit.context.requestId,
      retryAfterSeconds: rateLimit.retryAfterSeconds,
    });
    return createResponse({ status: 'rateLimited' });
  }

  let acceptablePassword: string;

  try {
    acceptablePassword = await assertPasswordIsAcceptable(parsed.data.password);
  } catch (error) {
    if (error instanceof PasswordCompromisedError) {
      recordAuthSecurityEvent('auth.password_recovery.password_compromised', {
        accountFingerprint: rateLimit.accountFingerprint,
        occurrenceCount: error.occurrenceCount,
        requestId: rateLimit.context.requestId,
      });
      return createResponse({
        fieldErrors: {
          password: ['passwordCompromised'],
        },
        status: 'error',
      });
    }

    if (error instanceof PasswordCompromiseCheckUnavailableError) {
      recordAuthSecurityEvent(
        'auth.password_recovery.password_check_unavailable',
        {
          accountFingerprint: rateLimit.accountFingerprint,
          requestId: rateLimit.context.requestId,
        },
      );
      return createResponse({ status: 'passwordCheckUnavailable' });
    }

    if (error instanceof PasswordPolicyError) {
      return createResponse({
        fieldErrors: {
          password: [getPasswordPolicyMessage(error)],
        },
        status: 'error',
      });
    }

    recordAuthSecurityEvent('auth.password_recovery.unexpected_error', {
      accountFingerprint: rateLimit.accountFingerprint,
      reason: 'password_acceptability',
      requestId: rateLimit.context.requestId,
    });
    return createResponse({ status: 'unexpected' });
  }

  let passwordHash: string;

  try {
    passwordHash = await hashPassword(acceptablePassword);
  } catch (error) {
    if (error instanceof PasswordHashingUnavailableError) {
      recordAuthSecurityEvent(
        'auth.password_recovery.password_hashing_unavailable',
        {
          accountFingerprint: rateLimit.accountFingerprint,
          requestId: rateLimit.context.requestId,
        },
      );
      return createResponse({ status: 'passwordHashingUnavailable' });
    }

    recordAuthSecurityEvent('auth.password_recovery.unexpected_error', {
      accountFingerprint: rateLimit.accountFingerprint,
      reason: 'password_hashing',
      requestId: rateLimit.context.requestId,
    });
    return createResponse({ status: 'unexpected' });
  }

  let result: Awaited<ReturnType<typeof applyPasswordRecovery>>;

  try {
    result = await applyPasswordRecovery({
      passwordHash,
      token,
    });
  } catch {
    recordAuthSecurityEvent('auth.password_recovery.unexpected_error', {
      accountFingerprint: rateLimit.accountFingerprint,
      reason: 'reset_persistence',
      requestId: rateLimit.context.requestId,
    });
    return createResponse({ status: 'unexpected' });
  }

  if (result.status !== 'reset') {
    recordAuthSecurityEvent(
      result.status === 'expired'
        ? 'auth.password_recovery.expired'
        : 'auth.password_recovery.invalid',
      { userId: result.userId },
    );
    return createResponse({ status: result.status }, true);
  }

  recordAuthSecurityEvent('auth.password_recovery.reset_completed', {
    userId: result.userId,
  });
  after(() =>
    sendPasswordChangedNotification({
      email: result.email,
      locale: result.locale,
      userId: result.userId,
    }),
  );

  return createResponse({ status: 'reset' }, true);
}
