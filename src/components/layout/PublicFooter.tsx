import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { PublicBrandLockup } from './PublicBrandLockup';

const legalNavigationMessages = {
  en: {
    privacy: 'Privacy',
    terms: 'Terms',
  },
  fr: {
    privacy: 'Confidentialité',
    terms: 'Conditions d’utilisation',
  },
} satisfies Record<Locale, { privacy: string; terms: string }>;

export function PublicFooter({
  isAuthenticated = false,
}: {
  isAuthenticated?: boolean;
}) {
  const t = useTranslations('PublicFooter');
  const locale = useLocale() as Locale;
  const legalMessages = legalNavigationMessages[locale];
  const accountHref = isAuthenticated ? '/app' : '/login';

  return (
    <footer className="border-border-subtle bg-background-sunken border-t">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 md:grid-cols-[1fr_auto] lg:px-8">
        <div className="max-w-sm">
          <PublicBrandLockup />
          <p className="text-content-secondary mt-4 text-sm leading-6">
            {t('description')}
          </p>
        </div>

        <nav
          aria-label={t('navigationLabel')}
          className="grid gap-3 text-sm sm:grid-cols-2 sm:gap-x-10"
        >
          <Link
            href="/#product"
            className="text-content-secondary hover:text-content-primary transition"
          >
            {t('product')}
          </Link>
          <Link
            href="/examples"
            className="text-content-secondary hover:text-content-primary transition"
          >
            {t('example')}
          </Link>
          <Link
            href="/learn"
            className="text-content-secondary hover:text-content-primary transition"
          >
            {t('learn')}
          </Link>
          <Link
            href="/pricing"
            className="text-content-secondary hover:text-content-primary transition"
          >
            {t('pricing')}
          </Link>
          <Link
            href={accountHref}
            className="text-content-secondary hover:text-content-primary transition"
          >
            {isAuthenticated ? t('dashboard') : t('signIn')}
          </Link>
          <Link
            href="/terms"
            className="text-content-secondary hover:text-content-primary transition"
          >
            {legalMessages.terms}
          </Link>
          <Link
            href="/privacy"
            className="text-content-secondary hover:text-content-primary transition"
          >
            {legalMessages.privacy}
          </Link>
        </nav>
      </div>

      <div className="border-border-subtle border-t px-6 py-4 lg:px-8">
        <p className="text-content-tertiary mx-auto max-w-7xl text-xs">
          {t('copyright', { year: new Date().getFullYear() })}
        </p>
      </div>
    </footer>
  );
}
