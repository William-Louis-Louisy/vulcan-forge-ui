import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authorizeCredentials } from '@/server/auth/credentials-authorizer';

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
    jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.locale = user.locale as string;
      }

      return token;
    },
    session({ session, token }) {
      session.user.id = token.id as string;
      session.user.locale = token.locale as 'en' | 'fr';

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
