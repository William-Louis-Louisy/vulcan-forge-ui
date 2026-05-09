import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

const featureCardKeys = ['tokens', 'accessibility', 'aiReadyDocs'] as const;

export default function HomePage() {
  const t = useTranslations('HomePage');

  return (
    <main className="bg-background-app text-content-primary min-h-screen px-6 py-16">
      <section className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-5xl flex-col justify-center">
        <p className="text-content-tertiary text-sm font-semibold tracking-[0.24em] uppercase">
          {t('eyebrow')}
        </p>

        <h1 className="mt-6 max-w-4xl text-5xl font-semibold tracking-tight md:text-7xl">
          {t('title')}
        </h1>

        <p className="text-content-secondary mt-6 max-w-2xl text-lg leading-8">
          {t('description')}
        </p>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/signup"
            className="bg-action-primary text-action-primary-content shadow-soft hover:bg-action-primary-hover rounded-lg px-5 py-3 text-sm font-semibold transition"
          >
            {t('primaryCta')}
          </Link>

          <Link
            href="/pricing"
            className="border-border-default bg-surface-primary text-content-primary hover:bg-surface-secondary rounded-lg border px-5 py-3 text-sm font-semibold transition"
          >
            {t('secondaryCta')}
          </Link>
        </div>

        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {featureCardKeys.map((key) => (
            <article
              key={key}
              className="border-border-subtle bg-surface-primary shadow-soft rounded-2xl border p-5"
            >
              <h2 className="text-content-primary text-base font-semibold">
                {t(`cards.${key}.title`)}
              </h2>
              <p className="text-content-secondary mt-2 text-sm leading-6">
                {t(`cards.${key}.description`)}
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
