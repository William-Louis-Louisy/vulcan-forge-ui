import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { recordAuthSecurityEvent } from '@/server/auth/auth-security-events';
import {
  PASSWORD_RECOVERY_CONFIRMATION_COOKIE,
  PASSWORD_RECOVERY_CONFIRMATION_COOKIE_PATH,
  PASSWORD_RECOVERY_CONFIRMATION_COOKIE_TTL_SECONDS,
  PASSWORD_RECOVERY_TOKEN_MAX_LENGTH,
} from '@/server/auth/password-recovery/password-recovery.constants';
import { inspectPasswordRecoveryToken } from '@/server/auth/password-recovery/password-recovery.service';

const PREPARE_BODY_MAX_LENGTH = PASSWORD_RECOVERY_TOKEN_MAX_LENGTH + 64;

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

async function getTokenFromBody(request: NextRequest) {
  const contentLengthValue = request.headers.get('content-length');

  if (contentLengthValue) {
    const contentLength = Number(contentLengthValue);

    if (
      !Number.isFinite(contentLength) ||
      contentLength > PREPARE_BODY_MAX_LENGTH
    ) {
      return '';
    }
  }

  try {
    const rawBody = await request.text();

    if (rawBody.length > PREPARE_BODY_MAX_LENGTH) {
      return '';
    }

    const body: unknown = JSON.parse(rawBody);

    if (!body || typeof body !== 'object' || !('token' in body)) {
      return '';
    }

    const token = body.token;

    return typeof token === 'string' &&
      token.length > 0 &&
      token.length <= PASSWORD_RECOVERY_TOKEN_MAX_LENGTH
      ? token
      : '';
  } catch {
    return '';
  }
}

function clearRecoveryCookie(response: NextResponse) {
  response.cookies.set(PASSWORD_RECOVERY_CONFIRMATION_COOKIE, '', {
    httpOnly: true,
    maxAge: 0,
    path: PASSWORD_RECOVERY_CONFIRMATION_COOKIE_PATH,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });
}

export async function POST(request: NextRequest) {
  const token = hasSameOrigin(request) ? await getTokenFromBody(request) : '';
  let result: Awaited<ReturnType<typeof inspectPasswordRecoveryToken>>;
  let unexpectedError = false;

  if (!token) {
    result = {
      expiresAt: null,
      status: 'invalid',
      userId: null,
    };
  } else {
    try {
      result = await inspectPasswordRecoveryToken({ token });
    } catch {
      unexpectedError = true;
      result = {
        expiresAt: null,
        status: 'invalid',
        userId: null,
      };
    }
  }

  if (unexpectedError) {
    recordAuthSecurityEvent('auth.password_recovery.unexpected_error', {
      reason: 'token_inspection',
    });
  } else if (result.status === 'confirm') {
    recordAuthSecurityEvent('auth.password_recovery.link_opened', {
      userId: result.userId,
    });
  } else {
    recordAuthSecurityEvent(
      result.status === 'expired'
        ? 'auth.password_recovery.expired'
        : 'auth.password_recovery.invalid',
      { userId: result.userId },
    );
  }

  const response = NextResponse.json(
    { status: result.status },
    {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
        Pragma: 'no-cache',
        'Referrer-Policy': 'no-referrer',
      },
    },
  );

  if (result.status === 'confirm' && token) {
    response.cookies.set(PASSWORD_RECOVERY_CONFIRMATION_COOKIE, token, {
      httpOnly: true,
      maxAge: PASSWORD_RECOVERY_CONFIRMATION_COOKIE_TTL_SECONDS,
      path: PASSWORD_RECOVERY_CONFIRMATION_COOKIE_PATH,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });
  } else {
    clearRecoveryCookie(response);
  }

  return response;
}
