import bcrypt from 'bcryptjs';
import { prisma } from '@/server/db/prisma';
import { loginSchema } from '@/features/auth/login/login.schema';
import { RateLimitedCredentialsError } from './auth-errors';
import {
  consumeAuthRateLimit,
  resetAuthAccountRateLimit,
} from './auth-rate-limit';
import { recordAuthSecurityEvent } from './auth-security-events';

const dummyPasswordHash =
  '$2b$12$R9h/cIPz0gi.URNNX3kh2OPST9/PgBkqquzi.Ss7KIUgO2t0jWMUW';

function getCredentialString(
  credentials: Partial<Record<'email' | 'password', unknown>>,
  key: 'email' | 'password',
) {
  const value = credentials[key];

  return typeof value === 'string' ? value : '';
}

export async function authorizeCredentials(
  credentials: Partial<Record<'email' | 'password', unknown>>,
  request: Request,
) {
  const rawEmail = getCredentialString(credentials, 'email');
  const rateLimit = await consumeAuthRateLimit({
    accountIdentifier: rawEmail,
    headers: request.headers,
    operation: 'login',
  });

  if (!rateLimit.allowed) {
    recordAuthSecurityEvent('auth.login.rate_limited', {
      accountFingerprint: rateLimit.accountFingerprint,
      ipFingerprint: rateLimit.context.ipFingerprint,
      requestId: rateLimit.context.requestId,
      retryAfterSeconds: rateLimit.retryAfterSeconds,
    });

    throw new RateLimitedCredentialsError();
  }

  const parsed = loginSchema.safeParse({
    email: rawEmail,
    password: getCredentialString(credentials, 'password'),
  });

  if (!parsed.success) {
    recordAuthSecurityEvent('auth.login.rejected', {
      accountFingerprint: rateLimit.accountFingerprint,
      ipFingerprint: rateLimit.context.ipFingerprint,
      reason: 'invalid_payload',
      requestId: rateLimit.context.requestId,
    });

    return null;
  }

  const user = await prisma.user.findUnique({
    where: {
      email: parsed.data.email,
    },
    select: {
      id: true,
      name: true,
      email: true,
      passwordHash: true,
      preferences: {
        select: {
          locale: true,
        },
      },
    },
  });

  const passwordMatches = await bcrypt.compare(
    parsed.data.password,
    user?.passwordHash ?? dummyPasswordHash,
  );

  if (!user || !passwordMatches) {
    recordAuthSecurityEvent('auth.login.rejected', {
      accountFingerprint: rateLimit.accountFingerprint,
      ipFingerprint: rateLimit.context.ipFingerprint,
      reason: 'invalid_credentials',
      requestId: rateLimit.context.requestId,
    });

    return null;
  }

  await resetAuthAccountRateLimit({
    accountIdentifier: parsed.data.email,
    operation: 'login',
  });

  recordAuthSecurityEvent('auth.login.succeeded', {
    accountFingerprint: rateLimit.accountFingerprint,
    ipFingerprint: rateLimit.context.ipFingerprint,
    requestId: rateLimit.context.requestId,
    userId: user.id,
  });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    locale: user.preferences?.locale ?? 'en',
  };
}
