'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

type UseMobileNavigationControllerOptions = {
  desktopMediaQuery: string;
};

export function useMobileNavigationController({
  desktopMediaQuery,
}: UseMobileNavigationControllerOptions) {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggle = useCallback(() => {
    setIsOpen((current) => !current);
  }, []);

  useEffect(() => {
    const desktopMedia = window.matchMedia(desktopMediaQuery);

    function handleBreakpointChange(event: MediaQueryListEvent) {
      if (event.matches) {
        close();
      }
    }

    if (typeof desktopMedia.addEventListener === 'function') {
      desktopMedia.addEventListener('change', handleBreakpointChange);

      return () => {
        desktopMedia.removeEventListener('change', handleBreakpointChange);
      };
    }

    desktopMedia.addListener(handleBreakpointChange);

    return () => {
      desktopMedia.removeListener(handleBreakpointChange);
    };
  }, [close, desktopMediaQuery]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== 'Escape') {
        return;
      }

      close();
      triggerRef.current?.focus();
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [close, isOpen]);

  return {
    close,
    contentRef,
    isOpen,
    toggle,
    triggerRef,
  };
}
