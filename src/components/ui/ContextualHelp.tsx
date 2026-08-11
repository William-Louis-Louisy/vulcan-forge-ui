'use client';

import { InfoIcon } from '@phosphor-icons/react';
import { useId, useState, type KeyboardEvent } from 'react';

export type ContextualHelpProps = {
  content: string;
  ariaLabel?: string;
  className?: string;
};

export function ContextualHelp({
  content,
  ariaLabel = content,
  className,
}: ContextualHelpProps) {
  const tooltipId = useId();
  const [isOpen, setIsOpen] = useState(false);

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key !== 'Escape') {
      return;
    }

    setIsOpen(false);
    event.currentTarget.blur();
  }

  return (
    <span
      className={['group relative inline-flex shrink-0', className]
        .filter(Boolean)
        .join(' ')}
    >
      <button
        type="button"
        aria-label={ariaLabel}
        aria-describedby={tooltipId}
        onClick={() => setIsOpen((current) => !current)}
        onBlur={() => setIsOpen(false)}
        onKeyDown={handleKeyDown}
        className="text-content-tertiary hover:text-content-primary focus-visible:outline-border-focus inline-flex size-5 items-center justify-center rounded-full transition focus-visible:outline-2 focus-visible:outline-offset-1"
      >
        <InfoIcon aria-hidden="true" size={14} weight="bold" />
      </button>

      <span
        id={tooltipId}
        role="tooltip"
        className={[
          'border-border-subtle bg-surface-primary text-content-secondary shadow-elevated pointer-events-none absolute right-0 bottom-full z-60 mb-2 w-64 max-w-[calc(100vw-2rem)] rounded-md border px-3 py-2 text-xs leading-5 transition-opacity',
          isOpen
            ? 'visible opacity-100'
            : 'invisible opacity-0 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100',
        ].join(' ')}
      >
        {content}
      </span>
    </span>
  );
}
