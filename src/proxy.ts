import createMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';
import { AUTH_REQUEST_TARGET_HEADER } from '@/features/auth/shared/request-target';
import { routing } from './i18n/routing';

const handleI18nRouting = createMiddleware(routing);

function isLocalizedApplicationPath(pathname: string) {
  return routing.locales.some((locale) => {
    const applicationRoot = `/${locale}/app`;

    return (
      pathname === applicationRoot || pathname.startsWith(`${applicationRoot}/`)
    );
  });
}

function getPublicRequestTarget(request: NextRequest) {
  const searchParams = new URLSearchParams(request.nextUrl.searchParams);

  // Next.js adds this transport-only parameter to React Server Component
  // navigations. It is not part of the user's requested destination.
  searchParams.delete('_rsc');

  const query = searchParams.toString();

  return query
    ? `${request.nextUrl.pathname}?${query}`
    : request.nextUrl.pathname;
}

export default function proxy(request: NextRequest) {
  const isPageRequest = request.method === 'GET' || request.method === 'HEAD';

  if (!isPageRequest || !isLocalizedApplicationPath(request.nextUrl.pathname)) {
    return handleI18nRouting(request);
  }

  const requestHeaders = new Headers(request.headers);

  // Always overwrite a client-supplied value at the proxy boundary. The
  // application layout validates this value again before exposing it in a URL.
  requestHeaders.set(
    AUTH_REQUEST_TARGET_HEADER,
    getPublicRequestTarget(request),
  );

  const forwardedRequest = new NextRequest(request.url, {
    headers: requestHeaders,
    method: request.method,
  });

  return handleI18nRouting(forwardedRequest);
}

export const config = {
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
};
