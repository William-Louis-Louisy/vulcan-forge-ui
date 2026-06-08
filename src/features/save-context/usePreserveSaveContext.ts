'use client';

import { useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { captureSaveContextSnapshot } from './save-context.client';

export function usePreserveSaveContext(contextId: string) {
  const pathname = usePathname();

  return useCallback(() => {
    captureSaveContextSnapshot({
      pathname,
      contextId,
    });
  }, [contextId, pathname]);
}
