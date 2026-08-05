import { NextResponse } from 'next/server';
import { defaultAppLocale, isAppLocale } from '@/domain/i18n';
import { recordAuthSecurityEvent } from '@/server/auth/auth-security-events';
import { consumeEmailVerificationToken } from '@/server/auth/email-verification/email-verification.service';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const requestedLocale = requestUrl.searchParams.get('locale') ?? '';
  const locale = isAppLocale(requestedLocale)
    ? requestedLocale
    : defaultAppLocale;
  const token = requestUrl.searchParams.get('token') ?? '';

  let result: Awaited<ReturnType<typeof consumeEmailVerificationToken>>;

  try {
    result = await consumeEmailVerificationToken({ token });
  } catch {
    result = {
      status: 'invalid',
      userId: null,
    };
  }

  const eventByStatus = {
    alreadyVerified: 'auth.email_verification.already_verified',
    expired: 'auth.email_verification.expired',
    invalid: 'auth.email_verification.invalid',
    verified: 'auth.email_verification.verified',
  } as const;

  recordAuthSecurityEvent(eventByStatus[result.status], {
    userId: result.userId,
  });

  const redirectUrl = new URL(`/${locale}/verify-email`, requestUrl.origin);
  redirectUrl.searchParams.set('status', result.status);

  const response = NextResponse.redirect(redirectUrl, 303);
  response.headers.set('Cache-Control', 'no-store, max-age=0');
  response.headers.set('Pragma', 'no-cache');
  response.headers.set('Referrer-Policy', 'no-referrer');

  return response;
}
