import { Link } from '@/i18n/navigation';
import { appConfig } from '@/config/app';
import { useTranslations } from 'next-intl';
import { LocaleSwitcher } from '@/components/i18n/LocaleSwitcher';

export function PublicHeader() {
  const t = useTranslations('PublicHeader');

  return (
    <header className="border-border-subtle bg-background-app/80 border-b backdrop-blur">
      <div className="mx-auto flex min-h-16 max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          className="text-content-primary inline-flex items-center gap-3 font-semibold"
        >
          <span className="bg-action-primary text-action-primary-content flex size-9 items-center justify-center rounded-lg text-sm font-black">
            VF
          </span>
          <span>{appConfig.name}</span>
        </Link>

        <nav
          aria-label={t('navigationLabel')}
          className="hidden items-center gap-6 md:flex"
        >
          <Link
            href="/"
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
        </nav>

        <div className="flex items-center gap-3">
          <LocaleSwitcher />

          <Link
            href="/login"
            className="border-border-default bg-surface-primary text-content-primary hover:bg-surface-secondary hidden rounded-lg border px-4 py-2 text-sm font-semibold transition sm:inline-flex"
          >
            {t('signIn')}
          </Link>

          <Link
            href="/signup"
            className="bg-action-primary text-action-primary-content shadow-soft hover:bg-action-primary-hover rounded-lg px-4 py-2 text-sm font-semibold transition"
          >
            {t('getStarted')}
          </Link>
        </div>
      </div>
    </header>
  );
}
