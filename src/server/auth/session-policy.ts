export const AUTH_SESSION_ABSOLUTE_MAX_AGE_SECONDS = 7 * 24 * 60 * 60;

function isValidEpochSeconds(value: unknown): value is number {
  return Number.isSafeInteger(value) && typeof value === 'number' && value > 0;
}

export function getAuthEpochSeconds(now: Date | number = Date.now()) {
  const milliseconds = now instanceof Date ? now.getTime() : now;

  return Math.floor(milliseconds / 1000);
}

export function resolveAuthSessionStartedAt({
  sessionStartedAt,
  tokenIssuedAt,
}: {
  sessionStartedAt: unknown;
  tokenIssuedAt: unknown;
}) {
  if (isValidEpochSeconds(sessionStartedAt)) {
    return sessionStartedAt;
  }

  if (isValidEpochSeconds(tokenIssuedAt)) {
    return tokenIssuedAt;
  }

  return null;
}

export function getAuthSessionExpiresAt({
  sessionStartedAt,
}: {
  sessionStartedAt: number;
}) {
  return sessionStartedAt + AUTH_SESSION_ABSOLUTE_MAX_AGE_SECONDS;
}

export function getAuthSessionExpiresAtIso({
  sessionStartedAt,
}: {
  sessionStartedAt: number;
}) {
  if (!isValidEpochSeconds(sessionStartedAt)) {
    return null;
  }

  return new Date(
    getAuthSessionExpiresAt({ sessionStartedAt }) * 1000,
  ).toISOString();
}

export function isAuthSessionWithinAbsoluteLifetime({
  now = getAuthEpochSeconds(),
  sessionStartedAt,
}: {
  now?: number;
  sessionStartedAt: number;
}) {
  if (!isValidEpochSeconds(now) || !isValidEpochSeconds(sessionStartedAt)) {
    return false;
  }

  if (sessionStartedAt > now) {
    return false;
  }

  return now < getAuthSessionExpiresAt({ sessionStartedAt });
}
