import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authorizeCredentials } from '@/server/auth/credentials-authorizer';
import {
  AUTH_SESSION_ABSOLUTE_MAX_AGE_SECONDS,
  getAuthEpochSeconds,
  getAuthSessionExpiresAtIso,
  isAuthSessionWithinAbsoluteLifetime,
  resolveAuthSessionStartedAt,
} from '@/server/auth/session-policy';
import { isAuthSessionVersionCurrent } from '@/server/auth/session-version';

const nextAuth = NextAuth({
  session: {
    strategy: 'jwt',
    maxAge: AUTH_SESSION_ABSOLUTE_MAX_AGE_SECONDS,
  },
  jwt: {
    maxAge: AUTH_SESSION_ABSOLUTE_MAX_AGE_SECONDS,
  },
  providers: [
    Credentials({
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
        },
        password: {
          label: 'Password',
          type: 'password',
        },
      },
      authorize: authorizeCredentials,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.authVersion = user.authVersion;
        token.id = user.id;
        token.invalidated = false;
        token.locale = user.locale;
        token.sessionStartedAt = getAuthEpochSeconds();
        return token;
      }

      const sessionStartedAt = resolveAuthSessionStartedAt({
        sessionStartedAt: token.sessionStartedAt,
        tokenIssuedAt: token.iat,
      });

      if (
        typeof token.authVersion !== 'number' ||
        typeof token.id !== 'string' ||
        sessionStartedAt === null ||
        !isAuthSessionWithinAbsoluteLifetime({ sessionStartedAt })
      ) {
        token.invalidated = true;
        return token;
      }

      token.sessionStartedAt = sessionStartedAt;
      token.invalidated = !(await isAuthSessionVersionCurrent({
        authVersion: token.authVersion,
        userId: token.id,
      }));

      return token;
    },
    session({ session, token }) {
      const tokenId = typeof token.id === 'string' ? token.id : '';
      const tokenLocale = token.locale === 'fr' ? 'fr' : 'en';
      const sessionStartedAt = resolveAuthSessionStartedAt({
        sessionStartedAt: token.sessionStartedAt,
        tokenIssuedAt: token.iat,
      });

      session.user.id = token.invalidated ? '' : tokenId;
      session.user.locale = tokenLocale;

      if (sessionStartedAt !== null) {
        const expires = getAuthSessionExpiresAtIso({ sessionStartedAt });

        if (expires) {
          session.expires = expires;
        }
      }

      return session;
    },
  },
});

export const { auth, handlers, signIn, signOut } = nextAuth;

/**
 * Explicit alias used by the verification journey to document that pending
 * accounts are valid authenticated sessions. Email verification is a product
 * trust signal and a prerequisite for selected sensitive features, not a
 * global authorization boundary for the workspace.
 */
export const authForEmailVerification = auth;
