import type { CSSProperties } from 'react';
import { ArrowRightIcon, CheckIcon } from '@phosphor-icons/react/dist/ssr';
import { getTranslations } from 'next-intl/server';
import { auth } from '@/auth';
import { PublicButtonLink } from '@/components/layout/PublicButtonLink';

const flowNodes = [
  {
    key: 'token',
    value: 'color.brand.600',
    detail: '#A94E2F',
  },
  {
    key: 'theme',
    value: 'accent',
    detail: 'Light',
  },
  {
    key: 'component',
    value: 'Button.primary',
    detail: 'background',
  },
  {
    key: 'accessibility',
    value: '5.50:1',
    detail: 'AA',
  },
  {
    key: 'delivery',
    value: 'tokens.css',
    detail: 'rules.md',
  },
] as const;

const workflowStepKeys = [
  'token',
  'theme',
  'component',
  'accessibility',
  'delivery',
] as const;

const differentiatorKeys = [
  'source',
  'semantics',
  'contracts',
  'accessibility',
  'ai',
] as const;

const accessibilityDemoCheckKeys = ['focus', 'foreground', 'status'] as const;
const aiRuleKeys = ['tokens', 'components', 'accessibility', 'reuse'] as const;
const scatteredKeys = ['token', 'docs', 'component', 'ai'] as const;
const connectedKeys = ['source', 'theme', 'component', 'outputs'] as const;

const exportFormats = [
  { key: 'css', fileName: 'tokens.css' },
  { key: 'tailwind', fileName: 'theme.css' },
  { key: 'typescript', fileName: 'theme.ts' },
  { key: 'reactNative', fileName: 'theme.native.ts' },
  { key: 'markdown', fileName: 'README.md' },
  { key: 'aiInstructions', fileName: 'rules.md' },
] as const;

const gridStyle = {
  backgroundImage:
    'linear-gradient(color-mix(in srgb, var(--vf-border-on-inverse) 45%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in srgb, var(--vf-border-on-inverse) 45%, transparent) 1px, transparent 1px)',
  backgroundSize: '36px 36px',
} satisfies CSSProperties;

const glowStyle = {
  backgroundImage:
    'radial-gradient(circle at 18% 12%, color-mix(in srgb, var(--vf-action-accent) 22%, transparent), transparent 30%), radial-gradient(circle at 82% 24%, color-mix(in srgb, var(--vf-action-info) 18%, transparent), transparent 28%)',
} satisfies CSSProperties;

export default async function ExamplesPage() {
  const [t, session] = await Promise.all([
    getTranslations('ExamplesPage'),
    auth(),
  ]);
  const isAuthenticated = Boolean(session?.user?.id);
  const primaryHref = isAuthenticated ? '/app' : '/signup';

  return (
    <main className="bg-background-app text-content-primary overflow-hidden">
      <section className="bg-surface-inverse text-content-on-inverse relative isolate overflow-hidden px-6 py-16 sm:py-20 lg:min-h-[calc(100vh-5rem)] lg:px-8 lg:py-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-80"
          style={glowStyle}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-30"
          style={gridStyle}
        />

        <div className="relative mx-auto grid max-w-7xl gap-16 lg:grid-cols-[minmax(0,0.72fr)_minmax(38rem,1.28fr)] lg:items-center">
          <div className="max-w-3xl">
            <div className="border-border-on-inverse bg-surface-primary/5 inline-flex items-center gap-2 border px-3 py-1.5 text-xs font-semibold backdrop-blur">
              <span
                aria-hidden="true"
                className="bg-action-accent size-1.5 rounded-full"
              />
              {t('hero.eyebrow')}
            </div>

            <h1 className="font-display mt-8 text-5xl leading-[0.94] font-semibold tracking-[-0.055em] text-balance sm:text-6xl lg:text-7xl xl:text-[5.5rem]">
              {t('hero.titleBefore')}{' '}
              <em className="text-action-accent font-medium">
                {t('hero.titleAccent')}
              </em>
            </h1>

            <p className="text-content-on-inverse/70 mt-8 max-w-2xl text-lg leading-8 sm:text-xl">
              {t('hero.description')}
            </p>

            <div className="mt-10">
              <PublicButtonLink href="#workflow" size="lg" className="gap-2">
                {t('hero.secondaryCta')}
                <ArrowRightIcon aria-hidden="true" size={16} weight="bold" />
              </PublicButtonLink>
            </div>

            <p className="text-content-on-inverse/50 mt-6 text-xs leading-5">
              {t('hero.disclosure')}
            </p>
          </div>

          <div className="border-border-on-inverse bg-surface-inverse/80 relative overflow-hidden border p-4 shadow-2xl backdrop-blur sm:p-6 lg:p-8">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-25"
              style={gridStyle}
            />

            <div className="relative">
              <div className="border-border-on-inverse flex flex-wrap items-center justify-between gap-4 border-b pb-5">
                <div>
                  <p className="text-content-on-inverse/45 font-mono text-[10px] tracking-[0.16em] uppercase">
                    {t('demo.projectLabel')}
                  </p>
                  <p className="mt-1 text-sm font-semibold">
                    color.brand.600 → {t('demo.deliveryLabel')}
                  </p>
                </div>
                <div className="border-border-on-inverse bg-surface-primary/5 flex items-center gap-2 border px-2.5 py-1.5 text-[11px] font-semibold">
                  <span
                    aria-hidden="true"
                    className="bg-action-success size-1.5 rounded-full"
                  />
                  {t('demo.connectedLayers')}
                </div>
              </div>

              <div className="relative mt-8 grid gap-3 md:grid-cols-5 md:gap-2">
                <div
                  aria-hidden="true"
                  className="bg-border-on-inverse absolute top-1/2 left-[8%] hidden h-px w-[84%] -translate-y-1/2 md:block"
                />

                {flowNodes.map((node, index) => (
                  <div
                    key={node.key}
                    className="border-border-on-inverse bg-surface-inverse relative z-10 min-w-0 border p-4 md:min-h-44"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-action-accent font-mono text-[10px]">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      {index < flowNodes.length - 1 ? (
                        <ArrowRightIcon
                          aria-hidden="true"
                          className="text-content-on-inverse/35 md:hidden"
                          size={14}
                        />
                      ) : null}
                    </div>

                    <p className="text-content-on-inverse/55 mt-6 text-[10px] font-semibold tracking-[0.12em] uppercase">
                      {t(`hero.flow.${node.key}.label`)}
                    </p>
                    <p className="mt-2 truncate font-mono text-xs font-semibold">
                      {node.value}
                    </p>
                    <p className="text-action-accent mt-1 truncate font-mono text-[11px]">
                      {node.detail}
                    </p>
                    <p className="text-content-on-inverse/45 mt-5 text-[11px] leading-5">
                      {t(`hero.flow.${node.key}.caption`)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-border-on-inverse bg-border-on-inverse mt-6 grid gap-px border sm:grid-cols-3">
                <div className="bg-surface-inverse p-4">
                  <p className="text-content-on-inverse/45 text-[10px] font-semibold uppercase">
                    {t('demo.source')}
                  </p>
                  <p className="mt-2 font-mono text-xs">#A94E2F</p>
                </div>
                <div className="bg-surface-inverse p-4">
                  <p className="text-content-on-inverse/45 text-[10px] font-semibold uppercase">
                    {t('demo.resolvedContrast')}
                  </p>
                  <p className="mt-2 font-mono text-xs">5.50:1 · AA</p>
                </div>
                <div className="bg-surface-inverse p-4">
                  <p className="text-content-on-inverse/45 text-[10px] font-semibold uppercase">
                    {t('demo.outputs')}
                  </p>
                  <p className="mt-2 font-mono text-xs">{t('demo.formats')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="workflow"
        className="scroll-mt-20 px-6 py-24 lg:px-8 lg:py-32"
      >
        <div className="mx-auto max-w-7xl">
          <div className="max-w-4xl">
            <p className="text-action-accent text-xs font-semibold tracking-[0.2em] uppercase">
              {t('workflow.eyebrow')}
            </p>
            <h2 className="font-display mt-5 text-4xl leading-[1.03] font-semibold tracking-[-0.04em] text-balance sm:text-5xl lg:text-6xl">
              {t('workflow.title')}
            </h2>
            <p className="text-content-secondary mt-6 max-w-3xl text-lg leading-8">
              {t('workflow.description')}
            </p>
          </div>

          <div className="mt-20 space-y-24 lg:space-y-32">
            {workflowStepKeys.map((key, index) => (
              <article
                key={key}
                className="relative grid gap-10 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] lg:gap-20"
              >
                <div className="lg:sticky lg:top-28 lg:self-start">
                  <p className="text-action-accent font-mono text-xs font-semibold">
                    {t(`workflow.steps.${key}.kicker`)}
                  </p>
                  <h3 className="font-display mt-5 text-3xl leading-tight font-semibold tracking-[-0.03em] sm:text-4xl">
                    {t(`workflow.steps.${key}.title`)}
                  </h3>
                  <p className="text-content-secondary mt-5 max-w-xl leading-7">
                    {t(`workflow.steps.${key}.description`)}
                  </p>
                  <div className="border-border-subtle mt-7 border-l pl-4">
                    <p className="text-content-primary text-sm leading-6 font-semibold">
                      {t(`workflow.steps.${key}.insight`)}
                    </p>
                  </div>
                </div>

                <div className="border-border-subtle bg-background-sunken relative min-h-[25rem] overflow-hidden border p-5 sm:p-8 lg:min-h-[32rem] lg:p-10">
                  <div
                    aria-hidden="true"
                    className="text-border-default pointer-events-none absolute -top-8 -right-1 font-mono text-[9rem] leading-none font-semibold opacity-25 sm:text-[12rem]"
                  >
                    {String(index + 1).padStart(2, '0')}
                  </div>

                  {key === 'token' ? (
                    <div className="relative flex h-full min-h-[20rem] items-center justify-center">
                      <div className="border-border-strong bg-surface-primary shadow-soft w-full max-w-xl border">
                        <div className="border-border-subtle flex items-center justify-between gap-4 border-b px-5 py-4">
                          <div>
                            <p className="font-mono text-xs font-semibold">
                              color.brand.600
                            </p>
                            <p className="text-content-tertiary mt-1 text-[11px]">
                              {t('demo.primitiveColor')}
                            </p>
                          </div>
                          <span className="bg-action-accent size-8 rounded-md" />
                        </div>
                        <div className="bg-border-subtle grid gap-px sm:grid-cols-2">
                          <div className="bg-surface-primary p-5">
                            <p className="text-content-tertiary text-[10px] font-semibold uppercase">
                              {t('demo.value')}
                            </p>
                            <p className="mt-3 font-mono text-lg font-semibold">
                              #A94E2F
                            </p>
                          </div>
                          <div className="bg-surface-primary p-5">
                            <p className="text-content-tertiary text-[10px] font-semibold uppercase">
                              {t('demo.intent')}
                            </p>
                            <p className="mt-3 text-sm font-semibold">
                              {t('demo.primaryBrandAction')}
                            </p>
                          </div>
                        </div>
                        <div className="border-border-subtle border-t p-5">
                          <p className="text-content-tertiary text-[10px] font-semibold uppercase">
                            {t('demo.description')}
                          </p>
                          <p className="text-content-secondary mt-2 text-sm leading-6">
                            {t('demo.tokenDescription')}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : null}

                  {key === 'theme' ? (
                    <div className="relative flex h-full min-h-[20rem] items-center justify-center">
                      <div className="grid w-full max-w-2xl gap-4 sm:grid-cols-2">
                        <div className="border-border-strong bg-surface-primary border p-5">
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <p className="text-xs font-semibold">Light</p>
                              <p className="text-content-tertiary mt-1 text-[11px]">
                                {t('demo.activeTheme')}
                              </p>
                            </div>
                            <span className="bg-background-app border-border-default size-7 rounded-full border" />
                          </div>
                          <div className="border-border-subtle mt-6 divide-y border-y">
                            <div className="grid grid-cols-[1fr_auto] gap-4 py-4">
                              <code className="text-xs font-semibold">
                                accent
                              </code>
                              <code className="text-content-secondary text-[11px]">
                                {'{'}color.brand.600{'}'}
                              </code>
                            </div>
                            <div className="grid grid-cols-[1fr_auto] gap-4 py-4">
                              <code className="text-xs font-semibold">
                                border-subtle
                              </code>
                              <code className="text-content-secondary text-[11px]">
                                {'{'}color.border.line{'}'}
                              </code>
                            </div>
                          </div>
                        </div>

                        <div className="bg-surface-inverse text-content-on-inverse border-border-strong border p-5">
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <p className="text-xs font-semibold">Dark</p>
                              <p className="text-content-on-inverse/50 mt-1 text-[11px]">
                                {t('demo.independentMapping')}
                              </p>
                            </div>
                            <span className="border-border-on-inverse bg-surface-inverse size-7 rounded-full border" />
                          </div>
                          <div className="border-border-on-inverse mt-6 divide-y border-y">
                            <div className="grid grid-cols-[1fr_auto] gap-4 py-4">
                              <code className="text-xs font-semibold">
                                accent
                              </code>
                              <code className="text-content-on-inverse/65 text-[11px]">
                                {'{'}color.brand.400{'}'}
                              </code>
                            </div>
                            <div className="grid grid-cols-[1fr_auto] gap-4 py-4">
                              <code className="text-xs font-semibold">
                                border-subtle
                              </code>
                              <code className="text-content-on-inverse/65 text-[11px]">
                                {'{'}color.border.muted{'}'}
                              </code>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : null}

                  {key === 'component' ? (
                    <div className="relative flex h-full min-h-[20rem] items-center justify-center">
                      <div className="border-border-strong bg-surface-primary w-full max-w-2xl border">
                        <div className="border-border-subtle flex flex-wrap items-center justify-between gap-4 border-b p-5">
                          <div>
                            <p className="text-lg font-semibold">Button</p>
                            <p className="text-content-tertiary mt-1 text-xs">
                              {t('demo.componentContract')}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <span className="bg-background-subtle text-content-secondary px-2 py-1 font-mono text-[10px]">
                              primary
                            </span>
                            <span className="bg-background-subtle text-content-secondary px-2 py-1 font-mono text-[10px]">
                              md
                            </span>
                          </div>
                        </div>
                        <div className="bg-border-subtle grid gap-px sm:grid-cols-[0.8fr_1.2fr]">
                          <div className="bg-surface-primary p-5">
                            <p className="text-content-tertiary text-[10px] font-semibold uppercase">
                              {t('demo.states')}
                            </p>
                            <div className="mt-4 flex flex-wrap gap-2">
                              {[
                                'default',
                                'hover',
                                'focusVisible',
                                'disabled',
                              ].map((state) => (
                                <span
                                  key={state}
                                  className="border-border-subtle border px-2 py-1 font-mono text-[10px]"
                                >
                                  {state}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="bg-surface-primary p-5">
                            <p className="text-content-tertiary text-[10px] font-semibold uppercase">
                              {t('demo.tokenBindings')}
                            </p>
                            <div className="mt-4 space-y-3 font-mono text-[11px]">
                              <div className="flex justify-between gap-4">
                                <span>background</span>
                                <span className="text-action-accent">
                                  theme.accent
                                </span>
                              </div>
                              <div className="flex justify-between gap-4">
                                <span>content</span>
                                <span className="text-action-accent">
                                  theme.background
                                </span>
                              </div>
                              <div className="flex justify-between gap-4">
                                <span>focusRing</span>
                                <span className="text-action-accent">
                                  theme.accent
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="border-border-subtle flex items-center justify-center border-t p-8">
                          <span className="bg-action-primary text-action-primary-content rounded-md px-5 py-3 text-sm font-semibold">
                            {t('demo.primaryAction')}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : null}

                  {key === 'accessibility' ? (
                    <div className="relative flex h-full min-h-[20rem] items-center justify-center">
                      <div className="grid w-full max-w-2xl gap-4 sm:grid-cols-[0.9fr_1.1fr]">
                        <div className="bg-surface-inverse text-content-on-inverse border-border-strong flex min-h-64 flex-col justify-between border p-6">
                          <div>
                            <p className="text-content-on-inverse/50 text-[10px] font-semibold uppercase">
                              {t('demo.resolvedContrast')}
                            </p>
                            <p className="font-display mt-5 text-6xl font-semibold tracking-[-0.05em]">
                              5.50
                            </p>
                            <p className="text-content-on-inverse/50 mt-1 font-mono text-xs">
                              :1
                            </p>
                          </div>
                          <div className="flex items-center gap-2 text-sm font-semibold">
                            <CheckIcon
                              aria-hidden="true"
                              className="text-action-accent"
                              size={16}
                              weight="bold"
                            />
                            WCAG AA
                          </div>
                        </div>

                        <div className="border-border-strong bg-surface-primary border p-6">
                          <p className="text-content-tertiary text-[10px] font-semibold uppercase">
                            {t('demo.contractChecks')}
                          </p>
                          <div className="mt-5 space-y-4">
                            {accessibilityDemoCheckKeys.map((key) => (
                              <div key={key} className="flex gap-3">
                                <span className="bg-action-success/10 text-action-success mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full">
                                  <CheckIcon
                                    aria-hidden="true"
                                    size={11}
                                    weight="bold"
                                  />
                                </span>
                                <p className="text-content-secondary text-sm leading-6">
                                  {t(`demo.checks.${key}`)}
                                </p>
                              </div>
                            ))}
                          </div>
                          <p className="border-border-subtle text-content-tertiary mt-6 border-t pt-4 text-xs leading-5">
                            {t('demo.manualReview')}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : null}

                  {key === 'delivery' ? (
                    <div className="relative flex h-full min-h-[20rem] items-center justify-center">
                      <div className="grid w-full max-w-2xl gap-4 sm:grid-cols-[1.15fr_0.85fr]">
                        <div className="bg-surface-inverse text-content-on-inverse border-border-strong border">
                          <div className="border-border-on-inverse flex items-center gap-2 border-b px-4 py-3">
                            <span className="bg-action-danger size-2 rounded-full" />
                            <span className="bg-action-warning size-2 rounded-full" />
                            <span className="bg-action-success size-2 rounded-full" />
                            <span className="text-content-on-inverse/40 ml-2 font-mono text-[10px]">
                              tokens.css
                            </span>
                          </div>
                          <pre className="overflow-x-auto p-5 font-mono text-[11px] leading-6">
                            <code>{`:root {\n  --color-accent: #A94E2F;\n  --color-border-subtle: #E3DDD0;\n}\n\n.button-primary {\n  background: var(--color-accent);\n}`}</code>
                          </pre>
                        </div>

                        <div className="border-border-strong bg-surface-primary border p-5">
                          <p className="text-content-tertiary text-[10px] font-semibold uppercase">
                            {t('demo.generatedFromProject')}
                          </p>
                          <div className="mt-5 space-y-2">
                            {exportFormats.map((format) => (
                              <div
                                key={format.key}
                                className="border-border-subtle flex items-center justify-between gap-3 border px-3 py-2.5"
                              >
                                <span className="text-xs font-semibold">
                                  {t(`delivery.formatLabels.${format.key}`)}
                                </span>
                                <span className="text-content-tertiary font-mono text-[10px]">
                                  {format.fileName}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-border-subtle bg-background-sunken border-y px-6 py-24 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <p className="text-action-accent text-xs font-semibold tracking-[0.2em] uppercase">
                {t('differentiation.eyebrow')}
              </p>
              <h2 className="font-display mt-5 text-4xl leading-[1.04] font-semibold tracking-[-0.04em] sm:text-5xl">
                {t('differentiation.title')}
              </h2>
              <p className="text-content-secondary mt-6 leading-7">
                {t('differentiation.description')}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {differentiatorKeys.map((key, index) => (
                <article
                  key={key}
                  className={`border-border-subtle bg-surface-primary border p-6 sm:p-7 ${
                    index === 0 || index === 4 ? 'sm:col-span-2' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-6">
                    <span className="text-action-accent font-mono text-[10px]">
                      0{index + 1}
                    </span>
                    <span className="bg-background-subtle text-content-tertiary px-2 py-1 font-mono text-[10px]">
                      {key}
                    </span>
                  </div>
                  <h3 className="mt-8 text-xl font-semibold">
                    {t(`differentiation.items.${key}.title`)}
                  </h3>
                  <p className="text-content-secondary mt-3 max-w-xl text-sm leading-6">
                    {t(`differentiation.items.${key}.description`)}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-surface-inverse text-content-on-inverse relative overflow-hidden px-6 py-24 lg:px-8 lg:py-32">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-20"
          style={gridStyle}
        />
        <div className="relative mx-auto grid max-w-7xl gap-14 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] lg:items-center lg:gap-20">
          <div className="max-w-2xl">
            <p className="text-action-accent text-xs font-semibold tracking-[0.2em] uppercase">
              {t('aiDevelopment.eyebrow')}
            </p>
            <h2 className="font-display mt-5 text-4xl leading-[1.04] font-semibold tracking-[-0.04em] text-balance sm:text-5xl lg:text-6xl">
              {t('aiDevelopment.title')}
            </h2>
            <p className="text-content-on-inverse/70 mt-6 text-lg leading-8">
              {t('aiDevelopment.description')}
            </p>
            <p className="border-border-on-inverse text-content-on-inverse/50 mt-8 border-l pl-4 text-xs leading-6">
              {t('aiDevelopment.boundary')}
            </p>
          </div>

          <div className="border-border-on-inverse bg-surface-inverse relative border">
            <div className="border-border-on-inverse flex flex-wrap items-center justify-between gap-4 border-b px-5 py-4 sm:px-6">
              <div>
                <p className="text-content-on-inverse/45 text-[10px] font-semibold tracking-[0.14em] uppercase">
                  {t('aiDevelopment.contextLabel')}
                </p>
                <p className="mt-1 font-mono text-sm font-semibold">
                  {t('aiDevelopment.rulesTitle')}
                </p>
              </div>
              <span className="border-border-on-inverse bg-surface-primary/5 text-content-on-inverse/60 border px-2.5 py-1.5 font-mono text-[10px]">
                design-system context
              </span>
            </div>

            <div className="p-5 sm:p-6">
              <div className="space-y-3">
                {aiRuleKeys.map((key) => (
                  <div
                    key={key}
                    className="border-border-on-inverse bg-surface-inverse border"
                  >
                    <div className="bg-surface-primary/5 flex gap-3 p-4">
                      <span className="bg-action-success/10 text-action-success mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full">
                        <CheckIcon
                          aria-hidden="true"
                          size={11}
                          weight="bold"
                        />
                      </span>
                      <code className="text-content-on-inverse/75 text-xs leading-6">
                        {t(`aiDevelopment.rules.${key}`)}
                      </code>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-border-on-inverse mt-6 border-t pt-6">
                <p className="text-action-accent text-[10px] font-semibold tracking-[0.14em] uppercase">
                  {t('aiDevelopment.promptLabel')}
                </p>
                <p className="mt-3 text-base font-semibold">
                  “{t('aiDevelopment.promptExample')}”
                </p>
                <p className="text-content-on-inverse/50 mt-2 text-xs leading-5">
                  {t('aiDevelopment.promptNote')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-24 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-action-accent text-xs font-semibold tracking-[0.2em] uppercase">
              {t('drift.eyebrow')}
            </p>
            <h2 className="font-display mt-5 text-4xl leading-[1.03] font-semibold tracking-[-0.04em] text-balance sm:text-5xl lg:text-6xl">
              {t('drift.title')}
            </h2>
            <p className="text-content-secondary mx-auto mt-6 max-w-3xl text-lg leading-8">
              {t('drift.description')}
            </p>
          </div>

          <div className="mt-16 grid gap-5 lg:grid-cols-2">
            <article className="border-border-subtle bg-background-sunken border p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <span className="bg-action-danger size-2 rounded-full" />
                <h3 className="text-sm font-semibold">
                  {t('drift.scatteredTitle')}
                </h3>
              </div>
              <div className="relative mt-8 space-y-3">
                <div
                  aria-hidden="true"
                  className="bg-border-default absolute top-5 bottom-5 left-[0.6875rem] z-0 w-px"
                />
                {scatteredKeys.map((key, index) => (
                  <div
                    key={key}
                    className="border-border-subtle bg-surface-primary relative z-10 flex items-start gap-4 border p-4"
                  >
                    <span className="bg-background-sunken border-border-default relative z-20 flex size-6 shrink-0 items-center justify-center rounded-full border font-mono text-[9px]">
                      {index + 1}
                    </span>
                    <p className="text-content-secondary pt-0.5 text-sm leading-6">
                      {t(`drift.scatteredItems.${key}`)}
                    </p>
                  </div>
                ))}
              </div>
            </article>

            <article className="bg-surface-inverse text-content-on-inverse border-border-strong border p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <span className="bg-action-success size-2 rounded-full" />
                <h3 className="text-sm font-semibold">
                  {t('drift.connectedTitle')}
                </h3>
              </div>
              <div className="relative mt-8 space-y-3">
                <div
                  aria-hidden="true"
                  className="bg-border-on-inverse absolute top-5 bottom-5 left-[0.6875rem] z-0 w-px"
                />
                {connectedKeys.map((key, index) => (
                  <div
                    key={key}
                    className="border-border-on-inverse bg-surface-inverse relative z-10 border"
                  >
                    <div className="bg-surface-primary/5 flex items-start gap-4 p-4">
                      <span className="border-border-on-inverse bg-surface-inverse relative z-20 flex size-6 shrink-0 items-center justify-center rounded-full border font-mono text-[9px]">
                        {index + 1}
                      </span>
                      <p className="text-content-on-inverse/70 pt-0.5 text-sm leading-6">
                        {t(`drift.connectedItems.${key}`)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="border-border-on-inverse text-action-accent mt-6 border-t pt-5 text-sm font-semibold">
                {t('drift.note')}
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="bg-surface-inverse text-content-on-inverse relative overflow-hidden px-6 py-24 lg:px-8 lg:py-28">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-20"
          style={gridStyle}
        />
        <div className="relative mx-auto max-w-7xl">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-4xl">
              <p className="text-action-accent text-xs font-semibold tracking-[0.2em] uppercase">
                {t('delivery.eyebrow')}
              </p>
              <h2 className="font-display mt-5 text-4xl leading-[1.04] font-semibold tracking-[-0.04em] sm:text-5xl">
                {t('delivery.title')}
              </h2>
            </div>
            <p className="text-content-on-inverse/60 max-w-md text-sm leading-6">
              {t('delivery.description')}
            </p>
          </div>

          <div className="border-border-on-inverse bg-border-on-inverse mt-12 grid gap-px border sm:grid-cols-2 lg:grid-cols-6">
            {exportFormats.map((format, index) => (
              <article
                key={format.key}
                className="bg-surface-inverse min-w-0 p-5"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-action-accent font-mono text-[10px]">
                    0{index + 1}
                  </span>
                  <CheckIcon
                    aria-hidden="true"
                    className="text-content-on-inverse/35"
                    size={13}
                  />
                </div>
                <h3 className="mt-6 text-sm font-semibold">
                  {t(`delivery.formatLabels.${format.key}`)}
                </h3>
                <p className="text-content-on-inverse/45 mt-2 truncate font-mono text-[10px]">
                  {format.fileName}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20 lg:px-8 lg:py-24">
        <div className="border-border-strong bg-surface-primary mx-auto grid max-w-7xl gap-8 border p-7 sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center lg:p-12">
          <div className="max-w-3xl">
            <p className="text-action-accent text-xs font-semibold tracking-[0.2em] uppercase">
              {t('finalCta.eyebrow')}
            </p>
            <h2 className="font-display mt-5 text-3xl leading-tight font-semibold tracking-[-0.035em] sm:text-4xl lg:text-5xl">
              {t('finalCta.title')}
            </h2>
            <p className="text-content-secondary mt-4 max-w-2xl leading-7">
              {t('finalCta.description')}
            </p>
          </div>
          <PublicButtonLink
            href={primaryHref}
            size="lg"
            className="shrink-0 gap-2"
          >
            {isAuthenticated ? t('finalCta.dashboardCta') : t('finalCta.cta')}
            <ArrowRightIcon aria-hidden="true" size={16} weight="bold" />
          </PublicButtonLink>
        </div>
      </section>
    </main>
  );
}
