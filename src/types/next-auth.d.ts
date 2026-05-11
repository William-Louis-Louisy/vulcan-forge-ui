import type { DefaultSession } from 'next-auth';
import type { AppLocale } from '@/domain/i18n';

declare module 'next-auth' {
  interface User {
    id: string;
    locale: AppLocale;
  }

  interface Session {
    user: {
      id: string;
      locale: AppLocale;
    } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    locale: AppLocale;
  }
}
