'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { Locale } from '@/i18n/routing';

type PreparationStatus = 'alreadyVerified' | 'confirm' | 'expired' | 'invalid';

const preparationStatuses = new Set<PreparationStatus>([
  'alreadyVerified',
  'confirm',
  'expired',
  'invalid',
]);

function getFragmentToken() {
  const fragment = window.location.hash.startsWith('#')
    ? window.location.hash.slice(1)
    : window.location.hash;

  return new URLSearchParams(fragment).get('token') ?? '';
}

function removeFragmentFromBrowserUrl() {
  window.history.replaceState(
    window.history.state,
    '',
    window.location.pathname + window.location.search,
  );
}

function getPreparationStatus(payload: unknown): PreparationStatus {
  if (
    !payload ||
    typeof payload !== 'object' ||
    !('status' in payload) ||
    typeof payload.status !== 'string' ||
    !preparationStatuses.has(payload.status as PreparationStatus)
  ) {
    return 'invalid';
  }

  return payload.status as PreparationStatus;
}

export function EmailVerificationLinkBootstrap({ locale }: { locale: Locale }) {
  const router = useRouter();

  useEffect(() => {
    const token = getFragmentToken();

    if (!token) {
      return;
    }

    removeFragmentFromBrowserUrl();

    void (async () => {
      let status: PreparationStatus = 'invalid';

      try {
        const response = await fetch('/api/auth/verify-email/prepare', {
          method: 'POST',
          body: JSON.stringify({ token }),
          cache: 'no-store',
          credentials: 'same-origin',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          status = getPreparationStatus(await response.json());
        }
      } catch {
        status = 'invalid';
      }

      router.replace(`/${locale}/verify-email?status=${status}`);
    })();
  }, [locale, router]);

  return null;
}
