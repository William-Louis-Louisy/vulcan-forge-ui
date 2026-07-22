'use client';

import { Button, WorkspaceState } from '@/components/ui';
import { useTranslations } from 'next-intl';

export default function SettingsError({ reset }: { reset: () => void }) {
  const t = useTranslations('SettingsPage');

  return (
    <section className="flex min-h-80 items-center justify-center p-4 md:p-6">
      <WorkspaceState
        role="alert"
        tone="danger"
        align="start"
        headingLevel={1}
        title={t('states.errorTitle')}
        description={t('states.errorDescription')}
        action={
          <Button type="button" size="sm" onClick={reset}>
            {t('states.retry')}
          </Button>
        }
      />
    </section>
  );
}
