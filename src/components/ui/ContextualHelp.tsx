'use client';

import { useAnchoredTopLayerPopover } from '@/components/interaction/useAnchoredTopLayerPopover';
import { InfoIcon } from '@phosphor-icons/react';
import { useId, useRef, useState, type KeyboardEvent } from 'react';

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
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const isOpen = isHovered || isFocused || isPinned;
  const { placement, popoverStyle } = useAnchoredTopLayerPopover({
    contentKey: content,
    isOpen,
    popoverRef,
    triggerRef,
  });

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key !== 'Escape') {
      return;
    }

    setIsHovered(false);
    setIsFocused(false);
    setIsPinned(false);
    event.currentTarget.blur();
  }

  return (
    <span
      className={['inline-flex shrink-0', className].filter(Boolean).join(' ')}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-label={ariaLabel}
        aria-describedby={isOpen ? tooltipId : undefined}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onClick={() => setIsPinned((current) => !current)}
        onKeyDown={handleKeyDown}
        className="text-content-tertiary hover:text-content-primary focus-visible:outline-border-focus inline-flex size-5 items-center justify-center rounded-full transition focus-visible:outline-2 focus-visible:outline-offset-1"
      >
        <InfoIcon aria-hidden="true" size={14} weight="bold" />
      </button>

      {isOpen ? (
        <div
          ref={popoverRef}
          id={tooltipId}
          role="tooltip"
          popover="manual"
          data-placement={placement}
          style={popoverStyle}
          className="border-action-info text-content-secondary shadow-elevated pointer-events-none fixed z-80 m-0 flex w-64 max-w-[calc(100vw-2rem)] flex-row items-center rounded-md border bg-[#b0cdf5]/95 px-4 py-3 text-xs leading-5"
        >
          <span className="border-action-info mr-4">
            <InfoIcon
              aria-hidden="true"
              size={20}
              weight="fill"
              className="text-action-info"
            />
          </span>
          <span>{content}</span>
        </div>
      ) : null}
    </span>
  );
}
