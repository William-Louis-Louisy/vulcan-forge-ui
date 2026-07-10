import { hasLocale } from 'next-intl';
import { notFound, redirect } from 'next/navigation';
import { routing } from '@/i18n/routing';

export default async function ProjectRootPage({
  params,
}: {
  params: Promise<{
    locale: string;
    projectSlug: string;
  }>;
}) {
  const { locale, projectSlug } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  redirect(`/${locale}/app/projects/${projectSlug}/tokens?set=color`);
}
