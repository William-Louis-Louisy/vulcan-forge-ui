import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authorizeCredentials } from '@/server/auth/credentials-authorizer';
import { prisma } from '@/server/db/prisma';

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

export const { handlers, signIn, signOut } = nextAuth;

/**
 * Returns the current session regardless of email-verification state.
 *
 * This is intentionally restricted to the verification journey and its
 * application-route gate. Product features and server actions must use
 * `auth`, which fails closed for accounts that have not proved ownership of
 * their current email address.
 */
export const authForEmailVerification = nextAuth.auth;

/**
 * Returns an authenticated session only while the account exists and its
 * current email address is verified.
 *
 * Server Actions are independently invokable entry points, so this database
 * check complements the application layout redirect instead of relying on UI
 * navigation as an authorization boundary.
 */
export async function auth() {
  const session = await authForEmailVerification();

  if (!session?.user?.id) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      emailVerifiedAt: true,
    },
  });

  return user?.emailVerifiedAt ? session : null;
}
