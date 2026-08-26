import type { Metadata } from 'next';
import { ArrowRightIcon, CheckIcon } from '@phosphor-icons/react/dist/ssr';
import { hasLocale } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { LearnCurriculumNav } from '@/features/learn/LearnCurriculumNav';
import { routing, type Locale } from '@/i18n/routing';

const questionKeys = ['anatomy', 'variants', 'states', 'behavior'] as const;
const definitionItemKeys = ['purpose', 'anatomy', 'axes', 'rules'] as const;
const anatomyKeys = ['root', 'label', 'icon'] as const;
const axisKeys = ['variant', 'size', 'state'] as const;
const ruleKeys = [
  'purpose',
  'usage',
  'content',
  'accessibility',
  'forbidden',
] as const;
const bindingKeys = ['background', 'foreground', 'radius', 'paddingX'] as const;
const accessibilityKeys = ['accessibleName', 'keyboard', 'semantics'] as const;
const sourceKeys = ['preview', 'documentation', 'ai', 'accessibility'] as const;
const productItemKeys = [
  'identity',
  'lifecycle',
  'localization',
  'anatomy',
  'axes',
  'bindings',
  'workspace',
  'downstream',
] as const;
const demoSequenceKeys = ['decision', 'token', 'theme', 'component'] as const;
const checkpointKeys = ['one', 'two', 'three', 'four', 'five'] as const;

type LearnComponentsPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export async function generateMetadata({
  params,
}: LearnComponentsPageProps): Promise<Metadata> {
  const { locale: requestedLocale } = await params;
  const locale = hasLocale(routing.locales, requestedLocale)
    ? (requestedLocale as Locale)
    : routing.defaultLocale;
  const t = await getTranslations({
    locale,
    namespace: 'LearnComponentsPage.metadata',
  });

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function LearnComponentsPage() {
  const t = await getTranslations('LearnComponentsPage');
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
              {curriculumT('chapterLabel', { number: '04' })}
            </p>
            <p className="mt-4 text-base leading-7 font-semibold">
              {t('hero.learnerQuestion')}
            </p>
          </blockquote>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-14 px-6 py-16 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-16 lg:px-8 lg:py-20">
        <article className="min-w-0">
          <section aria-labelledby="component-problem-title">
            <SectionHeading
              eyebrow={t('openingProblem.eyebrow')}
              title={t('openingProblem.title')}
              description={t('openingProblem.description')}
              titleId="component-problem-title"
            />

            <div className="mt-10 grid gap-4 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
              <div className="border-border-subtle bg-background-sunken flex min-h-64 flex-col border p-5 sm:p-6">
                <p className="text-content-tertiary text-[10px] font-semibold tracking-[0.14em] uppercase">
                  {t('openingProblem.visualLabel')}
                </p>
                <div className="flex flex-1 items-center justify-center py-10">
                  <button
                    type="button"
                    className="bg-action-accent text-on-action-accent min-h-11 rounded-md px-5 text-sm font-semibold"
                  >
                    {t('openingProblem.buttonLabel')}
                  </button>
                </div>
              </div>

              <div className="border-border-subtle bg-surface-primary border p-5 sm:p-6">
                <p className="text-content-tertiary text-[10px] font-semibold tracking-[0.14em] uppercase">
                  {t('openingProblem.questionLabel')}
                </p>
                <ul className="mt-5 grid gap-3">
                  {questionKeys.map((key) => (
                    <li
                      key={key}
                      className="border-border-subtle flex gap-3 border-t pt-3 text-sm leading-6 first:border-t-0 first:pt-0"
                    >
                      <span
                        aria-hidden="true"
                        className="text-action-accent font-mono font-semibold"
                      >
                        ?
                      </span>
                      <span>{t(`openingProblem.questions.${key}`)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <p className="border-action-accent bg-action-accent/5 mt-6 border-l-2 p-5 text-base leading-7 font-medium">
              {t('openingProblem.conclusion')}
            </p>
          </section>

          <section className="mt-20" aria-labelledby="component-contract-title">
            <SectionHeading
              eyebrow={t('definition.eyebrow')}
              title={t('definition.title')}
              description={t('definition.description')}
              titleId="component-contract-title"
            />

            <div className="mt-10 grid items-stretch gap-4 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,0.75fr)] lg:items-center">
              <div className="border-action-accent bg-action-accent/5 border p-5 sm:p-6">
                <p className="text-action-accent text-[10px] font-semibold tracking-[0.14em] uppercase">
                  {t('definition.contractLabel')}
                </p>
                <p className="font-display mt-3 text-3xl font-semibold tracking-[-0.03em]">
                  {t('definition.contractName')}
                </p>
                <ul className="mt-5 space-y-2">
                  {definitionItemKeys.map((key) => (
                    <li key={key} className="flex gap-2 text-sm leading-6">
                      <CheckIcon
                        aria-hidden="true"
                        className="text-action-success mt-1 shrink-0"
                        size={14}
                        weight="bold"
                      />
                      <span>{t(`definition.items.${key}`)}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <FlowArrow />

              <div className="border-border-subtle bg-surface-primary border p-5 sm:p-6">
                <p className="text-content-tertiary text-[10px] font-semibold tracking-[0.14em] uppercase">
                  {t('definition.instanceLabel')}
                </p>
                <p className="mt-4 text-xl font-semibold">
                  {t('definition.instanceName')}
                </p>
                <p className="text-content-secondary mt-2 font-mono text-xs [overflow-wrap:anywhere]">
                  {t('definition.instanceMeta')}
                </p>
              </div>
            </div>

            <p className="text-content-primary mt-6 text-base leading-7 font-semibold">
              {t('definition.rule')}
            </p>
          </section>

          <section className="mt-20" aria-labelledby="component-anatomy-title">
            <SectionHeading
              eyebrow={t('anatomy.eyebrow')}
              title={t('anatomy.title')}
              description={t('anatomy.description')}
              titleId="component-anatomy-title"
            />

            <div className="border-border-subtle bg-background-sunken mt-10 border p-5 sm:p-7">
              <p className="text-content-tertiary text-[10px] font-semibold tracking-[0.14em] uppercase">
                {t('anatomy.sampleLabel')}
              </p>

              <div className="mt-6 grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(14rem,0.8fr)] md:items-center">
                <div className="border-action-accent/40 bg-action-accent/5 relative flex min-h-36 items-center justify-center border border-dashed p-6">
                  <div className="bg-action-accent text-on-action-accent flex min-h-11 items-center gap-2 rounded-md px-5 text-sm font-semibold">
                    <span
                      aria-hidden="true"
                      className="border-on-action-accent/60 size-4 rounded-sm border"
                    />
                    <span>{t('openingProblem.buttonLabel')}</span>
                  </div>
                </div>

                <dl className="border-border-subtle bg-surface-primary divide-border-subtle divide-y border">
                  {anatomyKeys.map((key) => (
                    <div
                      key={key}
                      className="flex items-center justify-between gap-4 px-4 py-3"
                    >
                      <dt className="font-mono text-xs font-semibold">
                        {t(`anatomy.parts.${key}.label`)}
                      </dt>
                      <dd className="text-content-tertiary font-mono text-[10px] uppercase">
                        {t(`anatomy.parts.${key}.requirement`)}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>

            <p className="border-action-warning bg-action-warning/5 mt-6 border-l-2 p-5 text-sm leading-6">
              {t('anatomy.boundary')}
            </p>
          </section>

          <section className="mt-20" aria-labelledby="component-axes-title">
            <SectionHeading
              eyebrow={t('axes.eyebrow')}
              title={t('axes.title')}
              description={t('axes.description')}
              titleId="component-axes-title"
            />

            <div className="mt-10 grid gap-3 md:grid-cols-3">
              {axisKeys.map((key) => (
                <article
                  key={key}
                  className="border-border-subtle bg-surface-primary border p-5"
                >
                  <p className="text-action-accent text-xs font-semibold tracking-[0.12em] uppercase">
                    {t(`axes.items.${key}.label`)}
                  </p>
                  <p className="mt-4 font-mono text-xs font-semibold [overflow-wrap:anywhere]">
                    {t(`axes.items.${key}.values`)}
                  </p>
                  <p className="text-content-secondary mt-4 text-sm leading-6">
                    {t(`axes.items.${key}.meaning`)}
                  </p>
                </article>
              ))}
            </div>

            <div className="border-border-subtle bg-background-sunken mt-5 flex flex-col gap-2 border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-content-tertiary text-[10px] font-semibold tracking-[0.12em] uppercase">
                {t('axes.instanceLabel')}
              </span>
              <code className="text-content-primary font-mono text-xs font-semibold [overflow-wrap:anywhere]">
                {t('axes.instance')}
              </code>
            </div>

            <p className="text-content-secondary mt-5 text-sm leading-6">
              {t('axes.rule')}
            </p>
          </section>

          <section className="mt-20" aria-labelledby="component-rules-title">
            <SectionHeading
              eyebrow={t('rules.eyebrow')}
              title={t('rules.title')}
              description={t('rules.description')}
              titleId="component-rules-title"
            />

            <div className="border-border-subtle bg-border-subtle mt-10 grid gap-px border sm:grid-cols-2">
              {ruleKeys.map((key) => (
                <article key={key} className="bg-surface-primary p-5">
                  <h3 className="text-sm font-semibold">
                    {t(`rules.items.${key}.title`)}
                  </h3>
                  <p className="text-content-secondary mt-2 text-sm leading-6">
                    {t(`rules.items.${key}.description`)}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section className="mt-20" aria-labelledby="component-bindings-title">
            <SectionHeading
              eyebrow={t('bindings.eyebrow')}
              title={t('bindings.title')}
              description={t('bindings.description')}
              titleId="component-bindings-title"
            />

            <div className="border-border-subtle bg-border-subtle mt-10 grid gap-px border">
              <div className="bg-background-sunken hidden grid-cols-[minmax(7rem,0.7fr)_minmax(0,1.5fr)_minmax(7rem,0.7fr)] gap-4 px-5 py-3 text-[10px] font-semibold tracking-[0.12em] uppercase md:grid">
                <span className="text-content-tertiary">
                  {t('bindings.roleLabel')}
                </span>
                <span className="text-content-tertiary">
                  {t('bindings.pathLabel')}
                </span>
                <span className="text-content-tertiary">
                  {t('bindings.valueLabel')}
                </span>
              </div>
              {bindingKeys.map((key) => (
                <div
                  key={key}
                  className="bg-surface-primary grid min-w-0 gap-3 p-5 md:grid-cols-[minmax(7rem,0.7fr)_minmax(0,1.5fr)_minmax(7rem,0.7fr)] md:items-center md:gap-4"
                >
                  <BindingCell
                    label={t('bindings.roleLabel')}
                    value={t(`bindings.items.${key}.role`)}
                  />
                  <BindingCell
                    label={t('bindings.pathLabel')}
                    value={t(`bindings.items.${key}.path`)}
                    mono
                  />
                  <BindingCell
                    label={t('bindings.valueLabel')}
                    value={t(`bindings.items.${key}.value`)}
                    mono
                  />
                </div>
              ))}
            </div>

            <p className="border-action-warning bg-action-warning/5 mt-6 border-l-2 p-5 text-sm leading-6 font-semibold">
              {t('bindings.boundary')}
            </p>
          </section>

          <section
            className="mt-20"
            aria-labelledby="component-accessibility-title"
          >
            <SectionHeading
              eyebrow={t('accessibility.eyebrow')}
              title={t('accessibility.title')}
              description={t('accessibility.description')}
              titleId="component-accessibility-title"
            />

            <ul className="mt-10 grid gap-3 md:grid-cols-3">
              {accessibilityKeys.map((key) => (
                <li
                  key={key}
                  className="border-border-subtle bg-surface-primary flex gap-3 border p-5 text-sm leading-6"
                >
                  <CheckIcon
                    aria-hidden="true"
                    className="text-action-success mt-1 shrink-0"
                    size={15}
                    weight="bold"
                  />
                  <span>{t(`accessibility.items.${key}`)}</span>
                </li>
              ))}
            </ul>

            <p className="border-action-accent bg-action-accent/5 mt-6 border-l-2 p-5 text-sm leading-6">
              {t('accessibility.product')}
            </p>
          </section>

          <section className="mt-20" aria-labelledby="structured-source-title">
            <SectionHeading
              eyebrow={t('structuredSource.eyebrow')}
              title={t('structuredSource.title')}
              description={t('structuredSource.description')}
              titleId="structured-source-title"
            />

            <ul className="border-border-subtle bg-border-subtle mt-10 grid gap-px border sm:grid-cols-2">
              {sourceKeys.map((key) => (
                <li
                  key={key}
                  className="bg-surface-primary flex gap-3 p-5 text-sm leading-6"
                >
                  <ArrowRightIcon
                    aria-hidden="true"
                    className="text-action-accent mt-1 shrink-0"
                    size={14}
                    weight="bold"
                  />
                  <span>{t(`structuredSource.items.${key}`)}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-20" aria-labelledby="component-product-title">
            <SectionHeading
              eyebrow={t('productBridge.eyebrow')}
              title={t('productBridge.title')}
              description={t('productBridge.description')}
              titleId="component-product-title"
            />

            <div className="border-border-subtle bg-background-sunken mt-10 border p-5">
              <p className="text-content-tertiary text-[10px] font-semibold tracking-[0.12em] uppercase">
                {t('productBridge.typesLabel')}
              </p>
              <p className="mt-3 font-mono text-sm font-semibold [overflow-wrap:anywhere]">
                {t('productBridge.types')}
              </p>
            </div>

            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {productItemKeys.map((key) => (
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

            <p className="border-action-warning bg-action-warning/5 mt-6 border-l-2 p-5 text-sm leading-6 font-semibold">
              {t('productBridge.boundary')}
            </p>
          </section>

          <section className="mt-20" aria-labelledby="component-demo-title">
            <SectionHeading
              eyebrow={t('demo.eyebrow')}
              title={t('demo.title')}
              description={t('demo.description')}
              titleId="component-demo-title"
            />

            <div className="border-border-subtle bg-border-subtle mt-10 grid gap-px border sm:grid-cols-2 xl:grid-cols-4">
              {demoSequenceKeys.map((key, index) => (
                <div key={key} className="bg-surface-primary p-5">
                  <p className="text-action-accent font-mono text-xs font-semibold">
                    0{index + 1}
                  </p>
                  <p className="mt-4 text-sm leading-6 font-semibold">
                    {t(`demo.sequence.${key}`)}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section
            className="border-action-accent bg-action-accent/5 mt-20 border-l-2 p-6 sm:p-8"
            aria-labelledby="component-misconception-title"
          >
            <p className="text-action-accent text-xs font-semibold tracking-[0.16em] uppercase">
              {t('misconception.eyebrow')}
            </p>
            <h2
              id="component-misconception-title"
              className="font-display mt-4 text-3xl font-semibold tracking-[-0.03em] text-balance"
            >
              {t('misconception.title')}
            </h2>
            <p className="text-content-secondary mt-5 max-w-3xl text-base leading-7">
              {t('misconception.description')}
            </p>
          </section>

          <section className="mt-20" aria-labelledby="component-checkpoint-title">
            <SectionHeading
              eyebrow={t('checkpoint.eyebrow')}
              title={t('checkpoint.title')}
              description={t('checkpoint.description')}
              titleId="component-checkpoint-title"
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
              <h2 className="font-display mt-4 text-3xl font-semibold tracking-[-0.03em]">
                {t('continue.title')}
              </h2>
              <p className="text-content-secondary mt-4 text-sm leading-6 sm:text-base">
                {t('continue.description')}
              </p>
            </div>
          </section>

          <div className="mt-16 lg:hidden">
            <LearnCurriculumNav
              variant="compact"
              currentChapterKey="components"
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
              currentChapterKey="components"
            />
          </div>
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
        className="font-display mt-4 text-3xl font-semibold tracking-[-0.03em] text-balance sm:text-4xl"
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
        size={18}
        weight="bold"
      />
    </div>
  );
}

function BindingCell({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="min-w-0">
      <p className="text-content-tertiary text-[10px] font-semibold tracking-[0.1em] uppercase md:hidden">
        {label}
      </p>
      <p
        className={`mt-1 min-w-0 text-sm [overflow-wrap:anywhere] md:mt-0 ${mono ? 'font-mono text-xs font-semibold' : 'font-semibold'}`}
      >
        {value}
      </p>
    </div>
  );
}
