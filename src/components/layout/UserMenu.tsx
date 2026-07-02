'use client';

import { useState } from 'react';

import { LogoutButton } from '@/features/auth/logout/LogoutButton';

type UserMenuProps = {
  userEmail: string;
  ariaLabel: string;
  accountLabel: string;
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
}: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const initials = getInitials(userEmail);

  return (
    <div className="relative">
      <button
        type="button"
        aria-label={ariaLabel}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
        className="border-border-subtle bg-background-subtle text-content-secondary hover:bg-surface-secondary flex size-8 items-center justify-center rounded-full border text-xs font-semibold transition"
      >
        {initials}
      </button>

      {isOpen ? (
        <div className="border-border-subtle bg-surface-primary shadow-elevated absolute top-full right-0 z-40 mt-2 min-w-56 rounded-md border p-3">
          <p className="text-content-tertiary text-[11px] font-semibold tracking-[0.16em] uppercase">
            {accountLabel}
          </p>

          <p className="mt-2 truncate text-sm font-semibold">{userEmail}</p>

          <div className="border-border-subtle mt-3 border-t pt-3">
            <LogoutButton />
          </div>
        </div>
      ) : null}
    </div>
  );
}
