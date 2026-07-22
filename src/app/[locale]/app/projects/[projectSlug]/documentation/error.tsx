'use client';

import { Button, WorkspaceState } from '@/components/ui';
import { useTranslations } from 'next-intl';

export default function DocumentationGeneratorError({
  reset,
}: {
  reset: () => void;
}) {
  const t = useTranslations('DocumentationGeneratorPage');

  return (
    <section className="flex min-h-80 items-center justify-center p-4 md:p-6 xl:absolute xl:inset-0 xl:min-h-0">
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
