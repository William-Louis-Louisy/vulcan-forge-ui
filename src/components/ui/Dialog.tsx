'use client';

import { useEffect, useRef, type MouseEvent, type ReactNode } from 'react';

export type DialogSize = 'md' | 'lg';

export type DialogProps = {
  open: boolean;
  onClose: () => void;
  ariaLabel: string;
  children: ReactNode;
  size?: DialogSize;
};

const sizeClassNames: Record<DialogSize, string> = {
  md: 'max-w-xl',
  lg: 'max-w-3xl',
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
        'backdrop:bg-overlay-scrim m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] overflow-y-auto border-0 bg-transparent p-0 shadow-2xl',
        '[&>form]:mt-0 [&>form]:rounded-xl',
        sizeClassNames[size],
      ].join(' ')}
    >
      {children}
    </dialog>
  );
}
