import { Prisma } from '@/generated/prisma/client';
import { prisma } from '@/server/db/prisma';
import { AuthRateLimitUnavailableError } from './auth-errors';
import {
  createAuthFingerprint,
  createAuthRequestContext,
} from './auth-request-context';
import { recordAuthSecurityEvent } from './auth-security-events';

export type AuthRateLimitOperation =
  | 'emailVerification'
  | 'login'
  | 'signup';

type AuthRateLimitPolicy = {
  limit: number;
  windowMs: number;
};

type RateLimitBucketKind = 'account' | 'ip';

type RateLimitBucketResult = {
  allowed: boolean;
  attempts: number;
  kind: RateLimitBucketKind;
  limit: number;
  resetAt: Date;
};

type PersistedRateLimitRow = {
  attempts: number;
  resetAt: Date | string;
};

const minute = 60_000;
const hour = 60 * minute;
const expiredBucketRetentionMs = 24 * hour;
const cleanupIntervalMs = hour;

const authRateLimitPolicies: Record<
  AuthRateLimitOperation,
  Record<RateLimitBucketKind, AuthRateLimitPolicy>
> = {
  emailVerification: {
    account: {
      limit: 5,
      windowMs: hour,
    },
    ip: {
      limit: 20,
      windowMs: hour,
    },
  },
  login: {
    account: {
      limit: 8,
      windowMs: 15 * minute,
    },
    ip: {
      limit: 40,
      windowMs: 15 * minute,
    },
  },
  signup: {
    account: {
      limit: 10,
      windowMs: hour,
    },
    ip: {
      limit: 30,
      windowMs: hour,
    },
  },
};

let lastCleanupAt = 0;

function normalizeAccountIdentifier(value: string) {
  return value.trim().toLowerCase() || '<empty>';
}

function createBucketKey({
  fingerprint,
  kind,
  operation,
}: {
  fingerprint: string;
  kind: RateLimitBucketKind;
  operation: AuthRateLimitOperation;
}) {
  return `${operation}:${kind}:${fingerprint}`;
}

async function consumeBucket({
  key,
  kind,
  now,
  policy,
}: {
  key: string;
  kind: RateLimitBucketKind;
  now: Date;
  policy: AuthRateLimitPolicy;
}): Promise<RateLimitBucketResult> {
  const nextResetAt = new Date(now.getTime() + policy.windowMs);
  const rows = await prisma.$queryRaw<PersistedRateLimitRow[]>(Prisma.sql`
    INSERT INTO "AuthRateLimitBucket" (
      "key",
      "attempts",
      "resetAt",
      "updatedAt"
    )
    VALUES (
      ${key},
      1,
      ${nextResetAt},
      ${now}
    )
    ON CONFLICT ("key") DO UPDATE SET
      "attempts" = CASE
        WHEN "AuthRateLimitBucket"."resetAt" <= ${now} THEN 1
        ELSE "AuthRateLimitBucket"."attempts" + 1
      END,
      "resetAt" = CASE
        WHEN "AuthRateLimitBucket"."resetAt" <= ${now} THEN ${nextResetAt}
        ELSE "AuthRateLimitBucket"."resetAt"
      END,
      "updatedAt" = ${now}
    RETURNING "attempts", "resetAt"
  `);

  const row = rows[0];

  if (!row) {
    throw new Error('Rate limit bucket update returned no row.');
  }

  const resetAt = new Date(row.resetAt);

  return {
    allowed: row.attempts <= policy.limit,
    attempts: row.attempts,
    kind,
    limit: policy.limit,
    resetAt,
  };
}

async function cleanupExpiredBuckets(now: Date) {
  if (now.getTime() - lastCleanupAt < cleanupIntervalMs) {
    return;
  }

  lastCleanupAt = now.getTime();

  try {
    await prisma.authRateLimitBucket.deleteMany({
      where: {
        resetAt: {
          lt: new Date(now.getTime() - expiredBucketRetentionMs),
        },
      },
    });
  } catch {
    recordAuthSecurityEvent('auth.rate_limit.error', {
      failOpen: true,
      operation: 'cleanup',
    });
  }
}

function shouldFailOpen() {
  return process.env.AUTH_RATE_LIMIT_FAIL_OPEN === 'true';
}

export async function consumeAuthRateLimit({
  accountIdentifier,
  headers,
  operation,
}: {
  accountIdentifier: string;
  headers: Pick<Headers, 'get'>;
  operation: AuthRateLimitOperation;
}) {
  const now = new Date();
  const context = createAuthRequestContext(headers);
  const normalizedAccountIdentifier =
    normalizeAccountIdentifier(accountIdentifier);
  const accountFingerprint = createAuthFingerprint(
    'account',
    normalizedAccountIdentifier,
  );
  const accountBucketKey = createBucketKey({
    fingerprint: accountFingerprint,
    kind: 'account',
    operation,
  });

  try {
    const bucketPromises: Promise<RateLimitBucketResult>[] = [
      consumeBucket({
        key: accountBucketKey,
        kind: 'account',
        now,
        policy: authRateLimitPolicies[operation].account,
      }),
    ];

    if (context.ipFingerprint) {
      bucketPromises.push(
        consumeBucket({
          key: createBucketKey({
            fingerprint: context.ipFingerprint,
            kind: 'ip',
            operation,
          }),
          kind: 'ip',
          now,
          policy: authRateLimitPolicies[operation].ip,
        }),
      );
    }

    const buckets = await Promise.all(bucketPromises);
    await cleanupExpiredBuckets(now);

    const blockedBuckets = buckets.filter((bucket) => !bucket.allowed);
    const retryAfterSeconds = blockedBuckets.length
      ? Math.max(
          ...blockedBuckets.map((bucket) =>
            Math.max(
              1,
              Math.ceil((bucket.resetAt.getTime() - now.getTime()) / 1_000),
            ),
          ),
        )
      : 0;

    return {
      allowed: blockedBuckets.length === 0,
      accountFingerprint,
      context,
      retryAfterSeconds,
    };
  } catch {
    recordAuthSecurityEvent('auth.rate_limit.error', {
      accountFingerprint,
      failOpen: shouldFailOpen(),
      operation,
      requestId: context.requestId,
    });

    if (shouldFailOpen()) {
      return {
        allowed: true,
        accountFingerprint,
        context,
        retryAfterSeconds: 0,
      };
    }

    throw new AuthRateLimitUnavailableError();
  }
}

export async function resetAuthAccountRateLimit({
  accountIdentifier,
  operation,
}: {
  accountIdentifier: string;
  operation: AuthRateLimitOperation;
}) {
  const accountFingerprint = createAuthFingerprint(
    'account',
    normalizeAccountIdentifier(accountIdentifier),
  );

  try {
    await prisma.authRateLimitBucket.delete({
      where: {
        key: createBucketKey({
          fingerprint: accountFingerprint,
          kind: 'account',
          operation,
        }),
      },
    });
  } catch (error) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === 'P2025'
    ) {
      return;
    }

    recordAuthSecurityEvent('auth.rate_limit.error', {
      accountFingerprint,
      failOpen: true,
      operation,
    });
  }
}
