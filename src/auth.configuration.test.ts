import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  configuration: null as unknown,
  isCurrent: vi.fn(),
  rawAuth: vi.fn(),
  signIn: vi.fn(),
  signOut: vi.fn(),
}));

vi.mock('next-auth', () => ({
  default: vi.fn((configuration: unknown) => {
    mocks.configuration = configuration;

    return {
      auth: mocks.rawAuth,
      handlers: {},
      signIn: mocks.signIn,
      signOut: mocks.signOut,
    };
  }),
}));

vi.mock('next-auth/providers/credentials', () => ({
  default: vi.fn((configuration: unknown) => configuration),
}));

vi.mock('@/server/auth/credentials-authorizer', () => ({
  authorizeCredentials: vi.fn(),
}));

vi.mock('@/server/auth/session-version', () => ({
  isAuthSessionVersionCurrent: mocks.isCurrent,
}));

import { AUTH_SESSION_ABSOLUTE_MAX_AGE_SECONDS } from '@/server/auth/session-policy';
import './auth';

type JwtCallback = (input: {
  token: Record<string, unknown>;
  user?: {
    authVersion: number;
    id: string;
    locale: 'en' | 'fr';
  } | null;
}) => Promise<Record<string, unknown>>;

type SessionCallback = (input: {
  session: {
    expires: string;
    user: {
      id: string;
      locale: 'en' | 'fr';
    };
  };
  token: Record<string, unknown>;
}) => {
  expires: string;
  user: {
    id: string;
    locale: 'en' | 'fr';
  };
};

type AuthConfigurationProbe = {
  callbacks: {
    jwt: JwtCallback;
    session: SessionCallback;
  };
  jwt: {
    maxAge: number;
  };
  session: {
    maxAge: number;
    strategy: string;
  };
};

const configuration = mocks.configuration as AuthConfigurationProbe;

describe('Auth.js session configuration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  it('configures the JWT and session envelopes with the explicit seven-day maximum', () => {
    expect(configuration.session).toEqual({
      maxAge: AUTH_SESSION_ABSOLUTE_MAX_AGE_SECONDS,
      strategy: 'jwt',
    });
    expect(configuration.jwt).toEqual({
      maxAge: AUTH_SESSION_ABSOLUTE_MAX_AGE_SECONDS,
    });
  });

  it('captures an immutable absolute session start when credentials are accepted', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-08-07T08:00:00.000Z'));

    const token = await configuration.callbacks.jwt({
      token: {},
      user: {
        authVersion: 4,
        id: 'user-1',
        locale: 'fr',
      },
    });

    expect(token).toMatchObject({
      authVersion: 4,
      id: 'user-1',
      invalidated: false,
      locale: 'fr',
      sessionStartedAt: 1_786_089_600,
    });
  });

  it('invalidates an expired session before consulting persistence', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-08-14T08:00:00.000Z'));

    const token = await configuration.callbacks.jwt({
      token: {
        authVersion: 4,
        id: 'user-1',
        locale: 'en',
        sessionStartedAt: 1_786_089_600,
      },
    });

    expect(token.invalidated).toBe(true);
    expect(mocks.isCurrent).not.toHaveBeenCalled();
  });

  it('uses the legacy JWT issued-at once during rollout, then preserves it', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-08-07T08:10:00.000Z'));
    mocks.isCurrent.mockResolvedValue(true);

    const token = await configuration.callbacks.jwt({
      token: {
        authVersion: 4,
        iat: 1_786_089_600,
        id: 'user-1',
        locale: 'en',
      },
    });

    expect(token.sessionStartedAt).toBe(1_786_089_600);
    expect(token.invalidated).toBe(false);
    expect(mocks.isCurrent).toHaveBeenCalledWith({
      authVersion: 4,
      userId: 'user-1',
    });
  });

  it('fails closed when the persisted authentication version no longer matches', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-08-07T08:10:00.000Z'));
    mocks.isCurrent.mockResolvedValue(false);

    const token = await configuration.callbacks.jwt({
      token: {
        authVersion: 4,
        id: 'user-1',
        locale: 'en',
        sessionStartedAt: 1_786_089_600,
      },
    });

    expect(token.invalidated).toBe(true);
  });

  it('exposes the absolute expiry and removes the user id from invalid sessions', () => {
    const session = configuration.callbacks.session({
      session: {
        expires: '2099-01-01T00:00:00.000Z',
        user: {
          id: 'placeholder',
          locale: 'en',
        },
      },
      token: {
        id: 'user-1',
        invalidated: true,
        locale: 'fr',
        sessionStartedAt: 1_786_089_600,
      },
    });

    expect(session).toEqual({
      expires: '2026-08-14T08:00:00.000Z',
      user: {
        id: '',
        locale: 'fr',
      },
    });
  });
});
