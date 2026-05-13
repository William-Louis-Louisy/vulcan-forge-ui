import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

const tierKeys = ['freeBeta', 'proSoon'] as const;

const tierFeatureKeys = [
  'feature1',
  'feature2',
  'feature3',
  'feature4',
] as const;

const faqKeys = ['whyFree', 'billing', 'limits'] as const;

export default function PricingPage() {
  const t = useTranslations('PricingPage');

  return (
    <main className="bg-background-app text-content-primary px-6 py-24 sm:py-32 lg:px-8">
      <section className="mx-auto max-w-3xl text-center">
        <p className="text-action-primary text-sm font-semibold tracking-[0.24em] uppercase">
          {t('eyebrow')}
        </p>

        <h1 className="mt-4 text-5xl font-semibold tracking-tight text-balance sm:text-6xl">
          {t('title')}
        </h1>

        <p className="text-content-secondary mx-auto mt-6 max-w-2xl text-lg leading-8">
          {t('description')}
        </p>
      </section>

      <section className="mx-auto mt-16 grid max-w-5xl gap-6 lg:grid-cols-2">
        {tierKeys.map((tierKey) => {
          const isFeatured = tierKey === 'freeBeta';

          return (
            <article
              key={tierKey}
              className={[
                'shadow-soft rounded-3xl border p-8',
                isFeatured
                  ? 'border-action-primary bg-surface-primary'
                  : 'border-border-subtle bg-background-subtle',
              ].join(' ')}
            >
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-xl font-semibold">
                  {t(`tiers.${tierKey}.name`)}
                </h2>

                {isFeatured ? (
                  <span className="bg-action-primary/10 text-action-primary rounded-full px-3 py-1 text-xs font-semibold">
                    {t('recommendedBadge')}
                  </span>
                ) : null}
              </div>

              <p className="mt-6 text-5xl font-semibold tracking-tight">
                {t(`tiers.${tierKey}.price`)}
              </p>

              <p className="text-content-secondary mt-4 text-sm leading-6">
                {t(`tiers.${tierKey}.description`)}
              </p>

              <ul className="text-content-secondary mt-8 space-y-3 text-sm">
                {tierFeatureKeys.map((featureKey) => (
                  <li key={featureKey} className="flex gap-3">
                    <span className="text-action-success mt-1">✓</span>
                    <span>{t(`tiers.${tierKey}.features.${featureKey}`)}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/signup"
                className={[
                  'mt-8 inline-flex w-full justify-center rounded-lg px-4 py-3 text-sm font-semibold transition',
                  isFeatured
                    ? 'bg-action-primary text-action-primary-content hover:bg-action-primary-hover'
                    : 'border-border-default bg-surface-primary text-content-primary hover:bg-surface-secondary border',
                ].join(' ')}
              >
                {t(`tiers.${tierKey}.cta`)}
              </Link>
            </article>
          );
        })}
      </section>

      <section className="border-border-subtle bg-surface-primary shadow-soft mx-auto mt-20 max-w-4xl rounded-3xl border p-8">
        <h2 className="text-3xl font-semibold tracking-tight">
          {t('betaNotice.title')}
        </h2>

        <p className="text-content-secondary mt-4 leading-7">
          {t('betaNotice.description')}
        </p>
      </section>

      <section className="mx-auto mt-20 max-w-4xl">
        <h2 className="text-3xl font-semibold tracking-tight">
          {t('faq.title')}
        </h2>

        <div className="divide-border-subtle mt-8 divide-y">
          {faqKeys.map((faqKey) => (
            <article key={faqKey} className="py-6">
              <h3 className="font-semibold">
                {t(`faq.items.${faqKey}.question`)}
              </h3>
              <p className="text-content-secondary mt-3 text-sm leading-6">
                {t(`faq.items.${faqKey}.answer`)}
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
