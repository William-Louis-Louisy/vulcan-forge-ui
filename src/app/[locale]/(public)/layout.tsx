import type { ReactNode } from 'react';
import { PublicHeader } from '@/components/layout/PublicHeader';

type PublicLayoutProps = {
  children: ReactNode;
};

export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <>
      <PublicHeader />
      {children}
    </>
  );
}
