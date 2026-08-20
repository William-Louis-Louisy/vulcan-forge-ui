'use client';

import { useEffect } from 'react';
import { ListIcon, XIcon } from '@phosphor-icons/react';
import { LocaleSwitcher } from '@/components/i18n/LocaleSwitcher';
import { useDismissiblePopover } from '@/components/interaction/useDismissiblePopover';
import {
  MobileNavigationFooter,
  MobileNavigationLinkRow,
  MobileNavigationPanel,
} from './MobileNavigationPanel';
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
  const { close, containerRef, contentRef, isOpen, toggle, triggerRef } =
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

  return (
    <>
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
      </div>

      {isOpen ? (
        <MobileNavigationPanel
          contentRef={contentRef}
          id={menuId}
          topOffsetClassName="top-14"
        >
          <nav aria-label={labels.navigation}>
            <div className="border-border-subtle divide-border-subtle divide-y border-y">
              {navigationItems.map((item, index) => (
                <MobileNavigationLinkRow
                  key={item.key}
                  href={item.href}
                  index={index + 1}
                  onClick={close}
                >
                  {labels[item.key]}
                </MobileNavigationLinkRow>
              ))}
            </div>
          </nav>

          <MobileNavigationFooter
            leading={
              <LocaleSwitcher fullWidth showLabel onLocaleChange={close} />
            }
            actions={
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
            }
          />
        </MobileNavigationPanel>
      ) : null}
    </>
  );
}
