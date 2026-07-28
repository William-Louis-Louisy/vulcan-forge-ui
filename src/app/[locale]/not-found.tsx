import { auth } from '@/auth';
import { ErrorState } from '@/components/ui';
import { PublicButtonLink } from '@/components/layout/PublicButtonLink';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { getTranslations } from 'next-intl/server';

export default async function LocaleNotFound() {
  const [t, session] = await Promise.all([
    getTranslations('ErrorSurfaces'),
    auth(),
  ]);
  const isAuthenticated = Boolean(session?.user?.id);

  return (
    <>
      <PublicHeader isAuthenticated={isAuthenticated} />
      <main className="bg-background-app px-6 py-16 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <ErrorState
            code={t('publicNotFound.code')}
            eyebrow={t('publicNotFound.eyebrow')}
            title={t('publicNotFound.title')}
            description={t('publicNotFound.description')}
            tone="notFound"
            primaryAction={
              <PublicButtonLink href="/" size="lg">
                {t('actions.backToHome')}
              </PublicButtonLink>
            }
            secondaryAction={
              <PublicButtonLink
                href={isAuthenticated ? '/app' : '/login'}
                variant="secondary"
                size="lg"
              >
                {isAuthenticated
                  ? t('actions.backToDashboard')
                  : t('actions.signIn')}
              </PublicButtonLink>
            }
          />
        </div>
      </main>
      <PublicFooter isAuthenticated={isAuthenticated} />
    </>
  );
}
