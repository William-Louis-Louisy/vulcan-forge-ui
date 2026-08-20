'use client';

import { useEffect } from 'react';
import { ListIcon, XIcon } from '@phosphor-icons/react';

import { LocaleSwitcher } from '@/components/i18n/LocaleSwitcher';
import { useDismissiblePopover } from '@/components/interaction/useDismissiblePopover';
import { LogoutButton } from '@/features/auth/logout/LogoutButton';
import type { PrivateNavigationItemKey } from '@/features/app-navigation/private-navigation';
import { Link } from '@/i18n/navigation';
import { AppShellNavigation } from './AppShellNavigation';
import {
  MobileNavigationFooter,
  MobileNavigationPanel,
} from './MobileNavigationPanel';

type MobileAppMenuProps = {
  userEmail: string;
  ariaLabel: string;
  accountLabel: string;
  settingsLabel: string;
  navigationLabel: string;
  navigationItems: Record<PrivateNavigationItemKey, string>;
};

export function MobileAppMenu({
  userEmail,
  ariaLabel,
  accountLabel,
  settingsLabel,
  navigationLabel,
  navigationItems,
}: MobileAppMenuProps) {
  const { close, containerRef, contentRef, isOpen, toggle, triggerRef } =
    useDismissiblePopover();
  const menuId = 'mobile-app-menu';

  useEffect(() => {
    const desktopMedia = window.matchMedia('(min-width: 1024px)');

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
      <div ref={containerRef} className="relative">
        <button
          ref={triggerRef}
          type="button"
          aria-label={ariaLabel}
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
          topOffsetClassName="top-12"
        >
          <AppShellNavigation
            navigationLabel={navigationLabel}
            labels={navigationItems}
            onNavigate={close}
            variant="fullscreen"
          />

          <MobileNavigationFooter
            leading={
              <div className="grid gap-4">
                <div>
                  <p className="text-content-tertiary text-[11px] font-semibold tracking-[0.16em] uppercase">
                    {accountLabel}
                  </p>
                  <p className="text-content-primary mt-2 truncate text-sm font-semibold">
                    {userEmail}
                  </p>
                </div>

                <LocaleSwitcher
                  fullWidth
                  showLabel
                  onLocaleChange={close}
                />
              </div>
            }
            actions={
              <div className="grid gap-2 sm:grid-cols-2">
                <Link
                  href="/app/settings"
                  onClick={close}
                  className="border-border-default bg-surface-primary text-content-primary hover:bg-surface-secondary focus-visible:outline-border-focus inline-flex min-h-10 items-center justify-center rounded-md border px-4 py-2 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                  {settingsLabel}
                </Link>

                <LogoutButton className="border-border-default bg-surface-primary text-content-primary hover:bg-surface-secondary focus-visible:outline-border-focus flex min-h-10 w-full items-center justify-center rounded-md border px-4 py-2 focus-visible:outline-2 focus-visible:outline-offset-2" />
              </div>
            }
          />
        </MobileNavigationPanel>
      ) : null}
    </>
  );
}
