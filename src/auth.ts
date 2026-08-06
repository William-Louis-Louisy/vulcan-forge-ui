import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authorizeCredentials } from '@/server/auth/credentials-authorizer';
import { isAuthSessionVersionCurrent } from '@/server/auth/session-version';

const nextAuth = NextAuth({
  session: {
    strategy: 'jwt',
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
        return token;
      }

      if (
        typeof token.authVersion !== 'number' ||
        typeof token.id !== 'string'
      ) {
        token.invalidated = true;
        return token;
      }

      token.invalidated = !(await isAuthSessionVersionCurrent({
        authVersion: token.authVersion,
        userId: token.id,
      }));

      return token;
    },
    session({ session, token }) {
      const tokenId = typeof token.id === 'string' ? token.id : '';
      const tokenLocale = token.locale === 'fr' ? 'fr' : 'en';

      session.user.id = token.invalidated ? '' : tokenId;
      session.user.locale = tokenLocale;

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
