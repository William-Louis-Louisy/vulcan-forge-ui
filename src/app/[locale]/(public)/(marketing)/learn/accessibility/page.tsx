import type { Metadata } from 'next';
import { ArrowRightIcon, CheckIcon } from '@phosphor-icons/react/dist/ssr';
import { hasLocale } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { LearnCurriculumNav } from '@/features/learn/LearnCurriculumNav';
import { routing, type Locale } from '@/i18n/routing';

const systemLayerKeys = [
  'tokens',
  'themes',
  'components',
  'runtime',
  'humans',
] as const;
const contrastRowKeys = ['pass', 'warning', 'fail'] as const;
const automatedKeys = [
  'contrast',
  'tokenResolution',
  'componentStructure',
  'focusState',
  'bindings',
] as const;
const manualKeys = [
  'semantics',
  'keyboard',
  'assistiveTechnology',
  'content',
  'responsive',
] as const;
const productItemKeys = [
  'themes',
  'tokens',
  'components',
  'issues',
  'reports',
] as const;
const demoSequenceKeys = ['token', 'theme', 'component', 'audit'] as const;
const checkpointKeys = ['one', 'two', 'three', 'four', 'five'] as const;

type LearnAccessibilityPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export async function generateMetadata({
  params,
}: LearnAccessibilityPageProps): Promise<Metadata> {
  const { locale: requestedLocale } = await params;
  const locale = hasLocale(routing.locales, requestedLocale)
    ? (requestedLocale as Locale)
    : routing.defaultLocale;
  const t = await getTranslations({
    locale,
    namespace: 'LearnAccessibilityPage.metadata',
  });

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function LearnAccessibilityPage() {
  const t = await getTranslations('LearnAccessibilityPage');
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
              {curriculumT('chapterLabel', { number: '05' })}
            </p>
            <p className="mt-4 text-base leading-7 font-semibold">
              {t('hero.learnerQuestion')}
            </p>
          </blockquote>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-14 px-6 py-16 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-16 lg:px-8 lg:py-20">
        <article className="min-w-0">
          <section aria-labelledby="accessibility-problem-title">
            <SectionHeading
              eyebrow={t('openingProblem.eyebrow')}
              title={t('openingProblem.title')}
              description={t('openingProblem.description')}
              titleId="accessibility-problem-title"
            />

            <div className="border-border-subtle bg-background-sunken mt-10 border p-5 sm:p-7">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-content-tertiary text-[10px] font-semibold tracking-[0.14em] uppercase">
                    {t('openingProblem.roleLabel')}
                  </p>
                  <p className="mt-1 font-mono text-sm font-semibold">
                    {t('openingProblem.role')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-content-tertiary text-[10px] font-semibold tracking-[0.14em] uppercase">
                    {t('openingProblem.backgroundLabel')}
                  </p>
                  <p className="mt-1 font-mono text-sm font-semibold">
                    {t('openingProblem.backgroundValue')}
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <ContrastExampleCard
                  label={t('openingProblem.correct.label')}
                  token={t('openingProblem.correct.token')}
                  value={t('openingProblem.correct.value')}
                  ratio={t('openingProblem.correct.ratio')}
                  status={t('openingProblem.correct.status')}
                  sample={t('openingProblem.correct.sample')}
                  foreground="#3A4454"
                  tone="success"
                />
                <ContrastExampleCard
                  label={t('openingProblem.drifted.label')}
                  token={t('openingProblem.drifted.token')}
                  value={t('openingProblem.drifted.value')}
                  ratio={t('openingProblem.drifted.ratio')}
                  status={t('openingProblem.drifted.status')}
                  sample={t('openingProblem.drifted.sample')}
                  foreground="#A0B1CA"
                  tone="danger"
                />
              </div>
            </div>

            <p className="border-action-accent bg-action-accent/5 mt-6 border-l-2 p-5 text-base leading-7 font-medium">
              {t('openingProblem.conclusion')}
            </p>
          </section>

          <section
            className="mt-20"
            aria-labelledby="accessibility-system-property-title"
          >
            <SectionHeading
              eyebrow={t('systemProperty.eyebrow')}
              title={t('systemProperty.title')}
              description={t('systemProperty.description')}
              titleId="accessibility-system-property-title"
            />

            <div className="mt-10 grid gap-3 xl:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)] xl:items-stretch">
              {systemLayerKeys.map((key, index) => (
                <div key={key} className="contents">
                  <SystemLayerCard
                    number={String(index + 1).padStart(2, '0')}
                    label={t(`systemProperty.items.${key}.label`)}
                    description={t(`systemProperty.items.${key}.description`)}
                  />
                  {index < systemLayerKeys.length - 1 ? <FlowArrow /> : null}
                </div>
              ))}
            </div>

            <p className="text-content-primary mt-6 text-base leading-7 font-semibold">
              {t('systemProperty.rule')}
            </p>
          </section>

          <section className="mt-20" aria-labelledby="accessibility-contrast-title">
            <SectionHeading
              eyebrow={t('contrast.eyebrow')}
              title={t('contrast.title')}
              description={t('contrast.description')}
              titleId="accessibility-contrast-title"
            />

            <div className="border-border-subtle bg-surface-primary mt-10 border">
              <div className="border-border-subtle bg-background-sunken border-b px-5 py-4">
                <p className="text-content-tertiary text-[10px] font-semibold tracking-[0.14em] uppercase">
                  {t('contrast.productLabel')}
                </p>
              </div>

              <div className="divide-border-subtle divide-y">
                {contrastRowKeys.map((key) => (
                  <div
                    key={key}
                    className="grid gap-2 px-5 py-4 sm:grid-cols-[7.5rem_7rem_minmax(0,1fr)] sm:items-center sm:gap-4"
                  >
                    <p className="font-mono text-sm font-semibold">
                      {t(`contrast.rows.${key}.range`)}
                    </p>
                    <StatusPill
                      label={t(`contrast.rows.${key}.label`)}
                      tone={key}
                    />
                    <p className="text-content-secondary text-sm leading-6">
                      {t(`contrast.rows.${key}.meaning`)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-2">
              <p className="border-border-subtle bg-background-sunken border p-5 text-sm leading-6">
                {t('contrast.standardContext')}
              </p>
              <p className="border-action-warning bg-action-warning/5 border-l-2 p-5 text-sm leading-6 font-medium">
                {t('contrast.boundary')}
              </p>
            </div>
          </section>

          <section className="mt-20" aria-labelledby="accessibility-focus-title">
            <SectionHeading
              eyebrow={t('focus.eyebrow')}
              title={t('focus.title')}
              description={t('focus.description')}
              titleId="accessibility-focus-title"
            />

            <div className="mt-10 grid gap-4 md:grid-cols-2">
              <FocusExampleCard
                label={t('focus.withoutLabel')}
                buttonLabel={t('focus.button')}
                visible={false}
              />
              <FocusExampleCard
                label={t('focus.withLabel')}
                buttonLabel={t('focus.button')}
                visible
              />
            </div>

            <div className="border-border-subtle bg-surface-primary mt-6 grid gap-4 border p-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
              <div>
                <p className="text-content-tertiary text-[10px] font-semibold tracking-[0.14em] uppercase">
                  {t('focus.contractLabel')}
                </p>
                <p className="mt-2 font-mono text-sm font-semibold">
                  {t('focus.contractValue')}
                </p>
              </div>
              <span className="bg-action-success/10 text-action-success w-fit rounded-full px-3 py-1.5 text-xs font-semibold">
                {curriculumT('statuses.published')}
              </span>
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-2">
              <p className="border-action-accent bg-action-accent/5 border-l-2 p-5 text-sm leading-6">
                {t('focus.productRule')}
              </p>
              <p className="border-action-warning bg-action-warning/5 border-l-2 p-5 text-sm leading-6">
                {t('focus.manualRule')}
              </p>
            </div>
          </section>

          <section
            className="mt-20"
            aria-labelledby="accessibility-automation-title"
          >
            <SectionHeading
              eyebrow={t('automation.eyebrow')}
              title={t('automation.title')}
              description={t('automation.description')}
              titleId="accessibility-automation-title"
            />

            <div className="mt-10 grid gap-4 lg:grid-cols-2">
              <ValidationColumn
                label={t('automation.automatedLabel')}
                tone="success"
                items={automatedKeys.map((key) =>
                  t(`automation.automated.${key}`),
                )}
              />
              <ValidationColumn
                label={t('automation.manualLabel')}
                tone="warning"
                items={manualKeys.map((key) => t(`automation.manual.${key}`))}
              />
            </div>

            <p className="border-action-accent bg-action-accent/5 mt-6 border-l-2 p-5 text-sm leading-6 font-semibold">
              {t('automation.principle')}
            </p>
          </section>

          <section className="mt-20" aria-labelledby="accessibility-score-title">
            <SectionHeading
              eyebrow={t('score.eyebrow')}
              title={t('score.title')}
              description={t('score.description')}
              titleId="accessibility-score-title"
            />

            <div className="border-border-subtle bg-background-sunken mt-10 border p-5 sm:p-7">
              <p className="font-display text-center text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">
                {t('score.formula')}
              </p>

              <dl className="mt-7 grid gap-px overflow-hidden border border-border-subtle bg-border-subtle sm:grid-cols-4">
                <ScoreMetric
                  label={t('score.baseLabel')}
                  value={t('score.baseValue')}
                />
                <ScoreMetric
                  label={t('score.criticalLabel')}
                  value={t('score.criticalValue')}
                />
                <ScoreMetric
                  label={t('score.warningLabel')}
                  value={t('score.warningValue')}
                />
                <ScoreMetric
                  label={t('score.floorLabel')}
                  value={t('score.floorValue')}
                />
              </dl>

              <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,0.75fr)]">
                <div className="border-border-subtle bg-surface-primary border p-5">
                  <p className="text-content-tertiary text-[10px] font-semibold tracking-[0.14em] uppercase">
                    {t('score.statusesLabel')}
                  </p>
                  <ul className="mt-4 space-y-2 text-sm font-semibold">
                    <li className="text-action-success">
                      {t('score.statuses.healthy')}
                    </li>
                    <li className="text-action-warning">
                      {t('score.statuses.attention')}
                    </li>
                    <li className="text-action-danger">
                      {t('score.statuses.critical')}
                    </li>
                  </ul>
                </div>

                <div className="border-action-accent bg-action-accent/5 border p-5">
                  <p className="text-action-accent text-[10px] font-semibold tracking-[0.14em] uppercase">
                    {t('score.exampleLabel')}
                  </p>
                  <p className="mt-4 font-mono text-lg font-semibold">
                    {t('score.exampleFormula')}
                  </p>
                  <p className="text-content-secondary mt-3 text-sm leading-6">
                    {t('score.exampleMeaning')}
                  </p>
                </div>
              </div>
            </div>

            <p className="border-action-danger bg-action-danger/5 mt-6 border-l-2 p-5 text-sm leading-6 font-semibold">
              {t('score.disclaimer')}
            </p>
          </section>

          <section
            className="mt-20"
            aria-labelledby="accessibility-product-title"
          >
            <SectionHeading
              eyebrow={t('productBridge.eyebrow')}
              title={t('productBridge.title')}
              description={t('productBridge.description')}
              titleId="accessibility-product-title"
            />

            <ul className="mt-10 grid gap-3 sm:grid-cols-2">
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

          <section className="mt-20" aria-labelledby="accessibility-demo-title">
            <SectionHeading
              eyebrow={t('demo.eyebrow')}
              title={t('demo.title')}
              description={t('demo.description')}
              titleId="accessibility-demo-title"
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
            aria-labelledby="accessibility-misconception-title"
          >
            <p className="text-action-accent text-xs font-semibold tracking-[0.16em] uppercase">
              {t('misconception.eyebrow')}
            </p>
            <h2
              id="accessibility-misconception-title"
              className="font-display mt-4 text-3xl font-semibold tracking-[-0.03em] text-balance"
            >
              {t('misconception.title')}
            </h2>
            <p className="text-content-secondary mt-5 max-w-3xl text-base leading-7">
              {t('misconception.description')}
            </p>
          </section>

          <section
            className="mt-20"
            aria-labelledby="accessibility-checkpoint-title"
          >
            <SectionHeading
              eyebrow={t('checkpoint.eyebrow')}
              title={t('checkpoint.title')}
              description={t('checkpoint.description')}
              titleId="accessibility-checkpoint-title"
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
            currentChapterKey="accessibility"
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

function ContrastExampleCard({
  label,
  token,
  value,
  ratio,
  status,
  sample,
  foreground,
  tone,
}: {
  label: string;
  token: string;
  value: string;
  ratio: string;
  status: string;
  sample: string;
  foreground: string;
  tone: 'success' | 'danger';
}) {
  return (
    <article className="border-border-subtle bg-surface-primary overflow-hidden border">
      <header className="border-border-subtle flex items-start justify-between gap-3 border-b p-4">
        <div className="min-w-0">
          <p className="text-content-primary text-sm font-semibold">{label}</p>
          <p className="text-content-tertiary mt-1 break-all font-mono text-[11px]">
            {token}
          </p>
        </div>
        <span
          className={[
            'shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase',
            tone === 'success'
              ? 'bg-action-success/10 text-action-success'
              : 'bg-action-danger/10 text-action-danger',
          ].join(' ')}
        >
          {status}
        </span>
      </header>

      <div
        className="flex min-h-40 flex-col justify-between gap-6 p-5"
        style={{ backgroundColor: '#F7F3EB', color: foreground }}
      >
        <p className="text-lg leading-7 font-semibold">{sample}</p>
        <div className="flex flex-wrap items-end justify-between gap-3 font-mono text-xs font-semibold">
          <span>{value}</span>
          <span>{ratio}</span>
        </div>
      </div>
    </article>
  );
}

function SystemLayerCard({
  number,
  label,
  description,
}: {
  number: string;
  label: string;
  description: string;
}) {
  return (
    <article className="border-border-subtle bg-surface-primary min-w-0 border p-4 xl:p-3">
      <p className="text-action-accent font-mono text-[10px] font-semibold">
        {number}
      </p>
      <h3 className="mt-3 text-sm font-semibold">{label}</h3>
      <p className="text-content-secondary mt-2 text-xs leading-5">
        {description}
      </p>
    </article>
  );
}

function FlowArrow() {
  return (
    <div className="text-content-tertiary flex items-center justify-center py-1 xl:py-0">
      <ArrowRightIcon
        aria-hidden="true"
        className="rotate-90 xl:rotate-0"
        size={16}
      />
    </div>
  );
}

function StatusPill({
  label,
  tone,
}: {
  label: string;
  tone: (typeof contrastRowKeys)[number];
}) {
  const className =
    tone === 'pass'
      ? 'bg-action-success/10 text-action-success'
      : tone === 'warning'
        ? 'bg-action-warning/10 text-action-warning'
        : 'bg-action-danger/10 text-action-danger';

  return (
    <span
      className={`${className} w-fit rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase`}
    >
      {label}
    </span>
  );
}

function FocusExampleCard({
  label,
  buttonLabel,
  visible,
}: {
  label: string;
  buttonLabel: string;
  visible: boolean;
}) {
  return (
    <article className="border-border-subtle bg-background-sunken flex min-h-52 flex-col border p-5">
      <p className="text-content-tertiary text-[10px] font-semibold tracking-[0.14em] uppercase">
        {label}
      </p>
      <div className="flex flex-1 items-center justify-center py-8">
        <span
          className={[
            'bg-action-accent text-on-action-accent inline-flex min-h-11 items-center rounded-md px-5 text-sm font-semibold',
            visible
              ? 'outline-border-focus outline-2 outline-offset-2'
              : '',
          ].join(' ')}
        >
          {buttonLabel}
        </span>
      </div>
    </article>
  );
}

function ValidationColumn({
  label,
  tone,
  items,
}: {
  label: string;
  tone: 'success' | 'warning';
  items: string[];
}) {
  return (
    <article className="border-border-subtle bg-surface-primary border p-5 sm:p-6">
      <p
        className={[
          'text-xs font-semibold tracking-[0.14em] uppercase',
          tone === 'success' ? 'text-action-success' : 'text-action-warning',
        ].join(' ')}
      >
        {label}
      </p>
      <ul className="mt-5 space-y-3">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-sm leading-6">
            <CheckIcon
              aria-hidden="true"
              className={[
                'mt-1 shrink-0',
                tone === 'success'
                  ? 'text-action-success'
                  : 'text-action-warning',
              ].join(' ')}
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

function ScoreMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-surface-primary p-4 text-center">
      <dt className="text-content-tertiary text-[10px] font-semibold tracking-[0.12em] uppercase">
        {label}
      </dt>
      <dd className="mt-2 font-mono text-xl font-semibold">{value}</dd>
    </div>
  );
}
