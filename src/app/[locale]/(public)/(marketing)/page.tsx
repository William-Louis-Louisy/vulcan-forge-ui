import { ArrowRightIcon, CheckIcon } from '@phosphor-icons/react/dist/ssr';
import { getTranslations } from 'next-intl/server';
import { auth } from '@/auth';
import { ProductEditorPreview } from '@/components/layout/ProductEditorPreview';
import { PublicButtonLink } from '@/components/layout/PublicButtonLink';

const problemKeys = ['inconsistentUi', 'weakAccessibility', 'aiDrift'] as const;
const capabilityKeys = ['tokens', 'themes', 'components', 'aiRules'] as const;
const exportKeys = [
  'css',
  'tailwind',
  'typescript',
  'reactNative',
  'markdown',
  'aiInstructions',
] as const;
const audienceKeys = [
  'freelancers',
  'indieHackers',
  'agencies',
  'designers',
] as const;

export default async function HomePage() {
  const [t, session] = await Promise.all([getTranslations('HomePage'), auth()]);
  const isAuthenticated = Boolean(session?.user?.id);
  const primaryHref = isAuthenticated ? '/app' : '/signup';
  const primaryLabel = isAuthenticated
    ? t('hero.dashboardCta')
    : t('hero.primaryCta');
  const previewLabels = {
    accessibility: t('preview.navigation.accessibility'),
    brand: t('preview.navigation.brand'),
    delivered: t('preview.delivered'),
    export: t('preview.export'),
    overview: t('preview.navigation.overview'),
    preview: t('preview.label'),
    project: t('preview.project'),
    themes: t('preview.navigation.themes'),
    tokens: t('preview.navigation.tokens'),
  };

  return (
    <main className="bg-background-app text-content-primary overflow-hidden">
      <section className="border-border-subtle border-b px-6 py-16 sm:py-20 lg:px-8 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[minmax(0,0.95fr)_minmax(32rem,1.05fr)] lg:items-center">
          <div className="max-w-3xl">
            <p className="border-action-accent/30 bg-action-accent/10 text-action-accent inline-flex rounded-full border px-3 py-1 text-xs font-semibold">
              {t('hero.eyebrow')}
            </p>

            <h1 className="mt-7 font-[family-name:var(--font-fraunces)] text-5xl leading-[0.98] font-semibold tracking-[-0.045em] text-balance sm:text-6xl lg:text-7xl">
              {t('hero.titleBefore')}{' '}
              <em className="text-action-accent font-medium">
                {t('hero.titleAccent')}
              </em>{' '}
              {t('hero.titleAfter')}
            </h1>

            <p className="text-content-secondary mt-7 max-w-2xl text-lg leading-8">
              {t('hero.description')}
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <PublicButtonLink href={primaryHref} size="lg" className="gap-2">
                {primaryLabel}
                <ArrowRightIcon aria-hidden="true" size={16} weight="bold" />
              </PublicButtonLink>
              <PublicButtonLink href="/#example" variant="secondary" size="lg">
                {t('hero.secondaryCta')}
              </PublicButtonLink>
            </div>

            <p className="text-content-tertiary mt-4 text-xs font-medium">
              {t('hero.reassurance')}
            </p>
          </div>

          <div id="example" className="scroll-mt-24">
            <ProductEditorPreview labels={previewLabels} />
          </div>
        </div>
      </section>

      <section
        id="product"
        className="scroll-mt-20 px-6 py-20 lg:px-8 lg:py-24"
      >
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-action-accent text-xs font-semibold tracking-[0.18em] uppercase">
              {t('problems.eyebrow')}
            </p>
            <h2 className="mt-4 font-[family-name:var(--font-fraunces)] text-4xl leading-tight font-semibold tracking-[-0.035em] sm:text-5xl">
              {t('problems.title')}
            </h2>
          </div>

          <div className="border-border-subtle mt-12 grid border-y md:grid-cols-3">
            {problemKeys.map((key, index) => (
              <article
                key={key}
                className="border-border-subtle py-8 md:border-r md:px-8 md:first:pl-0 md:last:border-r-0 md:last:pr-0"
              >
                <p className="text-action-accent font-mono text-xs">
                  0{index + 1}
                </p>
                <h3 className="mt-5 text-xl font-semibold">
                  {t(`problems.items.${key}.title`)}
                </h3>
                <p className="text-content-secondary mt-3 text-sm leading-6">
                  {t(`problems.items.${key}.description`)}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-border-subtle bg-background-sunken border-y px-6 py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="max-w-xl">
              <p className="text-action-accent text-xs font-semibold tracking-[0.18em] uppercase">
                {t('capabilities.eyebrow')}
              </p>
              <h2 className="mt-4 font-[family-name:var(--font-fraunces)] text-4xl leading-tight font-semibold tracking-[-0.035em] sm:text-5xl">
                {t('capabilities.title')}
              </h2>
              <p className="text-content-secondary mt-5 leading-7">
                {t('capabilities.description')}
              </p>
            </div>

            <div className="divide-border-subtle border-border-subtle grid border-y sm:grid-cols-2 sm:divide-x">
              {capabilityKeys.map((key) => (
                <article
                  key={key}
                  className="border-border-subtle border-b p-6 last:border-b-0 sm:[&:nth-last-child(-n+2)]:border-b-0"
                >
                  <h3 className="text-base font-semibold">
                    {t(`capabilities.items.${key}.title`)}
                  </h3>
                  <p className="text-content-secondary mt-3 text-sm leading-6">
                    {t(`capabilities.items.${key}.description`)}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-action-secondary text-content-inverse px-6 py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-action-accent text-xs font-semibold tracking-[0.18em] uppercase">
                {t('exports.eyebrow')}
              </p>
              <h2 className="mt-4 font-[family-name:var(--font-fraunces)] text-4xl leading-tight font-semibold tracking-[-0.035em] sm:text-5xl">
                {t('exports.title')}
              </h2>
            </div>
            <p className="text-content-inverse/65 max-w-md text-sm leading-6">
              {t('exports.description')}
            </p>
          </div>

          <div className="border-content-inverse/15 mt-12 grid border-y sm:grid-cols-2 lg:grid-cols-3">
            {exportKeys.map((key) => (
              <article
                key={key}
                className="border-content-inverse/15 border-b p-5 sm:border-r"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold">
                      {t(`exports.items.${key}.title`)}
                    </h3>
                    <p className="text-content-inverse/60 mt-2 font-mono text-xs">
                      {t(`exports.items.${key}.fileName`)}
                    </p>
                  </div>
                  <CheckIcon
                    aria-hidden="true"
                    className="text-action-accent shrink-0"
                    size={16}
                    weight="bold"
                  />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20 lg:px-8 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-action-accent text-xs font-semibold tracking-[0.18em] uppercase">
              {t('audiences.eyebrow')}
            </p>
            <h2 className="mt-4 font-[family-name:var(--font-fraunces)] text-4xl leading-tight font-semibold tracking-[-0.035em] sm:text-5xl">
              {t('audiences.title')}
            </h2>
          </div>

          <div className="divide-border-subtle border-border-subtle divide-y border-y">
            {audienceKeys.map((key) => (
              <article
                key={key}
                className="grid gap-2 py-5 sm:grid-cols-[12rem_1fr] sm:gap-8"
              >
                <h3 className="font-semibold">
                  {t(`audiences.items.${key}.title`)}
                </h3>
                <p className="text-content-secondary text-sm leading-6">
                  {t(`audiences.items.${key}.description`)}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-border-subtle px-6 pb-20 lg:px-8 lg:pb-24">
        <div className="border-border-strong mx-auto flex max-w-7xl flex-col gap-8 border p-7 sm:p-10 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <h2 className="font-[family-name:var(--font-fraunces)] text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
              {t('finalCta.title')}
            </h2>
            <p className="text-content-secondary mt-3 leading-7">
              {t('finalCta.description')}
            </p>
          </div>
          <PublicButtonLink
            href={primaryHref}
            size="lg"
            className="shrink-0 gap-2"
          >
            {isAuthenticated ? t('hero.dashboardCta') : t('finalCta.cta')}
            <ArrowRightIcon aria-hidden="true" size={16} weight="bold" />
          </PublicButtonLink>
        </div>
      </section>
    </main>
  );
}
