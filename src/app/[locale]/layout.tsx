import '../globals.css';
import type { Metadata } from 'next';
import { routing } from '@/i18n/routing';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { Fraunces, Inter_Tight, JetBrains_Mono } from 'next/font/google';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { ThemePreferenceInitScript } from '@/features/settings/ThemePreferenceInitScript';
import { PublicThemePreferenceApplier } from '@/features/settings/PublicThemePreferenceApplier';

const fraunces = Fraunces({
  variable: '--font-fraunces',
  subsets: ['latin'],
});

const interTight = Inter_Tight({
  variable: '--font-inter-tight',
  subsets: ['latin'],
});

const jetBrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
});

type GenerateMetadataProps = {
  params: Promise<{
    locale: string;
  }>;
};

export async function generateMetadata({
  params,
}: GenerateMetadataProps): Promise<Metadata> {
  const { locale: requestedLocale } = await params;

  const locale = hasLocale(routing.locales, requestedLocale)
    ? requestedLocale
    : routing.defaultLocale;

  const t = await getTranslations({
    locale,
    namespace: 'Metadata',
  });

  return {
    title: t('title'),
    description: t('description'),
  };
}

type LocaleLayoutProps = Readonly<{
  children: React.ReactNode;
  params: Promise<{
    locale: string;
  }>;
}>;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <ThemePreferenceInitScript />
      </head>

      <body
        className={`${fraunces.variable} ${interTight.variable} ${jetBrainsMono.variable} antialiased`}
      >
        <NextIntlClientProvider>
          <PublicThemePreferenceApplier />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
