import { getTranslations } from 'next-intl/server';
import { auth } from '@/auth';

export default async function AppPage() {
  const session = await auth();
  const t = await getTranslations('AppPage');

  return (
    <section className="mx-auto max-w-5xl">
      <p className="text-action-primary text-sm font-semibold tracking-[0.24em] uppercase">
        {t('eyebrow')}
      </p>

      <h1 className="mt-4 text-4xl font-semibold tracking-tight">
        {t('title')}
      </h1>

      <p className="text-content-secondary mt-4 max-w-2xl">
        {t('signedInAs', {
          email: session?.user?.email ?? t('unknownUser'),
        })}
      </p>
    </section>
  );
}
