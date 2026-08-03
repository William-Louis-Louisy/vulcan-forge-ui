import { createHmac, randomUUID } from 'node:crypto';

type HeadersLike = Pick<Headers, 'get'>;

const developmentFingerprintSecret =
  'vulcanforge-ui-development-auth-fingerprint-secret';

function getFingerprintSecret() {
  const secret =
    process.env.AUTH_RATE_LIMIT_SECRET?.trim() ||
    process.env.AUTH_SECRET?.trim();

  if (secret) {
    return secret;
  }

  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      'AUTH_RATE_LIMIT_SECRET or AUTH_SECRET is required in production.',
    );
  }

  return developmentFingerprintSecret;
}

function normalizeForwardedAddress(value: string | null) {
  const firstAddress = value?.split(',')[0]?.trim().toLowerCase();

  if (!firstAddress || firstAddress.length > 128) {
    return null;
  }

  return firstAddress;
}

export function getTrustedClientAddress(headers: HeadersLike) {
  const isVercelRequest = process.env.VERCEL === '1';
  const trustProxyHeaders =
    isVercelRequest || process.env.AUTH_TRUST_PROXY_HEADERS === 'true';

  if (!trustProxyHeaders) {
    return null;
  }

  const address = isVercelRequest
    ? normalizeForwardedAddress(
        headers.get('x-vercel-forwarded-for') ??
          headers.get('x-forwarded-for'),
      )
    : normalizeForwardedAddress(
        headers.get('x-forwarded-for') ?? headers.get('x-real-ip'),
      );

  return address;
}

export function createAuthFingerprint(scope: string, value: string) {
  return createHmac('sha256', getFingerprintSecret())
    .update(`${scope}:${value}`)
    .digest('hex');
}

export function createAuthRequestContext(headers: HeadersLike) {
  const clientAddress = getTrustedClientAddress(headers);

  return {
    requestId: randomUUID(),
    clientAddress,
    ipFingerprint: clientAddress
      ? createAuthFingerprint('ip', clientAddress)
      : null,
  };
}
