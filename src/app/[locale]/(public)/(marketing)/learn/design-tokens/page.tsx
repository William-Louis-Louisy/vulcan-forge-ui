import type { Metadata } from 'next';
import {
  ArrowRightIcon,
  CheckIcon,
  LinkSimpleIcon,
} from '@phosphor-icons/react/dist/ssr';
import { getTranslations } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { routing, type Locale } from '@/i18n/routing';
import { LearnCurriculumNav } from '@/features/learn/LearnCurriculumNav';

const rawCardKeys = ['checkout', 'settings', 'mobile'] as const;
const anatomyKeys = ['path', 'type', 'value', 'description'] as const;
const categoryKeys = ['color', 'spacing', 'radius', 'typography', 'motion'] as const;
const productItemKeys = [
  'path',
  'type',
  'value',
  'reference',
  'description',
  'status',
] as const;
const checkpointKeys = ['one', 'two', 'three', 'four'] as const;

type LearnDesignTokensPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export async function generateMetadata({
  params,
}: LearnDesignTokensPageProps): Promise<Metadata> {
  const { locale: requestedLocale } = await params;
  const locale = hasLocale(routing.locales, requestedLocale)
    ? (requestedLocale as Locale)
    : routing.defaultLocale;
  const t = await getTranslations({
    locale,
    namespace: 'LearnDesignTokensPage.metadata',
  });

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function LearnDesignTokensPage() {
  const t = await getTranslations('LearnDesignTokensPage');
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
              {curriculumT('chapterLabel', { number: '02' })}
            </p>
            <p className="mt-4 text-base leading-7 font-semibold">
              {t('hero.learnerQuestion')}
            </p>
          </blockquote>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-14 px-6 py-16 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-16 lg:px-8 lg:py-20">
        <article className="min-w-0">
          <section aria-labelledby="raw-value-title">
            <SectionHeading
              eyebrow={t('openingProblem.eyebrow')}
              title={t('openingProblem.title')}
              description={t('openingProblem.description')}
              titleId="raw-value-title"
            />

            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {rawCardKeys.map((key) => (
                <article
                  key={key}
                  className="border-border-subtle bg-surface-primary border p-5"
                >
                  <p className="text-sm font-semibold">
                    {t(`openingProblem.cards.${key}.title`)}
                  </p>
                  <div className="bg-background-sunken border-border-subtle mt-5 border p-4">
                    <p className="text-content-tertiary text-[10px] font-semibold tracking-[0.12em] uppercase">
                      {t('openingProblem.rawLabel')}
                    </p>
                    <div className="mt-3 flex items-center gap-3">
                      <span
                        aria-hidden="true"
                        className="border-border-subtle h-8 w-8 shrink-0 border"
                        style={{
                          backgroundColor: t(
                            `openingProblem.cards.${key}.value`,
                          ),
                        }}
                      />
                      <code className="font-mono text-sm font-semibold">
                        {t(`openingProblem.cards.${key}.value`)}
                      </code>
                    </div>
                  </div>
                  <dl className="mt-5 space-y-3 text-xs leading-5">
                    <div>
                      <dt className="text-content-tertiary">
                        {t('openingProblem.meaningLabel')}
                      </dt>
                      <dd className="mt-0.5 font-medium">
                        {t(`openingProblem.cards.${key}.meaning`)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-content-tertiary">
                        {t('openingProblem.locationLabel')}
                      </dt>
                      <dd className="mt-0.5 font-mono">
                        {t(`openingProblem.cards.${key}.location`)}
                      </dd>
                    </div>
                  </dl>
                </article>
              ))}
            </div>

            <p className="border-action-accent bg-action-accent/5 mt-6 border-l-2 p-5 text-base leading-7 font-medium">
              {t('openingProblem.conclusion')}
            </p>
          </section>

          <section className="mt-20" aria-labelledby="token-definition-title">
            <SectionHeading
              eyebrow={t('definition.eyebrow')}
              title={t('definition.title')}
              description={t('definition.description')}
              titleId="token-definition-title"
            />

            <div className="border-border-subtle bg-border-subtle mt-10 grid gap-px border sm:grid-cols-2">
              {anatomyKeys.map((key, index) => (
                <article key={key} className="bg-surface-primary p-6">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-action-accent font-mono text-xs font-semibold">
                      0{index + 1}
                    </p>
                    <p className="text-content-tertiary text-[10px] font-semibold tracking-[0.12em] uppercase">
                      {t(`definition.anatomy.${key}.label`)}
                    </p>
                  </div>
                  <code className="mt-5 block break-all font-mono text-sm font-semibold">
                    {t(`definition.anatomy.${key}.value`)}
                  </code>
                  <p className="text-content-secondary mt-3 text-sm leading-6">
                    {t(`definition.anatomy.${key}.description`)}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section className="mt-20" aria-labelledby="primitive-title">
            <SectionHeading
              eyebrow={t('primitive.eyebrow')}
              title={t('primitive.title')}
              description={t('primitive.description')}
              titleId="primitive-title"
            />

            <div className="mt-10 grid items-stretch gap-3 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
              <TokenStageCard
                label={t('primitive.rawLabel')}
                primary={t('primitive.rawValue')}
                swatch={t('primitive.rawValue')}
              />
              <FlowArrow />
              <TokenStageCard
                label={t('primitive.tokenLabel')}
                primary={t('primitive.tokenPath')}
                secondary={t('primitive.tokenValue')}
                swatch={t('primitive.tokenValue')}
                emphasized
              />
            </div>

            <p className="text-content-primary mt-6 text-base leading-7 font-semibold">
              {t('primitive.benefit')}
            </p>
          </section>

          <section className="mt-20" aria-labelledby="semantic-title">
            <SectionHeading
              eyebrow={t('semantic.eyebrow')}
              title={t('semantic.title')}
              description={t('semantic.description')}
              titleId="semantic-title"
            />

            <div className="mt-10 grid gap-4 md:grid-cols-2">
              <ComparisonCard
                label={t('semantic.compare.primitive.title')}
                question={t('semantic.compare.primitive.question')}
                example={t('semantic.compare.primitive.example')}
              />
              <ComparisonCard
                label={t('semantic.compare.semantic.title')}
                question={t('semantic.compare.semantic.question')}
                example={t('semantic.compare.semantic.example')}
                emphasized
              />
            </div>

            <div className="border-border-subtle bg-background-sunken mt-6 grid gap-px border md:grid-cols-2">
              <div className="bg-surface-primary p-5">
                <p className="text-content-tertiary text-[10px] font-semibold tracking-[0.12em] uppercase">
                  {t('semantic.primitiveLabel')}
                </p>
                <code className="mt-3 block break-all font-mono text-sm font-semibold">
                  {t('semantic.primitivePath')}
                </code>
              </div>
              <div className="bg-surface-primary p-5">
                <p className="text-action-accent text-[10px] font-semibold tracking-[0.12em] uppercase">
                  {t('semantic.semanticLabel')}
                </p>
                <code className="mt-3 block break-all font-mono text-sm font-semibold">
                  {t('semantic.semanticPath')}
                </code>
                <p className="text-content-secondary mt-2 text-xs leading-5">
                  {t('semantic.semanticDescription')}
                </p>
              </div>
            </div>

            <p className="border-border-subtle text-content-secondary mt-6 border-l-2 pl-4 text-sm leading-6">
              {t('semantic.boundary')}
            </p>
          </section>

          <section className="mt-20" aria-labelledby="references-title">
            <SectionHeading
              eyebrow={t('references.eyebrow')}
              title={t('references.title')}
              description={t('references.description')}
              titleId="references-title"
            />

            <div className="mt-10 grid items-stretch gap-3 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)]">
              <TokenStageCard
                label={t('references.semanticLabel')}
                primary={t('references.semanticPath')}
              />
              <FlowArrow />
              <TokenStageCard
                label={t('references.referenceLabel')}
                primary={String(t.raw('references.reference'))}
                icon="link"
                emphasized
              />
              <FlowArrow />
              <TokenStageCard
                label={t('references.resolvedLabel')}
                primary={t('references.resolvedValue')}
                secondary={t('references.primitivePath')}
                swatch={t('references.resolvedValue')}
              />
            </div>

            <div className="border-border-subtle bg-surface-primary mt-8 border p-6 sm:p-7">
              <h3 className="text-lg font-semibold">
                {t('references.changeTitle')}
              </h3>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <ColorValue value={t('references.changeBefore')} />
                <ArrowRightIcon
                  aria-hidden="true"
                  className="text-content-tertiary"
                  size={18}
                />
                <ColorValue value={t('references.changeAfter')} />
              </div>
              <p className="text-content-secondary mt-5 text-sm leading-6">
                {t('references.changeDescription')}
              </p>
            </div>
          </section>

          <section className="mt-20" aria-labelledby="naming-title">
            <SectionHeading
              eyebrow={t('naming.eyebrow')}
              title={t('naming.title')}
              description={t('naming.description')}
              titleId="naming-title"
            />

            <div className="mt-10 grid gap-4 md:grid-cols-2">
              <NamingCard
                label={t('naming.weakLabel')}
                example={t('naming.weakExample')}
              />
              <NamingCard
                label={t('naming.strongLabel')}
                example={t('naming.strongExample')}
                emphasized
              />
            </div>
            <p className="text-content-secondary mt-5 text-sm leading-6">
              {t('naming.note')}
            </p>
          </section>

          <section className="mt-20" aria-labelledby="categories-title">
            <SectionHeading
              eyebrow={t('categories.eyebrow')}
              title={t('categories.title')}
              description={t('categories.description')}
              titleId="categories-title"
            />

            <div className="mt-10 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
              {categoryKeys.map((key) => (
                <article
                  key={key}
                  className="border-border-subtle bg-surface-primary border p-5"
                >
                  <h3 className="text-sm font-semibold">
                    {t(`categories.items.${key}.title`)}
                  </h3>
                  <code className="text-action-accent mt-4 block break-all font-mono text-xs">
                    {t(`categories.items.${key}.example`)}
                  </code>
                  <p className="text-content-secondary mt-3 text-xs leading-5">
                    {t(`categories.items.${key}.description`)}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section className="mt-20" aria-labelledby="demo-title">
            <SectionHeading
              eyebrow={t('demo.eyebrow')}
              title={t('demo.title')}
              description={t('demo.description')}
              titleId="demo-title"
            />

            <div className="mt-10 grid gap-4 md:grid-cols-2">
              <article className="border-border-subtle bg-surface-primary border p-6">
                <p className="text-content-tertiary text-xs font-semibold tracking-[0.12em] uppercase">
                  {t('demo.conceptualLabel')}
                </p>
                <code className="mt-5 block break-all font-mono text-base font-semibold">
                  {t('demo.conceptualPath')}
                </code>
              </article>

              <article className="border-action-accent bg-action-accent/5 border p-6">
                <p className="text-action-accent text-xs font-semibold tracking-[0.12em] uppercase">
                  {t('demo.productLabel')}
                </p>
                <div className="mt-5 flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="border-border-subtle h-9 w-9 shrink-0 border"
                    style={{ backgroundColor: t('demo.primitiveValue') }}
                  />
                  <div className="min-w-0">
                    <code className="block break-all font-mono text-sm font-semibold">
                      {t('demo.primitivePath')}
                    </code>
                    <code className="text-content-secondary mt-1 block font-mono text-xs">
                      {t('demo.primitiveValue')}
                    </code>
                  </div>
                </div>
                <div className="border-border-subtle mt-5 border-t pt-5">
                  <code className="block break-all font-mono text-sm font-semibold">
                    {t('demo.semanticPath')}
                  </code>
                  <code className="text-content-secondary mt-2 block break-all font-mono text-xs">
                    {String(t.raw('demo.semanticReference'))}
                  </code>
                </div>
              </article>
            </div>

            <p className="border-border-subtle text-content-secondary mt-6 border-l-2 pl-4 text-sm leading-6">
              {t('demo.note')}
            </p>
          </section>

          <section className="mt-20" aria-labelledby="product-bridge-title">
            <SectionHeading
              eyebrow={t('productBridge.eyebrow')}
              title={t('productBridge.title')}
              description={t('productBridge.description')}
              titleId="product-bridge-title"
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
                  <span>
                    {key === 'reference'
                      ? String(t.raw('productBridge.items.reference'))
                      : t(`productBridge.items.${key}`)}
                  </span>
                </li>
              ))}
            </ul>

            <p className="border-action-accent bg-action-accent/5 mt-6 border-l-2 p-5 text-sm leading-6">
              {t('productBridge.boundary')}
            </p>
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
              currentChapterKey="designTokens"
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
              currentChapterKey="designTokens"
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

type TokenStageCardProps = {
  label: string;
  primary: string;
  secondary?: string;
  swatch?: string;
  icon?: 'link';
  emphasized?: boolean;
};

function TokenStageCard({
  label,
  primary,
  secondary,
  swatch,
  icon,
  emphasized = false,
}: TokenStageCardProps) {
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
        {swatch ? (
          <span
            aria-hidden="true"
            className="border-border-subtle h-9 w-9 shrink-0 border"
            style={{ backgroundColor: swatch }}
          />
        ) : null}
        {icon === 'link' ? (
          <LinkSimpleIcon
            aria-hidden="true"
            className="text-action-accent shrink-0"
            size={20}
          />
        ) : null}
        <div className="min-w-0">
          <code className="block break-all font-mono text-sm font-semibold">
            {primary}
          </code>
          {secondary ? (
            <code className="text-content-secondary mt-1 block break-all font-mono text-xs">
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

type ComparisonCardProps = {
  label: string;
  question: string;
  example: string;
  emphasized?: boolean;
};

function ComparisonCard({
  label,
  question,
  example,
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
      <p
        className={`text-xs font-semibold tracking-[0.12em] uppercase ${
          emphasized ? 'text-action-accent' : 'text-content-tertiary'
        }`}
      >
        {label}
      </p>
      <p className="mt-5 text-base leading-7 font-semibold">{question}</p>
      <code className="text-content-secondary mt-4 block font-mono text-sm">
        {example}
      </code>
    </article>
  );
}

type NamingCardProps = {
  label: string;
  example: string;
  emphasized?: boolean;
};

function NamingCard({ label, example, emphasized = false }: NamingCardProps) {
  return (
    <article
      className={`border p-6 ${
        emphasized
          ? 'border-action-accent bg-action-accent/5'
          : 'border-border-subtle bg-surface-primary'
      }`}
    >
      <p className="text-content-tertiary text-xs font-semibold tracking-[0.12em] uppercase">
        {label}
      </p>
      <code className="mt-5 block break-all font-mono text-base font-semibold">
        {example}
      </code>
    </article>
  );
}

function ColorValue({ value }: { value: string }) {
  return (
    <div className="border-border-subtle bg-background-sunken flex items-center gap-3 border px-4 py-3">
      <span
        aria-hidden="true"
        className="border-border-subtle h-7 w-7 border"
        style={{ backgroundColor: value }}
      />
      <code className="font-mono text-xs font-semibold">{value}</code>
    </div>
  );
}
