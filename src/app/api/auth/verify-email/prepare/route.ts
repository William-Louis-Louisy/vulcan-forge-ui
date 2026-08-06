import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { recordAuthSecurityEvent } from '@/server/auth/auth-security-events';
import {
  EMAIL_VERIFICATION_CONFIRMATION_COOKIE,
  EMAIL_VERIFICATION_CONFIRMATION_COOKIE_TTL_SECONDS,
  EMAIL_VERIFICATION_TOKEN_MAX_LENGTH,
} from '@/server/auth/email-verification/email-verification.constants';
import { inspectEmailVerificationToken } from '@/server/auth/email-verification/email-verification.service';

const PREPARE_BODY_MAX_LENGTH = EMAIL_VERIFICATION_TOKEN_MAX_LENGTH + 64;

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
      token.length <= EMAIL_VERIFICATION_TOKEN_MAX_LENGTH
      ? token
      : '';
  } catch {
    return '';
  }
}

function clearConfirmationCookie(response: NextResponse) {
  response.cookies.set(EMAIL_VERIFICATION_CONFIRMATION_COOKIE, '', {
    httpOnly: true,
    maxAge: 0,
    path: '/api/auth/verify-email',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });
}

export async function POST(request: NextRequest) {
  const token = hasSameOrigin(request) ? await getTokenFromBody(request) : '';
  let result: Awaited<ReturnType<typeof inspectEmailVerificationToken>>;
  let unexpectedError = false;

  if (!token) {
    result = {
      expiresAt: null,
      status: 'invalid',
      userId: null,
    };
  } else {
    try {
      result = await inspectEmailVerificationToken({ token });
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
    recordAuthSecurityEvent('auth.email_verification.unexpected_error', {
      reason: 'token_inspection',
    });
  } else if (result.status === 'confirm') {
    recordAuthSecurityEvent('auth.email_verification.link_opened', {
      userId: result.userId,
    });
  } else {
    const eventByStatus = {
      alreadyVerified: 'auth.email_verification.already_verified',
      expired: 'auth.email_verification.expired',
      invalid: 'auth.email_verification.invalid',
    } as const;

    recordAuthSecurityEvent(eventByStatus[result.status], {
      userId: result.userId,
    });
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
    response.cookies.set(EMAIL_VERIFICATION_CONFIRMATION_COOKIE, token, {
      httpOnly: true,
      maxAge: EMAIL_VERIFICATION_CONFIRMATION_COOKIE_TTL_SECONDS,
      path: '/api/auth/verify-email',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });
  } else {
    clearConfirmationCookie(response);
  }

  return response;
}
