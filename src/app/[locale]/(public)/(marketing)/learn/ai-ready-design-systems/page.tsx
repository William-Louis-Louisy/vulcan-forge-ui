import type { Metadata } from 'next';
import { ArrowRightIcon, CheckIcon } from '@phosphor-icons/react/dist/ssr';
import { hasLocale } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { LearnCurriculumNav } from '@/features/learn/LearnCurriculumNav';
import { routing, type Locale } from '@/i18n/routing';

const structureStepKeys = ['human', 'structured', 'generated', 'assistant'] as const;
const contextKeys = [
  'brand',
  'tokens',
  'components',
  'accessibility',
  'forbidden',
] as const;
const strictnessKeys = ['balanced', 'strict', 'veryStrict'] as const;
const productItemKeys = [
  'locale',
  'strictness',
  'sections',
  'diagnostics',
  'delivery',
] as const;
const boundaryKeys = ['execution', 'sync', 'monitoring', 'guarantee'] as const;
const demoSequenceKeys = [
  'token',
  'component',
  'accessibility',
  'guidance',
  'context',
] as const;
const checkpointKeys = ['one', 'two', 'three', 'four', 'five'] as const;

const requestByLocale = {
  en: '“Make a primary button that matches the app.”',
  fr: '« Crée un bouton principal cohérent avec l’application. »',
} as const satisfies Record<Locale, string>;

const structuredContextByLocale = {
  en: [
    'token: color.semantic.action.primary',
    'component: Button · variant: primary',
    'state: focusVisible',
    'forbidden: Button ≠ navigation link',
    'missing information: report it instead of guessing',
  ],
  fr: [
    'token : color.semantic.action.primary',
    'composant : Button · variante : primary',
    'état : focusVisible',
    'interdit : Button ≠ lien de navigation',
    'information manquante : la signaler plutôt que deviner',
  ],
} as const satisfies Record<Locale, readonly string[]>;

const profileSummaryByLocale = {
  en: {
    title: 'AI Instructions profile',
    localeLabel: 'locale',
    strictnessLabel: 'strictness',
    sectionsLabel: 'sections',
    sections: '4 selectable',
  },
  fr: {
    title: 'Profil AI Instructions',
    localeLabel: 'langue',
    strictnessLabel: 'niveau de contrainte',
    sectionsLabel: 'sections',
    sections: '4 sélectionnables',
  },
} as const satisfies Record<
  Locale,
  {
    title: string;
    localeLabel: string;
    strictnessLabel: string;
    sectionsLabel: string;
    sections: string;
  }
>;

type LearnAiReadyDesignSystemsPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

function resolveLocale(requestedLocale: string): Locale {
  return hasLocale(routing.locales, requestedLocale)
    ? (requestedLocale as Locale)
    : routing.defaultLocale;
}

export async function generateMetadata({
  params,
}: LearnAiReadyDesignSystemsPageProps): Promise<Metadata> {
  const { locale: requestedLocale } = await params;
  const locale = resolveLocale(requestedLocale);
  const t = await getTranslations({
    locale,
    namespace: 'LearnAiReadyDesignSystemsPage.metadata',
  });

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function LearnAiReadyDesignSystemsPage({
  params,
}: LearnAiReadyDesignSystemsPageProps) {
  const { locale: requestedLocale } = await params;
  const locale = resolveLocale(requestedLocale);
  const t = await getTranslations({
    locale,
    namespace: 'LearnAiReadyDesignSystemsPage',
  });
  const curriculumT = await getTranslations({
    locale,
    namespace: 'LearnPage.curriculum',
  });
  const request = requestByLocale[locale];
  const structuredContext = structuredContextByLocale[locale];
  const profileSummary = profileSummaryByLocale[locale];

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
              {curriculumT('chapterLabel', { number: '07' })}
            </p>
            <p className="mt-4 text-base leading-7 font-semibold">
              {t('hero.learnerQuestion')}
            </p>
          </blockquote>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-14 px-6 py-16 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-16 lg:px-8 lg:py-20">
        <article className="min-w-0">
          <section aria-labelledby="ai-ready-problem-title">
            <SectionHeading
              eyebrow={t('openingProblem.eyebrow')}
              title={t('openingProblem.title')}
              description={t('openingProblem.description')}
              titleId="ai-ready-problem-title"
            />

            <div className="mt-10 grid gap-4 lg:grid-cols-2">
              <article className="border-action-danger/40 bg-action-danger/5 border">
                <header className="border-action-danger/20 border-b px-5 py-4">
                  <p className="text-action-danger text-[10px] font-semibold tracking-[0.14em] uppercase">
                    {t('openingProblem.weakLabel')}
                  </p>
                </header>
                <div className="p-5">
                  <p className="text-content-tertiary text-[10px] font-semibold tracking-[0.14em] uppercase">
                    {t('openingProblem.requestLabel')}
                  </p>
                  <p className="mt-3 text-lg leading-7 font-semibold text-pretty">
                    {request}
                  </p>
                  <p className="text-content-secondary mt-6 text-sm leading-6">
                    {t('openingProblem.weakOutcome')}
                  </p>
                </div>
              </article>

              <article className="border-action-success/40 bg-action-success/5 border">
                <header className="border-action-success/20 border-b px-5 py-4">
                  <p className="text-action-success text-[10px] font-semibold tracking-[0.14em] uppercase">
                    {t('openingProblem.structuredLabel')}
                  </p>
                </header>
                <div className="p-5">
                  <p className="text-content-tertiary text-[10px] font-semibold tracking-[0.14em] uppercase">
                    {t('openingProblem.contextLabel')}
                  </p>
                  <ul className="mt-3 space-y-2">
                    {structuredContext.map((item) => (
                      <li
                        key={item}
                        className="border-border-subtle bg-surface-primary break-words border px-3 py-2 font-mono text-xs leading-5"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                  <p className="text-content-secondary mt-6 text-sm leading-6">
                    {t('openingProblem.structuredOutcome')}
                  </p>
                </div>
              </article>
            </div>

            <p className="border-action-accent bg-action-accent/5 mt-6 border-l-2 p-5 text-base leading-7 font-medium">
              {t('openingProblem.conclusion')}
            </p>
          </section>

          <section className="mt-20" aria-labelledby="ai-ready-structure-title">
            <SectionHeading
              eyebrow={t('structure.eyebrow')}
              title={t('structure.title')}
              description={t('structure.description')}
              titleId="ai-ready-structure-title"
            />

            <div className="mt-10 grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)] lg:items-stretch">
              {structureStepKeys.map((key, index) => (
                <div key={key} className="contents">
                  <article className="border-border-subtle bg-surface-primary border p-5">
                    <p className="text-action-accent font-mono text-[10px] font-semibold">
                      0{index + 1}
                    </p>
                    <h3 className="mt-3 text-sm font-semibold">
                      {t(`structure.steps.${key}.label`)}
                    </h3>
                    <p className="text-content-secondary mt-2 text-xs leading-5">
                      {t(`structure.steps.${key}.description`)}
                    </p>
                  </article>
                  {index < structureStepKeys.length - 1 ? <FlowArrow /> : null}
                </div>
              ))}
            </div>

            <p className="text-content-primary mt-6 text-base leading-7 font-semibold">
              {t('structure.rule')}
            </p>
          </section>

          <section className="mt-20" aria-labelledby="ai-ready-context-title">
            <SectionHeading
              eyebrow={t('context.eyebrow')}
              title={t('context.title')}
              description={t('context.description')}
              titleId="ai-ready-context-title"
            />

            <div className="mt-10 grid gap-3 sm:grid-cols-2">
              {contextKeys.map((key) => (
                <article
                  key={key}
                  className="border-border-subtle bg-surface-primary border p-5"
                >
                  <h3 className="text-sm font-semibold">
                    {t(`context.items.${key}.label`)}
                  </h3>
                  <p className="text-content-secondary mt-2 text-sm leading-6">
                    {t(`context.items.${key}.description`)}
                  </p>
                </article>
              ))}
            </div>

            <p className="border-action-accent bg-action-accent/5 mt-6 border-l-2 p-5 text-sm leading-6 font-semibold">
              {t('context.antiHallucination')}
            </p>
          </section>

          <section className="mt-20" aria-labelledby="ai-ready-strictness-title">
            <SectionHeading
              eyebrow={t('strictness.eyebrow')}
              title={t('strictness.title')}
              description={t('strictness.description')}
              titleId="ai-ready-strictness-title"
            />

            <div className="border-border-subtle bg-background-sunken mt-10 grid gap-px border sm:grid-cols-3">
              {strictnessKeys.map((key, index) => (
                <article key={key} className="bg-surface-primary p-5">
                  <p className="text-action-accent font-mono text-xs font-semibold">
                    0{index + 1}
                  </p>
                  <h3 className="mt-4 text-sm font-semibold">
                    {t(`strictness.levels.${key}.label`)}
                  </h3>
                  <p className="text-content-secondary mt-2 text-sm leading-6">
                    {t(`strictness.levels.${key}.description`)}
                  </p>
                </article>
              ))}
            </div>

            <p className="border-action-warning bg-action-warning/5 mt-6 border-l-2 p-5 text-sm leading-6 font-semibold">
              {t('strictness.boundary')}
            </p>
          </section>

          <section className="mt-20" aria-labelledby="ai-ready-product-title">
            <SectionHeading
              eyebrow={t('productBridge.eyebrow')}
              title={t('productBridge.title')}
              description={t('productBridge.description')}
              titleId="ai-ready-product-title"
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

            <div className="border-border-subtle bg-background-sunken mt-6 border p-5 sm:p-6">
              <p className="text-content-tertiary text-[10px] font-semibold tracking-[0.14em] uppercase">
                {profileSummary.title}
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <ProfileMetric label={profileSummary.localeLabel} value="en / fr" />
                <ProfileMetric
                  label={profileSummary.strictnessLabel}
                  value="balanced / strict / veryStrict"
                />
                <ProfileMetric
                  label={profileSummary.sectionsLabel}
                  value={profileSummary.sections}
                />
              </div>
            </div>

            <p className="text-content-secondary mt-5 text-sm leading-6">
              {t('productBridge.snapshot')}
            </p>
          </section>

          <section className="mt-20" aria-labelledby="ai-ready-boundary-title">
            <SectionHeading
              eyebrow={t('boundary.eyebrow')}
              title={t('boundary.title')}
              description={t('boundary.description')}
              titleId="ai-ready-boundary-title"
            />
            <div className="mt-10 grid gap-3 sm:grid-cols-2">
              {boundaryKeys.map((key) => (
                <article
                  key={key}
                  className="border-action-warning/40 bg-action-warning/5 border p-5"
                >
                  <h3 className="text-sm font-semibold">
                    {t(`boundary.items.${key}.label`)}
                  </h3>
                  <p className="text-content-secondary mt-2 text-sm leading-6">
                    {t(`boundary.items.${key}.description`)}
                  </p>
                </article>
              ))}
            </div>

            <p className="border-action-accent bg-action-accent/5 mt-6 border-l-2 p-5 text-sm leading-6 font-semibold">
              {t('boundary.principle')}
            </p>
          </section>

          <section className="mt-20" aria-labelledby="ai-ready-demo-title">
            <SectionHeading
              eyebrow={t('demo.eyebrow')}
              title={t('demo.title')}
              description={t('demo.description')}
              titleId="ai-ready-demo-title"
            />

            <div className="border-border-subtle bg-border-subtle mt-10 grid gap-px border sm:grid-cols-2 xl:grid-cols-5">
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
            aria-labelledby="ai-ready-misconception-title"
          >
            <p className="text-action-accent text-xs font-semibold tracking-[0.16em] uppercase">
              {t('misconception.eyebrow')}
            </p>
            <h2
              id="ai-ready-misconception-title"
              className="font-display mt-4 text-3xl font-semibold tracking-[-0.03em] text-pretty"
            >
              {t('misconception.title')}
            </h2>
            <p className="text-content-secondary mt-5 max-w-3xl text-base leading-7">
              {t('misconception.description')}
            </p>
          </section>

          <section className="mt-20" aria-labelledby="ai-ready-checkpoint-title">
            <SectionHeading
              eyebrow={t('checkpoint.eyebrow')}
              title={t('checkpoint.title')}
              description={t('checkpoint.description')}
              titleId="ai-ready-checkpoint-title"
            />

            <ul className="mt-8 space-y-3">
              {checkpointKeys.map((key, index) => (
                <li
                  key={key}
                  className="border-border-subtle bg-surface-primary flex gap-4 border p-4 text-sm leading-6"
                >
                  <span className="text-action-accent mt-0.5 shrink-0 font-mono text-xs font-semibold">
                    0{index + 1}
                  </span>
                  <span>{t(`checkpoint.items.${key}`)}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="border-border-subtle bg-background-sunken mt-20 border p-6 sm:p-8">
            <div className="max-w-3xl">
              <p className="text-action-accent text-xs font-semibold tracking-[0.16em] uppercase">
                {t('complete.eyebrow')}
              </p>
              <h2 className="font-display mt-4 text-3xl font-semibold tracking-[-0.03em] text-pretty sm:text-4xl">
                {t('complete.title')}
              </h2>
              <p className="text-content-secondary mt-4 text-base leading-7">
                {t('complete.description')}
              </p>
              <div className="border-border-subtle bg-surface-primary mt-6 flex items-start gap-3 border p-5">
                <CheckIcon
                  aria-hidden="true"
                  className="text-action-success mt-1 shrink-0"
                  size={17}
                  weight="bold"
                />
                <p className="text-sm leading-6 font-semibold">
                  {t('complete.next')}
                </p>
              </div>
            </div>
          </section>
        </article>

        <aside className="min-w-0 lg:sticky lg:top-24 lg:self-start">
          <LearnCurriculumNav variant="compact" currentChapterKey="aiReady" />
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

function ProfileMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-border-subtle bg-surface-primary border p-4">
      <p className="text-content-tertiary font-mono text-[10px] font-semibold uppercase">
        {label}
      </p>
      <p className="mt-2 break-words text-sm font-semibold">{value}</p>
    </div>
  );
}
