'use client';

import type { Locale } from '@/i18n/routing';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { getLocaleSwitcherOptions } from '@/i18n/locale-switcher';

export function LocaleSwitcher() {
  const currentLocale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations('LocaleSwitcher');

  const options = getLocaleSwitcherOptions(currentLocale);

  function handleLocaleChange(nextLocale: Locale) {
    if (nextLocale === currentLocale) {
      return;
    }

    router.replace(pathname, { locale: nextLocale });
  }

  return (
    <nav aria-label={t('label')} className="inline-flex">
      <ul className="border-border-subtle bg-surface-primary inline-flex items-center gap-1 rounded-sm border">
        {options.map((option) => (
          <li key={option.locale} className="inline-flex h-full items-center">
            <button
              type="button"
              aria-current={option.isActive ? 'true' : undefined}
              aria-label={t('switchTo', { locale: option.label })}
              disabled={option.isActive}
              onClick={() => handleLocaleChange(option.locale)}
              className={[
                'h-full rounded-sm px-3 py-2 text-xs font-semibold transition',
                'focus-visible:outline-border-focus focus-visible:outline-2 focus-visible:outline-offset-2',
                option.isActive
                  ? 'bg-action-primary text-action-primary-content cursor-default'
                  : 'text-content-secondary hover:bg-surface-secondary hover:text-content-primary',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <span aria-hidden="true">{option.shortLabel}</span>
              <span className="sr-only">
                {option.isActive
                  ? t('currentLanguage', { locale: option.label })
                  : option.label}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
