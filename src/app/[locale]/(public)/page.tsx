import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

const featureKeys = [
  'tokens',
  'accessibility',
  'exports',
  'aiInstructions',
  'bilingual',
  'preview',
] as const;

const workflowStepKeys = ['create', 'structure', 'validate', 'export'] as const;

const pricingTierKeys = ['freeBeta', 'proSoon'] as const;

const faqKeys = ['audit', 'exports', 'billing'] as const;

export default function HomePage() {
  const t = useTranslations('HomePage');

  return (
    <main className="bg-background-app text-content-primary">
      <section className="border-border-subtle bg-background-subtle relative isolate overflow-hidden border-b px-6 py-24 sm:py-32 lg:px-8">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl"
        >
          <div className="from-action-primary to-action-success relative left-1/2 aspect-1155/678 w-6xl -translate-x-1/2 bg-linear-to-tr opacity-20" />
        </div>

        <div className="mx-auto max-w-4xl text-center">
          <p className="text-content-tertiary text-sm font-semibold tracking-[0.24em] uppercase">
            {t('hero.eyebrow')}
          </p>

          <h1 className="mt-6 text-5xl font-semibold tracking-tight text-balance sm:text-7xl">
            {t('hero.title')}
          </h1>

          <p className="text-content-secondary mx-auto mt-8 max-w-2xl text-lg leading-8 sm:text-xl">
            {t('hero.description')}
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/signup"
              className="bg-action-primary text-action-primary-content shadow-soft hover:bg-action-primary-hover rounded-lg px-5 py-3 text-sm font-semibold transition"
            >
              {t('hero.primaryCta')}
            </Link>

            <Link
              href="/pricing"
              className="border-border-default bg-surface-primary text-content-primary hover:bg-surface-secondary rounded-lg border px-5 py-3 text-sm font-semibold transition"
            >
              {t('hero.secondaryCta')}
            </Link>
          </div>
        </div>

        <div className="border-border-subtle bg-surface-primary/80 shadow-elevated mx-auto mt-20 max-w-5xl rounded-2xl border p-4 backdrop-blur">
          <div className="border-border-subtle bg-background-app rounded-xl border p-4">
            <div className="border-border-subtle flex items-center gap-2 border-b pb-4">
              <span className="bg-action-danger size-3 rounded-full" />
              <span className="bg-action-primary size-3 rounded-full" />
              <span className="bg-action-success size-3 rounded-full" />
              <span className="text-content-tertiary ml-3 text-xs font-medium">
                vulcan-forge-ui/design-system.json
              </span>
            </div>

            <div className="grid gap-4 pt-4 md:grid-cols-[1.1fr_0.9fr]">
              <div className="border-border-subtle bg-surface-primary space-y-3 rounded-lg border p-4">
                <PreviewTokenRow
                  name="color.action.primary"
                  value="oklch(...)"
                />
                <PreviewTokenRow name="radius.2xl" value="1.75rem" />
                <PreviewTokenRow name="locale.default" value="en / fr" />
                <PreviewTokenRow name="a11y.target" value="WCAG 2.2 AA" />
              </div>

              <div className="border-border-subtle bg-surface-primary rounded-lg border p-4">
                <p className="text-content-primary text-sm font-semibold">
                  {t('preview.title')}
                </p>
                <p className="text-content-secondary mt-2 text-sm leading-6">
                  {t('preview.description')}
                </p>

                <div className="border-border-default bg-background-subtle mt-6 rounded-xl border p-4">
                  <button className="bg-action-primary text-action-primary-content rounded-lg px-4 py-2 text-sm font-semibold">
                    {t('preview.button')}
                  </button>
                  <p className="text-content-secondary mt-4 text-sm">
                    {t('preview.helper')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-action-primary text-sm font-semibold tracking-[0.24em] uppercase">
            {t('features.eyebrow')}
          </p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
            {t('features.title')}
          </h2>
          <p className="text-content-secondary mt-6 text-lg leading-8">
            {t('features.description')}
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featureKeys.map((key) => (
            <article
              key={key}
              className="border-border-subtle bg-surface-primary shadow-soft rounded-2xl border p-6"
            >
              <div className="bg-action-primary/10 text-action-primary mb-5 flex size-10 items-center justify-center rounded-lg text-sm font-black">
                VF
              </div>

              <h3 className="text-base font-semibold">
                {t(`features.items.${key}.title`)}
              </h3>

              <p className="text-content-secondary mt-3 text-sm leading-6">
                {t(`features.items.${key}.description`)}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-background-subtle px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-action-primary text-sm font-semibold tracking-[0.24em] uppercase">
              {t('workflow.eyebrow')}
            </p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
              {t('workflow.title')}
            </h2>
            <p className="text-content-secondary mt-6 text-lg leading-8">
              {t('workflow.description')}
            </p>
          </div>

          <div className="grid gap-4">
            {workflowStepKeys.map((step, index) => (
              <div
                key={step}
                className="border-border-subtle bg-surface-primary shadow-soft rounded-2xl border p-6"
              >
                <p className="text-action-primary text-sm font-semibold">
                  0{index + 1}
                </p>

                <h3 className="mt-2 text-lg font-semibold">
                  {t(`workflow.steps.${step}.title`)}
                </h3>

                <p className="text-content-secondary mt-2 text-sm leading-6">
                  {t(`workflow.steps.${step}.description`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="pricing"
        className="relative isolate overflow-hidden px-6 py-24 sm:py-32 lg:px-8"
      >
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 -z-10 transform-gpu overflow-hidden blur-3xl"
        >
          <div className="from-action-primary to-action-success mx-auto aspect-1155/678 w-6xl bg-linear-to-tr opacity-10" />
        </div>

        <div className="mx-auto max-w-3xl text-center">
          <p className="text-action-primary text-sm font-semibold tracking-[0.24em] uppercase">
            {t('pricing.eyebrow')}
          </p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
            {t('pricing.title')}
          </h2>
          <p className="text-content-secondary mt-6 text-lg leading-8">
            {t('pricing.description')}
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-5xl gap-6 lg:grid-cols-2">
          {pricingTierKeys.map((key) => {
            const featured = key === 'freeBeta';

            return (
              <article
                key={key}
                className={[
                  'shadow-soft rounded-3xl border p-8',
                  featured
                    ? 'border-action-primary bg-surface-primary'
                    : 'border-border-subtle bg-background-subtle',
                ].join(' ')}
              >
                <h3 className="text-lg font-semibold">
                  {t(`pricing.tiers.${key}.name`)}
                </h3>

                <p className="mt-4 text-4xl font-semibold tracking-tight">
                  {t(`pricing.tiers.${key}.price`)}
                </p>

                <p className="text-content-secondary mt-4 text-sm leading-6">
                  {t(`pricing.tiers.${key}.description`)}
                </p>

                <ul className="text-content-secondary mt-8 space-y-3 text-sm">
                  {[0, 1, 2, 3].map((index) => (
                    <li key={index} className="flex gap-3">
                      <span className="text-action-success mt-1">✓</span>
                      <span>{t(`pricing.tiers.${key}.features.${index}`)}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/signup"
                  className={[
                    'mt-8 inline-flex w-full justify-center rounded-lg px-4 py-3 text-sm font-semibold transition',
                    featured
                      ? 'bg-action-primary text-action-primary-content hover:bg-action-primary-hover'
                      : 'border-border-default bg-surface-primary text-content-primary hover:bg-surface-secondary border',
                  ].join(' ')}
                >
                  {t(`pricing.tiers.${key}.cta`)}
                </Link>
              </article>
            );
          })}
        </div>
      </section>

      <section id="faq" className="px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            {t('faq.title')}
          </h2>

          <div className="divide-border-subtle mt-12 divide-y">
            {faqKeys.map((key) => (
              <article key={key} className="py-6">
                <h3 className="text-base font-semibold">
                  {t(`faq.items.${key}.question`)}
                </h3>
                <p className="text-content-secondary mt-3 text-sm leading-6">
                  {t(`faq.items.${key}.answer`)}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 pb-24 sm:pb-32 lg:px-8">
        <div className="border-border-subtle bg-surface-primary shadow-elevated mx-auto max-w-5xl rounded-3xl border p-8 text-center sm:p-12">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {t('finalCta.title')}
          </h2>
          <p className="text-content-secondary mx-auto mt-4 max-w-2xl">
            {t('finalCta.description')}
          </p>
          <div className="mt-8">
            <Link
              href="/signup"
              className="bg-action-primary text-action-primary-content shadow-soft hover:bg-action-primary-hover inline-flex rounded-lg px-5 py-3 text-sm font-semibold transition"
            >
              {t('finalCta.cta')}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function PreviewTokenRow({ name, value }: { name: string; value: string }) {
  return (
    <div className="border-border-subtle bg-background-subtle flex items-center justify-between gap-4 rounded-lg border px-3 py-2 font-mono text-xs">
      <span className="text-content-secondary">{name}</span>
      <span className="text-content-primary">{value}</span>
    </div>
  );
}
