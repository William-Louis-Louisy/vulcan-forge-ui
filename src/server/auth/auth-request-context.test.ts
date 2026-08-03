import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  createAuthFingerprint,
  getTrustedClientAddress,
} from './auth-request-context';

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('getTrustedClientAddress', () => {
  it('trusts Vercel client headers because Vercel overwrites them', () => {
    vi.stubEnv('VERCEL', '1');

    const headers = new Headers({
      'x-vercel-forwarded-for': '203.0.113.10, 10.0.0.4',
    });

    expect(getTrustedClientAddress(headers)).toBe('203.0.113.10');
  });

  it('ignores forwarded headers when no trusted proxy is configured', () => {
    vi.stubEnv('VERCEL', '0');
    vi.stubEnv('AUTH_TRUST_PROXY_HEADERS', 'false');

    const headers = new Headers({
      'x-forwarded-for': '203.0.113.10',
    });

    expect(getTrustedClientAddress(headers)).toBeNull();
  });

  it('uses the first forwarded address for an explicitly trusted proxy', () => {
    vi.stubEnv('VERCEL', '0');
    vi.stubEnv('AUTH_TRUST_PROXY_HEADERS', 'true');

    const headers = new Headers({
      'x-forwarded-for': '198.51.100.8, 10.0.0.2',
    });

    expect(getTrustedClientAddress(headers)).toBe('198.51.100.8');
  });
});

describe('createAuthFingerprint', () => {
  it('creates stable, scope-separated fingerprints without retaining raw data', () => {
    vi.stubEnv('AUTH_RATE_LIMIT_SECRET', 'test-rate-limit-secret');

    const first = createAuthFingerprint('account', 'user@example.com');
    const second = createAuthFingerprint('account', 'user@example.com');
    const ipScoped = createAuthFingerprint('ip', 'user@example.com');

    expect(first).toBe(second);
    expect(first).not.toBe(ipScoped);
    expect(first).not.toContain('user@example.com');
  });
});
