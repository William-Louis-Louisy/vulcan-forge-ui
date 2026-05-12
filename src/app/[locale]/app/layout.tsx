import { hasLocale } from 'next-intl';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { routing } from '@/i18n/routing';

type AppLayoutProps = {
  children: React.ReactNode;
  params: Promise<{
    locale: string;
  }>;
};

export default async function AppLayout({ children, params }: AppLayoutProps) {
  const { locale: requestedLocale } = await params;

  const locale = hasLocale(routing.locales, requestedLocale)
    ? requestedLocale
    : routing.defaultLocale;

  const session = await auth();

  if (!session?.user) {
    redirect(`/${locale}/login`);
  }

  return children;
}
