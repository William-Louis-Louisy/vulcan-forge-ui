import type { Metadata } from 'next';
import {
  ArrowRightIcon,
  CheckIcon,
} from '@phosphor-icons/react/dist/ssr';
import { hasLocale } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { LearnCurriculumNav } from '@/features/learn/LearnCurriculumNav';
import { routing, type Locale } from '@/i18n/routing';

const roleKeys = [
  'background',
  'surface',
  'content',
  'muted',
  'accent',
] as const;
const accessibilityKeys = ['contrast', 'semantics', 'states'] as const;
const productItemKeys = [
  'modes',
  'mapping',
  'core',
  'statuses',
  'custom',
  'preview',
  'contrast',
  'exports',
] as const;
const demoSequenceKeys = ['decision', 'token', 'theme', 'component'] as const;
const checkpointKeys = ['one', 'two', 'three', 'four', 'five'] as const;

type LearnThemesPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export async function generateMetadata({
  params,
}: LearnThemesPageProps): Promise<Metadata> {
  const { locale: requestedLocale } = await params;
  const locale = hasLocale(routing.locales, requestedLocale)
    ? (requestedLocale as Locale)
    : routing.defaultLocale;
  const t = await getTranslations({
    locale,
    namespace: 'LearnThemesPage.metadata',
  });

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function LearnThemesPage() {
  const t = await getTranslations('LearnThemesPage');
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
              {curriculumT('chapterLabel', { number: '03' })}
            </p>
            <p className="mt-4 text-base leading-7 font-semibold">
              {t('hero.learnerQuestion')}
            </p>
          </blockquote>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-14 px-6 py-16 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-16 lg:px-8 lg:py-20">
        <article className="min-w-0">
          <section aria-labelledby="theme-problem-title">
            <SectionHeading
              eyebrow={t('openingProblem.eyebrow')}
              title={t('openingProblem.title')}
              description={t('openingProblem.description')}
              titleId="theme-problem-title"
            />

            <div className="mt-10 grid gap-4 md:grid-cols-2">
              <FixedValueDemo
                label={t('openingProblem.lightLabel')}
                fixedLabel={t('openingProblem.fixedLabel')}
                value={t('openingProblem.fixedValue')}
                background={t('openingProblem.lightBackground')}
                sampleText={t('openingProblem.sampleText')}
              />
              <FixedValueDemo
                label={t('openingProblem.darkLabel')}
                fixedLabel={t('openingProblem.fixedLabel')}
                value={t('openingProblem.fixedValue')}
                background={t('openingProblem.darkBackground')}
                sampleText={t('openingProblem.sampleText')}
              />
            </div>

            <p className="border-action-accent bg-action-accent/5 mt-6 border-l-2 p-5 text-base leading-7 font-medium">
              {t('openingProblem.conclusion')}
            </p>
          </section>

          <section className="mt-20" aria-labelledby="theme-definition-title">
            <SectionHeading
              eyebrow={t('definition.eyebrow')}
              title={t('definition.title')}
              description={t('definition.description')}
              titleId="theme-definition-title"
            />

            <div className="mt-10 grid items-stretch gap-3 lg:grid-cols-[minmax(0,0.8fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)]">
              <ThemeStageCard
                label={t('definition.roleLabel')}
                primary={t('definition.role')}
                emphasized
              />
              <FlowArrow />
              <ThemeStageCard
                label={t('definition.lightLabel')}
                primary={String(t.raw('definition.lightReference'))}
                secondary={t('definition.lightValue')}
                swatch={t('definition.lightValue')}
              />
              <FlowArrow />
              <ThemeStageCard
                label={t('definition.darkLabel')}
                primary={String(t.raw('definition.darkReference'))}
                secondary={t('definition.darkValue')}
                swatch={t('definition.darkValue')}
              />
            </div>

            <p className="text-content-primary mt-6 text-base leading-7 font-semibold">
              {t('definition.rule')}
            </p>
          </section>

          <section className="mt-20" aria-labelledby="roles-title">
            <SectionHeading
              eyebrow={t('roles.eyebrow')}
              title={t('roles.title')}
              description={t('roles.description')}
              titleId="roles-title"
            />

            <div className="border-border-subtle bg-border-subtle mt-10 grid gap-px border">
              <div className="bg-background-sunken hidden grid-cols-[minmax(8rem,0.55fr)_minmax(0,1fr)_minmax(0,1fr)] gap-4 px-5 py-3 text-[10px] font-semibold tracking-[0.12em] uppercase md:grid">
                <span className="text-content-tertiary">{t('roles.roleLabel')}</span>
                <span className="text-content-tertiary">{t('roles.lightLabel')}</span>
                <span className="text-content-tertiary">{t('roles.darkLabel')}</span>
              </div>
              {roleKeys.map((key) => (
                <RoleMappingRow
                  key={key}
                  role={t(`roles.items.${key}.role`)}
                  lightReference={String(
                    t.raw(`roles.items.${key}.lightReference`),
                  )}
                  lightValue={t(`roles.items.${key}.lightValue`)}
                  darkReference={String(
                    t.raw(`roles.items.${key}.darkReference`),
                  )}
                  darkValue={t(`roles.items.${key}.darkValue`)}
                  lightLabel={t('roles.lightLabel')}
                  darkLabel={t('roles.darkLabel')}
                />
              ))}
            </div>

            <p className="border-border-subtle text-content-secondary mt-6 border-l-2 pl-4 text-sm leading-6">
              {t('roles.statuses')}
            </p>
          </section>

          <section className="mt-20" aria-labelledby="theme-flow-title">
            <SectionHeading
              eyebrow={t('flow.eyebrow')}
              title={t('flow.title')}
              description={t('flow.description')}
              titleId="theme-flow-title"
            />

            <div className="mt-10 grid items-stretch gap-3 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)]">
              <ThemeStageCard
                label={t('flow.componentLabel')}
                primary={t('flow.component')}
              />
              <FlowArrow />
              <ThemeStageCard
                label={t('flow.roleLabel')}
                primary={t('flow.role')}
                emphasized
              />
              <FlowArrow />
              <div className="border-border-subtle bg-surface-primary border p-5">
                <p className="text-content-tertiary text-[10px] font-semibold tracking-[0.12em] uppercase">
                  {t('flow.mappingLabel')}
                </p>
                <div className="mt-4 space-y-3 font-mono text-xs font-semibold">
                  <p>{t('flow.mappingLight')}</p>
                  <p>{t('flow.mappingDark')}</p>
                </div>
              </div>
            </div>

            <p className="text-content-secondary mt-6 text-sm leading-6">
              {t('flow.outcome')}
            </p>
          </section>

          <section className="mt-20" aria-labelledby="theme-accessibility-title">
            <SectionHeading
              eyebrow={t('accessibility.eyebrow')}
              title={t('accessibility.title')}
              description={t('accessibility.description')}
              titleId="theme-accessibility-title"
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

          <section
            className="border-border-subtle bg-background-sunken mt-20 border p-6 sm:p-8"
            aria-labelledby="broader-theme-title"
          >
            <p className="text-action-accent text-xs font-semibold tracking-[0.16em] uppercase">
              {t('broaderConcept.eyebrow')}
            </p>
            <h2
              id="broader-theme-title"
              className="font-display mt-4 text-3xl font-semibold tracking-[-0.03em] text-balance sm:text-4xl"
            >
              {t('broaderConcept.title')}
            </h2>
            <p className="text-content-secondary mt-5 max-w-3xl text-base leading-7">
              {t('broaderConcept.description')}
            </p>
            <p className="border-action-warning bg-action-warning/5 mt-6 border-l-2 p-4 text-sm leading-6 font-medium">
              {t('broaderConcept.caution')}
            </p>
          </section>

          <section className="mt-20" aria-labelledby="theme-product-title">
            <SectionHeading
              eyebrow={t('productBridge.eyebrow')}
              title={t('productBridge.title')}
              description={t('productBridge.description')}
              titleId="theme-product-title"
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

          <section className="mt-20" aria-labelledby="theme-demo-title">
            <SectionHeading
              eyebrow={t('demo.eyebrow')}
              title={t('demo.title')}
              description={t('demo.description')}
              titleId="theme-demo-title"
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
            aria-labelledby="theme-misconception-title"
          >
            <p className="text-action-accent text-xs font-semibold tracking-[0.16em] uppercase">
              {t('misconception.eyebrow')}
            </p>
            <h2
              id="theme-misconception-title"
              className="font-display mt-4 text-3xl font-semibold tracking-[-0.03em] text-balance"
            >
              {t('misconception.title')}
            </h2>
            <p className="text-content-secondary mt-5 max-w-3xl text-base leading-7">
              {t('misconception.description')}
            </p>
          </section>

          <section className="mt-20" aria-labelledby="theme-checkpoint-title">
            <SectionHeading
              eyebrow={t('checkpoint.eyebrow')}
              title={t('checkpoint.title')}
              description={t('checkpoint.description')}
              titleId="theme-checkpoint-title"
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
              currentChapterKey="themes"
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
              currentChapterKey="themes"
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

function FixedValueDemo({
  label,
  fixedLabel,
  value,
  background,
  sampleText,
}: {
  label: string;
  fixedLabel: string;
  value: string;
  background: string;
  sampleText: string;
}) {
  return (
    <article className="border-border-subtle bg-surface-primary border p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-semibold">{label}</p>
        <code className="text-content-tertiary font-mono text-[10px]">
          {fixedLabel}: {value}
        </code>
      </div>
      <div
        className="border-border-subtle mt-5 flex min-h-36 items-center justify-center border p-6"
        style={{ backgroundColor: background }}
      >
        <p className="text-lg font-semibold" style={{ color: value }}>
          {sampleText}
        </p>
      </div>
    </article>
  );
}

function ThemeStageCard({
  label,
  primary,
  secondary,
  swatch,
  emphasized = false,
}: {
  label: string;
  primary: string;
  secondary?: string;
  swatch?: string;
  emphasized?: boolean;
}) {
  return (
    <div
      className={`min-w-0 border p-5 ${
        emphasized
          ? 'border-action-accent bg-action-accent/5'
          : 'border-border-subtle bg-surface-primary'
      }`}
    >
      <p className="text-content-tertiary text-[10px] font-semibold tracking-[0.12em] uppercase">
        {label}
      </p>
      <div className="mt-4 flex min-w-0 items-center gap-3">
        {swatch ? <ColorSwatch value={swatch} /> : null}
        <div className="min-w-0">
          <code className="block font-mono text-sm font-semibold break-all">
            {primary}
          </code>
          {secondary ? (
            <code className="text-content-secondary mt-1 block font-mono text-xs break-all">
              {secondary}
            </code>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function FlowArrow() {
  return (
    <div className="text-content-tertiary flex items-center justify-center py-1 md:px-1 md:py-0">
      <ArrowRightIcon
        aria-hidden="true"
        className="rotate-90 md:rotate-0"
        size={18}
      />
    </div>
  );
}

function RoleMappingRow({
  role,
  lightReference,
  lightValue,
  darkReference,
  darkValue,
  lightLabel,
  darkLabel,
}: {
  role: string;
  lightReference: string;
  lightValue: string;
  darkReference: string;
  darkValue: string;
  lightLabel: string;
  darkLabel: string;
}) {
  return (
    <div className="bg-surface-primary grid gap-4 p-5 md:grid-cols-[minmax(8rem,0.55fr)_minmax(0,1fr)_minmax(0,1fr)] md:items-center">
      <code className="font-mono text-sm font-semibold">{role}</code>
      <RoleValue
        label={lightLabel}
        reference={lightReference}
        value={lightValue}
      />
      <RoleValue
        label={darkLabel}
        reference={darkReference}
        value={darkValue}
      />
    </div>
  );
}

function RoleValue({
  label,
  reference,
  value,
}: {
  label: string;
  reference: string;
  value: string;
}) {
  return (
    <div className="min-w-0">
      <p className="text-content-tertiary text-[10px] font-semibold tracking-[0.1em] uppercase md:hidden">
        {label}
      </p>
      <div className="mt-2 flex min-w-0 items-center gap-3 md:mt-0">
        <ColorSwatch value={value} />
        <div className="min-w-0">
          <code className="block font-mono text-xs font-semibold break-all">
            {reference}
          </code>
          <code className="text-content-secondary mt-1 block font-mono text-[11px]">
            {value}
          </code>
        </div>
      </div>
    </div>
  );
}

function ColorSwatch({ value }: { value: string }) {
  return (
    <span
      aria-hidden="true"
      className="border-border-subtle h-9 w-9 shrink-0 border"
      style={{ backgroundColor: value }}
    />
  );
}
