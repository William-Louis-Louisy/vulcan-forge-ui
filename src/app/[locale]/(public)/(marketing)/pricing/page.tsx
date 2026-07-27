import { CheckIcon } from '@phosphor-icons/react/dist/ssr';
import { getTranslations } from 'next-intl/server';
import { auth } from '@/auth';
import { PublicButtonLink } from '@/components/layout/PublicButtonLink';

const tierKeys = ['freeBeta', 'proSoon', 'teamSoon'] as const;
const tierFeatureKeys = [
  'feature1',
  'feature2',
  'feature3',
  'feature4',
  'feature5',
] as const;
const faqKeys = ['whyFree', 'exports', 'futurePlans'] as const;

export default async function PricingPage() {
  const [t, session] = await Promise.all([
    getTranslations('PricingPage'),
    auth(),
  ]);
  const isAuthenticated = Boolean(session?.user?.id);
  const primaryHref = isAuthenticated ? '/app' : '/signup';

  return (
    <main className="bg-background-app text-content-primary px-6 py-16 sm:py-20 lg:px-8 lg:py-24">
      <section className="mx-auto max-w-4xl text-center">
        <p className="border-action-accent/30 bg-action-accent/10 text-action-accent inline-flex rounded-full border px-3 py-1 text-xs font-semibold">
          {t('eyebrow')}
        </p>
        <h1 className="mt-6 font-[family-name:var(--font-fraunces)] text-5xl leading-[1.02] font-semibold tracking-[-0.045em] text-balance sm:text-6xl">
          {t('titleBefore')}{' '}
          <em className="text-content-tertiary font-medium">
            {t('titleAccent')}
          </em>
        </h1>
        <p className="text-content-secondary mx-auto mt-6 max-w-2xl text-lg leading-8">
          {t('description')}
        </p>
      </section>

      <section className="mx-auto mt-14 grid max-w-7xl gap-4 lg:grid-cols-3">
        {tierKeys.map((tierKey) => {
          const isAvailable = tierKey === 'freeBeta';

          return (
            <article
              key={tierKey}
              className={[
                'border p-6 sm:p-7',
                isAvailable
                  ? 'border-border-strong bg-surface-primary shadow-soft'
                  : 'border-border-subtle bg-background-sunken',
              ].join(' ')}
            >
              <div className="flex min-h-8 items-start justify-between gap-4">
                <h2 className="text-xl font-semibold">
                  {t(`tiers.${tierKey}.name`)}
                </h2>
                <span
                  className={[
                    'rounded-full px-2.5 py-1 text-[11px] font-semibold',
                    isAvailable
                      ? 'bg-action-accent/10 text-action-accent'
                      : 'bg-surface-secondary text-content-tertiary',
                  ].join(' ')}
                >
                  {t(`tiers.${tierKey}.status`)}
                </span>
              </div>

              <div className="mt-7 flex items-baseline gap-2">
                <p className="font-[family-name:var(--font-fraunces)] text-5xl font-semibold tracking-[-0.04em]">
                  {t(`tiers.${tierKey}.price`)}
                </p>
                <p className="text-content-tertiary text-sm">
                  {t(`tiers.${tierKey}.priceDescription`)}
                </p>
              </div>

              {isAvailable ? (
                <PublicButtonLink href={primaryHref} className="mt-7 w-full">
                  {isAuthenticated
                    ? t('dashboardCta')
                    : t(`tiers.${tierKey}.cta`)}
                </PublicButtonLink>
              ) : (
                <p className="border-border-subtle text-content-tertiary mt-7 flex min-h-10 items-center justify-center rounded-md border text-sm font-semibold">
                  {t(`tiers.${tierKey}.unavailable`)}
                </p>
              )}

              <ul className="border-border-subtle mt-7 space-y-3 border-t pt-6 text-sm">
                {tierFeatureKeys.map((featureKey) => (
                  <li key={featureKey} className="flex gap-3">
                    <CheckIcon
                      aria-hidden="true"
                      size={15}
                      weight="bold"
                      className={
                        isAvailable
                          ? 'text-action-accent mt-0.5'
                          : 'text-content-tertiary mt-0.5'
                      }
                    />
                    <span className="text-content-secondary">
                      {t(`tiers.${tierKey}.features.${featureKey}`)}
                    </span>
                  </li>
                ))}
              </ul>
            </article>
          );
        })}
      </section>

      <section className="mx-auto mt-20 max-w-7xl">
        <h2 className="font-[family-name:var(--font-fraunces)] text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
          {t('faq.title')}
        </h2>
        <div className="border-border-subtle mt-8 grid border-y md:grid-cols-3">
          {faqKeys.map((faqKey) => (
            <article
              key={faqKey}
              className="border-border-subtle py-6 md:border-r md:px-6 md:first:pl-0 md:last:border-r-0 md:last:pr-0"
            >
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
