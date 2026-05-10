'use client';

import { useLocale, useTranslations } from 'next-intl';
import { getLocaleSwitcherOptions } from '@/i18n/locale-switcher';
import { usePathname, useRouter } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';

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
      <ul className="border-border-subtle bg-surface-primary inline-flex items-center gap-1 rounded-full border p-1">
        {options.map((option) => (
          <li key={option.locale}>
            <button
              type="button"
              aria-current={option.isActive ? 'true' : undefined}
              aria-label={t('switchTo', { locale: option.label })}
              disabled={option.isActive}
              onClick={() => handleLocaleChange(option.locale)}
              className={[
                'min-h-8 rounded-full px-3 text-xs font-semibold transition',
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
