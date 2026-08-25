import type { Metadata } from 'next';
import { ArrowRightIcon } from '@phosphor-icons/react/dist/ssr';
import { getTranslations } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { routing, type Locale } from '@/i18n/routing';
import { PublicButtonLink } from '@/components/layout/PublicButtonLink';
import { LearnCurriculumNav } from '@/features/learn/LearnCurriculumNav';

type LearnPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

const progressionKeys = [
  'intent',
  'tokens',
  'system',
  'accessibility',
  'delivery',
  'ai',
] as const;

export async function generateMetadata({
  params,
}: LearnPageProps): Promise<Metadata> {
  const { locale: requestedLocale } = await params;
  const locale = hasLocale(routing.locales, requestedLocale)
    ? (requestedLocale as Locale)
    : routing.defaultLocale;
  const t = await getTranslations({ locale, namespace: 'LearnPage.metadata' });

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function LearnPage() {
  const t = await getTranslations('LearnPage');

  return (
    <main className="bg-background-app text-content-primary">
      <section className="border-border-subtle border-b px-6 py-20 sm:py-24 lg:px-8 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[minmax(0,0.82fr)_minmax(24rem,0.58fr)] lg:items-end lg:gap-20">
          <div className="max-w-4xl">
            <p className="text-action-accent text-xs font-semibold tracking-[0.2em] uppercase">
              {t('hero.eyebrow')}
            </p>
            <h1 className="font-display mt-5 text-5xl leading-[0.96] font-semibold tracking-[-0.05em] text-balance sm:text-6xl lg:text-7xl">
              {t('hero.titleBefore')}{' '}
              <em className="text-action-accent font-medium">
                {t('hero.titleAccent')}
              </em>
            </h1>
            <p className="text-content-secondary mt-7 max-w-3xl text-lg leading-8 sm:text-xl">
              {t('hero.description')}
            </p>
          </div>

          <div className="border-border-subtle bg-surface-primary border p-5 sm:p-6">
            <p className="text-content-tertiary font-mono text-[10px] font-semibold tracking-[0.14em] uppercase">
              01 → 07
            </p>
            <p className="mt-4 text-lg font-semibold">
              {t('curriculum.title')}
            </p>
            <p className="text-content-secondary mt-3 text-sm leading-6">
              {t('hero.reassurance')}
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-action-accent text-xs font-semibold tracking-[0.2em] uppercase">
              {t('curriculum.eyebrow')}
            </p>
            <h2 className="font-display mt-4 text-4xl font-semibold tracking-[-0.04em] text-balance sm:text-5xl">
              {t('curriculum.title')}
            </h2>
            <p className="text-content-secondary mt-5 text-base leading-7 sm:text-lg">
              {t('curriculum.description')}
            </p>
          </div>

          <div className="mt-12">
            <LearnCurriculumNav />
          </div>
        </div>
      </section>

      <section className="border-border-subtle bg-background-sunken border-y px-6 py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.48fr)_minmax(0,1fr)] lg:gap-20">
            <div className="max-w-xl">
              <p className="text-action-accent text-xs font-semibold tracking-[0.2em] uppercase">
                {t('progression.eyebrow')}
              </p>
              <h2 className="font-display mt-4 text-4xl font-semibold tracking-[-0.04em] text-balance sm:text-5xl">
                {t('progression.title')}
              </h2>
              <p className="text-content-secondary mt-5 text-base leading-7">
                {t('progression.description')}
              </p>
            </div>

            <ol className="border-border-subtle bg-border-subtle grid gap-px border sm:grid-cols-2 xl:grid-cols-3">
              {progressionKeys.map((key, index) => (
                <li key={key} className="bg-surface-primary min-h-32 p-5">
                  <p className="text-content-tertiary font-mono text-[10px] tracking-[0.14em] uppercase">
                    {String(index + 1).padStart(2, '0')}
                  </p>
                  <p className="mt-7 text-sm font-semibold">
                    {t(`progression.nodes.${key}`)}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="px-6 py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-action-accent text-xs font-semibold tracking-[0.2em] uppercase">
              {t('boundary.eyebrow')}
            </p>
            <h2 className="font-display mt-4 text-4xl font-semibold tracking-[-0.04em] text-balance sm:text-5xl">
              {t('boundary.title')}
            </h2>
          </div>

          <div className="mt-10 grid gap-px border border-border-subtle bg-border-subtle md:grid-cols-2">
            <article className="bg-surface-primary p-6 sm:p-8">
              <p className="text-action-accent font-mono text-xs font-semibold uppercase">
                01 · {t('boundary.learnTitle')}
              </p>
              <p className="text-content-secondary mt-5 max-w-xl text-base leading-7">
                {t('boundary.learnDescription')}
              </p>
            </article>

            <article className="bg-surface-primary p-6 sm:p-8">
              <p className="text-content-tertiary font-mono text-xs font-semibold uppercase">
                02 · {t('boundary.examplesTitle')}
              </p>
              <p className="text-content-secondary mt-5 max-w-xl text-base leading-7">
                {t('boundary.examplesDescription')}
              </p>
              <div className="mt-7">
                <PublicButtonLink
                  href="/examples"
                  variant="secondary"
                  size="sm"
                  className="gap-2"
                >
                  {t('boundary.examplesCta')}
                  <ArrowRightIcon aria-hidden="true" size={15} weight="bold" />
                </PublicButtonLink>
              </div>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}
