import { NextRequest, NextResponse } from 'next/server';
import { defaultAppLocale, isAppLocale } from '@/domain/i18n';
import { recordAuthSecurityEvent } from '@/server/auth/auth-security-events';
import {
  EMAIL_VERIFICATION_CONFIRMATION_COOKIE,
  EMAIL_VERIFICATION_CONFIRMATION_COOKIE_TTL_SECONDS,
} from '@/server/auth/email-verification/email-verification.constants';
import {
  consumeEmailVerificationToken,
  inspectEmailVerificationToken,
} from '@/server/auth/email-verification/email-verification.service';

function getRequestLocale(request: NextRequest) {
  const requestedLocale = request.nextUrl.searchParams.get('locale') ?? '';

  return isAppLocale(requestedLocale) ? requestedLocale : defaultAppLocale;
}

function createStatusRedirect({
  locale,
  request,
  status,
}: {
  locale: string;
  request: NextRequest;
  status: string;
}) {
  const redirectUrl = new URL(`/${locale}/verify-email`, request.nextUrl.origin);
  redirectUrl.searchParams.set('status', status);

  const response = NextResponse.redirect(redirectUrl, 303);
  response.headers.set('Cache-Control', 'no-store, max-age=0');
  response.headers.set('Pragma', 'no-cache');
  response.headers.set('Referrer-Policy', 'no-referrer');

  return response;
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

export async function GET(request: NextRequest) {
  const locale = getRequestLocale(request);
  const token = request.nextUrl.searchParams.get('token') ?? '';

  let result: Awaited<ReturnType<typeof inspectEmailVerificationToken>>;
  let unexpectedError = false;

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

  const response = createStatusRedirect({
    locale,
    request,
    status: result.status,
  });

  if (result.status === 'confirm') {
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

export async function POST(request: NextRequest) {
  const locale = getRequestLocale(request);
  const token = request.cookies.get(
    EMAIL_VERIFICATION_CONFIRMATION_COOKIE,
  )?.value;

  let result: Awaited<ReturnType<typeof consumeEmailVerificationToken>>;
  let unexpectedError = false;

  if (!hasSameOrigin(request) || !token) {
    result = {
      status: 'invalid',
      userId: null,
    };
  } else {
    try {
      result = await consumeEmailVerificationToken({ token });
    } catch {
      unexpectedError = true;
      result = {
        status: 'invalid',
        userId: null,
      };
    }
  }

  if (unexpectedError) {
    recordAuthSecurityEvent('auth.email_verification.unexpected_error', {
      reason: 'token_consumption',
    });
  } else {
    const eventByStatus = {
      alreadyVerified: 'auth.email_verification.already_verified',
      expired: 'auth.email_verification.expired',
      invalid: 'auth.email_verification.invalid',
      verified: 'auth.email_verification.verified',
    } as const;

    recordAuthSecurityEvent(eventByStatus[result.status], {
      userId: result.userId,
    });
  }

  const response = createStatusRedirect({
    locale,
    request,
    status: result.status,
  });
  clearConfirmationCookie(response);

  return response;
}
