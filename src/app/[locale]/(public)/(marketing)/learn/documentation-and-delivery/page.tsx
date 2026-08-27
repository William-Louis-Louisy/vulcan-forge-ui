import type { Metadata } from 'next';
import { ArrowRightIcon, CheckIcon } from '@phosphor-icons/react/dist/ssr';
import { hasLocale } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { LearnCurriculumNav } from '@/features/learn/LearnCurriculumNav';
import { routing, type Locale } from '@/i18n/routing';

const copyKeys = ['documentation', 'css', 'typescript', 'native'] as const;
const consumerKeys = [
  'documentation',
  'css',
  'tailwind',
  'typescript',
  'native',
] as const;
const formatKeys = ['css', 'tailwind', 'typescript', 'native'] as const;
const documentationSectionKeys = [
  'overview',
  'tokens',
  'themes',
  'components',
  'accessibility',
] as const;
const diagnosticKeys = [
  'resolution',
  'deprecated',
  'themes',
  'translations',
] as const;
const productFormatKeys = [
  'css',
  'tailwind',
  'typescript',
  'native',
  'markdown',
] as const;
const snapshotKeys = ['source', 'regenerate', 'integrate'] as const;
const demoSequenceKeys = [
  'source',
  'validate',
  'generate',
  'integrate',
] as const;
const checkpointKeys = ['one', 'two', 'three', 'four', 'five'] as const;

type LearnDocumentationDeliveryPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export async function generateMetadata({
  params,
}: LearnDocumentationDeliveryPageProps): Promise<Metadata> {
  const { locale: requestedLocale } = await params;
  const locale = hasLocale(routing.locales, requestedLocale)
    ? (requestedLocale as Locale)
    : routing.defaultLocale;
  const t = await getTranslations({
    locale,
    namespace: 'LearnDocumentationDeliveryPage.metadata',
  });

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function LearnDocumentationDeliveryPage() {
  const t = await getTranslations('LearnDocumentationDeliveryPage');
  const curriculumT = await getTranslations('LearnPage.curriculum');

  return (
    <main className="bg-background-app text-content-primary">
      <section className="border-border-subtle border-b px-6 py-16 sm:py-20 lg:px-8 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-end lg:gap-16">
          <div className="max-w-4xl">
            <p className="text-action-accent text-xs font-semibold tracking-[0.2em] uppercase">
              {t('hero.chapter')}
            </p>
            <h1 className="font-display mt-5 text-5xl leading-[0.98] font-semibold tracking-[-0.05em] text-pretty sm:text-6xl lg:text-7xl">
              {t('hero.title')}
            </h1>
            <p className="text-content-secondary mt-7 max-w-3xl text-lg leading-8 sm:text-xl">
              {t('hero.description')}
            </p>
          </div>

          <blockquote className="border-action-accent bg-surface-primary border-l-2 p-5 sm:p-6">
            <p className="text-content-tertiary font-mono text-[10px] font-semibold tracking-[0.14em] uppercase">
              {curriculumT('chapterLabel', { number: '06' })}
            </p>
            <p className="mt-4 text-base leading-7 font-semibold">
              {t('hero.learnerQuestion')}
            </p>
          </blockquote>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-14 px-6 py-16 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-16 lg:px-8 lg:py-20">
        <article className="min-w-0">
          <section aria-labelledby="delivery-problem-title">
            <SectionHeading
              eyebrow={t('openingProblem.eyebrow')}
              title={t('openingProblem.title')}
              description={t('openingProblem.description')}
              titleId="delivery-problem-title"
            />

            <div className="border-border-subtle bg-background-sunken mt-10 border p-5 sm:p-7">
              <div className="border-border-subtle bg-surface-primary border p-5">
                <p className="text-content-tertiary text-[10px] font-semibold tracking-[0.14em] uppercase">
                  {t('openingProblem.sourceLabel')}
                </p>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                  <code className="min-w-0 text-sm font-semibold break-all">
                    {t('openingProblem.sourcePath')}
                  </code>
                  <span className="text-action-accent shrink-0 font-mono text-sm font-semibold">
                    {t('openingProblem.sourceValue')}
                  </span>
                </div>
              </div>

              <p className="text-content-tertiary mt-6 text-[10px] font-semibold tracking-[0.14em] uppercase">
                {t('openingProblem.copiesLabel')}
              </p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {copyKeys.map((key) => (
                  <div
                    key={key}
                    className="border-border-subtle bg-surface-primary border p-4 font-mono text-xs font-semibold"
                  >
                    {t(`openingProblem.copies.${key}`)}
                  </div>
                ))}
              </div>

              <div className="border-action-danger bg-action-danger/5 mt-5 border-l-2 p-4">
                <p className="text-action-danger text-[10px] font-semibold tracking-[0.14em] uppercase">
                  {t('openingProblem.driftLabel')}
                </p>
                <p className="mt-2 font-mono text-sm font-semibold">
                  {t('openingProblem.driftValue')}
                </p>
              </div>
            </div>

            <p className="border-action-accent bg-action-accent/5 mt-6 border-l-2 p-5 text-base leading-7 font-medium">
              {t('openingProblem.conclusion')}
            </p>
          </section>

          <section className="mt-20" aria-labelledby="delivery-source-title">
            <SectionHeading
              eyebrow={t('canonicalSource.eyebrow')}
              title={t('canonicalSource.title')}
              description={t('canonicalSource.description')}
              titleId="delivery-source-title"
            />

            <div className="mt-10 grid gap-5 lg:grid-cols-[minmax(0,0.8fr)_auto_minmax(0,1.2fr)] lg:items-center">
              <div className="border-action-accent bg-action-accent/5 border p-5">
                <p className="text-action-accent text-[10px] font-semibold tracking-[0.14em] uppercase">
                  {t('canonicalSource.sourceLabel')}
                </p>
                <p className="mt-4 text-sm leading-6 font-semibold">
                  {t('canonicalSource.sourceItems')}
                </p>
              </div>

              <ArrowRightIcon
                aria-hidden="true"
                className="text-content-tertiary mx-auto rotate-90 lg:rotate-0"
                size={20}
              />

              <div>
                <p className="text-content-tertiary text-[10px] font-semibold tracking-[0.14em] uppercase">
                  {t('canonicalSource.consumerLabel')}
                </p>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {consumerKeys.map((key) => (
                    <div
                      key={key}
                      className="border-border-subtle bg-surface-primary border p-3 text-sm font-semibold"
                    >
                      {t(`canonicalSource.consumers.${key}`)}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <p className="text-content-primary mt-6 text-base leading-7 font-semibold">
              {t('canonicalSource.rule')}
            </p>
          </section>

          <section className="mt-20" aria-labelledby="delivery-decision-title">
            <SectionHeading
              eyebrow={t('oneDecision.eyebrow')}
              title={t('oneDecision.title')}
              description={t('oneDecision.description')}
              titleId="delivery-decision-title"
            />

            <div className="border-border-subtle bg-background-sunken mt-10 border p-5 sm:p-7">
              <div className="border-border-subtle bg-surface-primary border p-5">
                <p className="text-content-tertiary text-[10px] font-semibold tracking-[0.14em] uppercase">
                  {t('oneDecision.tokenLabel')}
                </p>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                  <code className="min-w-0 text-sm font-semibold break-all">
                    {t('oneDecision.tokenPath')}
                  </code>
                  <span className="text-action-accent shrink-0 font-mono text-sm font-semibold">
                    {t('oneDecision.tokenValue')}
                  </span>
                </div>
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-2">
                {formatKeys.map((key) => (
                  <article
                    key={key}
                    className="border-border-subtle bg-surface-primary min-w-0 border"
                  >
                    <header className="border-border-subtle flex flex-wrap items-center justify-between gap-2 border-b px-4 py-3">
                      <h3 className="text-sm font-semibold">
                        {t(`oneDecision.formats.${key}.label`)}
                      </h3>
                      <span className="text-content-tertiary font-mono text-[10px]">
                        {t(`oneDecision.formats.${key}.file`)}
                      </span>
                    </header>
                    <pre className="overflow-x-auto p-4 text-xs leading-6">
                      <code>{t(`oneDecision.formats.${key}.snippet`)}</code>
                    </pre>
                  </article>
                ))}
              </div>
            </div>

            <p className="text-content-secondary mt-5 text-sm leading-6">
              {t('oneDecision.boundary')}
            </p>
          </section>

          <section
            className="mt-20"
            aria-labelledby="delivery-documentation-title"
          >
            <SectionHeading
              eyebrow={t('documentation.eyebrow')}
              title={t('documentation.title')}
              description={t('documentation.description')}
              titleId="delivery-documentation-title"
            />

            <div className="border-border-subtle bg-surface-primary mt-10 border">
              <header className="border-border-subtle bg-background-sunken border-b px-5 py-4">
                <p className="text-content-tertiary text-[10px] font-semibold tracking-[0.14em] uppercase">
                  {t('documentation.sectionsLabel')}
                </p>
              </header>
              <ul className="divide-border-subtle divide-y">
                {documentationSectionKeys.map((key) => (
                  <li
                    key={key}
                    className="flex gap-3 px-5 py-4 text-sm leading-6"
                  >
                    <CheckIcon
                      aria-hidden="true"
                      className="text-action-success mt-1 shrink-0"
                      size={15}
                      weight="bold"
                    />
                    <span>{t(`documentation.sections.${key}`)}</span>
                  </li>
                ))}
              </ul>
            </div>

            <p className="border-action-accent bg-action-accent/5 mt-6 border-l-2 p-5 text-sm leading-6 font-medium">
              {t('documentation.localization')}
            </p>
          </section>

          <section
            className="mt-20"
            aria-labelledby="delivery-diagnostics-title"
          >
            <SectionHeading
              eyebrow={t('diagnostics.eyebrow')}
              title={t('diagnostics.title')}
              description={t('diagnostics.description')}
              titleId="delivery-diagnostics-title"
            />

            <ul className="mt-10 grid gap-3 sm:grid-cols-2">
              {diagnosticKeys.map((key) => (
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
                  <span>{t(`diagnostics.items.${key}`)}</span>
                </li>
              ))}
            </ul>

            <p className="text-content-primary mt-6 text-base leading-7 font-semibold">
              {t('diagnostics.rule')}
            </p>
          </section>

          <section className="mt-20" aria-labelledby="delivery-snapshot-title">
            <SectionHeading
              eyebrow={t('snapshot.eyebrow')}
              title={t('snapshot.title')}
              description={t('snapshot.description')}
              titleId="delivery-snapshot-title"
            />

            <div className="mt-10 grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)] lg:items-stretch">
              {snapshotKeys.map((key, index) => (
                <div key={key} className="contents">
                  <div className="border-border-subtle bg-surface-primary flex min-h-28 items-center border p-5 text-center text-sm leading-6 font-semibold lg:justify-center">
                    {t(`snapshot.flow.${key}`)}
                  </div>
                  {index < snapshotKeys.length - 1 ? <FlowArrow /> : null}
                </div>
              ))}
            </div>

            <p className="border-action-warning bg-action-warning/5 mt-6 border-l-2 p-5 text-sm leading-6 font-semibold">
              {t('snapshot.notSync')}
            </p>
          </section>

          <section className="mt-20" aria-labelledby="delivery-product-title">
            <SectionHeading
              eyebrow={t('productBridge.eyebrow')}
              title={t('productBridge.title')}
              description={t('productBridge.description')}
              titleId="delivery-product-title"
            />

            <div className="border-border-subtle bg-background-sunken mt-10 border p-5 sm:p-6">
              <p className="text-content-tertiary text-[10px] font-semibold tracking-[0.14em] uppercase">
                {t('productBridge.formatsLabel')}
              </p>
              <p className="mt-3 text-sm leading-6 font-semibold">
                {t('productBridge.formats')}
              </p>
            </div>

            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {productFormatKeys.map((key) => (
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

            <p className="border-action-accent bg-action-accent/5 mt-6 border-l-2 p-5 text-sm leading-6 font-semibold">
              {t('productBridge.deferred')}
            </p>
          </section>

          <section className="mt-20" aria-labelledby="delivery-demo-title">
            <SectionHeading
              eyebrow={t('demo.eyebrow')}
              title={t('demo.title')}
              description={t('demo.description')}
              titleId="delivery-demo-title"
            />

            <div className="border-border-subtle bg-border-subtle mt-10 grid gap-px border sm:grid-cols-2 xl:grid-cols-4">
              {demoSequenceKeys.map((key) => (
                <div key={key} className="bg-surface-primary p-5">
                  <p className="text-sm leading-6 font-semibold">
                    {t(`demo.sequence.${key}`)}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section
            className="border-action-accent bg-action-accent/5 mt-20 border-l-2 p-6 sm:p-8"
            aria-labelledby="delivery-misconception-title"
          >
            <p className="text-action-accent text-xs font-semibold tracking-[0.16em] uppercase">
              {t('misconception.eyebrow')}
            </p>
            <h2
              id="delivery-misconception-title"
              className="font-display mt-4 text-3xl font-semibold tracking-[-0.03em] text-pretty"
            >
              {t('misconception.title')}
            </h2>
            <p className="text-content-secondary mt-5 max-w-3xl text-base leading-7">
              {t('misconception.description')}
            </p>
          </section>

          <section
            className="mt-20"
            aria-labelledby="delivery-checkpoint-title"
          >
            <SectionHeading
              eyebrow={t('checkpoint.eyebrow')}
              title={t('checkpoint.title')}
              description={t('checkpoint.description')}
              titleId="delivery-checkpoint-title"
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
            <div className="max-w-2xl">
              <div className="flex flex-wrap items-center gap-3">
                <p className="text-action-accent text-xs font-semibold tracking-[0.16em] uppercase">
                  {t('continue.eyebrow')}
                </p>
                <span className="border-action-accent/30 bg-action-accent/10 text-action-accent rounded-full border px-2.5 py-1 text-[10px] font-semibold tracking-[0.08em] uppercase">
                  {t('continue.status')}
                </span>
              </div>
              <h2 className="font-display mt-4 text-3xl font-semibold tracking-[-0.03em] text-pretty">
                {t('continue.title')}
              </h2>
              <p className="text-content-secondary mt-4 text-sm leading-6 sm:text-base">
                {t('continue.description')}
              </p>
              <ArrowRightIcon
                aria-hidden="true"
                className="text-action-accent mt-6"
                size={22}
              />
            </div>
          </section>
        </article>

        <aside className="min-w-0 lg:sticky lg:top-24 lg:self-start">
          <LearnCurriculumNav
            variant="compact"
            currentChapterKey="documentationDelivery"
          />
        </aside>
      </div>
    </main>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
  titleId,
}: {
  eyebrow: string;
  title: string;
  description: string;
  titleId: string;
}) {
  return (
    <div className="max-w-3xl">
      <p className="text-action-accent text-xs font-semibold tracking-[0.16em] uppercase">
        {eyebrow}
      </p>
      <h2
        id={titleId}
        className="font-display mt-4 text-3xl font-semibold tracking-[-0.035em] text-pretty sm:text-4xl"
      >
        {title}
      </h2>
      <p className="text-content-secondary mt-5 text-base leading-7">
        {description}
      </p>
    </div>
  );
}

function FlowArrow() {
  return (
    <div className="text-content-tertiary flex items-center justify-center py-1 lg:py-0">
      <ArrowRightIcon
        aria-hidden="true"
        className="rotate-90 lg:rotate-0"
        size={16}
      />
    </div>
  );
}
