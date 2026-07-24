import { auth } from '@/auth';
import { hasLocale } from 'next-intl';
import { notFound, redirect } from 'next/navigation';

import { BrandProfileEditor } from '@/features/brand/BrandProfileEditor';
import { getBrandProfilePageData } from '@/features/brand/brand-profile.queries';
import { routing, type Locale } from '@/i18n/routing';

type BrandProfilePageProps = {
  params: Promise<{
    locale: string;
    projectSlug: string;
  }>;
};

export default async function BrandProfilePage({
  params,
}: BrandProfilePageProps) {
  const { locale: requestedLocale, projectSlug } = await params;

  if (!hasLocale(routing.locales, requestedLocale)) {
    notFound();
  }

  const locale = requestedLocale as Locale;
  const session = await auth();

  if (!session?.user?.id) {
    redirect(`/${locale}/login`);
  }

  const pageData = await getBrandProfilePageData({
    userId: session.user.id,
    projectSlug,
  });

  if (!pageData) {
    notFound();
  }

  return (
    <BrandProfileEditor
      interfaceLocale={locale}
      project={pageData.project}
      initialProfile={pageData.profile}
    />
  );
}
