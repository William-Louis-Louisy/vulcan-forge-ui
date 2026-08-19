import { ArrowRightIcon, CheckIcon } from '@phosphor-icons/react/dist/ssr';
import { getTranslations } from 'next-intl/server';
import { auth } from '@/auth';
import { ProductEditorPreview } from '@/components/layout/ProductEditorPreview';
import { PublicButtonLink } from '@/components/layout/PublicButtonLink';

const workflowKeys = [
  'tokens',
  'themes',
  'components',
  'accessibility',
  'exports',
] as const;

const tokenRows = [
  { key: 'background', path: 'color.bg.app', kind: 'primitive' },
  { key: 'surface', path: 'color.bg.surface', kind: 'semantic' },
  { key: 'content', path: 'color.fg.primary', kind: 'semantic' },
  { key: 'accent', path: 'color.accent', kind: 'primitive' },
  { key: 'border', path: 'color.border.line', kind: 'semantic' },
] as const;

const roleRows = [
  { role: 'background', reference: 'color.bg.app', custom: false },
  { role: 'surface', reference: 'color.bg.surface', custom: false },
  { role: 'content', reference: 'color.fg.primary', custom: false },
  { role: 'accent', reference: 'color.accent', custom: false },
  { role: 'border-subtle', reference: 'color.border.line', custom: true },
] as const;

const componentKeys = ['button', 'alert'] as const;

const componentTechnicalDetails = {
  button: {
    variants: 'primary · secondary · ghost',
    states: 'default · hover · focusVisible · disabled',
    bindings: 'action · content · border',
  },
  alert: {
    variants: 'info · success · warning · danger',
    states: 'default',
    bindings: 'status.info · status.success · status.warning · status.danger',
  },
} as const;

const accessibilityCheckKeys = ['contrast', 'focus', 'manual'] as const;

const exportFormats = [
  { key: 'css', fileName: 'tokens.css' },
  { key: 'tailwind', fileName: 'theme.css' },
  { key: 'typescript', fileName: 'theme.ts' },
  { key: 'reactNative', fileName: 'theme.native.ts' },
  { key: 'markdown', fileName: 'README.md' },
  { key: 'aiInstructions', fileName: 'rules.md' },
] as const;

export default async function ExamplesPage() {
  const [t, session] = await Promise.all([
    getTranslations('ExamplesPage'),
    auth(),
  ]);
  const isAuthenticated = Boolean(session?.user?.id);
  const primaryHref = isAuthenticated ? '/app' : '/signup';

  return (
    <main className="bg-background-app text-content-primary overflow-hidden">
      <section className="border-border-subtle border-b px-6 py-16 sm:py-20 lg:px-8 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[minmax(0,0.85fr)_minmax(32rem,1.15fr)] lg:items-center">
          <div className="max-w-3xl">
            <p className="border-action-accent/30 bg-action-accent/10 text-action-accent inline-flex rounded-full border px-3 py-1 text-xs font-semibold">
              {t('hero.eyebrow')}
            </p>

            <h1 className="font-display mt-7 text-5xl leading-[0.98] font-semibold tracking-[-0.045em] text-balance sm:text-6xl lg:text-7xl">
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
                {isAuthenticated
                  ? t('hero.dashboardCta')
                  : t('hero.primaryCta')}
                <ArrowRightIcon aria-hidden="true" size={16} weight="bold" />
              </PublicButtonLink>
              <PublicButtonLink
                href="/examples#workflow"
                variant="secondary"
                size="lg"
              >
                {t('hero.secondaryCta')}
              </PublicButtonLink>
            </div>

            <p className="border-border-subtle text-content-tertiary mt-6 border-l pl-4 text-xs leading-5">
              {t('hero.disclosure')}
            </p>
          </div>

          <ProductEditorPreview />
        </div>
      </section>

      <section
        id="workflow"
        className="scroll-mt-20 px-6 py-20 lg:px-8 lg:py-24"
      >
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <p className="text-action-accent text-xs font-semibold tracking-[0.18em] uppercase">
                {t('workflow.eyebrow')}
              </p>
              <h2 className="font-display mt-4 text-4xl leading-tight font-semibold tracking-[-0.035em] sm:text-5xl">
                {t('workflow.title')}
              </h2>
            </div>
            <p className="text-content-secondary max-w-2xl leading-7 lg:justify-self-end">
              {t('workflow.description')}
            </p>
          </div>

          <div className="border-border-subtle mt-12 grid border-y sm:grid-cols-2 lg:grid-cols-5">
            {workflowKeys.map((key, index) => (
              <article
                key={key}
                className="border-border-subtle border-b py-6 sm:px-5 lg:border-r lg:border-b-0 lg:last:border-r-0"
              >
                <p className="text-action-accent font-mono text-xs">
                  {String(index + 1).padStart(2, '0')}
                </p>
                <h3 className="mt-4 font-semibold">
                  {t(`workflow.items.${key}.title`)}
                </h3>
                <p className="text-content-secondary mt-2 text-sm leading-6">
                  {t(`workflow.items.${key}.description`)}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-border-subtle bg-background-sunken border-y px-6 py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-action-accent text-xs font-semibold tracking-[0.18em] uppercase">
              {t('model.eyebrow')}
            </p>
            <h2 className="font-display mt-4 text-4xl leading-tight font-semibold tracking-[-0.035em] sm:text-5xl">
              {t('model.title')}
            </h2>
            <p className="text-content-secondary mt-5 leading-7">
              {t('model.description')}
            </p>
          </div>

          <div className="mt-12 grid gap-5 lg:grid-cols-2">
            <article className="border-border-subtle bg-surface-primary border">
              <div className="border-border-subtle border-b p-5 sm:p-6">
                <h3 className="text-lg font-semibold">
                  {t('model.tokensTitle')}
                </h3>
                <p className="text-content-secondary mt-2 text-sm leading-6">
                  {t('model.tokensDescription')}
                </p>
              </div>

              <div className="divide-border-subtle divide-y">
                {tokenRows.map((row) => (
                  <div
                    key={row.path}
                    className="grid gap-3 p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:px-6"
                  >
                    <div className="min-w-0">
                      <code className="block truncate text-sm font-semibold">
                        {row.path}
                      </code>
                      <p className="text-content-secondary mt-1 text-xs">
                        {t(`model.tokenPurposes.${row.key}`)}
                      </p>
                    </div>
                    <span className="bg-background-subtle text-content-tertiary w-fit rounded-sm px-2 py-1 text-[11px] font-semibold sm:justify-self-end">
                      {t(`model.tokenKinds.${row.kind}`)}
                    </span>
                  </div>
                ))}
              </div>
            </article>

            <article className="border-border-subtle bg-surface-primary border">
              <div className="border-border-subtle border-b p-5 sm:p-6">
                <h3 className="text-lg font-semibold">
                  {t('model.rolesTitle')}
                </h3>
                <p className="text-content-secondary mt-2 text-sm leading-6">
                  {t('model.rolesDescription')}
                </p>
              </div>

              <div className="divide-border-subtle divide-y">
                {roleRows.map((row) => (
                  <div
                    key={row.role}
                    className="grid gap-3 p-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] sm:items-center sm:px-6"
                  >
                    <div className="flex min-w-0 items-center gap-2">
                      <code className="truncate text-sm font-semibold">
                        {row.role}
                      </code>
                      {row.custom ? (
                        <span className="border-border-subtle bg-background-subtle text-content-tertiary shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold">
                          {t('model.customRoleLabel')}
                        </span>
                      ) : null}
                    </div>
                    <code className="text-content-secondary min-w-0 truncate text-xs sm:text-right">
                      {'{'}
                      {row.reference}
                      {'}'}
                    </code>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="px-6 py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <p className="text-action-accent text-xs font-semibold tracking-[0.18em] uppercase">
                {t('contracts.eyebrow')}
              </p>
              <h2 className="font-display mt-4 text-4xl leading-tight font-semibold tracking-[-0.035em] sm:text-5xl">
                {t('contracts.title')}
              </h2>
            </div>
            <p className="text-content-secondary max-w-2xl leading-7 lg:justify-self-end">
              {t('contracts.description')}
            </p>
          </div>

          <div className="mt-12 grid gap-5 lg:grid-cols-2">
            {componentKeys.map((key) => {
              const technicalDetails = componentTechnicalDetails[key];

              return (
                <article
                  key={key}
                  className="border-border-subtle bg-surface-primary border p-5 sm:p-7"
                >
                  <div className="border-border-subtle border-b pb-6">
                    <h3 className="text-xl font-semibold">
                      {t(`contracts.items.${key}.title`)}
                    </h3>
                    <p className="text-content-secondary mt-2 text-sm leading-6">
                      {t(`contracts.items.${key}.purpose`)}
                    </p>

                    {key === 'button' ? (
                      <div
                        aria-hidden="true"
                        className="mt-6 flex flex-wrap gap-2"
                      >
                        <span className="bg-action-primary text-action-primary-content rounded-md px-3 py-2 text-xs font-semibold">
                          {t('contracts.items.button.previewPrimary')}
                        </span>
                        <span className="border-border-default bg-surface-primary text-content-primary rounded-md border px-3 py-2 text-xs font-semibold">
                          {t('contracts.items.button.previewSecondary')}
                        </span>
                      </div>
                    ) : (
                      <div
                        aria-hidden="true"
                        className="border-action-success/30 bg-action-success/10 mt-6 border p-3"
                      >
                        <p className="text-action-success text-xs font-semibold">
                          {t('contracts.items.alert.previewStatus')}
                        </p>
                        <p className="text-content-secondary mt-1 text-xs leading-5">
                          {t('contracts.items.alert.previewMessage')}
                        </p>
                      </div>
                    )}
                  </div>

                  <dl className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
                    <div>
                      <dt className="text-content-tertiary text-xs font-semibold uppercase">
                        {t('contracts.labels.variants')}
                      </dt>
                      <dd className="text-content-secondary mt-1.5 leading-6">
                        {technicalDetails.variants}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-content-tertiary text-xs font-semibold uppercase">
                        {t('contracts.labels.states')}
                      </dt>
                      <dd className="text-content-secondary mt-1.5 leading-6">
                        {technicalDetails.states}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-content-tertiary text-xs font-semibold uppercase">
                        {t('contracts.labels.bindings')}
                      </dt>
                      <dd className="text-content-secondary mt-1.5 break-words font-mono text-xs leading-6">
                        {technicalDetails.bindings}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-content-tertiary text-xs font-semibold uppercase">
                        {t('contracts.labels.accessibility')}
                      </dt>
                      <dd className="text-content-secondary mt-1.5 leading-6">
                        {t(`contracts.items.${key}.accessibility`)}
                      </dd>
                    </div>
                  </dl>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-surface-inverse text-content-on-inverse px-6 py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="max-w-xl">
              <p className="text-action-accent text-xs font-semibold tracking-[0.18em] uppercase">
                {t('accessibility.eyebrow')}
              </p>
              <h2 className="font-display mt-4 text-4xl leading-tight font-semibold tracking-[-0.035em] sm:text-5xl">
                {t('accessibility.title')}
              </h2>
              <p className="text-content-on-inverse/65 mt-5 leading-7">
                {t('accessibility.description')}
              </p>
            </div>

            <div className="border-border-on-inverse divide-border-on-inverse divide-y border-y">
              {accessibilityCheckKeys.map((key) => (
                <article key={key} className="flex gap-4 py-5">
                  <CheckIcon
                    aria-hidden="true"
                    className="text-action-accent mt-1 shrink-0"
                    size={16}
                    weight="bold"
                  />
                  <div>
                    <h3 className="font-semibold">
                      {t(`accessibility.checks.${key}.title`)}
                    </h3>
                    <p className="text-content-on-inverse/65 mt-2 text-sm leading-6">
                      {t(`accessibility.checks.${key}.description`)}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <p className="border-border-on-inverse text-content-on-inverse/55 mt-10 max-w-3xl border-l pl-4 text-xs leading-5">
            {t('accessibility.disclosure')}
          </p>
        </div>
      </section>

      <section className="px-6 py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-action-accent text-xs font-semibold tracking-[0.18em] uppercase">
                {t('delivery.eyebrow')}
              </p>
              <h2 className="font-display mt-4 text-4xl leading-tight font-semibold tracking-[-0.035em] sm:text-5xl">
                {t('delivery.title')}
              </h2>
            </div>
            <p className="text-content-secondary max-w-md text-sm leading-6">
              {t('delivery.description')}
            </p>
          </div>

          <div className="border-border-subtle mt-12 grid border-y sm:grid-cols-2 lg:grid-cols-3">
            {exportFormats.map((format) => (
              <article
                key={format.key}
                className="border-border-subtle border-b p-5 sm:border-r"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold">
                      {t(`delivery.formatLabels.${format.key}`)}
                    </h3>
                    <p className="text-content-tertiary mt-2 font-mono text-xs">
                      {format.fileName}
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

      <section className="border-border-subtle px-6 pb-20 lg:px-8 lg:pb-24">
        <div className="border-border-strong mx-auto flex max-w-7xl flex-col gap-8 border p-7 sm:p-10 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
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
            {isAuthenticated
              ? t('finalCta.dashboardCta')
              : t('finalCta.cta')}
            <ArrowRightIcon aria-hidden="true" size={16} weight="bold" />
          </PublicButtonLink>
        </div>
      </section>
    </main>
  );
}
