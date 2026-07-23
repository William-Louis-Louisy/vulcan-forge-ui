'use client';

import {
  GearSixIcon,
  ListIcon,
  XIcon,
} from '@phosphor-icons/react';

import { LocaleSwitcher } from '@/components/i18n/LocaleSwitcher';
import { useDismissiblePopover } from '@/components/interaction/useDismissiblePopover';
import { LogoutButton } from '@/features/auth/logout/LogoutButton';
import type { PrivateNavigationItemKey } from '@/features/app-navigation/private-navigation';
import { Link } from '@/i18n/navigation';
import { AppShellNavigation } from './AppShellNavigation';

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
  const { close, containerRef, isOpen, toggle, triggerRef } =
    useDismissiblePopover();
  const popoverId = 'mobile-app-menu';

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-label={ariaLabel}
        aria-expanded={isOpen}
        aria-controls={popoverId}
        onClick={toggle}
        className="border-border-subtle bg-background-subtle text-content-secondary hover:bg-surface-secondary focus-visible:outline-border-focus flex size-8 items-center justify-center rounded-md border transition focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        {isOpen ? (
          <XIcon aria-hidden="true" size={18} weight="bold" />
        ) : (
          <ListIcon aria-hidden="true" size={18} weight="bold" />
        )}
      </button>

      {isOpen ? (
        <div
          id={popoverId}
          className="border-border-subtle bg-surface-primary shadow-elevated absolute top-full right-0 z-50 mt-2 max-h-[calc(100vh-4rem)] w-[min(22rem,calc(100vw-1rem))] overflow-y-auto rounded-md border p-3"
        >
          <AppShellNavigation
            navigationLabel={navigationLabel}
            labels={navigationItems}
            onNavigate={close}
          />

          <div className="border-border-subtle mt-4 border-t pt-3">
            <p className="text-content-tertiary text-[11px] font-semibold tracking-[0.16em] uppercase">
              {accountLabel}
            </p>
            <p className="mt-2 truncate text-sm font-semibold">{userEmail}</p>

            <Link
              href="/app/settings"
              onClick={close}
              className="text-content-secondary hover:bg-background-subtle hover:text-content-primary focus-visible:outline-border-focus mt-3 flex min-h-9 items-center gap-2 rounded-md px-2.5 text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              <GearSixIcon aria-hidden="true" size={16} />
              <span>{settingsLabel}</span>
            </Link>
          </div>

          <div className="border-border-subtle mt-3 border-t pt-3">
            <LocaleSwitcher fullWidth showLabel />
          </div>

          <div className="border-border-subtle mt-3 border-t pt-3">
            <LogoutButton className="hover:bg-background-subtle flex min-h-9 w-full items-center rounded-md px-2.5 text-left" />
          </div>
        </div>
      ) : null}
    </div>
  );
}
