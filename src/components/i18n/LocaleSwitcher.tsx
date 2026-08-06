'use client';

import type { Locale } from '@/i18n/routing';
import { useLocale, useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { usePathname, useRouter } from '@/i18n/navigation';
import { getLocaleSwitcherOptions } from '@/i18n/locale-switcher';
import { getLocalizedAuthReturnTo } from '@/features/auth/shared/return-to';

type LocaleSwitcherProps = {
  className?: string;
  fullWidth?: boolean;
  showLabel?: boolean;
};

export function LocaleSwitcher({
  className,
  fullWidth = false,
  showLabel = false,
}: LocaleSwitcherProps = {}) {
  const currentLocale = useLocale() as Locale;
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const t = useTranslations('LocaleSwitcher');

  const options = getLocaleSwitcherOptions(currentLocale);

  function handleLocaleChange(nextLocale: Locale) {
    if (nextLocale === currentLocale) {
      return;
    }

    const nextSearchParams = new URLSearchParams(searchParams.toString());
    const returnTo = nextSearchParams.get('returnTo');

    if (returnTo) {
      nextSearchParams.set(
        'returnTo',
        getLocalizedAuthReturnTo({
          currentLocale,
          nextLocale,
          returnTo,
        }),
      );
    }

    const query = nextSearchParams.toString();
    const destination = query ? `${pathname}?${query}` : pathname;

    router.replace(destination, { locale: nextLocale });
  }

  return (
    <div
      className={[fullWidth ? 'w-full' : 'inline-flex', className]
        .filter(Boolean)
        .join(' ')}
    >
      {showLabel ? (
        <p className="text-content-tertiary mb-2 text-[11px] font-semibold tracking-[0.16em] uppercase">
          {t('label')}
        </p>
      ) : null}

      <nav
        aria-label={t('label')}
        className={fullWidth ? 'w-full' : 'inline-flex'}
      >
        <ul
          className={[
            'border-border-subtle bg-surface-primary items-center gap-1 rounded-sm border',
            fullWidth ? 'grid w-full grid-cols-2' : 'inline-flex',
          ].join(' ')}
        >
          {options.map((option) => (
            <li key={option.locale} className="inline-flex h-full items-center">
              <button
                type="button"
                aria-current={option.isActive ? 'true' : undefined}
                aria-label={t('switchTo', { locale: option.label })}
                disabled={option.isActive}
                onClick={() => handleLocaleChange(option.locale)}
                className={[
                  'h-full cursor-pointer rounded-sm px-3 py-2 text-xs font-semibold transition',
                  'focus-visible:outline-border-focus focus-visible:outline-2 focus-visible:outline-offset-2',
                  fullWidth ? 'w-full' : '',
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
    </div>
  );
}
