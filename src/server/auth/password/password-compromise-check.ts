import { createHash } from 'node:crypto';
import {
  PWNED_PASSWORDS_MAX_RESPONSE_BYTES,
  PWNED_PASSWORDS_RANGE_URL,
  PWNED_PASSWORDS_TIMEOUT_MS,
  PWNED_PASSWORDS_USER_AGENT,
} from './password.constants';
import { PasswordCompromiseCheckUnavailableError } from './password.errors';
import { normalizePassword } from './password-normalization';

export type PasswordCompromiseCheckResult = {
  compromised: boolean;
  occurrenceCount: number;
};

export type PasswordCompromiseCheckOptions = {
  fetchImpl?: typeof fetch;
  timeoutMs?: number;
};

const RANGE_LINE_PATTERN = /^([0-9A-F]{35}):(\d+)$/i;

function createUnavailableError() {
  return new PasswordCompromiseCheckUnavailableError();
}

export async function checkPasswordCompromise(
  password: string,
  options: PasswordCompromiseCheckOptions = {},
): Promise<PasswordCompromiseCheckResult> {
  const normalizedPassword = normalizePassword(password);
  const sha1 = createHash('sha1')
    .update(normalizedPassword, 'utf8')
    .digest('hex')
    .toUpperCase();
  const prefix = sha1.slice(0, 5);
  const expectedSuffix = sha1.slice(5);
  const fetchImpl = options.fetchImpl ?? globalThis.fetch;

  if (typeof fetchImpl !== 'function') {
    throw createUnavailableError();
  }

  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    options.timeoutMs ?? PWNED_PASSWORDS_TIMEOUT_MS,
  );

  let response: Response;

  try {
    response = await fetchImpl(`${PWNED_PASSWORDS_RANGE_URL}/${prefix}`, {
      cache: 'no-store',
      headers: {
        'Add-Padding': 'true',
        'User-Agent': PWNED_PASSWORDS_USER_AGENT,
      },
      method: 'GET',
      signal: controller.signal,
    });
  } catch {
    throw createUnavailableError();
  } finally {
    clearTimeout(timeout);
  }

  if (!response.ok) {
    throw createUnavailableError();
  }

  let body: string;

  try {
    body = await response.text();
  } catch {
    throw createUnavailableError();
  }

  if (
    !body.length ||
    Buffer.byteLength(body, 'utf8') > PWNED_PASSWORDS_MAX_RESPONSE_BYTES
  ) {
    throw createUnavailableError();
  }

  let occurrenceCount = 0;
  const seenSuffixes = new Set<string>();

  for (const rawLine of body.split(/\r?\n/)) {
    const line = rawLine.trim();

    if (!line.length) {
      continue;
    }

    const match = RANGE_LINE_PATTERN.exec(line);

    if (!match) {
      throw createUnavailableError();
    }

    const suffix = match[1]?.toUpperCase();
    const rawCount = match[2];

    if (!suffix || rawCount === undefined || seenSuffixes.has(suffix)) {
      throw createUnavailableError();
    }

    seenSuffixes.add(suffix);

    const count = Number(rawCount);

    if (!Number.isSafeInteger(count) || count < 0) {
      throw createUnavailableError();
    }

    if (suffix === expectedSuffix) {
      occurrenceCount = count;
    }
  }

  if (!seenSuffixes.size) {
    throw createUnavailableError();
  }

  return {
    compromised: occurrenceCount > 0,
    occurrenceCount,
  };
}
