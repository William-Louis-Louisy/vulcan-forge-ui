'use client';

import { useEffect } from 'react';
import type { ComponentProps, ReactNode, RefObject } from 'react';
import { createPortal } from 'react-dom';
import { ArrowRightIcon } from '@phosphor-icons/react';

import { Link } from '@/i18n/navigation';

type MobileNavigationPanelProps = {
  children: ReactNode;
  contentRef: RefObject<HTMLDivElement | null>;
  id: string;
  topOffsetClassName: 'top-12' | 'top-14';
};

type MobileNavigationLinkRowProps = Omit<
  ComponentProps<typeof Link>,
  'children'
> & {
  children: ReactNode;
  index: number;
  isActive?: boolean;
};

type MobileNavigationDisabledRowProps = {
  children: ReactNode;
  index: number;
  trailing?: ReactNode;
};

type MobileNavigationFooterProps = {
  actions: ReactNode;
  leading: ReactNode;
};

export function MobileNavigationPanel({
  children,
  contentRef,
  id,
  topOffsetClassName,
}: MobileNavigationPanelProps) {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  if (typeof document === 'undefined') {
    return null;
  }

  return createPortal(
    <div
      ref={contentRef}
      id={id}
      className={[
        'border-border-subtle bg-background-app fixed inset-x-0 bottom-0 z-50 overflow-y-auto border-t',
        topOffsetClassName,
      ].join(' ')}
    >
      <div className="mx-auto flex min-h-full max-w-7xl flex-col px-6 py-8 sm:px-8 sm:py-10">
        {children}
      </div>
    </div>,
    document.body,
  );
}

export function MobileNavigationLinkRow({
  children,
  className,
  index,
  isActive = false,
  ...props
}: MobileNavigationLinkRowProps) {
  return (
    <Link
      className={[
        'group flex items-center gap-5 py-5 sm:py-6',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      <span
        aria-hidden="true"
        className="text-action-accent w-6 shrink-0 font-mono text-[10px] font-semibold"
      >
        {String(index).padStart(2, '0')}
      </span>
      <span
        className={[
          'font-display flex-1 text-2xl leading-none font-semibold tracking-[-0.025em] sm:text-3xl',
          isActive ? 'text-action-accent' : 'text-content-primary',
        ].join(' ')}
      >
        {children}
      </span>
      <span
        className={[
          'flex size-9 shrink-0 items-center justify-center rounded-full border transition sm:size-10',
          isActive
            ? 'border-action-accent bg-action-accent/10 text-action-accent'
            : 'border-border-subtle bg-surface-primary text-content-secondary group-hover:border-border-strong group-hover:text-content-primary',
        ].join(' ')}
      >
        <ArrowRightIcon aria-hidden="true" size={16} weight="bold" />
      </span>
    </Link>
  );
}

export function MobileNavigationDisabledRow({
  children,
  index,
  trailing,
}: MobileNavigationDisabledRowProps) {
  return (
    <div
      aria-disabled="true"
      className="text-content-tertiary flex items-center gap-5 py-5 opacity-70 sm:py-6"
    >
      <span
        aria-hidden="true"
        className="w-6 shrink-0 font-mono text-[10px] font-semibold"
      >
        {String(index).padStart(2, '0')}
      </span>
      <span className="font-display flex-1 text-2xl leading-none font-semibold tracking-[-0.025em] sm:text-3xl">
        {children}
      </span>
      {trailing ? <span className="shrink-0">{trailing}</span> : null}
    </div>
  );
}

export function MobileNavigationFooter({
  actions,
  leading,
}: MobileNavigationFooterProps) {
  return (
    <div className="mt-auto pt-10 sm:pt-12">
      <div className="border-border-subtle grid gap-6 border-t pt-6 sm:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] sm:items-end">
        {leading}
        {actions}
      </div>
    </div>
  );
}
