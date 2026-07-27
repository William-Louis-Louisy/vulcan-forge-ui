import type { ReactNode } from 'react';
import { auth } from '@/auth';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { PublicHeader } from '@/components/layout/PublicHeader';

type MarketingLayoutProps = {
  children: ReactNode;
};

export default async function MarketingLayout({
  children,
}: MarketingLayoutProps) {
  const session = await auth();
  const isAuthenticated = Boolean(session?.user?.id);

  return (
    <>
      <PublicHeader isAuthenticated={isAuthenticated} />
      {children}
      <PublicFooter isAuthenticated={isAuthenticated} />
    </>
  );
}
