'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { restorePendingSaveContext } from './save-context.client';

export function SaveContextRestorer() {
  const pathname = usePathname();

  useEffect(() => {
    restorePendingSaveContext(pathname);
  });

  return null;
}
