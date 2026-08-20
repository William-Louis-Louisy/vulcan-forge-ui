'use client';

import { useEffect } from 'react';
import { ArrowRightIcon, ListIcon, XIcon } from '@phosphor-icons/react';
import { LocaleSwitcher } from '@/components/i18n/LocaleSwitcher';
import { useDismissiblePopover } from '@/components/interaction/useDismissiblePopover';
import { Link } from '@/i18n/navigation';
import { PublicButtonLink } from './PublicButtonLink';

type PublicMobileMenuProps = {
  isAuthenticated: boolean;
  labels: {
    close: string;
    dashboard: string;
    example: string;
    getStarted: string;
    navigation: string;
    open: string;
    pricing: string;
    product: string;
    signIn: string;
  };
};

const navigationItems = [
  { href: '/#product', key: 'product' },
  { href: '/pricing', key: 'pricing' },
  { href: '/examples', key: 'example' },
] as const;

export function PublicMobileMenu({
  isAuthenticated,
  labels,
}: PublicMobileMenuProps) {
  const { close, containerRef, isOpen, toggle, triggerRef } =
    useDismissiblePopover();
  const menuId = 'public-mobile-menu';

  useEffect(() => {
    const desktopMedia = window.matchMedia('(min-width: 768px)');

    function handleBreakpointChange(event: MediaQueryListEvent) {
      if (event.matches) {
        close();
      }
    }

    desktopMedia.addEventListener('change', handleBreakpointChange);

    return () => {
      desktopMedia.removeEventListener('change', handleBreakpointChange);
    };
  }, [close]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative md:hidden">
      <button
        ref={triggerRef}
        type="button"
        aria-label={isOpen ? labels.close : labels.open}
        aria-expanded={isOpen}
        aria-controls={menuId}
        onClick={toggle}
        className={[
          'flex size-10 items-center justify-center rounded-md border transition',
          'focus-visible:outline-border-focus focus-visible:outline-2 focus-visible:outline-offset-2',
          isOpen
            ? 'border-surface-inverse bg-surface-inverse text-content-on-inverse'
            : 'border-border-subtle bg-surface-primary text-content-primary hover:bg-surface-secondary',
        ].join(' ')}
      >
        {isOpen ? (
          <XIcon aria-hidden="true" size={18} weight="bold" />
        ) : (
          <ListIcon aria-hidden="true" size={20} weight="bold" />
        )}
      </button>

      {isOpen ? (
        <div
          id={menuId}
          className="border-border-subtle bg-background-app fixed inset-x-0 top-14 bottom-0 z-50 overflow-y-auto border-t"
        >
          <div className="mx-auto flex min-h-full max-w-7xl flex-col px-6 py-8 sm:px-8 sm:py-10">
            <nav aria-label={labels.navigation}>
              <div className="border-border-subtle divide-border-subtle divide-y border-y">
                {navigationItems.map((item, index) => (
                  <Link
                    key={item.key}
                    href={item.href}
                    onClick={close}
                    className="group flex items-center gap-5 py-5 sm:py-6"
                  >
                    <span
                      aria-hidden="true"
                      className="text-action-accent w-6 shrink-0 font-mono text-[10px] font-semibold"
                    >
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="font-display flex-1 text-2xl leading-none font-semibold tracking-[-0.025em] sm:text-3xl">
                      {labels[item.key]}
                    </span>
                    <span className="border-border-subtle bg-surface-primary text-content-secondary group-hover:border-border-strong group-hover:text-content-primary flex size-9 shrink-0 items-center justify-center rounded-full border transition sm:size-10">
                      <ArrowRightIcon
                        aria-hidden="true"
                        size={16}
                        weight="bold"
                      />
                    </span>
                  </Link>
                ))}
              </div>
            </nav>

            <div className="mt-auto pt-10 sm:pt-12">
              <div className="border-border-subtle grid gap-6 border-t pt-6 sm:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] sm:items-end">
                <LocaleSwitcher fullWidth showLabel onLocaleChange={close} />

                <div className="grid gap-2 sm:grid-cols-2">
                  {isAuthenticated ? (
                    <PublicButtonLink
                      href="/app"
                      onClick={close}
                      className="w-full sm:col-span-2"
                    >
                      {labels.dashboard}
                    </PublicButtonLink>
                  ) : (
                    <>
                      <PublicButtonLink
                        href="/login"
                        variant="secondary"
                        onClick={close}
                        className="w-full"
                      >
                        {labels.signIn}
                      </PublicButtonLink>
                      <PublicButtonLink
                        href="/signup"
                        onClick={close}
                        className="w-full"
                      >
                        {labels.getStarted}
                      </PublicButtonLink>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
