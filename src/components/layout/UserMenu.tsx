'use client';

import { GearSixIcon } from '@phosphor-icons/react';

import { useDismissiblePopover } from '@/components/interaction/useDismissiblePopover';
import { LogoutButton } from '@/features/auth/logout/LogoutButton';
import { Link } from '@/i18n/navigation';

type UserMenuProps = {
  userEmail: string;
  ariaLabel: string;
  accountLabel: string;
  settingsLabel: string;
};

function getInitials(email: string) {
  const [namePart] = email.split('@');

  if (!namePart) {
    return 'U';
  }

  const parts = namePart.split(/[._-]/).filter(Boolean);

  const initials =
    parts.length >= 2
      ? parts
          .slice(0, 2)
          .map((part) => part[0])
          .join('')
      : namePart.slice(0, 2);

  return initials.toUpperCase() || 'U';
}

export function UserMenu({
  userEmail,
  ariaLabel,
  accountLabel,
  settingsLabel,
}: UserMenuProps) {
  const { close, containerRef, isOpen, toggle, triggerRef } =
    useDismissiblePopover();
  const initials = getInitials(userEmail);
  const popoverId = 'app-user-menu';

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-label={ariaLabel}
        aria-expanded={isOpen}
        aria-controls={popoverId}
        onClick={toggle}
        className="border-border-subtle bg-background-subtle text-content-secondary hover:bg-surface-secondary focus-visible:outline-border-focus flex size-8 items-center justify-center rounded-full border text-xs font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        {initials}
      </button>

      {isOpen ? (
        <div
          id={popoverId}
          className="border-border-subtle bg-surface-primary shadow-elevated absolute top-full right-0 z-40 mt-2 w-64 max-w-[calc(100vw-1rem)] rounded-md border p-3"
        >
          <p className="text-content-tertiary text-[11px] font-semibold tracking-[0.16em] uppercase">
            {accountLabel}
          </p>

          <p className="mt-2 truncate text-sm font-semibold">{userEmail}</p>

          <div className="border-border-subtle mt-3 border-t pt-3">
            <Link
              href="/app/settings"
              onClick={close}
              className="text-content-secondary hover:bg-background-subtle hover:text-content-primary focus-visible:outline-border-focus flex min-h-9 items-center gap-2 rounded-md px-2.5 text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              <GearSixIcon aria-hidden="true" size={16} />
              <span>{settingsLabel}</span>
            </Link>
          </div>

          <div className="border-border-subtle mt-3 border-t pt-3">
            <LogoutButton />
          </div>
        </div>
      ) : null}
    </div>
  );
}
