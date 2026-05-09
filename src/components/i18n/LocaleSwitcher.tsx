'use client';

import type { Locale } from '@/i18n/routing';
import { localeShortLabels } from '@/i18n/locales';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';

const locales = ['en', 'fr'] as const satisfies readonly Locale[];

export function LocaleSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale() as Locale;
  const t = useTranslations('LocaleSwitcher');

  function handleLocaleChange(nextLocale: Locale) {
    if (nextLocale === currentLocale) {
      return;
    }

    router.replace(pathname, { locale: nextLocale });
  }

  return (
    <div className="border-border-subtle bg-surface-primary inline-flex items-center gap-1 rounded-full border p-1">
      <span className="sr-only">{t('label')}</span>

      {locales.map((locale) => {
        const isActive = locale === currentLocale;

        return (
          <button
            key={locale}
            type="button"
            aria-pressed={isActive}
            aria-label={t('switchTo', { locale: localeShortLabels[locale] })}
            onClick={() => handleLocaleChange(locale)}
            className={[
              'min-h-8 rounded-full px-3 text-xs font-semibold transition',
              'focus-visible:outline-border-focus focus-visible:outline-2 focus-visible:outline-offset-2',
              isActive
                ? 'bg-action-primary text-action-primary-content'
                : 'text-content-secondary hover:bg-surface-secondary hover:text-content-primary',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {localeShortLabels[locale]}
          </button>
        );
      })}
    </div>
  );
}
