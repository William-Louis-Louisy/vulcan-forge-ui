import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { PublicHeader } from '@/components/layout/PublicHeader';

type AuthLayoutProps = {
  children: ReactNode;
  params: Promise<{
    locale: string;
  }>;
};

export default async function AuthLayout({
  children,
  params,
}: AuthLayoutProps) {
  const [session, { locale }] = await Promise.all([auth(), params]);

  if (session?.user?.id) {
    redirect(`/${locale}/app`);
  }

  return (
    <>
      <PublicHeader />
      {children}
    </>
  );
}
