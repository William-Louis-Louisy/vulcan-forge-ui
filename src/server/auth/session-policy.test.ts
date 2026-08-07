import { describe, expect, it } from 'vitest';

import {
  AUTH_SESSION_ABSOLUTE_MAX_AGE_SECONDS,
  getAuthEpochSeconds,
  getAuthSessionExpiresAt,
  getAuthSessionExpiresAtIso,
  isAuthSessionWithinAbsoluteLifetime,
  resolveAuthSessionStartedAt,
} from './session-policy';

describe('session policy', () => {
  it('uses an explicit seven-day absolute lifetime', () => {
    expect(AUTH_SESSION_ABSOLUTE_MAX_AGE_SECONDS).toBe(604_800);
  });

  it('converts wall-clock time to integer epoch seconds', () => {
    expect(getAuthEpochSeconds(new Date('2026-08-07T08:00:00.999Z'))).toBe(
      1_786_089_600,
    );
  });

  it('preserves the explicit session start and falls back to the JWT issued-at during rollout', () => {
    expect(
      resolveAuthSessionStartedAt({
        sessionStartedAt: 100,
        tokenIssuedAt: 50,
      }),
    ).toBe(100);
    expect(
      resolveAuthSessionStartedAt({
        sessionStartedAt: undefined,
        tokenIssuedAt: 50,
      }),
    ).toBe(50);
    expect(
      resolveAuthSessionStartedAt({
        sessionStartedAt: undefined,
        tokenIssuedAt: undefined,
      }),
    ).toBeNull();
  });

  it('expires a session at the absolute boundary without an inactivity extension', () => {
    const sessionStartedAt = 10_000;
    const expiresAt = getAuthSessionExpiresAt({ sessionStartedAt });

    expect(expiresAt).toBe(
      sessionStartedAt + AUTH_SESSION_ABSOLUTE_MAX_AGE_SECONDS,
    );
    expect(
      isAuthSessionWithinAbsoluteLifetime({
        now: expiresAt - 1,
        sessionStartedAt,
      }),
    ).toBe(true);
    expect(
      isAuthSessionWithinAbsoluteLifetime({
        now: expiresAt,
        sessionStartedAt,
      }),
    ).toBe(false);
  });

  it('fails closed for malformed or future session starts', () => {
    expect(
      isAuthSessionWithinAbsoluteLifetime({
        now: 100,
        sessionStartedAt: 101,
      }),
    ).toBe(false);
    expect(
      isAuthSessionWithinAbsoluteLifetime({
        now: 100,
        sessionStartedAt: Number.NaN,
      }),
    ).toBe(false);
    expect(
      getAuthSessionExpiresAtIso({ sessionStartedAt: Number.NaN }),
    ).toBeNull();
  });

  it('exposes the absolute expiry as an ISO timestamp', () => {
    const sessionStartedAt = getAuthEpochSeconds(
      new Date('2026-08-07T08:00:00.000Z'),
    );

    expect(getAuthSessionExpiresAtIso({ sessionStartedAt })).toBe(
      '2026-08-14T08:00:00.000Z',
    );
  });
});
