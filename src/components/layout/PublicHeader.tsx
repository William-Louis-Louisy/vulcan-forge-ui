import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { LocaleSwitcher } from '@/components/i18n/LocaleSwitcher';
import { PublicBrandLockup } from './PublicBrandLockup';
import { PublicButtonLink } from './PublicButtonLink';
import { PublicMobileMenu } from './PublicMobileMenu';

type PublicHeaderProps = {
  isAuthenticated?: boolean;
};

export function PublicHeader({
  isAuthenticated = false,
}: PublicHeaderProps) {
  const t = useTranslations('PublicHeader');
  const accountHref = isAuthenticated ? '/app' : '/login';

  return (
    <header className="border-border-subtle bg-background-app/95 sticky top-0 z-40 border-b backdrop-blur">
      <div className="mx-auto flex min-h-14 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          aria-label={t('homeLabel')}
          className="inline-flex shrink-0 items-center"
        >
          <PublicBrandLockup compact />
        </Link>

        <nav
          aria-label={t('navigationLabel')}
          className="ml-8 hidden items-center gap-6 md:flex"
        >
          <Link
            href="/#product"
            className="text-content-secondary hover:text-content-primary text-sm font-medium transition"
          >
            {t('product')}
          </Link>
          <Link
            href="/pricing"
            className="text-content-secondary hover:text-content-primary text-sm font-medium transition"
          >
            {t('pricing')}
          </Link>
          <Link
            href="/#example"
            className="text-content-secondary hover:text-content-primary text-sm font-medium transition"
          >
            {t('example')}
          </Link>
        </nav>

        <div className="ml-auto hidden items-center gap-3 md:flex">
          <LocaleSwitcher />

          <PublicButtonLink href={accountHref} variant="ghost" size="sm">
            {isAuthenticated ? t('dashboard') : t('signIn')}
          </PublicButtonLink>

          {!isAuthenticated ? (
            <PublicButtonLink href="/signup" size="sm">
              {t('getStarted')}
            </PublicButtonLink>
          ) : null}
        </div>

        <div className="ml-auto md:hidden">
          <PublicMobileMenu
            isAuthenticated={isAuthenticated}
            labels={{
              close: t('mobile.close'),
              dashboard: t('dashboard'),
              example: t('example'),
              getStarted: t('getStarted'),
              navigation: t('navigationLabel'),
              open: t('mobile.open'),
              pricing: t('pricing'),
              product: t('product'),
              signIn: t('signIn'),
            }}
          />
        </div>
      </div>
    </header>
  );
}
