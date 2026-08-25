import type { Metadata } from 'next';
import { ArrowRightIcon, CheckIcon } from '@phosphor-icons/react/dist/ssr';
import { getTranslations } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { routing, type Locale } from '@/i18n/routing';
import { LearnCurriculumNav } from '@/features/learn/LearnCurriculumNav';
import { PublicButtonLink } from '@/components/layout/PublicButtonLink';

type LearnDesignSystemsPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

const driftCardKeys = ['first', 'second', 'third'] as const;
const definitionPartKeys = [
  'language',
  'foundations',
  'components',
  'guidance',
] as const;
const libraryItemKeys = ['one', 'two', 'three'] as const;
const systemItemKeys = ['one', 'two', 'three', 'four'] as const;
const whyMatterKeys = [
  'continuity',
  'speed',
  'quality',
  'collaboration',
] as const;
const systemMapKeys = [
  'intent',
  'foundations',
  'components',
  'guidance',
  'experience',
] as const;
const productBridgeKeys = [
  'brand',
  'tokens',
  'themes',
  'components',
  'accessibility',
  'delivery',
] as const;
const checkpointKeys = ['one', 'two', 'three'] as const;

export async function generateMetadata({
  params,
}: LearnDesignSystemsPageProps): Promise<Metadata> {
  const { locale: requestedLocale } = await params;
  const locale = hasLocale(routing.locales, requestedLocale)
    ? (requestedLocale as Locale)
    : routing.defaultLocale;
  const t = await getTranslations({
    locale,
    namespace: 'LearnDesignSystemsPage.metadata',
  });

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function LearnDesignSystemsPage() {
  const t = await getTranslations('LearnDesignSystemsPage');
  const curriculumT = await getTranslations('LearnPage.curriculum');

  return (
    <main className="bg-background-app text-content-primary">
      <section className="border-border-subtle border-b px-6 py-16 sm:py-20 lg:px-8 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-end lg:gap-16">
          <div className="max-w-4xl">
            <p className="text-action-accent text-xs font-semibold tracking-[0.2em] uppercase">
              {t('hero.chapter')}
            </p>
            <h1 className="font-display mt-5 text-5xl leading-[0.98] font-semibold tracking-[-0.05em] text-balance sm:text-6xl lg:text-7xl">
              {t('hero.title')}
            </h1>
            <p className="text-content-secondary mt-7 max-w-3xl text-lg leading-8 sm:text-xl">
              {t('hero.description')}
            </p>
          </div>

          <blockquote className="border-action-accent bg-surface-primary border-l-2 p-5 sm:p-6">
            <p className="text-content-tertiary font-mono text-[10px] font-semibold tracking-[0.14em] uppercase">
              {curriculumT('chapterLabel', { number: '01' })}
            </p>
            <p className="mt-4 text-base leading-7 font-semibold">
              {t('hero.learnerQuestion')}
            </p>
          </blockquote>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-14 px-6 py-16 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-16 lg:px-8 lg:py-20">
        <article className="min-w-0">
          <section aria-labelledby="design-drift-title">
            <SectionHeading
              eyebrow={t('openingProblem.eyebrow')}
              title={t('openingProblem.title')}
              description={t('openingProblem.description')}
              titleId="design-drift-title"
            />

            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {driftCardKeys.map((key, index) => {
                const color = t(`openingProblem.cards.${key}.color`);
                const hasFocusTreatment = key !== 'third';

                return (
                  <article
                    key={key}
                    className="border-border-subtle bg-surface-primary border p-5"
                  >
                    <p className="text-content-tertiary font-mono text-[10px] font-semibold tracking-[0.12em] uppercase">
                      {t('openingProblem.screenLabel', {
                        number: String(index + 1),
                      })}
                    </p>
                    <div className="bg-background-sunken border-border-subtle mt-5 flex min-h-36 items-center justify-center border p-5">
                      <div
                        className="text-sm font-semibold"
                        style={{
                          backgroundColor: color,
                          borderRadius: key === 'second' ? 12 : 14,
                          color: '#ffffff',
                          boxShadow: hasFocusTreatment
                            ? '0 0 0 3px rgba(37, 99, 235, 0.38)'
                            : 'none',
                          padding:
                            key === 'second' ? '10px 16px' : '12px 16px',
                        }}
                      >
                        {t('openingProblem.buttonLabel')}
                      </div>
                    </div>
                    <ul className="text-content-secondary mt-5 space-y-2 text-xs leading-5">
                      <li className="text-content-primary font-mono">
                        {color}
                      </li>
                      <li>{t(`openingProblem.cards.${key}.radius`)}</li>
                      <li>{t(`openingProblem.cards.${key}.padding`)}</li>
                    </ul>
                    <p className="text-content-tertiary border-border-subtle mt-4 border-t pt-4 text-xs leading-5">
                      {t(`openingProblem.cards.${key}.focus`)}
                    </p>
                  </article>
                );
              })}
            </div>

            <p className="border-action-accent bg-action-accent/5 mt-6 border-l-2 p-5 text-base leading-7 font-medium">
              {t('openingProblem.conclusion')}
            </p>
          </section>

          <section className="mt-20" aria-labelledby="definition-title">
            <SectionHeading
              eyebrow={t('definition.eyebrow')}
              title={t('definition.title')}
              description={t('definition.intro')}
              titleId="definition-title"
            />

            <div className="border-border-subtle bg-border-subtle mt-10 grid gap-px border sm:grid-cols-2">
              {definitionPartKeys.map((key, index) => (
                <article key={key} className="bg-surface-primary p-6 sm:p-7">
                  <p className="text-action-accent font-mono text-xs font-semibold">
                    0{index + 1}
                  </p>
                  <h3 className="mt-5 text-lg font-semibold">
                    {t(`definition.parts.${key}.title`)}
                  </h3>
                  <p className="text-content-secondary mt-3 text-sm leading-6">
                    {t(`definition.parts.${key}.description`)}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section className="mt-20" aria-labelledby="distinction-title">
            <SectionHeading
              eyebrow={t('distinction.eyebrow')}
              title={t('distinction.title')}
              description={t('distinction.description')}
              titleId="distinction-title"
            />

            <div className="mt-10 grid gap-4 md:grid-cols-2">
              <ComparisonCard
                title={t('distinction.library.title')}
                items={libraryItemKeys.map((key) =>
                  t(`distinction.library.items.${key}`),
                )}
              />
              <ComparisonCard
                title={t('distinction.system.title')}
                items={systemItemKeys.map((key) =>
                  t(`distinction.system.items.${key}`),
                )}
                emphasized
              />
            </div>
          </section>

          <section className="mt-20" aria-labelledby="why-matters-title">
            <SectionHeading
              eyebrow={t('whyMatters.eyebrow')}
              title={t('whyMatters.title')}
              description={t('whyMatters.description')}
              titleId="why-matters-title"
            />

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {whyMatterKeys.map((key) => (
                <article
                  key={key}
                  className="border-border-subtle bg-surface-primary border p-6"
                >
                  <h3 className="text-lg font-semibold">
                    {t(`whyMatters.items.${key}.title`)}
                  </h3>
                  <p className="text-content-secondary mt-3 text-sm leading-6">
                    {t(`whyMatters.items.${key}.description`)}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section className="mt-20" aria-labelledby="demo-project-title">
            <SectionHeading
              eyebrow={t('demo.eyebrow')}
              title={t('demo.title')}
              description={t('demo.description')}
              titleId="demo-project-title"
            />

            <div className="mt-10 grid gap-4 md:grid-cols-2">
              <article className="border-border-subtle bg-surface-primary border p-6">
                <p className="text-content-tertiary text-xs font-semibold tracking-[0.12em] uppercase">
                  {t('demo.beforeLabel')}
                </p>
                <div className="mt-6 flex gap-2" aria-hidden="true">
                  {['#A94E2F', '#A34B31', '#A94E2F'].map((color, index) => (
                    <span
                      key={`${color}-${index}`}
                      className="border-border-subtle h-10 flex-1 border"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <p className="text-content-secondary mt-6 text-sm leading-6">
                  {t('demo.beforeDescription')}
                </p>
              </article>

              <article className="border-action-accent bg-action-accent/5 border p-6">
                <p className="text-action-accent text-xs font-semibold tracking-[0.12em] uppercase">
                  {t('demo.afterLabel')}
                </p>
                <div className="mt-6 flex items-center gap-4">
                  <span
                    className="border-border-subtle h-12 w-12 shrink-0 border"
                    style={{ backgroundColor: t('demo.decisionValue') }}
                    aria-hidden="true"
                  />
                  <div>
                    <p className="text-sm font-semibold">
                      {t('demo.decisionLabel')}
                    </p>
                    <p className="text-content-secondary mt-1 font-mono text-xs">
                      {t('demo.decisionValue')}
                    </p>
                  </div>
                </div>
                <p className="text-content-secondary mt-6 text-sm leading-6">
                  {t('demo.afterDescription')}
                </p>
              </article>
            </div>

            <p className="text-content-primary mt-6 text-base leading-7 font-semibold">
              {t('demo.bridge')}
            </p>
          </section>

          <section className="mt-20" aria-labelledby="system-map-title">
            <SectionHeading
              eyebrow={t('systemMap.eyebrow')}
              title={t('systemMap.title')}
              description={t('systemMap.description')}
              titleId="system-map-title"
            />

            <ol className="mt-10 grid gap-3 sm:grid-cols-5">
              {systemMapKeys.map((key, index) => (
                <li
                  key={key}
                  className="border-border-subtle bg-surface-primary relative border p-4"
                >
                  <p className="text-content-tertiary font-mono text-[10px]">
                    0{index + 1}
                  </p>
                  <p className="mt-4 text-sm leading-5 font-semibold">
                    {t(`systemMap.nodes.${key}`)}
                  </p>
                  {index < systemMapKeys.length - 1 ? (
                    <ArrowRightIcon
                      aria-hidden="true"
                      className="text-content-tertiary absolute top-1/2 -right-2 z-10 hidden -translate-y-1/2 sm:block"
                      size={14}
                    />
                  ) : null}
                </li>
              ))}
            </ol>
          </section>

          <section className="mt-20" aria-labelledby="product-bridge-title">
            <SectionHeading
              eyebrow={t('productBridge.eyebrow')}
              title={t('productBridge.title')}
              description={t('productBridge.description')}
              titleId="product-bridge-title"
            />

            <ul className="mt-10 grid gap-3 sm:grid-cols-2">
              {productBridgeKeys.map((key) => (
                <li
                  key={key}
                  className="border-border-subtle bg-surface-primary flex gap-3 border p-5 text-sm leading-6"
                >
                  <CheckIcon
                    aria-hidden="true"
                    className="text-action-accent mt-1 shrink-0"
                    size={15}
                    weight="bold"
                  />
                  <span>{t(`productBridge.items.${key}`)}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <PublicButtonLink
                href="/examples"
                variant="secondary"
                size="sm"
                className="gap-2"
              >
                {t('productBridge.examplesCta')}
                <ArrowRightIcon aria-hidden="true" size={15} weight="bold" />
              </PublicButtonLink>
            </div>
          </section>

          <section
            className="border-action-accent bg-action-accent/5 mt-20 border-l-2 p-6 sm:p-8"
            aria-labelledby="misconception-title"
          >
            <p className="text-action-accent text-xs font-semibold tracking-[0.16em] uppercase">
              {t('misconception.eyebrow')}
            </p>
            <h2
              id="misconception-title"
              className="font-display mt-4 text-3xl font-semibold tracking-[-0.03em] text-balance"
            >
              {t('misconception.title')}
            </h2>
            <p className="text-content-secondary mt-5 max-w-3xl text-base leading-7">
              {t('misconception.description')}
            </p>
          </section>

          <section className="mt-20" aria-labelledby="checkpoint-title">
            <SectionHeading
              eyebrow={t('checkpoint.eyebrow')}
              title={t('checkpoint.title')}
              description={t('checkpoint.description')}
              titleId="checkpoint-title"
            />

            <ul className="mt-8 space-y-3">
              {checkpointKeys.map((key) => (
                <li
                  key={key}
                  className="border-border-subtle bg-surface-primary flex gap-3 border p-4 text-sm leading-6"
                >
                  <CheckIcon
                    aria-hidden="true"
                    className="text-action-success mt-1 shrink-0"
                    size={15}
                    weight="bold"
                  />
                  <span>{t(`checkpoint.items.${key}`)}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="border-border-subtle bg-background-sunken mt-20 border p-6 sm:p-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-2xl">
                <div className="flex items-center gap-3">
                  <p className="text-action-accent text-xs font-semibold tracking-[0.16em] uppercase">
                    {t('continue.eyebrow')}
                  </p>
                  <span className="border-action-accent/30 bg-action-accent/10 text-action-accent rounded-full border px-2.5 py-1 text-[10px] font-semibold tracking-[0.08em] uppercase">
                    {t('continue.status')}
                  </span>
                </div>
                <h2 className="font-display mt-4 text-3xl font-semibold tracking-[-0.03em]">
                  {t('continue.title')}
                </h2>
                <p className="text-content-secondary mt-4 text-sm leading-6 sm:text-base">
                  {t('continue.description')}
                </p>
              </div>
            </div>
          </section>

          <div className="mt-16 lg:hidden">
            <LearnCurriculumNav
              variant="compact"
              currentChapterKey="designSystems"
            />
          </div>
        </article>

        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <p className="text-content-tertiary mb-4 text-xs font-semibold tracking-[0.14em] uppercase">
              {curriculumT('eyebrow')}
            </p>
            <LearnCurriculumNav
              variant="compact"
              currentChapterKey="designSystems"
            />
          </div>
        </aside>
      </div>
    </main>
  );
}

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description: string;
  titleId: string;
};

function SectionHeading({
  eyebrow,
  title,
  description,
  titleId,
}: SectionHeadingProps) {
  return (
    <div className="max-w-3xl">
      <p className="text-action-accent text-xs font-semibold tracking-[0.16em] uppercase">
        {eyebrow}
      </p>
      <h2
        id={titleId}
        className="font-display mt-4 text-3xl font-semibold tracking-[-0.035em] text-balance sm:text-4xl"
      >
        {title}
      </h2>
      <p className="text-content-secondary mt-5 text-base leading-7">
        {description}
      </p>
    </div>
  );
}

type ComparisonCardProps = {
  title: string;
  items: string[];
  emphasized?: boolean;
};

function ComparisonCard({
  title,
  items,
  emphasized = false,
}: ComparisonCardProps) {
  return (
    <article
      className={`border p-6 ${
        emphasized
          ? 'border-action-accent bg-action-accent/5'
          : 'border-border-subtle bg-surface-primary'
      }`}
    >
      <h3 className="text-lg font-semibold">{title}</h3>
      <ul className="mt-6 space-y-3">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-sm leading-6">
            <CheckIcon
              aria-hidden="true"
              className={
                emphasized ? 'text-action-accent' : 'text-content-tertiary'
              }
              size={15}
              weight="bold"
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}
