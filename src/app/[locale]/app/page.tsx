import { auth } from '@/auth';
import { getTranslations } from 'next-intl/server';
import { LogoutButton } from '@/features/auth/logout/LogoutButton';

export default async function AppPage() {
  const session = await auth();
  const t = await getTranslations('AppPage');

  return (
    <main className="bg-background-app text-content-primary min-h-screen px-6 py-16">
      <section className="mx-auto max-w-3xl">
        <h1 className="text-4xl font-semibold tracking-tight">{t('title')}</h1>

        <p className="text-content-secondary mt-4">
          {t('signedInAs', {
            email: session?.user?.email ?? t('unknownUser'),
          })}
        </p>

        <div className="mt-8">
          <LogoutButton />
        </div>
      </section>
    </main>
  );
}
