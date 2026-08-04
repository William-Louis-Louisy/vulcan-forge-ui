import { prisma } from '@/server/db/prisma';
import { loginSchema } from '@/features/auth/login/login.schema';
import { RateLimitedCredentialsError } from './auth-errors';
import {
  consumeAuthRateLimit,
  resetAuthAccountRateLimit,
} from './auth-rate-limit';
import { recordAuthSecurityEvent } from './auth-security-events';
import {
  PasswordHashingUnavailableError,
  PasswordPolicyError,
} from './password/password.errors';
import {
  hashPassword,
  verifyPassword,
  type PasswordHashScheme,
} from './password/password.service';

const dummyPasswordHash =
  '$vulcan$argon2id$v=1$m=19456,t=2,p=1,l=32$AAECAwQFBgcICQoLDA0ODw$DC0uxfOnxsyo6hd1XhvappBgPe5mVsW9ymOa3b4sh7w';

type AuthenticatedUser = {
  email: string;
  id: string;
  name: string | null;
  passwordHash: string;
  preferences: {
    locale: string;
  } | null;
};

type RateLimitContext = Awaited<ReturnType<typeof consumeAuthRateLimit>>;

function getCredentialString(
  credentials: Partial<Record<'email' | 'password', unknown>>,
  key: 'email' | 'password',
) {
  const value = credentials[key];

  return typeof value === 'string' ? value : '';
}

function getPasswordEventMetadata({
  rateLimit,
  scheme,
  userId,
}: {
  rateLimit: RateLimitContext;
  scheme: PasswordHashScheme;
  userId: string;
}) {
  return {
    accountFingerprint: rateLimit.accountFingerprint,
    ipFingerprint: rateLimit.context.ipFingerprint,
    requestId: rateLimit.context.requestId,
    sourceScheme: scheme,
    userId,
  };
}

async function upgradePasswordHash({
  password,
  rateLimit,
  scheme,
  user,
}: {
  password: string;
  rateLimit: RateLimitContext;
  scheme: PasswordHashScheme;
  user: AuthenticatedUser;
}) {
  const metadata = getPasswordEventMetadata({
    rateLimit,
    scheme,
    userId: user.id,
  });
  let passwordHash: string;

  try {
    passwordHash = await hashPassword(password);
  } catch (error) {
    if (error instanceof PasswordPolicyError) {
      recordAuthSecurityEvent('auth.password.rehash_skipped', {
        ...metadata,
        reason: 'policy_ineligible',
      });
      return;
    }

    recordAuthSecurityEvent('auth.password.rehash_failed', {
      ...metadata,
      reason:
        error instanceof PasswordHashingUnavailableError
          ? 'hashing_unavailable'
          : 'hashing_failed',
    });
    return;
  }

  try {
    const result = await prisma.user.updateMany({
      where: {
        id: user.id,
        passwordHash: user.passwordHash,
      },
      data: {
        passwordHash,
      },
    });

    if (result.count !== 1) {
      recordAuthSecurityEvent('auth.password.rehash_skipped', {
        ...metadata,
        reason: 'concurrent_hash_change',
      });
      return;
    }

    recordAuthSecurityEvent('auth.password.rehash_succeeded', metadata);
  } catch {
    recordAuthSecurityEvent('auth.password.rehash_failed', {
      ...metadata,
      reason: 'persistence_failed',
    });
  }
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

  const verification = await verifyPassword(
    parsed.data.password,
    user?.passwordHash ?? dummyPasswordHash,
  );

  if (user && verification.scheme === 'unknown') {
    await verifyPassword(parsed.data.password, dummyPasswordHash);
  }

  if (!user || !verification.valid) {
    recordAuthSecurityEvent('auth.login.rejected', {
      accountFingerprint: rateLimit.accountFingerprint,
      ipFingerprint: rateLimit.context.ipFingerprint,
      reason: 'invalid_credentials',
      requestId: rateLimit.context.requestId,
    });

    return null;
  }

  if (verification.needsRehash) {
    await upgradePasswordHash({
      password: parsed.data.password,
      rateLimit,
      scheme: verification.scheme,
      user,
    });
  }

  await resetAuthAccountRateLimit({
    accountIdentifier: parsed.data.email,
    operation: 'login',
  });

  recordAuthSecurityEvent('auth.login.succeeded', {
    accountFingerprint: rateLimit.accountFingerprint,
    ipFingerprint: rateLimit.context.ipFingerprint,
    passwordScheme: verification.scheme,
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
