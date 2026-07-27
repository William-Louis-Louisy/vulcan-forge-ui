'use client';

import { ListIcon, XIcon } from '@phosphor-icons/react';
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

export function PublicMobileMenu({
  isAuthenticated,
  labels,
}: PublicMobileMenuProps) {
  const { close, containerRef, isOpen, toggle, triggerRef } =
    useDismissiblePopover();
  const menuId = 'public-mobile-menu';

  return (
    <div ref={containerRef} className="relative md:hidden">
      <button
        ref={triggerRef}
        type="button"
        aria-label={isOpen ? labels.close : labels.open}
        aria-expanded={isOpen}
        aria-controls={menuId}
        onClick={toggle}
        className="border-border-subtle bg-surface-primary text-content-primary hover:bg-surface-secondary flex size-9 items-center justify-center rounded-md border transition"
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
          className="border-border-subtle bg-surface-primary shadow-elevated absolute top-full right-0 z-50 mt-2 w-[min(21rem,calc(100vw-2rem))] rounded-md border p-3"
        >
          <nav aria-label={labels.navigation}>
            <div className="grid gap-1">
              <Link
                href="/#product"
                onClick={close}
                className="text-content-secondary hover:bg-background-subtle hover:text-content-primary rounded-md px-3 py-2.5 text-sm font-medium transition"
              >
                {labels.product}
              </Link>
              <Link
                href="/#example"
                onClick={close}
                className="text-content-secondary hover:bg-background-subtle hover:text-content-primary rounded-md px-3 py-2.5 text-sm font-medium transition"
              >
                {labels.example}
              </Link>
              <Link
                href="/pricing"
                onClick={close}
                className="text-content-secondary hover:bg-background-subtle hover:text-content-primary rounded-md px-3 py-2.5 text-sm font-medium transition"
              >
                {labels.pricing}
              </Link>
            </div>
          </nav>

          <div className="border-border-subtle mt-3 border-t pt-3">
            <LocaleSwitcher fullWidth showLabel />
          </div>

          <div className="border-border-subtle mt-3 grid gap-2 border-t pt-3">
            {isAuthenticated ? (
              <PublicButtonLink href="/app" onClick={close} className="w-full">
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
      ) : null}
    </div>
  );
}
