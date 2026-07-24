'use client';

import { useTranslations } from 'next-intl';

import { Button, WorkspaceState } from '@/components/ui';

export default function ProjectOverviewError({ reset }: { reset: () => void }) {
  const t = useTranslations('ProjectOverviewPage');

  return (
    <section className="flex min-h-80 items-center justify-center p-4 md:p-6 xl:absolute xl:inset-0 xl:min-h-0">
      <WorkspaceState
        role="alert"
        tone="danger"
        align="start"
        headingLevel={1}
        eyebrow={t('states.errorEyebrow')}
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
