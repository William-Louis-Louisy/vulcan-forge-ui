import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prisma } from '@/server/db/prisma';
import { loginSchema } from '@/features/auth/login/login.schema';

export const { handlers, auth, signIn, signOut } = NextAuth({
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
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);

        if (!parsed.success) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            email: parsed.data.email,
          },
          select: {
            id: true,
            name: true,
            email: true,
            passwordHash: true,
            preferences: {
              select: {
                locale: true,
              },
            },
          },
        });

        if (!user) {
          return null;
        }

        const passwordMatches = await bcrypt.compare(
          parsed.data.password,
          user.passwordHash,
        );

        if (!passwordMatches) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          locale: user.preferences?.locale ?? 'en',
        };
      },
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
