import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing, type Locale } from '@/i18n/routing';
import { LegalDocumentPage } from '@/features/legal/LegalDocumentPage';
import { getLegalDocument } from '@/features/legal/legal-content';
import { getLegalPublisher } from '@/features/legal/legal-publisher';

type TermsPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export async function generateMetadata({
  params,
}: TermsPageProps): Promise<Metadata> {
  const { locale: requestedLocale } = await params;
  const locale = hasLocale(routing.locales, requestedLocale)
    ? (requestedLocale as Locale)
    : routing.defaultLocale;
  const publisher = getLegalPublisher();
  const document = getLegalDocument({ locale, kind: 'terms', publisher });

  return {
    title: `${document.title} · VulcanForge UI`,
    description: document.description,
  };
}

export default async function TermsPage({ params }: TermsPageProps) {
  const { locale: requestedLocale } = await params;

  if (!hasLocale(routing.locales, requestedLocale)) {
    notFound();
  }

  const locale = requestedLocale as Locale;
  const publisher = getLegalPublisher();
  const document = getLegalDocument({ locale, kind: 'terms', publisher });

  return <LegalDocumentPage document={document} publisher={publisher} />;
}
