'use client';

import {
  useEffect,
  useRef,
  type MouseEvent,
  type ReactNode,
} from 'react';

export type DialogSize = 'md' | 'lg';

export type DialogProps = {
  open: boolean;
  onClose: () => void;
  ariaLabel: string;
  children: ReactNode;
  size?: DialogSize;
};

export type DialogActionsProps = {
  children: ReactNode;
};

const sizeClassNames: Record<DialogSize, string> = {
  md: 'sm:max-w-xl',
  lg: 'sm:max-w-3xl',
};

export function Dialog({
  open,
  onClose,
  ariaLabel,
  children,
  size = 'md',
}: DialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const dialogElement = dialogRef.current;

    if (!dialogElement) {
      return;
    }

    if (open) {
      if (dialogElement.open) {
        return;
      }

      returnFocusRef.current =
        document.activeElement instanceof HTMLElement
          ? document.activeElement
          : null;
      dialogElement.showModal();

      requestAnimationFrame(() => {
        if (!dialogElement.open) {
          return;
        }

        dialogElement
          .querySelector<HTMLElement>(
            '[autofocus], input:not([type="hidden"]):not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])',
          )
          ?.focus();
      });

      return;
    }

    if (dialogElement.open) {
      dialogElement.close();
    }

    returnFocusRef.current?.focus();
  }, [open]);

  function handleBackdropClick(event: MouseEvent<HTMLDialogElement>) {
    if (event.target === event.currentTarget) {
      event.currentTarget.close();
    }
  }

  return (
    <dialog
      ref={dialogRef}
      aria-label={ariaLabel}
      onClose={onClose}
      onClick={handleBackdropClick}
      className={[
        'backdrop:bg-overlay-scrim fixed inset-x-0 top-auto bottom-0 m-0 max-h-[calc(100dvh-0.5rem)] w-full max-w-none overflow-y-auto overscroll-contain border-0 bg-transparent p-0 shadow-2xl',
        'sm:inset-auto sm:m-auto sm:max-h-[calc(100dvh-2rem)] sm:w-[calc(100%-2rem)]',
        '[&>form]:mt-0 [&>form]:rounded-t-xl sm:[&>form]:rounded-xl',
        sizeClassNames[size],
      ].join(' ')}
    >
      {children}
    </dialog>
  );
}

export function DialogActions({ children }: DialogActionsProps) {
  return (
    <div className="border-border-subtle bg-surface-primary sticky bottom-0 -mx-5 mt-6 grid grid-cols-2 gap-3 border-t px-5 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:-mx-6 sm:flex sm:justify-end sm:px-6 sm:pb-5">
      {children}
    </div>
  );
}
