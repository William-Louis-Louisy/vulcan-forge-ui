'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export function useDismissiblePopover() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggle = useCallback(() => {
    setIsOpen((current) => !current);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function isInsidePopover(target: EventTarget | null) {
      if (!(target instanceof Node)) {
        return false;
      }

      return Boolean(
        containerRef.current?.contains(target) ||
        contentRef.current?.contains(target),
      );
    }

    function handlePointerDown(event: PointerEvent) {
      if (!isInsidePopover(event.target)) {
        close();
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== 'Escape') {
        return;
      }

      close();
      triggerRef.current?.focus();
    }

    function handleScroll(event: Event) {
      if (isInsidePopover(event.target)) {
        return;
      }

      close();
    }

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('scroll', handleScroll, true);
    window.visualViewport?.addEventListener('scroll', handleScroll);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('scroll', handleScroll, true);
      window.visualViewport?.removeEventListener('scroll', handleScroll);
    };
  }, [close, isOpen]);

  return {
    close,
    containerRef,
    contentRef,
    isOpen,
    setIsOpen,
    toggle,
    triggerRef,
  };
}
